// POST /api/leads/submit — captures an installation lead and routes to installers
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { extractPostcodeArea, scoreLead, type LeadSubmission } from "@/lib/leads";
import { sendLeadToInstaller, sendLeadConfirmation, sendAdminNotification } from "@/lib/mail";
import { SITE } from "@/lib/site";

export async function POST(req: NextRequest) {
  try {
    const body: LeadSubmission = await req.json();
    const { name, email, phone, postcode, property_type, rooms, budget_range, timeline, notes } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !postcode?.trim()) {
      return NextResponse.json({ error: "Name, email, and postcode are required." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Extract postcode area for routing
    const postcodeArea = extractPostcodeArea(postcode);

    const supabase = supabaseAdmin();

    // Insert the lead
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        postcode: postcode.trim().toUpperCase(),
        postcode_area: postcodeArea,
        property_type: property_type || null,
        rooms: rooms || null,
        budget_range: budget_range || null,
        timeline: timeline || null,
        notes: notes?.trim() || null,
        status: "new",
      })
      .select()
      .single();

    if (insertError || !lead) {
      console.error("Failed to insert lead:", insertError);
      return NextResponse.json({ error: "Failed to save enquiry. Please try again." }, { status: 500 });
    }

    // Log creation event
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      event_type: "created",
      metadata: { score: scoreLead(body), postcode_area: postcodeArea },
    });

    // Find matching installers by postcode area
    const { data: installers, error: matchError } = await supabase
      .from("installers")
      .select("*")
      .eq("active", true)
      .contains("postcode_areas", [postcodeArea]);

    if (matchError) {
      console.error("Failed to match installers:", matchError);
    }

    const matchedInstallers = installers || [];

    if (matchedInstallers.length > 0) {
      // Route to matched installers — send email to each
      for (const installer of matchedInstallers) {
        try {
          await sendLeadToInstaller(
            installer.email,
            installer.contact,
            {
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              postcode: lead.postcode,
              property_type: lead.property_type,
              rooms: lead.rooms,
              budget_range: lead.budget_range,
              timeline: lead.timeline,
              notes: lead.notes,
              credits: installer.credits,
            },
            lead.id,
          );

          // Log routing event
          await supabase.from("lead_events").insert({
            lead_id: lead.id,
            event_type: "routed",
            metadata: { installer_id: installer.id, installer_email: installer.email },
          });
        } catch (emailErr) {
          console.error(`Failed to email installer ${installer.email}:`, emailErr);
        }
      }

      // Update lead status to "routed"
      await supabase
        .from("leads")
        .update({ status: "routed" })
        .eq("id", lead.id);
    }

    // Send confirmation to the customer
    try {
      await sendLeadConfirmation(email, name, matchedInstallers.length);
    } catch (err) {
      console.error("Failed to send lead confirmation:", err);
    }

    // Notify admin (Dale)
    try {
      await sendAdminNotification(SITE.contactEmail, {
        name: lead.name,
        email: lead.email,
        postcode: lead.postcode,
        budget_range: lead.budget_range,
      }, matchedInstallers.length);
    } catch (err) {
      console.error("Failed to send admin notification:", err);
    }

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      matched_installers: matchedInstallers.length,
    });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
