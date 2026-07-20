import type { Offer, Product } from "./types";
import { SAMPLE_PRODUCTS } from "./sample-products";
import { createClient } from "@supabase/supabase-js";

// ── Product read seam ────────────────────────────────────────────────
// Reads live stock data from Supabase (updated every 2h by cron).
// Falls back to the static SAMPLE_PRODUCTS if Supabase is unreachable.

async function readFromSupabase(): Promise<Product[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return SAMPLE_PRODUCTS;

  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });

    const { data, error } = await sb
      .from("uatk_products")
      .select("data");

    if (error || !data?.length) return SAMPLE_PRODUCTS;

    return data.map((row: any) => row.data as Product);
  } catch {
    return SAMPLE_PRODUCTS;
  }
}

let _cachedProducts: Product[] | null = null;
let _cacheAt = 0;
const CACHE_TTL = 120_000; // 2 min — matches cron cadence

// Only retailers we actually earn from are shown. Amazon (direct tag), eBay
// (EPN), Hughes (Awin merchant 3133), and Geepas (Awin affiliate).
// Keep this in step with AWIN_MERCHANTS in lib/affiliate.ts.
export const EARNING_RETAILERS = new Set(["amazon", "ebay", "hughes", "geepas"]);

export function stripNonEarningRetailers(products: Product[]): Product[] {
  // Category-based price ceilings for eBay — anything above = scalper. Only
  // fires when there's no Amazon price to cross-check against (the primary
  // 2.5x-Amazon-floor check below already covers that case).
  const SCALPER_CAP: Record<string, number> = {
    "portable-air-conditioners": 500,
    "air-con-units": 600,
    "tower-fans": 200,
    "pedestal-fans": 150,
    "dehumidifiers": 300,
    "air-purifiers": 300,
    "evaporative-coolers": 250,
    "desk-usb-fans": 80,
    "portable-fans": 60,
    "ice-makers": 200,
  };

  // Verified-legitimate premium SKUs that would otherwise fail the flat
  // category cap above (eBay-only, no Amazon price to cross-check against).
  // A flat cap can't tell "genuine premium model" from "budget unit marked
  // up" — this was tried once (raising the whole category cap to 1600) and
  // it worked for the Meaco Cirro+ but also let real scalper listings
  // through (a "Pro Breeze 9000 BTU" at £999-1128 — that model retails
  // ~£150-250). Allowlist by id instead: precise, doesn't widen the net for
  // everything else in the category.
  const PREMIUM_MODEL_IDS = new Set([
    "ebay-meaco-cirro-12000-cooling", // £899.99 — genuine Meaco Cirro inverter line
    "ebay-meaco-cirro-12000-heat",    // £904.30
    "ebay-meaco-cirro-16000",         // £1,499.99
    "ebay-wessex-12000-4in1",         // £899.98 — verified real listing, Dale's dashboard export
    "ebay-daewoo-3in1-9000",          // £780.46 — same
  ]);

  return products.map((p) => {
    const amazonPrices = p.offers
      .filter((o) => o.retailer.id === "amazon")
      .map((o) => o.price)
      .filter((p) => p > 0);
    const amazonFloor = amazonPrices.length ? Math.min(...amazonPrices) : null;
    const cap = SCALPER_CAP[p.category] ?? 400;

    return {
      ...p,
      offers: p.offers
        .filter((o) => EARNING_RETAILERS.has(o.retailer.id))
        .map((o) => {
          // Unverified generic search URL — no ASIN/item id for the refresh
          // cron to look up, so this offer can never be re-checked and would
          // otherwise assert whatever status it was seeded with forever. Was
          // eBay-only; the same pattern exists for Amazon (amazon.co.uk/s?k=...
          // seed offers), which had no honesty check at all until now.
          const isSearchUrl =
            o.url.includes("ebay.co.uk/sch/") ||
            o.url.includes("ebay.co.uk/sch?") ||
            o.url.includes("amazon.co.uk/s?");
          if (isSearchUrl && o.status === "in_stock") {
            return { ...o, status: "out_of_stock" as const, deliveryNote: `Check ${o.retailer.name} for live listings` };
          }

          // Stale offer: not verified in 48h = unreliable. Was eBay-only —
          // Amazon offers frozen by an ingestion gap got no such check and
          // could assert "in stock" indefinitely on data over a week old.
          const checkedAt = o.lastChecked ? new Date(o.lastChecked).getTime() : 0;
          const hoursStale = (Date.now() - checkedAt) / 36e5;
          if (hoursStale > 48 && o.status === "in_stock") {
            return { ...o, status: "out_of_stock" as const, deliveryNote: `Listing may have ended — check ${o.retailer.name}` };
          }

          // Never-verified offer (lastChecked = null): the refresh cron has
          // never touched this listing. eBay auctions ship with lastChecked:null
          // and sit as "in_stock" forever despite the auction ending weeks ago.
          // Treat as OOS until a real check happens.
          if (!o.lastChecked && (o.status === "in_stock" || o.status === "low_stock")) {
            return { ...o, status: "out_of_stock" as const, deliveryNote: `Waiting for stock check — try ${o.retailer.name}` };
          }

          // Empty or invalid URL — can never be buyable. Serving a dead link
          // damages trust. Kill it at the data gate regardless of status.
          if (!o.url || !o.url.startsWith("http")) {
            return { ...o, status: "out_of_stock" as const, deliveryNote: "Listing unavailable" };
          }

          if (o.retailer.id !== "ebay") return o;

          // Scalper detection #1: >2.5x Amazon price
          if (amazonFloor && o.price > amazonFloor * 2.5) {
            return { ...o, status: "out_of_stock" as const, deliveryNote: "Scalper listing — skip" };
          }
          // Scalper detection #2: eBay-only product, price above category cap
          if (!amazonFloor && o.price > cap && !PREMIUM_MODEL_IDS.has(p.id)) {
            return { ...o, status: "out_of_stock" as const, deliveryNote: "Scalper listing — skip" };
          }

          return o;
        }),
    };
  });
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Serve cache when warm
    const now = Date.now();
    if (_cachedProducts && (now - _cacheAt) < CACHE_TTL) {
      return _cachedProducts;
    }

    const fromSupabase = await readFromSupabase();
    
    // If Supabase has fewer products than the static file, something is wrong —
    // keep the static file as the authoritative catalogue and overlay live data.
    if (fromSupabase.length < SAMPLE_PRODUCTS.length * 0.5) {
      // Fall back: use SAMPLE_PRODUCTS as base, no live overlay
      _cachedProducts = stripNonEarningRetailers(SAMPLE_PRODUCTS);
      _cacheAt = now;
      return _cachedProducts;
    }

    _cachedProducts = stripNonEarningRetailers(fromSupabase);
    _cacheAt = now;
    return _cachedProducts;
  } catch {
    return stripNonEarningRetailers(SAMPLE_PRODUCTS);
  }
}

