import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { buildAffiliateUrl } from "@/lib/affiliate";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

// Resend batch API accepts up to 100 emails per call; one batch call keeps a
// full run well inside the Netlify function time limit (the old one-by-one
// loop 504'd at ~260 sends).
const MAX_PER_RUN = 100;

const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  "pro-breeze-7000-btu-portable-air-conditioner": "Pro Breeze 7,000 BTU Portable AC",
  "goodhome-culver-portable-air-conditioner": "GoodHome Culver Portable AC",
  "sony-reon-pocket-personal-air-conditioner": "Sony Reon Pocket Personal AC",
  "meaco-sefte-10-pedestal-fan": "Meaco Sefte 10\" Pedestal Fan",
  "meaco-fan-1056-air-circulator": "Meaco Fan 1056 Air Circulator",
  "pro-breeze-40-inch-tower-fan": "Pro Breeze 40\" Tower Fan",
  "pro-breeze-rechargeable-camping-fan": "Pro Breeze Rechargeable Camping Fan",
  "rechargeable-usb-desk-fan": "Rechargeable USB Desk Fan",
  "jisulife-pro13-rechargeable-neck-fan": "JISULIFE Pro13 Neck Fan",
};

type ClaimedSub = { id: number; email: string; product_slug: string; token: string };

// One block per tracked product. Each keeps its OWN unsubscribe link (the
// token is per email+product_slug row), so unsubscribing from one tracked
// unit never silently drops someone's other alerts.
function productBlock(sub: ClaimedSub, siteUrl: string, trackUrl: (url: string) => string): string {
  const product = SAMPLE_PRODUCTS.find(p => p.slug === sub.product_slug);
  const productName = product?.name ?? PRODUCT_DISPLAY_NAMES[sub.product_slug] ?? "Your tracked product";
  const bestOffer = product?.offers.find(o => o.status === "in_stock");
  const buyUrl = bestOffer ? buildAffiliateUrl(bestOffer) : null;
  const price = bestOffer?.price;
  const unsubUrl = `${siteUrl}/alerts/unsubscribe?token=${sub.token}`;

  return buyUrl && price ? `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:18px;margin:0 0 12px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.05em;color:#1d4ed8;font-weight:700;">YOUR TRACKED PRODUCT</p>
      <p style="margin:0 0 4px;font-weight:700;font-size:17px;">${productName}</p>
      <p style="margin:0 0 14px;font-size:24px;font-weight:800;color:#0f172a;">£${price.toFixed(2)}</p>
      <a href="${trackUrl(buyUrl)}" style="display:inline-block;background:#2563eb;color:#fff;padding:11px 22px;border-radius:6px;font-weight:700;text-decoration:none;">Check Price &amp; Buy →</a>
      <p style="margin:10px 0 0;font-size:11px;"><a href="${unsubUrl}" style="color:#94a3b8;">Stop alerts for this product</a></p>
    </div>` : `
    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:0 0 12px;">
      <p style="margin:0 0 6px;font-weight:700;">${productName}</p>
      <p style="margin:0 0 10px;font-size:14px;">Still not confirmed in stock anywhere we track — but see the alternatives below.</p>
      <p style="margin:0;font-size:11px;"><a href="${unsubUrl}" style="color:#94a3b8;">Stop alerts for this product</a></p>
    </div>`;
}

// One consolidated email per subscriber, covering every product they have
// pending this run — replaces the old one-email-per-product-tracked send,
// which put multiple emails in the same inbox on the same day for anyone
// tracking more than one unit.
function emailHtml(subs: ClaimedSub[]): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";
  // UTM tracking for email → purchase attribution in Amazon Associates
  const emailUtm = "utm_source=email&utm_medium=alert&utm_campaign=restock";
  const trackUrl = (url: string) => url.includes("?") ? `${url}&${emailUtm}` : `${url}?${emailUtm}`;
  const excludeSlugs = subs.map(s => s.product_slug);
  const recs = SAMPLE_PRODUCTS
    .filter(p => !excludeSlugs.includes(p.slug) && p.offers.some(o => o.status === "in_stock"))
    .slice(0, 3)
    .map(p => {
      const offer = p.offers.find(o => o.status === "in_stock")!;
      return { name: p.name, price: offer.price, url: buildAffiliateUrl(offer) };
    });
  const heading = subs.length === 1
    ? `Price & stock alert: ${SAMPLE_PRODUCTS.find(p => p.slug === subs[0].product_slug)?.name ?? PRODUCT_DISPLAY_NAMES[subs[0].product_slug] ?? "your tracked product"}`
    : `Price & stock alert: ${subs.length} tracked products`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

  <div style="background:#0f172a;padding:20px 28px;">
    <p style="color:#60a5fa;font-size:12px;letter-spacing:.08em;font-weight:700;margin:0 0 6px;">UK AIR CON TRACKER</p>
    <h1 style="color:#fff;font-size:20px;margin:0;">${heading}</h1>
  </div>

  <div style="padding:24px 28px;">
    <p style="margin:0 0 16px;">Hi — here's the latest on what you're tracking.</p>

    ${subs.map(sub => productBlock(sub, siteUrl, trackUrl)).join("")}

    <h2 style="font-size:15px;margin:20px 0 12px;">Our best picks to beat the heat right now</h2>

    ${recs.map(r => `
    <div style="border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:0 0 10px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="margin:0;font-weight:600;font-size:14px;">${r.name}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b;">from £${r.price.toFixed(2)}</p>
      </div>
      <a href="${trackUrl(r.url)}" style="display:inline-block;background:#0f172a;color:#fff;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap;margin-left:12px;">Buy Now</a>
    </div>
    `).join("")}

    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:24px 0 0;">
      <p style="margin:0 0 4px;font-weight:600;font-size:14px;">See all prices across every retailer →</p>
      <p style="margin:0 0 8px;font-size:13px;color:#64748b;">We track Amazon and eBay — refreshed daily.</p>
      <a href="${siteUrl}" style="color:#2563eb;text-decoration:none;font-weight:600;font-size:14px;">${siteUrl.replace("https://", "")}</a>
    </div>
  </div>

  <div style="padding:16px 28px;border-top:1px solid #e2e8f0;">
    <p style="font-size:11px;color:#94a3b8;margin:0;">
      You're getting this because you signed up for a price alert at ukaircontracker.co.uk.<br>
      Contains affiliate links — we may earn a small commission at no cost to you.
    </p>
  </div>
