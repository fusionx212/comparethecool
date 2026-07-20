// POST /api/installers/register — installer self-serve registration
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "content@policyandplay.co.uk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contact, email, phone, website, fgas_reg, postcode_areas } = body;

    if (!company?.trim() || !contact?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Company, contact, email, and phone are required." }, { status: 400 });
    }

    if (!postcode_areas || !Array.isArray(postcode_areas) || postcode_areas.length === 0) {
      return NextResponse.json({ error: "Select at least one postcode area." }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    // Check for existing installer with same email
    const { data: existing } = await supabase
      .from("installers")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "An installer with this email already exists." }, { status: 409 });
    }

    const { data: installer, error } = await supabase
      .from("installers")
      .insert({
        company: company.trim(),
        contact: contact.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        website: website?.trim() || null,
        fgas_reg: fgas_reg?.trim() || null,
        postcode_areas,
        active: true,
        credits: 0,
        trial_used: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Installer registration error:", error);
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }

    // Notify admin
    try {
      await resend.emails.send({
        from: "UK Air Con Tracker <leads@ukaircontracker.co.uk>",
        to: ADMIN_EMAIL,
        subject: `[NEW INSTALLER] ${company.trim()} — ${postcode_areas.length} areas`,
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="color:#0792b4">New installer registered</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#666">Company</td><td><strong>${company.trim()}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666">Contact</td><td>${contact.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Email</td><td>${email.trim().toLowerCase()}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Phone</td><td>${phone.trim()}</td></tr>
            ${website?.trim() ? `<tr><td style="padding:6px 0;color:#666">Website</td><td>${website.trim()}</td></tr>` : ""}
            ${fgas_reg?.trim() ? `<tr><td style="padding:6px 0;color:#666">F-Gas</td><td>${fgas_reg.trim()}</td></tr>` : ""}
            <tr><td style="padding:6px 0;color:#666">Coverage</td><td>${postcode_areas.sort().join(", ")}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Status</td><td style="color:#0f9d54">Active — 3 free trial leads</td></tr>
          </table>
          <p style="margin-top:16px">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ukaircontracker.co.uk'}/admin/leads" style="color:#0792b4">View dashboard →</a>
          </p>
        </div>`,
      });
    } catch (mailErr) {
      console.error("Failed to send admin notification:", mailErr);
    }

    return NextResponse.json({ success: true, installer_id: installer.id });
  } catch (err) {
    console.error("Installer registration error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
