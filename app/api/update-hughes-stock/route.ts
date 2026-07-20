import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";
import type { CategorySlug, Offer, Product } from "@/lib/types";

// Hughes stock via Awin's product datafeed — approved merchant 3133, feed
// 84905 (verified: membership "active", 2565 products, matches Hughes'
// entire Awin-listed catalogue, no larger feed exists for this merchant).
// Unlike Amazon/eBay this reads a daily-refreshed CSV, not a per-item API
// call, so it runs on its own daily schedule (see update-hughes-stock-cron.mts)
// rather than joining the 2h Amazon/eBay pass.
const AWIN_FEED_ID = "84905";
const AWIN_MERCHANT_ID = 3133;
const FEED_COLUMNS = [
  "merchant_product_id",
  "product_name",
  "brand_name",
  "description",
  "category_name",
  "search_price",
  "merchant_image_url",
  "merchant_deep_link",
  "in_stock",
  "ean",
  "mpn",
  "delivery_time",
].join(",");

// Only these two Awin category_name values map to anything this site sells —
// Hughes' other ~2540 products (TVs, fridges, cookers…) are out of scope.
const RELEVANT_CATEGORIES = new Set(["Fans", "Heating & Cooling"]);

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Category classifier — verified against all 24 real Fans/Heating & Cooling
 * rows in the live feed before use (19 matched, 5 correctly excluded: ceramic
 * and convector heaters have no honest category fit on this site — there is
 * no "electric heater" category, only oil-radiators, which they are not).
 * Returns null (exclude) rather than force a product into the wrong category.
 */
function classify(description: string, categoryName: string): CategorySlug | null {
  const d = description.toLowerCase();
  if (/dehumidif/.test(d)) return "dehumidifiers";
  if (/oil.?fill.*radiator|radiator.*oil.?fill/.test(d)) return "oil-radiators";
  if (/purif|hepa/.test(d)) return "air-purifiers";
  if (/tower fan/.test(d)) return "tower-fans";
  if (categoryName === "Fans" && /tabletop|desk/.test(d)) return "desk-usb-fans";
  if (categoryName === "Fans" && /portable|circulator|misting/.test(d)) return "portable-fans";
  return null;
}

function buildFeedUrl(apiKey: string): string {
  const cols = encodeURIComponent(FEED_COLUMNS);
  return (
    `https://productdata.awin.com/datafeed/download/apikey/${apiKey}` +
    `/fid/${AWIN_FEED_ID}/format/csv/language/en/delimiter/%2C` +
    `/compression/gzip/adultcontent/1/columns/${cols}/`
  );
}

type FeedRow = {
  merchant_product_id: string;
  product_name: string;
  brand_name: string;
  description: string;
  category_name: string;
  search_price: string;
  merchant_image_url: string;
  merchant_deep_link: string;
  in_stock: string;
  ean: string;
  mpn: string;
  delivery_time: string;
};

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.AWIN_DATAFEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AWIN_DATAFEED_API_KEY not set" }, { status: 500 });
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const res = await fetch(buildFeedUrl(apiKey), { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    return NextResponse.json({ error: `Awin feed fetch failed: HTTP ${res.status}` }, { status: 502 });
  }
  const gz = Buffer.from(await res.arrayBuffer());
  const csv = gunzipSync(gz).toString("utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true }) as FeedRow[];

  const now = new Date().toISOString();
  let matched = 0, classified = 0, excluded = 0, upserted = 0;
  const excludedSamples: string[] = [];

  const upsertRows = [];
  for (const row of rows) {
    if (!RELEVANT_CATEGORIES.has(row.category_name)) continue;
    matched++;

    const category = classify(row.description, row.category_name);
    if (!category) {
      excluded++;
      if (excludedSamples.length < 10) excludedSamples.push(row.description.slice(0, 70));
      continue;
    }
    classified++;

    const price = parseFloat(row.search_price);
    if (!price || price <= 0) continue; // no honest price to show — skip

    const slug = `hughes-${row.merchant_product_id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
    const name = decodeEntities(row.description || row.product_name);
    const brand = decodeEntities(row.brand_name);
    const inStock = row.in_stock === "1";

    const offer: Offer = {
      retailer: { id: "hughes", name: "Hughes", awinMerchantId: AWIN_MERCHANT_ID },
      price,
      url: row.merchant_deep_link, // RAW retailer URL — affiliate.ts builds the
      // tracked cread.php link server-side at click time. Using aw_deep_link
      // here instead would double-wrap it (already Awin-tracked, then wrapped
      // again), since buildAffiliateUrl() assumes offer.url is untracked.
      status: inStock ? "in_stock" : "out_of_stock",
      deliveryNote: row.delivery_time || undefined,
      lastChecked: now,
    };

    const product: Product = {
      id: slug,
      slug,
      name,
      brand,
      category,
      image: row.merchant_image_url || null,
      highlights: [`${brand} — sold by Hughes.co.uk`],
      offers: [offer],
    };

    upsertRows.push({
      id: product.id,
      data: product,
      stock_status: offer.status,
      price: offer.price,
      image: product.image,
      last_checked: now,
    });
    upserted++;
  }

  if (upsertRows.length) {
    const { error } = await supabase.from("uatk_products").upsert(upsertRows);
    if (error) {
      return NextResponse.json({ error: `Supabase upsert failed: ${error.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({
    feed_rows: rows.length,
    matched_categories: matched,
    classified,
    excluded,
    excluded_samples: excludedSamples,
    upserted,
    at: now,
  });
}
