import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/**
 * Returns download URL only for paid/fulfilled orders.
 * Token stays server-side in DB; we mint the download URL here after status check.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: order, error } = await sb
    .from("ctc_digital_orders")
    .select("status, capability_token, session_id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const status = order.status as string;
  if (status !== "paid" && status !== "fulfilled") {
    return NextResponse.json({ status, download_url: null });
  }

  const token = order.capability_token as string | null;
  if (!token) {
    return NextResponse.json({ status, download_url: null, error: "Token missing" });
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://comparethecool.com";
  const download_url = `${site}/api/digital/download?session_id=${encodeURIComponent(sessionId)}&token=${encodeURIComponent(token)}`;

  return NextResponse.json({ status, download_url });
}
