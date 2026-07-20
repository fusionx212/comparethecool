// GET /api/ebay/search?q=portable+air+conditioner+9000+btu&limit=5
// Searches eBay UK for Buy It Now listings, returns normalized Offer objects.
// Uses production eBay Browse API with EPN affiliate links.
import { NextRequest, NextResponse } from "next/server";
import type { Offer, StockStatus, Retailer } from "@/lib/types";

export const runtime = "nodejs";

const EBAY_APP_ID = process.env.EBAY_APP_ID || "";
const EBAY_CERT_ID = process.env.EBAY_CERT_ID || "";
const EPN_CAMPAIGN_ID = process.env.EPN_CAMPAIGN_ID || "5339164583";

const EBAY_RETAILER: Retailer = {
  id: "ebay",
  name: "eBay",
};

let cachedToken = "";
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const auth = Buffer.from(`${EBAY_APP_ID}:${EBAY_CERT_ID}`).toString("base64");

  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  const data = await res.json();
  cachedToken = data.access_token as string;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000; // 5 min buffer
  return cachedToken!;
}

function ebayAffiliateUrl(itemWebUrl: string): string {
  // eBay EPN affiliate link format: append campaign ID
  const url = new URL(itemWebUrl);
  url.searchParams.set("campid", EPN_CAMPAIGN_ID);
  return url.toString();
}

export interface EbayItemCheck {
  legacyId: string;
  live: boolean; // listing exists and is buyable now
  price: number | null;
  availability: string | null; // IN_STOCK | LIMITED_STOCK | OUT_OF_STOCK | null
}

/**
 * Verify legacy item ids via the Browse getItems group endpoint (20 per call).
 * Items missing from a successful response = ended/removed listings → live:false.
 * Throws on quota/auth-level failures (429/401/5xx) so the caller leaves
 * existing statuses untouched instead of mass-marking products dead.
 */
async function checkItems(token: string, legacyIds: string[]): Promise<EbayItemCheck[]> {
  const out: EbayItemCheck[] = [];

  for (let i = 0; i < legacyIds.length; i += 20) {
    const batch = legacyIds.slice(i, i + 20);
    const itemIds = batch.map((id) => `v1|${id}|0`).join(",");
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item?item_ids=${encodeURIComponent(itemIds)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB",
        },
      },
    );

    if (res.status === 429 || res.status === 401 || res.status >= 500) {
      throw new Error(`ebay getItems ${res.status}`);
    }

    const data = await res.json().catch(() => ({}));
    const items: any[] = data.items || [];
    const seen = new Set<string>();

    for (const item of items) {
      const legacy = item.legacyItemId || (item.itemId || "").split("|")[1];
      if (!legacy) continue;
      seen.add(legacy);
      const avail = item.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus ?? null;
      const ended = item.itemEndDate && new Date(item.itemEndDate).getTime() < Date.now();
      out.push({
        legacyId: legacy,
        live: !ended && avail !== "OUT_OF_STOCK" && (item.buyingOptions ?? []).length > 0,
        price: item.price?.value ? parseFloat(item.price.value) : null,
        availability: avail,
      });
    }

    // Absent from a successful response = listing ended or removed.
    for (const id of batch) {
      if (!seen.has(id)) out.push({ legacyId: id, live: false, price: null, availability: null });
    }
  }

  return out;
}

interface EbayItem {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  itemWebUrl: string;
  image?: { imageUrl: string };
  quantitySold?: number;
  condition?: string;
  estimatedAvailabilities?: { estimatedAvailabilityStatus: string; estimatedSoldQuantity?: number }[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 10);

  // Verification mode — used by /api/update-stock's cron to re-check stored
  // eBay offers. Cron-secret gated so public traffic can't burn API quota.
  const ids = searchParams.get("ids");
  if (ids) {
    if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const legacyIds = ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 200);
    try {
      const token = await getToken();
      const checks = await checkItems(token, legacyIds);
      return NextResponse.json({ checks });
    } catch (err: any) {
      // Quota/auth failure — caller must leave existing statuses untouched.
      return NextResponse.json({ error: err.message, checks: null }, { status: 503 });
    }
  }

  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  try {
    const token = await getToken();

    const ebayUrl = new URL("https://api.ebay.com/buy/browse/v1/item_summary/search");
    ebayUrl.searchParams.set("q", query);
    ebayUrl.searchParams.set("limit", String(limit));
    // Filter: Fixed price (Buy It Now) only, UK items only.
    ebayUrl.searchParams.set("filter", "buyingOptions:{FIXED_PRICE},itemLocationCountry:GB");

    const res = await fetch(ebayUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB",
      },
    });

    if (!res.ok) {
      console.error("[ebay-search] API error:", res.status, await res.text());
      // Short CDN cache so a quota blip doesn't hammer the API on every view.
      return NextResponse.json(
        { offers: [] },
        { headers: { "Cache-Control": "public, s-maxage=900" } },
      );
    }

    const data = await res.json();
    const items: EbayItem[] = data.itemSummaries || [];

    // item_summary/search only returns ACTIVE listings, so every result is
    // buyable now. (Sold-quantity is popularity, not availability — the old
    // mapStatus(soldQuantity) marked unsold-but-live items out of stock.)
    const offers: Offer[] = items.map((item) => {
      // item_summary/search never actually returns quantitySold (it's only
      // populated via the separate getItems path checkItems() uses) — this
      // was unconditionally appending "0 sold" to every result, fabricating
      // a stat that reads as "nobody wants this" for genuinely live listings.
      // Only show a sold-count when a real positive number is present.
      const sold = item.quantitySold && item.quantitySold > 0 ? `${item.quantitySold} sold` : null;
      const deliveryNote = [item.condition, sold].filter(Boolean).join(" · ") || undefined;
      return {
        retailer: EBAY_RETAILER,
        price: parseFloat(item.price?.value || "0"),
        url: ebayAffiliateUrl(item.itemWebUrl),
        status: "in_stock" as StockStatus,
        stockQuantity: null,
        deliveryNote,
        lastChecked: new Date().toISOString(),
      };
    });

    // CDN-cache per query URL — the strips are client-fetched on every page
    // view and were burning the whole daily eBay quota (429s site-wide).
    return NextResponse.json(
      { offers },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } },
    );
  } catch (err: any) {
    console.error("[ebay-search] error:", err.message);
    return NextResponse.json(
      { offers: [] },
      { headers: { "Cache-Control": "public, s-maxage=900" } },
    );
  }
}
