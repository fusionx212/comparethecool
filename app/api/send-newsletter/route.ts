import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { buildAffiliateUrl } from "@/lib/affiliate";
import { isAnyInStock, bestOffer } from "@/lib/data";
import { gbp } from "@/lib/format";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_PER_RUN = 100;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";
const emailUtm = "utm_source=newsletter&utm_medium=email&utm_campaign=weekly-deals";

function track(url: string) {
  return url.includes("?") ? `${url}&${emailUtm}` : `${url}?${emailUtm}`;
}

function weeklyHtml() {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long",
    timeZone: "Europe/London",
  }).format(now);

  // Top 4 in-stock products by price (high-ticket first for commission)
  const inStock = SAMPLE_PRODUCTS
    .filter(isAnyInStock)
    .sort((a, b) => {
      const oa = bestOffer(a);
      const ob = bestOffer(b);
      return (ob?.price ?? 0) - (oa?.price ?? 0);
    })
    .slice(0, 4);

  const productCards = inStock.map(p => {
    const o = bestOffer(p)!;
    const buyUrl = track(buildAffiliateUrl(o));
    const productUrl = track(`${siteUrl}/p/${p.slug}`);
    const img = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:auto;border-radius:6px;margin-bottom:10px" />`
      : "";
    return `
    <div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:0 0 12px">
      ${img}
      <p style="margin:0;font-weight:700;font-size:15px"><a href="${productUrl}" style="color:#0f172a;text-decoration:none">${p.name}</a></p>
      <p style="margin:4px 0 8px;font-size:22px;font-weight:800;color:#0f172a">${gbp(o.price)}</p>
      <a href="${buyUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none">Check Price &amp; Buy →</a>
    </div>`;
  }).join("");

  const topDeal = inStock[0];
  const topOffer = bestOffer(topDeal!)!;
  const seeAllUrl = track(siteUrl);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

  <div style="background:#0f172a;padding:24px 28px;">
    <p style="color:#60a5fa;font-size:12px;letter-spacing:.08em;font-weight:700;margin:0 0 6px;">UK AIR CON TRACKER — WEEKLY</p>
    <h1 style="color:#fff;font-size:22px;margin:0;">Best cooling deals this week — ${dateStr}</h1>
  </div>

  <div style="padding:24px 28px;">
    <p style="margin:0 0 20px;font-size:15px;color:#334155;">
      Here's what's in stock and worth buying this week. Prices change fast in hot weather — these were checked this morning.
    </p>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:18px;margin:0 0 24px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.05em;color:#1d4ed8;font-weight:700;">SPOTLIGHT DEAL</p>
      <p style="margin:0 0 4px;font-weight:700;font-size:17px;">${topDeal!.name}</p>
      <p style="margin:0 0 12px;font-size:26px;font-weight:800;color:#0f172a;">${gbp(topOffer.price)}</p>
      <a href="${track(buildAffiliateUrl(topOffer))}" style="display:inline-block;background:#2563eb;color:#fff;padding:11px 24px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;">View Deal →</a>
    </div>

    <h2 style="font-size:16px;margin:0 0 14px;">More in stock this week</h2>
    ${productCards}

    <div style="text-align:center;margin:24px 0;">
      <a href="${seeAllUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 28px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">See All In-Stock Products →</a>
    </div>

    <!-- CROSS-SELL: Digital products -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:24px 0 0;">
      <p style="margin:0 0 6px;font-weight:700;font-size:14px;color:#166534;">📋 While you're here — our digital products</p>
      <p style="margin:0 0 10px;font-size:13px;color:#166534;">
        <strong>Holiday Let Welcome Book</strong> (£14.99) — editable PDF for your guests<br>
        <strong>Energy Bill Crash Course</strong> (£4.99) — run your AC for less<br>
        <strong>Home Maintenance Logbook</strong> (£7.99) — never miss a service
      </p>
      <a href="${track(`${siteUrl}/products/holiday-let-welcome-book`)}" style="color:#166534;font-weight:600;font-size:13px;">See all products →</a>
    </div>
  </div>

  <div style="padding:16px 28px;border-top:1px solid #e2e8f0;">
    <p style="font-size:11px;color:#94a3b8;margin:0;">
      You're getting this because you signed up for stock alerts at ukaircontracker.co.uk.<br>
      Contains affiliate links — we may earn a small commission at no cost to you.<br>
      <a href="${siteUrl}/alerts/unsubscribe" style="color:#94a3b8;">Unsubscribe from all emails</a>
    </p>
  </div>
</div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all subscribers who haven't unsubscribed
  const { data: subscribers, error } = await supabase
    .from("aircon_alert_subscriptions")
    .select("id, email")
    .is("unsubscribed_at", null)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subscribers?.length) return NextResponse.json({ sent: 0, message: "No subscribers" });

  const from = `UK Air Con Tracker <${process.env.RESEND_FROM_EMAIL ?? "deals@ukaircontracker.co.uk"}>`;
  const html = weeklyHtml();
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });

  // Send in batches of MAX_PER_RUN
  let sent = 0;
  for (let i = 0; i < subscribers.length; i += MAX_PER_RUN) {
    const batch = subscribers.slice(i, i + MAX_PER_RUN).map(sub => ({
      from,
      to: sub.email,
      subject: `This week's best cooling deals — ${dateStr}`,
      html,
    }));

    try {
      const res = await resend.batch.send(batch);
      if (res.error) throw new Error(res.error.message);
      sent += batch.length;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ sent, remaining: subscribers.length - sent, error: msg }, { status: 500 });
    }
  }

  // Telegram notification
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChat,
        text: `📧 Weekly newsletter: ${sent} sent to ${subscribers.length} subscribers`,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ sent, total: subscribers.length });
}
