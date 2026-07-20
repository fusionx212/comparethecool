// Email sending via Resend for lead notifications
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "UK Air Con Tracker <leads@ukaircontracker.co.uk>";

export async function sendLeadToInstaller(
  installerEmail: string,
  installerName: string,
  lead: {
    name: string;
    email: string;
    phone?: string;
    postcode: string;
    property_type?: string;
    rooms?: string;
    budget_range?: string;
    timeline?: string;
    notes?: string;
    credits?: number;
  },
  leadId: string,
) {
  const budget = lead.budget_range?.replace("1000-2000", "£1,000–£2,000")
    .replace("2000-4000", "£2,000–£4,000")
    .replace("4000+", "£4,000+")
    .replace("researching", "Just researching") ?? "Not specified";
  
  const timing = lead.timeline?.replace("asap", "ASAP")
    .replace("within-1-month", "Within 1 month")
    .replace("1-3-months", "1–3 months")
    .replace("browsing", "Just browsing") ?? "Not specified";

  const claimUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/leads/claim?id=${leadId}`;

  await resend.emails.send({
    from: FROM,
    to: installerEmail,
    subject: `New AC installation lead — ${lead.postcode} — ${budget}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0792b4;margin:0 0 16px">New Installation Lead</h2>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${lead.name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${lead.email}</td></tr>
        ${lead.phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0"><strong>${lead.phone}</strong></td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#666">Postcode</td><td style="padding:8px 0"><strong>${lead.postcode}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Property</td><td style="padding:8px 0">${lead.property_type ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Scope</td><td style="padding:8px 0">${lead.rooms ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0"><strong>${budget}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Timeline</td><td style="padding:8px 0">${timing}</td></tr>
        ${lead.notes ? `<tr><td style="padding:8px 0;color:#666">Notes</td><td style="padding:8px 0">${lead.notes}</td></tr>` : ""}
      </table>

      <a href="${claimUrl}" style="display:inline-block;background:#0792b4;color:#fff;padding:12px 28px;text-decoration:none;font-weight:600">Claim This Lead</a>
      
      <p style="color:#999;font-size:13px;margin-top:20px">
        This lead is exclusive to the first installer who claims it. 
        You have ${lead.credits || 0} credits remaining.
        ${(lead.credits || 0) <= 2 ? `<br><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ukaircontracker.co.uk'}/installers/account" style="color:#0792b4">Buy more credits →</a>` : ''}
      </p>
    </div>`,
  });
}

export async function sendLeadConfirmation(
  leadEmail: string,
  leadName: string,
  matchedInstallers: number,
) {
  await resend.emails.send({
    from: FROM,
    to: leadEmail,
    subject: "Your AC installation enquiry — we're finding installers",
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0792b4;margin:0 0 16px">Thanks for your enquiry, ${leadName}</h2>
      <p>We've received your request and are matching you with ${matchedInstallers > 1 ? `${matchedInstallers} F-Gas certified installers` : "a local F-Gas certified installer"} in your area.</p>
      <p>They'll contact you directly within 1–2 working days with quotes.</p>
      <p style="color:#999;font-size:13px;margin-top:24px">
        — UK Air Con Tracker
      </p>
    </div>`,
  });
}

export async function sendAdminNotification(
  adminEmail: string,
  lead: { name: string; email: string; postcode: string; budget_range?: string },
  matchedCount: number,
) {
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[LEAD] ${lead.name} — ${lead.postcode} — ${lead.budget_range ?? "Researching"}`,
    text: `New lead: ${lead.name} | ${lead.email} | ${lead.postcode} | Budget: ${lead.budget_range}\nMatched to ${matchedCount} installer(s).`,
  });
}
