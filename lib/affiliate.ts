import type { Offer } from "./types";

// Server-side affiliate URL construction. No client-side link rewriter is
// required: eBay and Awin attribution are added before the redirect response,
// while Amazon remains a direct associate-tagged link.
//
// Env:
//   AMAZON_ASSOCIATES_TAG  — Amazon Associates store tag (e.g. ukaircon-21)
//   EPN_CAMPAIGN_ID        — eBay Partner Network campaign id
//   AWIN_AFFILIATE_ID      — Awin publisher id (numeric)

const AMAZON_ASSOCIATES_TAG = process.env.AMAZON_ASSOCIATES_TAG;
const EPN_CAMPAIGN_ID = process.env.EPN_CAMPAIGN_ID ?? "5339164583";
const EPN_GB_ROTATION_ID = "710-53481-19255-0";
// Policy & Play Ltd. Public identifier — it appears in every outbound link, so
// it is defaulted here (as EPN_CAMPAIGN_ID is) rather than relying on an env
// var whose absence would silently make every Awin link earn nothing.
const AWIN_AFFILIATE_ID = process.env.AWIN_AFFILIATE_ID ?? "2953601";

// Awin merchants we are APPROVED for, keyed by retailer id. This is the single
// source of truth for merchant ids, so ingestion never has to carry one on
// every stored offer. Only add a retailer once Awin approval is confirmed — an
// unapproved merchant id produces a click that is tracked but never paid.
const AWIN_MERCHANTS: Record<string, number> = {
  hughes: 3133, // approved 14 Jul 2026 — 2.5% flat on net sales, 30-day cookie
  geepas: 46851, // Geepas Partner Program — home/kitchen/cooling appliances
};

// AWIN_MERCHANTS only — was `?? offer.retailer.awinMerchantId`, which meant
// ANY retailer object carrying a leftover awinMerchantId field (Geepas, AO,
// Currys, Robert Dyas, Meaco Ireland, Hoover, Electrical World — none ever
// approved) got treated as Awin-tracked. Confirmed live: 999 real clicks
// logged for AO/Currys/Robert Dyas alone, tracked and never paid. This is
// the single source of truth the AWIN_MERCHANTS comment already promised.
function awinMerchantIdFor(offer: Offer): number | undefined {
  return AWIN_MERCHANTS[offer.retailer.id];
}

// Amazon UK ASINs are 10 chars of upper-case letters/digits, always preceded
// by /dp/ in our stored URLs (see lib/sample-products.ts).
function extractAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/);
  return match ? match[1] : null;
}

/**
 * Build the outbound URL for an offer. Retailers without a configured
 * affiliate programme fall back to their raw product URL.
 */
export function buildAffiliateUrl(offer: Offer, referenceId?: string): string {
  // eBay — construct the EPN click URL on the server.
  if (offer.retailer.id === "ebay") {
    const url = new URL(offer.url);
    url.searchParams.set("mkevt", "1");
    url.searchParams.set("mkcid", "1");
    url.searchParams.set("mkrid", EPN_GB_ROTATION_ID);
    url.searchParams.set("campid", EPN_CAMPAIGN_ID);
    url.searchParams.set("toolid", "10001");
    if (referenceId) url.searchParams.set("customid", referenceId.slice(0, 256));
    return url.toString();
  }

  // Amazon Associates — append tag directly (Amazon forbids cloaking/redirects).
  // Direct /dp/ASIN link — the /gp/offer-listing/ path was causing Amazon "Uh oh"
  // error pages (Amazon blocks redirect traffic to that endpoint). The /dp/ page
  // still surfaces alternative sellers when the primary listing is OOS via
  // Amazon's own "Other Sellers on Amazon" box.
  if (offer.retailer.id === "amazon" && AMAZON_ASSOCIATES_TAG) {
    const asin = extractAsin(offer.url);
    const base = asin ? `https://www.amazon.co.uk/dp/${asin}` : offer.url;
    const url = new URL(base);
    url.searchParams.set("tag", AMAZON_ASSOCIATES_TAG);
    return url.toString();
  }

  // Awin — tracked deeplink for an approved merchant. `clickref` mirrors eBay's
  // customid, so Awin reporting attributes the sale to the page that drove it.
  const awinMid = awinMerchantIdFor(offer);
  if (awinMid && AWIN_AFFILIATE_ID) {
    const url = new URL("https://www.awin1.com/cread.php");
    url.searchParams.set("awinmid", String(awinMid));
    url.searchParams.set("awinaffid", AWIN_AFFILIATE_ID);
    if (referenceId) url.searchParams.set("clickref", referenceId.slice(0, 100));
    url.searchParams.set("ued", offer.url);
    return url.toString();
  }

  return offer.url;
}

/** Whether this offer earns via an approved Awin merchant. */
export function isTrackedByAwin(offer: Offer): boolean {
  return Boolean(awinMerchantIdFor(offer) && AWIN_AFFILIATE_ID);
}

/**
 * The href to put on a "Buy" button. Three cases, by design:
 *  - Amazon: DIRECT associate-tagged URL (Amazon forbids cloaking/redirects).
 *  - eBay or an approved Awin merchant: route via our `/go/` redirect, which
 *    adds attribution server-side and logs the click.
 *  - Everyone else: a direct retailer link.
 */
export function outboundHref(productSlug: string, offer: Offer): string {
  if (offer.retailer.id === "amazon") return buildAffiliateUrl(offer);
  if (offer.retailer.id === "ebay" || isTrackedByAwin(offer)) {
    return `/go/${encodeURIComponent(productSlug)}/${encodeURIComponent(offer.retailer.id)}`;
  }
  return offer.url;
}