// The single freshness signal for the site — the most recent lastChecked
// across every offer actually shown. Used for the sitewide header so it can
// never claim to be fresher than the data backing it (was previously
// request-time new Date(), i.e. always "just now" regardless of real staleness).
export async function getFreshestCheckedAt(): Promise<string | null> {
  const all = await getAllProducts();
  let latest: string | null = null;
  let latestMs = -Infinity;
  for (const p of all) {
    for (const o of p.offers) {
      if (!o.lastChecked) continue;
      const ms = new Date(o.lastChecked).getTime();
      if (Number.isNaN(ms)) continue;
      if (ms > latestMs) {
        latestMs = ms;
        latest = o.lastChecked;
      }
    }
  }
  return latest;
}

// ── Category plausibility floor ───────────────────────────────────────────
// The mirror of SCALPER_CAP above. Marketplace sellers keyword-stuff listing
// titles ("Portable Air Conditioner, Cool Air Conditioner, USB Powered Cooling
// Fan"), so a £15 USB desk fan ingests into portable-air-conditioners. Being
// the cheapest in-stock row it then leads the price-asc sort AND gets quoted
// verbatim by categoryAnswerLead as "the cheapest in-stock option" — a false
// headline claim on the page that takes the most traffic.
//
// A compressor unit cannot retail below ~£100 (real ones start ~£150), so
// anything under the floor is a miscategorised accessory, not a bargain.
// Floors are set only for the categories where the failure is proven; a
// category with no floor is unaffected.
const CATEGORY_PRICE_FLOOR: Record<string, number> = {
  "portable-air-conditioners": 100,
  "air-con-units": 100,
};

