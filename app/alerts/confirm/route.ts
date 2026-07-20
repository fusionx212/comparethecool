import { NextResponse } from "next/server";

export const runtime = "nodejs";

// One-click confirm link from the signup email. Flips confirmed=true on the
// matching subscription, then bounces back to /alerts with a status flag so
// the page can show a plain-English result — no dedicated page needed.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/alerts?confirmed=0", req.url), 302);

  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("aircon_alert_subscriptions")
      .update({ confirmed: true })
      .eq("token", token)
      .is("unsubscribed_at", null)
      .select("id")
      .maybeSingle();

    if (error || !data) return NextResponse.redirect(new URL("/alerts?confirmed=0", req.url), 302);
    return NextResponse.redirect(new URL("/alerts?confirmed=1", req.url), 302);
  } catch {
    return NextResponse.redirect(new URL("/alerts?confirmed=0", req.url), 302);
  }
}
