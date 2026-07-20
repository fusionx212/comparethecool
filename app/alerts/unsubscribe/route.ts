import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Linked from every alert email (see app/api/send-alerts/route.ts emailHtml).
// This route didn't exist before, so every "Unsubscribe" click 404'd.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/alerts?unsubscribed=0", req.url), 302);

  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("aircon_alert_subscriptions")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("token", token)
      .select("id")
      .maybeSingle();

    if (error || !data) return NextResponse.redirect(new URL("/alerts?unsubscribed=0", req.url), 302);
    return NextResponse.redirect(new URL("/alerts?unsubscribed=1", req.url), 302);
  } catch {
    return NextResponse.redirect(new URL("/alerts?unsubscribed=0", req.url), 302);
  }
}