/**
 * True when a product sits in a category it physically cannot belong to.
 * Judged on the cheapest offer of any status, so a miscategorised unit can't
 * slip back in by going out of stock at one retailer.
 *
 * Price is the only test on purpose. A title-keyword rule (/usb|desk fan/)
 * was tried and dropped: sellers put "with USB Port" in the titles of genuine
 * £400 units, so it hid real, buyable stock — a false positive here costs a
 * sale, while the £100 floor is grounded in physics (a compressor, hose and
 * condenser cannot retail below it) and cannot fire on a real AC.
 */
export function isMiscategorised(p: Product): boolean {
  const floor = CATEGORY_PRICE_FLOOR[p.category];
  if (floor === undefined) return false;
  const low = lowestPrice(p);
  return low !== undefined && low > 0 && low < floor;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getAllProducts();
  // Filtered at the category seam, not in getAllProducts: these products keep
  // their own /p/ page (already indexed — removing it would 404 a live URL).
  // They just stop polluting the category list, the answer lead, the brand
  // filter and the ItemList schema, all of which read from here.
  return all.filter((p) => p.category === slug && !isMiscategorised(p));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

// Cheapest currently-buyable offer; falls back to the cheapest of any status.
export function bestOffer(p: Product): Offer | undefined {
  const buyable = p.offers.filter((o) => o.status === "in_stock" || o.status === "low_stock");
  const pool = buyable.length ? buyable : p.offers;
  return [...pool].sort((a, b) => a.price - b.price)[0];
}

export function lowestPrice(p: Product): number | undefined {
  return p.offers.length ? Math.min(...p.offers.map((o) => o.price)) : undefined;
}

// A product is "in stock" if any retailer has it buyable now.
export function isAnyInStock(p: Product): boolean {
  return p.offers.some((o) => o.status === "in_stock" || o.status === "low_stock");
}

// ── Brand helpers for scarcity/stock-checker pages ────────────────────────

/** Normalised URL-safe brand slugs. */
export const BRAND_SLUGS: Record<string, string> = {
  meaco: "Meaco",
  "pro-breeze": "Pro Breeze",
  delonghi: "De'Longhi",
  dyson: "Dyson",
  honeywell: "Honeywell",
  electriq: "electriQ",
  geepas: "Geepas",
};

export function getBrandName(slug: string): string | undefined {
  return BRAND_SLUGS[slug.toLowerCase()];
}

/**
 * True when a value is plausibly a manufacturer name rather than a fragment
 * parsed out of a keyword-stuffed marketplace title.
 *
 * The ingested `brand` is frequently a spec token — "12000", "10L", "550W",
 * "3-in-1", "6-Speeds", "1800BTU", "2026". 73 of these reach the brand filter
 * on /portable-air-conditioners, burying the ~12 genuine brands (AEG,
 * De'Longhi, Honeywell, BLACK+DECKER, Devola, electriQ) in noise and giving
 * the page the text signature of scraped content.
 *
 * Deliberately conservative: it rejects only provable parse artefacts, never
 * an ugly-but-real brand. HJYXXSR and KPOUYYDS look like noise but are genuine
 * Amazon seller brands, and dropping them would remove their products' only
 * filter path. Nothing is hidden from the catalogue either — a rejected value
 * just stops being offered as a filter option.
 */
export function isRealBrand(brand: string): boolean {
  const b = brand.trim();
  if (b.length < 2) return false;
  // No manufacturer name starts with a digit; every spec fragment does.
  if (/^\d/.test(b)) return false;
  // Needs at least two letters to be a name at all (rejects "-", "4-in-1").
  if ((b.match(/[a-z]/gi) ?? []).length < 2) return false;
  // Word-shaped fragments the parser lifts out of a title ("Portable Air
  // Conditioner" -> "Portable"), feed placeholders, and retailers misfiled as
  // manufacturers. Exact-match only, so real brands containing these words
  // ("Air Pro", "Pro Breeze") are untouched.
  if (
    /^(generic|air|unbranded|no ?brand|n\/?a|none|other|mini|pair|portable|smart|new|ebay|amazon)$/i.test(b)
  ) {
    return false;
  }
  return true;
}

/** Reverse lookup: brand display name → its checker slug (undefined if no page exists). */
export function getBrandSlug(brandName: string): string | undefined {
  const target = brandName.toLowerCase();
  return Object.keys(BRAND_SLUGS).find((slug) => BRAND_SLUGS[slug].toLowerCase() === target);
}

export async function getProductsByBrand(brandName: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase(),
  );
}
