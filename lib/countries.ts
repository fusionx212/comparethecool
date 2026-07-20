// Multi-country configuration for Compare the Cool / Compare the Heat
// Amazon Associates tags prefixed by season: ctc=cooling, cth=heating

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  amazonMarketplace: string;
  amazonTagCool: string;    // ctc = Compare the Cool (summer)
  amazonTagHeat: string;    // cth = Compare the Heat (winter)
  ebayMarketplace: string;
  flag: string;
  eu: boolean;              // EU coverage
  season: "both" | "cooling" | "heating"; // which seasons apply
}

export const COUNTRIES: Record<string, CountryConfig> = {
  uk: {
    code: "uk", name: "United Kingdom", currency: "GBP", currencySymbol: "£",
    locale: "en-GB", amazonMarketplace: "www.amazon.co.uk",
    amazonTagCool: "ukaircon-21", amazonTagHeat: "ukaircon-21", // reuse existing
    ebayMarketplace: "EBAY_GB", flag: "🇬🇧", eu: false, season: "both",
  },
  de: {
    code: "de", name: "Deutschland", currency: "EUR", currencySymbol: "€",
    locale: "de-DE", amazonMarketplace: "www.amazon.de",
    amazonTagCool: "ctc.de-21", amazonTagHeat: "cth.de-21",
    ebayMarketplace: "EBAY_DE", flag: "🇩🇪", eu: true, season: "both",
  },
  fr: {
    code: "fr", name: "France", currency: "EUR", currencySymbol: "€",
    locale: "fr-FR", amazonMarketplace: "www.amazon.fr",
    amazonTagCool: "ctc.fr-21", amazonTagHeat: "cth.fr-21",
    ebayMarketplace: "EBAY_FR", flag: "🇫🇷", eu: true, season: "both",
  },
  it: {
    code: "it", name: "Italia", currency: "EUR", currencySymbol: "€",
    locale: "it-IT", amazonMarketplace: "www.amazon.it",
    amazonTagCool: "ctc.eu-21", amazonTagHeat: "cth.eu-21", // EU catch-all
    ebayMarketplace: "EBAY_IT", flag: "🇮🇹", eu: true, season: "both",
  },
  es: {
    code: "es", name: "España", currency: "EUR", currencySymbol: "€",
    locale: "es-ES", amazonMarketplace: "www.amazon.es",
    amazonTagCool: "ctc.eu-21", amazonTagHeat: "cth.eu-21",
    ebayMarketplace: "EBAY_ES", flag: "🇪🇸", eu: true, season: "both",
  },
  nl: {
    code: "nl", name: "Nederland", currency: "EUR", currencySymbol: "€",
    locale: "nl-NL", amazonMarketplace: "www.amazon.nl",
    amazonTagCool: "ctc.eu-21", amazonTagHeat: "cth.eu-21",
    ebayMarketplace: "EBAY_NL", flag: "🇳🇱", eu: true, season: "both",
  },
  us: {
    code: "us", name: "United States", currency: "USD", currencySymbol: "$",
    locale: "en-US", amazonMarketplace: "www.amazon.com",
    amazonTagCool: "ctc-us-21", amazonTagHeat: "cth-america-21",
    ebayMarketplace: "EBAY_US", flag: "🇺🇸", eu: false, season: "both",
  },
  // Asia/Pacific — broad region tag
  au: {
    code: "au", name: "Australia", currency: "AUD", currencySymbol: "A$",
    locale: "en-AU", amazonMarketplace: "www.amazon.com.au",
    amazonTagCool: "ctcasia-21", amazonTagHeat: "cth-asia-21",
    ebayMarketplace: "EBAY_AU", flag: "🇦🇺", eu: false, season: "cooling", // opposite seasons!
  },
  // EU catch-all for smaller markets (Poland, Sweden, Austria, Belgium, etc.)
  eu: {
    code: "eu", name: "Europe", currency: "EUR", currencySymbol: "€",
    locale: "en", amazonMarketplace: "www.amazon.de", // default to DE
    amazonTagCool: "ctc.eu-21", amazonTagHeat: "cth.eu-21",
    ebayMarketplace: "EBAY_DE", flag: "🇪🇺", eu: true, season: "both",
  },
};

export function getCountry(code: string): CountryConfig {
  return COUNTRIES[code] || COUNTRIES.uk;
}

export function countryFromHeader(cfCountry: string | null): string {
  const map: Record<string, string> = {
    GB: "uk", DE: "de", FR: "fr", IT: "it", ES: "es", NL: "nl",
    US: "us", AU: "au", NZ: "au",
    AT: "de", CH: "de", BE: "nl", LU: "de", PL: "eu", SE: "eu",
    DK: "eu", NO: "eu", FI: "eu", PT: "eu", GR: "eu", CZ: "eu",
    IE: "uk", CA: "us",
  };
  return map[cfCountry || ""] || "uk";
}

/** Get active Amazon tag based on current season */
export function activeAmazonTag(country: CountryConfig): string {
  const now = new Date();
  const month = now.getUTCMonth(); // 0=Jan, 11=Dec
  // Northern hemisphere: cooling Apr-Sep, heating Oct-Mar
  // Southern hemisphere (AU): opposite
  const isSouthern = country.code === "au";
  const isCoolingSeason = isSouthern
    ? (month >= 9 || month <= 2)  // Oct-Mar = southern summer
    : (month >= 3 && month <= 8); // Apr-Sep = northern summer
  
  if (country.season === "cooling") return country.amazonTagCool;
  if (country.season === "heating") return country.amazonTagHeat;
  return isCoolingSeason ? country.amazonTagCool : country.amazonTagHeat;
}

export const SITE_NAME_COOL = "Compare the Cool";
export const SITE_NAME_HEAT = "Compare the Heat";
export const SITE_URL_COOL = "https://comparethecool.com";
export const SITE_URL_HEAT = "https://comparetheheat.com";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://YOUR_PROJECT.supabase.co";
