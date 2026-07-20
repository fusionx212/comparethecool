// POST /api/update-stock — Called by Hermes cron with x-cron-secret header.
// Uses the Amazon Creators API to check all product ASINs live,
// then writes status/prices/images to Supabase for runtime consumption.
// Also auto-updates `popularity` from real click data so the ranking
// engine has fresh demand signals.
// Zero deploys — data flows directly to Supabase.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { updatePopularity } from "@/lib/popularity";
import { getHeatwaveState } from "@/lib/heatwave";
import { fetchSellerReputations } from "@/lib/seller-reputation";

const CRED_ID = process.env.AMAZON_CREATORS_CLIENT_ID || "";
const CRED_SECRET = process.env.AMAZON_CREATORS_CLIENT_SECRET || "";
const TAG = process.env.AMAZON_ASSOCIATES_TAG || "ukaircon-21";
const RESOURCES = ["itemInfo.title","offersV2.listings.price","offersV2.listings.availability","offersV2.listings.merchantInfo","images.primary.large"];

async function getToken() {
  const r = await fetch("https://api.amazon.co.uk/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${CRED_ID}&client_secret=${CRED_SECRET}&scope=creatorsapi::default`,
  });
  const data = await r.json();
  return data.access_token;
}

async function checkAsins(token: string, asins: string[]) {
  const r = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": "www.amazon.co.uk",
    },
    body: JSON.stringify({
      itemIds: asins,
      partnerTag: TAG,
      marketplace: "www.amazon.co.uk",
      resources: RESOURCES,
    }),
  });
  return r.json();
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get all ASINs currently in Supabase (from existing data or previous runs)
  const { data: existing } = await supabase.from("uatk_products").select("id,data");
  const asinMap = new Map<string, string>(); // asin -> product id
  if (existing) {
    for (const row of existing) {
      const offers = row.data?.offers || [];
      for (const o of offers) {
        if (o.url && o.url.includes("amazon.co.uk/dp/")) {
          const asin = o.url.split("/dp/")[1]?.split("?")[0]?.split("/")[0];
          if (asin) asinMap.set(asin, row.id);
        }
      }
    }
  }

  // Seed Supabase from static file if table is empty
  if ((existing || []).length === 0) {
    const now = new Date().toISOString();
    // Seed in batches to avoid payload limits
    for (let i = 0; i < SAMPLE_PRODUCTS.length; i += 20) {
      const batch = SAMPLE_PRODUCTS.slice(i, i + 20).map(p => ({
        id: p.id,
        data: p,
        stock_status: p.offers?.some((o: any) => o.status === "in_stock") ? "in_stock" : "out_of_stock",
        price: p.offers?.[0]?.price || null,
        image: p.image || "",
        last_checked: now,
      }));
      await supabase.from("uatk_products").upsert(batch);
    }
    // Re-read after seed
    const { data: refreshed } = await supabase.from("uatk_products").select("id,data");
    if (refreshed) {
      for (const row of refreshed) {
        for (const o of (row.data?.offers || [])) {
          if (o.url?.includes("amazon.co.uk/dp/")) {
            const a = o.url.split("/dp/")[1]?.split("?")[0]?.split("/")[0];
            if (a) asinMap.set(a, row.id);
          }
        }
      }
    }
  } else {
    // Always sync: ensure every SAMPLE_PRODUCT exists in Supabase
    // (catches new products added between deploys)
    const existingIds = new Set((existing || []).map((e: any) => e.id));
    const missing = SAMPLE_PRODUCTS.filter(p => !existingIds.has(p.id));
    if (missing.length > 0) {
      const now = new Date().toISOString();
      for (let i = 0; i < missing.length; i += 20) {
        const batch = missing.slice(i, i + 20).map(p => ({
          id: p.id,
          data: p,
          stock_status: p.offers?.some((o: any) => o.status === "in_stock") ? "in_stock" : "out_of_stock",
          price: p.offers?.[0]?.price || null,
          image: p.image || "",
          last_checked: now,
        }));
        await supabase.from("uatk_products").upsert(batch);
      }
      // Add new product ASINs to the map so they get stock-checked too
      for (const p of missing) {
        for (const o of (p.offers || [])) {
          if (o.url?.includes("amazon.co.uk/dp/")) {
            const a = o.url.split("/dp/")[1]?.split("?")[0]?.split("/")[0];
            if (a) asinMap.set(a, p.id);
          }
        }
      }
    }
    // Rebuild ASIN map from existing products
    for (const row of (existing || [])) {
      for (const o of (row.data?.offers || [])) {
        if (o.url?.includes("amazon.co.uk/dp/")) {
          const a = o.url.split("/dp/")[1]?.split("?")[0]?.split("/")[0];
          if (a) asinMap.set(a, row.id);
        }
      }
    }
  }

  // If no data yet, seed from the static file on first run
  let asins = Array.from(asinMap.keys());
  if (asins.length === 0) {
    // Auto-seed from SAMPLE_PRODUCTS on first run (shouldn't hit this anymore, but safety)
    const seedRows = SAMPLE_PRODUCTS.map(p => ({
      id: p.id,
      data: p,
      stock_status: "in_stock",
      price: p.offers?.[0]?.price || null,
      image: p.image || "",
      last_checked: new Date().toISOString(),
    }));
    await supabase.from("uatk_products").upsert(seedRows);

    // Rebuild ASIN map from seed
    for (const p of SAMPLE_PRODUCTS) {
      for (const o of (p.offers || [])) {
        if (o.url?.includes("amazon.co.uk/dp/")) {
          const a = o.url.split("/dp/")[1]?.split("?")[0]?.split("/")[0];
          if (a) asinMap.set(a, p.id);
        }
      }
    }
    asins = Array.from(asinMap.keys());
  }

  const token = await getToken();
  const results: Record<string, any> = {};
  let inStock = 0, outStock = 0, notFound = 0;

  // Amazon batches of 10, 4 in flight — keeps the whole run inside the
  // function timeout even at full catalogue size.
  const asinBatches: string[][] = [];
  for (let i = 0; i < asins.length; i += 10) asinBatches.push(asins.slice(i, i + 10));

  for (let i = 0; i < asinBatches.length; i += 4) {
    const wave = asinBatches.slice(i, i + 4);
    const datas = await Promise.all(wave.map((batch) => checkAsins(token, batch).catch(() => null)));

    datas.forEach((data, w) => {
      const batch = wave[w];
      if (!data) return; // network/API failure — leave these ASINs untouched
      const items = data?.itemsResult?.items || [];
      const found = new Set<string>();

      for (const item of items) {
        const a = item.asin;
        found.add(a);
        const listings = item.offersV2?.listings || [];
        const l = listings[0];
        const avail = l?.availability || {};
        const money = l?.price?.money || {};
        const atype = avail.type;
        const amsg = avail.message || "";

        let status = "out_of_stock";
        if (atype === "AVAILABLE_DATE" || atype === "NOW" || atype === "IN_STOCK") status = "in_stock";
        else if (atype === "LEADTIME") status = "in_stock";

        results[a] = {
          status,
          price: money.amount || null,
          image: item.images?.primary?.large?.url || "",
          title: item.itemInfo?.title?.displayValue || "",
          note: amsg || (status === "in_stock" ? "In stock" : "Currently unavailable"),
          found: true,
        };
        if (status === "in_stock") inStock++;
        else outStock++;
      }

      for (const a of batch) {
        if (!found.has(a)) {
          results[a] = { status: "not_found", price: null, image: "", note: "ASIN not found", found: false };
          notFound++;
        }
      }
    });
  }

  const now = new Date().toISOString();

  // Rows to upsert, one per touched product (Map dedupes products that carry
  // several checked offers — duplicate ids in one upsert batch error out).
  const touched = new Map<string, any>();
  const rowFor = (productId: string) => {
    let row = touched.get(productId);
    if (!row) {
      const ex = existing?.find((e: any) => e.id === productId);
      if (!ex) return null;
      row = { id: productId, data: { ...ex.data } };
      touched.set(productId, row);
    }
    return row;
  };

  // Apply Amazon results
  for (const [asin, productId] of asinMap) {
    const r = results[asin];
    if (!r) continue;
    const row = rowFor(productId);
    if (!row) continue;

    const amazonOffer = (row.data.offers || []).find((o: any) =>
      o.url?.includes(`amazon.co.uk/dp/${asin}`)
    );
    if (amazonOffer) {
      amazonOffer.status = r.status;
      if (r.price) amazonOffer.price = r.price;
      if (r.note) amazonOffer.deliveryNote = r.note;
      amazonOffer.lastChecked = now;
    }
    if (r.image) row.data.image = r.image;
  }

  // ── eBay pass — re-verify every stored eBay offer via the Browse API ──
  // (through our own /api/ebay/search?ids= verification mode, which owns the
  // eBay credentials). Listings end constantly; without this pass the site
  // keeps showing "in stock" for dead listings and the counts drift wrong.
  let ebayChecked = 0, ebayDead = 0, ebaySkipped = false;
  const ebayIdToProducts = new Map<string, string[]>();
  for (const row of existing || []) {
    for (const o of row.data?.offers || []) {
      if (o.retailer?.id !== "ebay") continue;
      const m = (o.url || "").match(/ebay\.co\.uk\/itm\/(\d+)/);
      if (!m) continue;
      const list = ebayIdToProducts.get(m[1]) ?? [];
      list.push(row.id);
      ebayIdToProducts.set(m[1], list);
    }
  }

  const ebayIds = Array.from(ebayIdToProducts.keys());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukaircontracker.co.uk";
  for (let i = 0; i < ebayIds.length && !ebaySkipped; i += 100) {
    const chunk = ebayIds.slice(i, i + 100);
    try {
      const res = await fetch(
        `${siteUrl}/api/ebay/search?ids=${chunk.join(",")}`,
        { headers: { "x-cron-secret": process.env.CRON_SECRET ?? "" } },
      );
      if (!res.ok) { ebaySkipped = true; break; } // quota/auth — leave statuses alone
      const { checks } = await res.json();
      if (!checks) { ebaySkipped = true; break; }

      for (const c of checks) {
        ebayChecked++;
        if (!c.live) ebayDead++;
        for (const productId of ebayIdToProducts.get(c.legacyId) ?? []) {
          const row = rowFor(productId);
          if (!row) continue;
          const offer = (row.data.offers || []).find(
            (o: any) => o.retailer?.id === "ebay" && o.url?.includes(`/itm/${c.legacyId}`)
          );
          if (!offer) continue;
          offer.status = c.live
            ? (c.availability === "LIMITED_STOCK" ? "low_stock" : "in_stock")
            : "out_of_stock";
          if (c.live && c.price) offer.price = c.price;
          if (!c.live) offer.deliveryNote = "Listing ended";
          offer.lastChecked = now;
        }
      }
    } catch {
      ebaySkipped = true;
    }
  }

  // Finalize rows: stock_status/price derived from ALL offers, not just the
  // last-checked retailer.
  const upserts: any[] = [];
  for (const row of touched.values()) {
    const offers = row.data.offers || [];
    const buyable = offers.filter((o: any) => o.status === "in_stock" || o.status === "low_stock");
    const cheapest = buyable.length
      ? Math.min(...buyable.map((o: any) => o.price).filter((p: any) => typeof p === "number"))
      : null;
    upserts.push({
      id: row.id,
      data: row.data,
      stock_status: buyable.length ? "in_stock" : "out_of_stock",
      price: Number.isFinite(cheapest) ? cheapest : null,
      image: row.data.image || "",
      last_checked: now,
    });
  }

  // Batch upserts of 50 so one bad row can't sink the whole write
  for (let i = 0; i < upserts.length; i += 50) {
    const { error } = await supabase.from("uatk_products").upsert(upserts.slice(i, i + 50));
    if (error) {
      return NextResponse.json({ error: error.message, updated: i }, { status: 500 });
    }
  }

  // Auto-update popularity from real click data so the ranking engine
  // always has fresh demand signals.
  const popResult = await updatePopularity(supabase);

  // Fetch heatwave state for logging + future GSC integration
  const heatwaveEnabled = process.env.ENABLE_HEATWAVE_BOOST !== "false";
  const heatwave = heatwaveEnabled ? await getHeatwaveState() : null;

  // Fetch seller reputation data (optional, no API key required for MVP defaults)
  const sellerRepEnabled = process.env.ENABLE_SELLER_REPUTATION !== "false";
  let sellerRepCount = 0;
  if (sellerRepEnabled) {
    try {
      const allOffers: any[] = [];
      for (const row of existing || []) {
        allOffers.push(...(row.data?.offers || []));
      }
      const reps = await fetchSellerReputations(allOffers);
      sellerRepCount = reps.size;
    } catch (e) {
      console.log("[cron] Seller rep fetch failed:", e);
    }
  }

  // Log to Telegram for monitoring
  const telegramMsg = [
    `🌡️ *Stock Update* — ${new Date(now).toLocaleTimeString('en-GB')}`,
    `Amazon: ${inStock}/${asins.length} in stock (${notFound} N/A)`,
    `eBay: ${ebayChecked} checked, ${ebayDead} dead`,
    `Popularity updated: ${popResult.updated} products`,
    sellerRepCount > 0 ? `Seller reputation: ${sellerRepCount} sellers scored` : "",
    heatwave && heatwave.active
      ? `🔥 *HEATWAVE ACTIVE* — ${heatwave.currentTemp.toFixed(1)}°C (avg ${heatwave.historicalAvg.toFixed(1)}°C, +${heatwave.delta.toFixed(1)}°C) → ${heatwave.boost.toFixed(1)}x AC boost applied`
      : heatwave
        ? `✓ Temp ${heatwave.currentTemp.toFixed(1)}°C — no boost`
        : `✓ Heatwave detection disabled`,
  ]
    .filter(Boolean)
    .join("\n");

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    await fetch("https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMsg,
        parse_mode: "Markdown",
      }),
    }).catch(() => {}); // Silent fail
  }

  // Extract GSC stats from popularity result if available
  const gscStats = (popResult as any)?.gscMatched ? {
    gsc_queries: (popResult as any).gscMatched,
  } : {};

  return NextResponse.json({
    ok: true,
    checked: asins.length,
    in_stock: inStock,
    out_of_stock: outStock,
    not_found: notFound,
    ebay_checked: ebayChecked,
    ebay_dead: ebayDead,
    ebay_skipped: ebaySkipped,
    updated: upserts.length,
    popularity_updated: popResult.updated,
    popularity_error: popResult.error,
    seller_reputation: sellerRepCount,
    ...gscStats,
    heatwave: heatwave ? {
      current_temp: heatwave.currentTemp,
      historical_avg: heatwave.historicalAvg,
      delta: heatwave.delta,
      boost: heatwave.boost,
      active: heatwave.active,
    } : null,
    at: now,
  });
}
