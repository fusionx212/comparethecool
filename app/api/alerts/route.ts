import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { logAnalyticsEvent, guessDevice } from "@/lib/analytics";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort — a failed confirmation send must never fail the signup itself
// (the row is already saved; the user can always request the alert again).
async function sendConfirmationEmail(email: string, productSlug: string, token: string) {
  if (!process.env.RESEND_API_KEY) return;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";
  const confirmUrl = `${siteUrl}/alerts/confirm?token=${token}`;
  const from = `UK Air Con Tracker <${process.env.RESEND_FROM_EMAIL ?? "alerts@ukaircontracker.co.uk"}>`;

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: "Confirm your restock alert",
      html: `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
  <div style="background:#0f172a;padding:20px 28px;">
    <p style="color:#60a5fa;font-size:12px;letter-spacing:.08em;font-weight:700;margin:0 0 6px;">UK AIR CON TRACKER</p>
    <h1 style="color:#fff;font-size:20px;margin:0;">One click to confirm your restock alert</h1>
  </div>
  <div style="padding:24px 28px;">
    <p style="margin:0 0 20px;">Confirm this email address to activate restock alerts for <strong>${productSlug.replace(/-/g, " ")}</strong> — we only ever email confirmed addresses.</p>
    <a href="${confirmUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:11px 22px;border-radius:6px;font-weight:700;text-decoration:none;">Confirm my alert →</a>
    <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">Didn't request this? Ignore this email and nothing further will happen.</p>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.warn("[alerts] confirmation email failed:", e instanceof Error ? e.message : e);
  }
}

export async function POST(req: Request) {
  let body: {
    email?: string;
    productSlug?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
    landing_path?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const productSlug = (body.productSlug ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (!productSlug) {
    return NextResponse.json({ error: "Please choose a product" }, { status: 400 });
  }

  // Persist if Supabase is configured; otherwise accept gracefully (pre-launch).
  const hasSupabase =
    Boolean(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!hasSupabase) {
    // Still log attribution as much as possible
    await logAnalyticsEvent("alert_signup", {
      email,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_term: body.utm_term,
      utm_content: body.utm_content,
      gclid: body.gclid,
      fbclid: body.fbclid,
      referrer: body.referrer,
      landing_path: body.landing_path,
      device: guessDevice(req.headers.get("user-agent")),
      meta: { product_slug: productSlug, has_supabase: false },
    });
    return NextResponse.json({
      ok: true,
      message:
        "Noted — restock alerts go live the moment the tracker connects to retailer feeds. We'll have you covered.",
    });
  }

  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    const db = supabaseAdmin();

    // Look up first rather than blind-upsert: a blind upsert would stamp a
    // fresh token and confirmed:false on every resubmit, silently signing an
    // already-confirmed subscriber back out and orphaning their old confirm
    // link.
    const { data: existing } = await db
      .from("aircon_alert_subscriptions")
      .select("token, confirmed, unsubscribed_at")
      .eq("email", email)
      .eq("product_slug", productSlug)
      .maybeSingle();

    const alreadyConfirmed = Boolean(existing?.confirmed) && !existing?.unsubscribed_at;
    let token = existing?.token ?? randomUUID();

    if (!existing) {
      const { error } = await db
        .from("aircon_alert_subscriptions")
        .insert({ email, product_slug: productSlug, token, confirmed: false });
      if (error) throw error;
    } else if (existing.unsubscribed_at) {
      // Re-subscribing after an unsubscribe needs a fresh confirmation.
      token = randomUUID();
      const { error } = await db
        .from("aircon_alert_subscriptions")
        .update({ token, confirmed: false, unsubscribed_at: null })
        .eq("email", email)
        .eq("product_slug", productSlug);
      if (error) throw error;
    }
    // else: already subscribed and not unsubscribed — leave token/confirmed as-is.

    // Log attribution event alongside the subscription
    await logAnalyticsEvent("alert_signup", {
      email,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_term: body.utm_term,
      utm_content: body.utm_content,
      gclid: body.gclid,
      fbclid: body.fbclid,
      referrer: body.referrer,
      landing_path: body.landing_path,
      device: guessDevice(req.headers.get("user-agent")),
      meta: { product_slug: productSlug, has_supabase: true },
    });

    if (!alreadyConfirmed) await sendConfirmationEmail(email, productSlug, token);

    return NextResponse.json({
      ok: true,
      message: alreadyConfirmed
        ? "You're already confirmed for this alert — we'll email you the moment it's back in stock."
        : "Almost there — check your inbox and confirm to activate this alert.",
    });
  } catch {
    return NextResponse.json({ error: "Could not save your alert — please try again." }, { status: 500 });
  }
}
