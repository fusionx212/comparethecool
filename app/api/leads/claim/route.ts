// GET /api/leads/claim — installer claims a lead (first-come, first-served)
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const leadId = req.nextUrl.searchParams.get("id");
    if (!leadId) {
      return NextResponse.json({ error: "Missing lead ID." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    // Check lead exists and isn't already claimed
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    if (lead.status === "claimed" || lead.status === "won" || lead.status === "lost") {
      return NextResponse.json(
        { error: `Lead already ${lead.status}.` },
        { status: 409 },
      );
    }

    // Find installer by email from query param (simple auth for now)
    const installerEmail = req.nextUrl.searchParams.get("email");
    if (!installerEmail) {
      return NextResponse.json({ error: "Installer email required." }, { status: 400 });
    }

    const { data: installer, error: instError } = await supabase
      .from("installers")
      .select("*")
      .eq("email", installerEmail)
      .eq("active", true)
      .single();

    if (instError || !installer) {
      return NextResponse.json({ error: "Installer not found or inactive." }, { status: 403 });
    }

    // Check credits (skip if trial not used)
    if (installer.trial_used && installer.credits < 1) {
      return NextResponse.json(
        { error: "No credits remaining. Purchase more to claim leads." },
        { status: 402 },
      );
    }

    // Claim the lead
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: "claimed",
        installer_id: installer.id,
        claimed_at: now,
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("Failed to claim lead:", updateError);
      return NextResponse.json({ error: "Failed to claim lead." }, { status: 500 });
    }

    // Deduct credit (after trial)
    if (installer.trial_used) {
      await supabase
        .from("installers")
        .update({ credits: installer.credits - 1 })
        .eq("id", installer.id);
    } else {
      // Mark trial as used
      await supabase
        .from("installers")
        .update({ trial_used: true })
        .eq("id", installer.id);
    }

    // Log event
    await supabase.from("lead_events").insert({
      lead_id: leadId,
      event_type: "claimed",
      metadata: { installer_id: installer.id, installer_email: installer.email },
    });

    // Return lead details with full contact info
    return NextResponse.json({
      success: true,
      lead: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        postcode: lead.postcode,
        property_type: lead.property_type,
        rooms: lead.rooms,
        budget_range: lead.budget_range,
        timeline: lead.timeline,
        notes: lead.notes,
      },
    });
  } catch (err) {
    console.error("Claim error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
