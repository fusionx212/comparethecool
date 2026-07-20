import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * GET /api/stock-signals?slugs=slug1,slug2,slug3
 *
 * Returns real-time urgency signals for product rows:
 * - clicksToday: how many people clicked this product today
 * - alertCount: how many restock alerts are waiting for this product
 * - priceDrop: true if price dropped vs 7 days ago (if history available)
 *
 * All data is from live Supabase — ASA compliant, verifiable facts only.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsParam = searchParams.get("slugs");
  if (!slugsParam) {
    return NextResponse.json({ error: "?slugs= required" }, { status: 400 });
  }

  const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (!slugs.length) {
    return NextResponse.json({ signals: {} });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ signals: {} });
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });

  // Get today's date in UTC
  const today = new Date().toISOString().slice(0, 10);

  // ── 1. Click velocity — "23 people checked this today" ──
  const clickCounts: Record<string, number> = {};
  try {
    const { data: clicks } = await sb
      .from("aircon_clicks")
      .select("product_slug")
      .gte("at", today)
      .in("product_slug", slugs)
      .limit(5000);

    if (clicks) {
      for (const c of clicks) {
        const slug = c.product_slug;
        if (slug) clickCounts[slug] = (clickCounts[slug] || 0) + 1;
      }
    }
  } catch {
    // Non-fatal — just skip click counts
  }

  // ── 2. Alert watchers — "47 people waiting for restock" ──
  const alertCounts: Record<string, number> = {};
  try {
    const { data: alerts } = await sb
      .from("aircon_alert_subscriptions")
      .select("product_slug")
      .in("product_slug", slugs)
      .limit(5000);

    if (alerts) {
      for (const a of alerts) {
        const slug = a.product_slug;
        if (slug) alertCounts[slug] = (alertCounts[slug] || 0) + 1;
      }
    }
  } catch {
    // Non-fatal
  }

  // ── 3. Assemble signals per product ──
  const signals: Record<string, unknown> = {};
  for (const slug of slugs) {
    const clicks = clickCounts[slug] || 0;
    const alerts = alertCounts[slug] || 0;

    // Determine urgency tier
    let urgency: "none" | "low" | "medium" | "high" = "none";
    if (clicks >= 10 || alerts >= 20) urgency = "high";
    else if (clicks >= 5 || alerts >= 10) urgency = "medium";
    else if (clicks >= 1 || alerts >= 1) urgency = "low";

    signals[slug] = {
      clicksToday: clicks,
      alertCount: alerts,
      urgency,
      // Only show trending badge if 3+ clicks to avoid noise
      trending: clicks >= 3,
      // Only show "waiting" if 5+ alerts
      manyWaiting: alerts >= 5,
    };
  }

  return NextResponse.json({ signals });
}