</div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Re-activate dormant subscribers: clear sent_alert_at after 7 days so they
  // become eligible for price-drop and restock re-alerts. Subscriber stays in
  // the loop forever — one alert per product status change, not one alert ever.
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: resetError } = await supabase
    .from("aircon_alert_subscriptions")
    .update({ sent_alert_at: null })
    .lt("sent_alert_at", sevenDaysAgo)
    .is("unsubscribed_at", null);
  if (resetError) console.warn("[alerts] reset failed:", resetError.message);

  const requested = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Math.min(Number.isFinite(requested) && requested > 0 ? requested : MAX_PER_RUN, MAX_PER_RUN);

  const { data: candidates, error } = await supabase
    .from("aircon_alert_subscriptions")
    .select("id")
    .eq("confirmed", true)
    .is("sent_alert_at", null)
    .is("unsubscribed_at", null)
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!candidates?.length) return NextResponse.json({ sent: 0, remaining: 0, message: "No pending subscribers" });

  // Atomic claim: only rows still unsent get stamped, so an overlapping
  // invocation can never pick up the same subscriber (no double-sends).
  const { data: claimed, error: claimError } = await supabase
    .from("aircon_alert_subscriptions")
    .update({ sent_alert_at: new Date().toISOString() })
    .in("id", candidates.map(c => c.id))
    .is("sent_alert_at", null)
    .select("id, email, product_slug, token");

  if (claimError) return NextResponse.json({ error: claimError.message }, { status: 500 });
  if (!claimed?.length) return NextResponse.json({ sent: 0, message: "All candidates claimed by another run" });

  // Consolidate: one email per subscriber address, not one per tracked
  // product — someone tracking 3 units used to get 3 separate emails in the
  // same run.
  const groups = new Map<string, ClaimedSub[]>();
  for (const sub of claimed) {
    const arr = groups.get(sub.email) ?? [];
    arr.push(sub);
    groups.set(sub.email, arr);
  }

  const from = `UK Air Con Tracker <${process.env.RESEND_FROM_EMAIL ?? "alerts@ukaircontracker.co.uk"}>`;
  const batch = Array.from(groups.entries()).map(([email, subs]) => {
    const subject = subs.length === 1
      ? `Price alert: ${SAMPLE_PRODUCTS.find(p => p.slug === subs[0].product_slug)?.name ?? PRODUCT_DISPLAY_NAMES[subs[0].product_slug] ?? "your tracked product"} — and our best picks today`
      : `Price alert: ${subs.length} products you're tracking`;
    return { from, to: email, subject, html: emailHtml(subs) };
  });

  let sent = 0;
  let sendError: string | null = null;
  try {
    const res = await resend.batch.send(batch);
    if (res.error) throw new Error(res.error.message);
    sent = claimed.length;
  } catch (e: unknown) {
    sendError = e instanceof Error ? e.message : String(e);
    // Release the claim so a later run retries these subscribers.
    await supabase
      .from("aircon_alert_subscriptions")
      .update({ sent_alert_at: null })
      .in("id", claimed.map(c => c.id));
  }

  const { count: remaining } = await supabase
    .from("aircon_alert_subscriptions")
    .select("id", { count: "exact", head: true })
    .is("sent_alert_at", null)
    .is("unsubscribed_at", null);

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat && (sent > 0 || sendError)) {
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChat,
        text: `📧 ukaircontracker alerts: ${sent} product-alerts across ${batch.length} email(s), ${remaining ?? "?"} remaining.${sendError ? `\n⚠️ batch error (claims released for retry): ${sendError}` : ""}`,
      }),
    }).catch(() => {});
  }

  if (sendError) return NextResponse.json({ sent: 0, emailsSent: 0, remaining, error: sendError }, { status: 500 });
  return NextResponse.json({ sent, emailsSent: batch.length, remaining });
}
