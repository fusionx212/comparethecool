/**
 * Affiliate URL wrappers — Amazon seasonal tags + eBay EPN.
 * Always force the shopper onto the local marketplace for their country path.
 */

import {
  activeAmazonTag,
  getCountry,
  type CountryConfig,
} from "@/lib/countries";
import type { SiteBrand } from "@/lib/site-brand";
import { looksLikeRealAsin } from "@/lib/asin";

export const EBAY_EPN_CAMPID = "5339164583";

/** Local eBay hostname for a market — never ebay.us / ebay.au. */
export function ebayHostFor(code: string): string {
  switch (code) {
    case "uk":
      return "www.ebay.co.uk";
    case "us":
      return "www.ebay.com";
    case "au":
      return "www.ebay.com.au";
    case "de":
    case "eu":
      return "www.ebay.de";
    case "fr":
      return "www.ebay.fr";
    case "it":
      return "www.ebay.it";
    case "es":
      return "www.ebay.es";
    case "nl":
      return "www.ebay.nl";
    default:
      return "www.ebay.co.uk";
  }
}

export function amazonProductUrl(
  country: CountryConfig | string,
  asin: string,
  tagOverride?: string,
  brand?: SiteBrand,
): string | null {
  if (!looksLikeRealAsin(asin)) return null;
  const cc = typeof country === "string" ? getCountry(country) : country;
  const tag = tagOverride || activeAmazonTag(cc, brand);
  return `https://${cc.amazonMarketplace}/dp/${asin}?tag=${tag}`;
}

export function ebayItemUrl(
  country: CountryConfig | string,
  itemId: string,
): string {
  const cc = typeof country === "string" ? getCountry(country) : country;
  const u = new URL(`https://${ebayHostFor(cc.code)}/itm/${itemId}`);
  u.searchParams.set("campid", EBAY_EPN_CAMPID);
  u.searchParams.set("customid", `ctc-${cc.code}`);
  u.searchParams.set("mkevt", "1");
  u.searchParams.set("mkcid", "1");
  u.searchParams.set("mkrid", "0");
  return u.toString();
}

export function ebaySearchUrl(
  country: CountryConfig | string,
  query: string,
): string {
  const cc = typeof country === "string" ? getCountry(country) : country;
  const u = new URL(`https://${ebayHostFor(cc.code)}/sch/i.html`);
  u.searchParams.set("_nkw", query);
  u.searchParams.set("campid", EBAY_EPN_CAMPID);
  u.searchParams.set("customid", `ctc-${cc.code}-search`);
  u.searchParams.set("mkevt", "1");
  return u.toString();
}

/**
 * Force offer URLs onto this country's marketplace — never leave a shopper
 * on amazon.de when they are browsing /uk, etc.
 */
export function wrapOfferUrl(
  country: CountryConfig | string,
  retailerId: string,
  url: string,
  asin?: string | null,
  ebayItemId?: string | null,
  brand?: SiteBrand,
): string | null {
  const cc = typeof country === "string" ? getCountry(country) : country;
  if (retailerId === "amazon") {
    const resolvedAsin =
      (looksLikeRealAsin(asin) && asin) ||
      url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1] ||
      null;
    if (!looksLikeRealAsin(resolvedAsin)) return null;
    return amazonProductUrl(cc, resolvedAsin!, undefined, brand);
  }
  if (retailerId === "ebay") {
    if (ebayItemId) return ebayItemUrl(cc, ebayItemId);
    try {
      const u = new URL(url);
      if (/\/itm\//i.test(u.pathname)) {
        const id = u.pathname.match(/\/itm\/([^/?#]+)/)?.[1];
        if (id) return ebayItemUrl(cc, id);
        u.hostname = ebayHostFor(cc.code);
        u.protocol = "https:";
        u.searchParams.set("campid", EBAY_EPN_CAMPID);
        u.searchParams.set("customid", `ctc-${cc.code}`);
        u.searchParams.set("mkevt", "1");
        return u.toString();
      }
      const q = u.searchParams.get("_nkw") || "product";
      return ebaySearchUrl(cc, q);
    } catch {
      return ebaySearchUrl(cc, "product");
    }
  }
  return url;
}
