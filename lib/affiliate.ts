/**
 * Affiliate URL wrappers — Amazon seasonal tags + eBay EPN campid.
 * Tag selection uses activeAmazonTag() (hemisphere-aware). Never hardcode cool-only.
 */

import {
  activeAmazonTag,
  getCountry,
  type CountryConfig,
} from "@/lib/countries";

export const EBAY_EPN_CAMPID = "5339164583";

export function amazonProductUrl(
  country: CountryConfig | string,
  asin: string,
  tagOverride?: string,
): string {
  const cc = typeof country === "string" ? getCountry(country) : country;
  const tag = tagOverride || activeAmazonTag(cc);
  return `https://${cc.amazonMarketplace}/dp/${asin}?tag=${tag}`;
}

export function ebayItemUrl(
  country: CountryConfig | string,
  itemId: string,
): string {
  const cc = typeof country === "string" ? getCountry(country) : country;
  const host =
    cc.code === "uk"
      ? "www.ebay.co.uk"
      : cc.code === "us"
        ? "www.ebay.com"
        : cc.code === "au"
          ? "www.ebay.com.au"
          : `www.ebay.${cc.code === "de" ? "de" : cc.code === "fr" ? "fr" : cc.code === "it" ? "it" : cc.code === "es" ? "es" : cc.code === "nl" ? "nl" : "de"}`;
  const u = new URL(`https://${host}/itm/${itemId}`);
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
  const host =
    cc.code === "uk"
      ? "www.ebay.co.uk"
      : cc.code === "us"
        ? "www.ebay.com"
        : cc.code === "au"
          ? "www.ebay.com.au"
          : `www.ebay.${cc.code === "de" ? "de" : cc.code === "fr" ? "fr" : cc.code === "it" ? "it" : cc.code === "es" ? "es" : "de"}`;
  const u = new URL(`https://${host}/sch/i.html`);
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
): string {
  const cc = typeof country === "string" ? getCountry(country) : country;
  if (retailerId === "amazon") {
    if (asin) return amazonProductUrl(cc, asin);
    try {
      const u = new URL(url);
      const pathAsin = u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1];
      if (pathAsin) return amazonProductUrl(cc, pathAsin);
      u.hostname = cc.amazonMarketplace;
      u.protocol = "https:";
      u.searchParams.set("tag", activeAmazonTag(cc));
      return u.toString();
    } catch {
      return url;
    }
  }
  if (retailerId === "ebay") {
    if (ebayItemId) return ebayItemUrl(cc, ebayItemId);
    try {
      const u = new URL(url);
      const local = new URL(ebaySearchUrl(cc, u.searchParams.get("_nkw") || "product"));
      // Prefer item links on the local host when we already have /itm/
      if (/\/itm\//i.test(u.pathname)) {
        const host =
          cc.code === "uk"
            ? "www.ebay.co.uk"
            : cc.code === "us"
              ? "www.ebay.com"
              : cc.code === "au"
                ? "www.ebay.com.au"
                : `www.ebay.${cc.code === "de" ? "de" : cc.code === "fr" ? "fr" : cc.code === "it" ? "it" : cc.code === "es" ? "es" : cc.code === "nl" ? "nl" : "de"}`;
        u.hostname = host;
        u.protocol = "https:";
        u.searchParams.set("campid", EBAY_EPN_CAMPID);
        u.searchParams.set("customid", `ctc-${cc.code}`);
        u.searchParams.set("mkevt", "1");
        return u.toString();
      }
      local.searchParams.set("campid", EBAY_EPN_CAMPID);
      local.searchParams.set("customid", `ctc-${cc.code}`);
      return local.toString();
    } catch {
      return url;
    }
  }
  return url;
}
