/**
 * Offline seed catalog — baked into static pages when Supabase is empty/unreachable.
 * Upsert to ctc_products via scripts/seed-catalog.mjs when credentials are available.
 * No LLM involvement.
 */

import type { CatalogRow, CatalogProductData } from "./contract";
import type { CategorySlug, Offer } from "@/lib/types";
import { amazonProductUrl, ebaySearchUrl } from "@/lib/affiliate";
import { categoryPhoto } from "@/lib/product-image";
import { asinForSlug, imageForSlug } from "@/lib/catalog/image-cache";
import { getCountry } from "@/lib/countries";
import { looksLikeRealAsin } from "@/lib/asin";

const NOW = "2026-07-21T10:00:00.000Z";

function offerAmazon(code: string, asin: string, price: number): Offer | null {
  const url = amazonProductUrl(code, asin);
  if (!url) return null;
  return {
    retailer: { id: "amazon", name: "Amazon" },
    price,
    url,
    status: "in_stock",
    lastChecked: NOW,
  };
}

function offerEbay(code: string, query: string, price: number): Offer {
  return {
    retailer: { id: "ebay", name: "eBay" },
    price,
    url: ebaySearchUrl(code, query),
    status: "in_stock",
    lastChecked: NOW,
  };
}

function row(
  country: string,
  data: CatalogProductData,
  price: number,
): CatalogRow {
  return {
    id: `${country}-${data.slug}`,
    country_code: country,
    data,
    stock_status: "in_stock",
    price,
    image: data.image || null,
    last_checked: NOW,
  };
}

type SeedDef = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  season: "summer" | "winter" | "all-year";
  asinByMarket: Partial<Record<string, string>>;
  basePrice: Record<string, number>; // uk gbp, de eur, us usd, etc — fallback multiply
  rating: number;
  highlights: string[];
  verdict: string;
  pros: string[];
  cons: string[];
  btu?: number;
  room_size_m2?: number;
  popularity: number;
};

const SEEDS: SeedDef[] = [
  // —— Portable AC ——
  {
    slug: "delonghi-pinguino-pac-n82",
    name: "De'Longhi Pinguino PAC N82",
    brand: "De'Longhi",
    category: "portable-air-conditioners",
    season: "summer",
    asinByMarket: { uk: "B08XYZPAC1", de: "B08DELPAC1", fr: "B08FRPAC1", it: "B08ITPAC1", es: "B08ESPAC1", nl: "B08NLPAC1", us: "B08USPAC1", au: "B08AUPAC1" },
    basePrice: { uk: 549, de: 579, fr: 569, it: 559, es: 549, nl: 589, us: 599, au: 899 },
    rating: 4.6,
    highlights: ["8200 BTU", "Quiet night mode", "Energy class A"],
    verdict: "Best overall portable AC for bedrooms and living rooms up to ~65 m².",
    pros: ["Strong cooling", "Quiet night mode", "Solid build"],
    cons: ["Premium price", "Heavy to move"],
    btu: 8200,
    room_size_m2: 65,
    popularity: 100,
  },
  {
    slug: "comfee-mpph-12crn7",
    name: "Comfee MPPH-12CRN7",
    brand: "Comfee",
    category: "portable-air-conditioners",
    season: "summer",
    asinByMarket: { uk: "B08COMFE1", de: "B08COMFE2", fr: "B08COMFE3", us: "B08COMFE4", au: "B08COMFE5" },
    basePrice: { uk: 329, de: 349, fr: 339, it: 335, es: 329, nl: 355, us: 379, au: 549 },
    rating: 4.4,
    highlights: ["12000 BTU class", "Strong value", "Remote + timer"],
    verdict: "Best value portable AC — capable cooling without the flagship price.",
    pros: ["Price/performance", "Decent feature set"],
    cons: ["Louder than premium models"],
    btu: 12000,
    room_size_m2: 40,
    popularity: 95,
  },
  {
    slug: "trotec-pac-3500-x",
    name: "Trotec PAC 3500 X",
    brand: "Trotec",
    category: "portable-air-conditioners",
    season: "summer",
    asinByMarket: { uk: "B08TROT1", de: "B08TROT2", fr: "B08TROT3" },
    basePrice: { uk: 449, de: 469, fr: 459, it: 455, es: 449, nl: 479, us: 499, au: 699 },
    rating: 4.3,
    highlights: ["High output", "Large rooms", "Dehumidify mode"],
    verdict: "Best for large rooms when you need maximum cooling punch.",
    pros: ["High BTU", "Versatile modes"],
    cons: ["Bulkier footprint"],
    btu: 12000,
    room_size_m2: 95,
    popularity: 85,
  },
  {
    slug: "aurahome-9000-btu-4-in-1-ac",
    name: "AuraHome 9000 BTU 4-in-1 Portable Air Conditioner",
    brand: "AuraHome",
    category: "portable-air-conditioners",
    season: "summer",
    asinByMarket: { uk: "B0FLV7SC1J" },
    basePrice: { uk: 499, de: 519, fr: 509, it: 499, es: 495, nl: 529, us: 549, au: 799 },
    rating: 3.8,
    highlights: ["9000 BTU", "4-in-1: cool, dehum, fan, purify", "Digital display + remote"],
    verdict: "Amazon #5 bestseller — the cheapest way into a 4-in-1 AC. Cools adequately for medium rooms; the purification is a bonus, not a replacement for a dedicated purifier.",
    pros: ["4-in-1 versatility", "Window kit included", "Remote control"],
    cons: ["Purification is minimal", "Build quality reflects price", "60dB at full speed"],
    btu: 9000,
    room_size_m2: 26,
    popularity: 90,
  },
  // —— Dehumidifiers (all-year) ——
  {
    slug: "meaco-arete-one-12l",
    name: "Meaco Arete One 12L",
    brand: "Meaco",
    category: "dehumidifiers",
    season: "all-year",
    asinByMarket: { uk: "B08MEACO1", de: "B08MEACO2", fr: "B08MEACO3", us: "B08MEACO4", au: "B08MEACO5" },
    basePrice: { uk: 229, de: 249, fr: 239, it: 235, es: 229, nl: 255, us: 259, au: 399 },
    rating: 4.7,
    highlights: ["Quiet", "Laundry mode", "Low running cost"],
    verdict: "Best all-year dehumidifier for UK/EU homes fighting damp and mould.",
    pros: ["Very quiet", "Efficient", "Trusted brand"],
    cons: ["12L may be small for large basements"],
    popularity: 90,
  },
  {
    slug: "pro-breeze-20l",
    name: "Pro Breeze 20L Dehumidifier",
    brand: "Pro Breeze",
    category: "dehumidifiers",
    season: "all-year",
    asinByMarket: { uk: "B08PROB1", de: "B08PROB2", us: "B08PROB3" },
    basePrice: { uk: 179, de: 189, fr: 185, it: 179, es: 175, nl: 195, us: 199, au: 329 },
    rating: 4.3,
    highlights: ["20L/day", "Continuous drain", "Digital humidistat"],
    verdict: "Best capacity pick for wet rooms and larger flats.",
    pros: ["High extraction", "Good price"],
    cons: ["Louder than Meaco"],
    popularity: 80,
  },
  // —— Air purifiers (all-year) ——
  {
    slug: "levoit-core-300s",
    name: "Levoit Core 300S",
    brand: "Levoit",
    category: "air-purifiers",
    season: "all-year",
    asinByMarket: { uk: "B08LEVO1", de: "B08LEVO2", fr: "B08LEVO3", us: "B08LEVO4", au: "B08LEVO5" },
    basePrice: { uk: 99, de: 109, fr: 105, it: 99, es: 98, nl: 115, us: 99, au: 149 },
    rating: 4.6,
    highlights: ["HEPA", "App control", "Quiet sleep mode"],
    verdict: "Best compact air purifier for bedrooms and home offices.",
    pros: ["App + schedules", "Filter cost reasonable"],
    cons: ["Best for mid-size rooms"],
    popularity: 88,
  },
  {
    slug: "dyson-purifier-cool",
    name: "Dyson Purifier Cool",
    brand: "Dyson",
    category: "air-purifiers",
    season: "all-year",
    asinByMarket: { uk: "B08DYSON1", de: "B08DYSON2", us: "B08DYSON3", au: "B08DYSON4" },
    basePrice: { uk: 449, de: 479, fr: 469, it: 459, es: 449, nl: 489, us: 549, au: 799 },
    rating: 4.5,
    highlights: ["Purify + cool fan", "Sealed HEPA", "Reports air quality"],
    verdict: "Premium pick if you want purification and airflow in one unit.",
    pros: ["Dual role", "Strong sensors"],
    cons: ["Expensive filters"],
    popularity: 75,
  },
  // —— Heat: oil radiators ——
  {
    slug: "delonghi-dragon4",
    name: "De'Longhi Dragon4 Oil Radiator",
    brand: "De'Longhi",
    category: "oil-radiators",
    season: "winter",
    asinByMarket: { uk: "B08DRAG1", de: "B08DRAG2", fr: "B08DRAG3", us: "B08DRAG4" },
    basePrice: { uk: 119, de: 129, fr: 125, it: 119, es: 115, nl: 135, us: 139, au: 199 },
    rating: 4.5,
    highlights: ["Even heat", "Thermostatic", "Safety cut-out"],
    verdict: "Best oil-filled radiator for steady whole-room winter heat.",
    pros: ["Retains heat", "Quiet"],
    cons: ["Slow to warm up"],
    popularity: 92,
  },
  {
    slug: "dimplex-ofc2000ti",
    name: "Dimplex OFC2000TI Oil Free Radiator",
    brand: "Dimplex",
    category: "oil-radiators",
    season: "winter",
    asinByMarket: { uk: "B08DIMP1", de: "B08DIMP2" },
    basePrice: { uk: 99, de: 109, fr: 105, it: 99, es: 95, nl: 115, us: 119, au: 179 },
    rating: 4.2,
    highlights: ["Faster heat-up", "Lightweight", "Timer"],
    verdict: "Best when you need heat quickly in a home office or bedroom.",
    pros: ["Faster than oil", "Portable"],
    cons: ["Cools faster when off"],
    popularity: 70,
  },
  // —— Electric blankets ——
  {
    slug: "dreamland-luxury-fleece",
    name: "Dreamland Luxury Fleece Heated Blanket",
    brand: "Dreamland",
    category: "electric-blankets",
    season: "winter",
    asinByMarket: { uk: "B08DREAM1", de: "B08DREAM2", us: "B08DREAM3" },
    basePrice: { uk: 59, de: 69, fr: 65, it: 62, es: 59, nl: 72, us: 69, au: 99 },
    rating: 4.6,
    highlights: ["Machine washable", "Multi heat", "Auto shut-off"],
    verdict: "Best electric blanket for low-cost winter comfort and lower boiler use.",
    pros: ["Cheap to run", "Soft fleece"],
    cons: ["Controller cable management"],
    popularity: 86,
  },
  // —— Tower fans ——
  {
    slug: "dyson-cool-am07",
    name: "Dyson Cool AM07 Tower Fan",
    brand: "Dyson",
    category: "tower-fans",
    season: "summer",
    asinByMarket: { uk: "B08AM07UK", de: "B08AM07DE", us: "B08AM07US", au: "B08AM07AU" },
    basePrice: { uk: 299, de: 319, fr: 309, it: 299, es: 295, nl: 329, us: 349, au: 499 },
    rating: 4.4,
    highlights: ["Bladeless", "Quiet airflow", "Oscillation"],
    verdict: "Premium tower fan when noise and safety matter most.",
    pros: ["Safe for kids", "Strong airflow"],
    cons: ["Pricey vs pedestal fans"],
    popularity: 72,
  },
  {
    slug: "honeywell-hyf290",
    name: "Honeywell HYF290 QuietSet Tower Fan",
    brand: "Honeywell",
    category: "tower-fans",
    season: "summer",
    asinByMarket: { uk: "B08HONF1", de: "B08HONF2", us: "B08HONF3" },
    basePrice: { uk: 79, de: 85, fr: 82, it: 79, es: 75, nl: 89, us: 89, au: 129 },
    rating: 4.3,
    highlights: ["QuietSet levels", "Oscillating", "Affordable"],
    verdict: "Best budget tower fan for everyday cooling.",
    pros: ["Value", "Multiple speeds"],
    cons: ["Plastic build"],
    popularity: 78,
  },
  // —— Wine Coolers (all-year) ——
  {
    slug: "subcold-pro-28",
    name: "Subcold Pro 28 Bottle Wine Cooler",
    brand: "Subcold",
    category: "wine-coolers",
    season: "all-year",
    asinByMarket: { uk: "B09SUBCLD1" },
    basePrice: { uk: 299, de: 319, fr: 309, it: 299, es: 295, nl: 329, us: 349, au: 449 },
    rating: 4.5,
    highlights: ["28 bottles", "5-18°C digital control", "UV-protected glass door"],
    verdict: "Best mid-size wine cooler for serious collectors — precise temp control and quiet compressor.",
    pros: ["Accurate temperature", "Quiet operation", "UV glass"],
    cons: ["No dual zone", "Heavy when full"],
    popularity: 82,
  },
  {
    slug: "cookology-cwc150bk",
    name: "Cookology CWC150BK Freestanding Wine Cooler",
    brand: "Cookology",
    category: "wine-coolers",
    season: "all-year",
    asinByMarket: { uk: "B08COOKWC1" },
    basePrice: { uk: 199, de: 219, fr: 209, it: 199, es: 195, nl: 229, us: 239, au: 329 },
    rating: 4.2,
    highlights: ["8 bottles", "Compact freestanding", "Thermoelectric cooling"],
    verdict: "Best budget wine cooler for casual drinkers — fits under counters and runs silently.",
    pros: ["Compact size", "Energy efficient", "Vibration-free"],
    cons: ["Small capacity", "No temp display"],
    popularity: 74,
  },
  // —— Ice Makers (summer) ——
  {
    slug: "cowsar-ice-maker-26lbs",
    name: "COWSAR Ice Maker Countertop 26lbs/24H",
    brand: "COWSAR",
    category: "ice-makers",
    season: "summer",
    asinByMarket: { uk: "B08COWSAR1" },
    basePrice: { uk: 79, de: 89, fr: 85, it: 79, es: 75, nl: 95, us: 89, au: 129 },
    rating: 4.4,
    highlights: ["26 lbs/day", "8 cubes in 6 min", "Self-cleaning"],
    verdict: "Best budget ice maker — fast bullets, self-cleaning, perfect for home bars and parties.",
    pros: ["Fast ice production", "Self-cleaning mode", "Compact"],
    cons: ["No freezer — melts if not used", "Bullet ice only"],
    popularity: 84,
  },
  {
    slug: "songmics-ice-maker-12kg",
    name: "SONGMICS Ice Maker 12kg/24H Countertop",
    brand: "SONGMICS",
    category: "ice-makers",
    season: "summer",
    asinByMarket: { uk: "B08SONGIC1" },
    basePrice: { uk: 99, de: 109, fr: 105, it: 99, es: 95, nl: 115, us: 109, au: 149 },
    rating: 4.3,
    highlights: ["12 kg/day", "2 ice sizes", "9 cubes in 6 min"],
    verdict: "Best mid-range ice maker — choice of small or large bullets, handles a family barbecue.",
    pros: ["Two ice sizes", "Quiet compressor", "Large basket"],
    cons: ["Heavier than COWSAR", "No self-clean"],
    popularity: 76,
  },
  // —— Ceiling Fans (summer) ——
  {
    slug: "bomkra-ceiling-fan-light",
    name: "BomKra Ceiling Fan with Light & Remote",
    brand: "BomKra",
    category: "ceiling-fans",
    season: "summer",
    asinByMarket: { uk: "B0BOMKRAF1" },
    basePrice: { uk: 59, de: 69, fr: 65, it: 59, es: 55, nl: 72, us: 69, au: 99 },
    rating: 4.4,
    highlights: ["3-head drone design", "LED 50W", "3 speeds + dimmable"],
    verdict: "Best modern ceiling fan for bedrooms — the triple-head design moves serious air and looks great.",
    pros: ["Unique design", "Bright LED", "Remote included"],
    cons: ["Assembly takes time", "Not for large rooms"],
    popularity: 80,
  },
  {
    slug: "hfan-ceiling-fan-light",
    name: "HFAN Ceiling Fan with Light 20.5-inch",
    brand: "HFAN",
    category: "ceiling-fans",
    season: "summer",
    asinByMarket: { uk: "B0HFANFAN1" },
    basePrice: { uk: 45, de: 52, fr: 49, it: 45, es: 42, nl: 55, us: 49, au: 79 },
    rating: 4.2,
    highlights: ["20.5 inch", "3 colour temps", "RC timing + remote"],
    verdict: "Best compact ceiling fan for small rooms — affordable, quiet, and the remote makes it effortless.",
    pros: ["Very quiet", "3 light colours", "Timer function"],
    cons: ["Small blade span", "Plastic housing"],
    popularity: 71,
  },
  // —— Mini Fridges (all-year) ——
  {
    slug: "russell-hobbs-rh4clr1001",
    name: "Russell Hobbs RH4CLR1001 4L Mini Fridge",
    brand: "Russell Hobbs",
    category: "mini-fridges",
    season: "all-year",
    asinByMarket: { uk: "B08RHOBBS1" },
    basePrice: { uk: 45, de: 52, fr: 49, it: 45, es: 42, nl: 55, us: 49, au: 79 },
    rating: 4.3,
    highlights: ["4 litre / 6 cans", "Cool & warm", "AC/DC power"],
    verdict: "Best budget mini fridge for drinks and skincare — tiny, retro, and can even keep things warm.",
    pros: ["Cool + warm modes", "Retro styling", "Car adapter included"],
    cons: ["Only 4L — tiny", "Thermoelectric, not compressor"],
    popularity: 77,
  },
  {
    slug: "yashe-mini-fridge-15l",
    name: "YASHE Mini Fridge 15 Litre Portable Cooler",
    brand: "YASHE",
    category: "mini-fridges",
    season: "all-year",
    asinByMarket: { uk: "B08YASHEF1" },
    basePrice: { uk: 55, de: 62, fr: 59, it: 55, es: 52, nl: 65, us: 59, au: 89 },
    rating: 4.1,
    highlights: ["15 litre / 21 cans", "AC & DC", "Thermoelectric"],
    verdict: "Best capacity mini fridge for the price — fits a full 24-pack of cans in a dorm or office.",
    pros: ["Surprisingly spacious", "Lightweight", "Quiet"],
    cons: ["No compressor cooling", "Door seal can be tight"],
    popularity: 69,
  },
  // —— Patio Heaters (winter) ——
  {
    slug: "heatlab-2kw-patio-heater",
    name: "Heatlab 2KW Freestanding Electric Patio Heater",
    brand: "Heatlab",
    category: "patio-heaters",
    season: "winter",
    asinByMarket: { uk: "B08HEATLB1" },
    basePrice: { uk: 89, de: 99, fr: 95, it: 89, es: 85, nl: 105, us: 109, au: 149 },
    rating: 4.3,
    highlights: ["2KW infrared", "IPX4 waterproof", "3 heat settings + remote"],
    verdict: "Best all-round electric patio heater — instant heat, weatherproof, and remote controlled.",
    pros: ["Instant infrared heat", "Weatherproof", "Remote"],
    cons: ["Covers ~9m² only", "Needs power socket"],
    popularity: 79,
  },
  {
    slug: "alogfire-portable-gas-heater",
    name: "ALOGFIRE Mini Portable Butane Gas Heater",
    brand: "ALOGFIRE",
    category: "patio-heaters",
    season: "winter",
    asinByMarket: { uk: "B08ALOGF1" },
    basePrice: { uk: 65, de: 72, fr: 69, it: 65, es: 62, nl: 75, us: 79, au: 109 },
    rating: 4.0,
    highlights: ["1.5KW butane", "3-in-1: heater/stove/fire pit", "Smokeless"],
    verdict: "Best portable patio heater — doubles as a camping stove and fire pit, runs on standard butane cans.",
    pros: ["3-in-1 versatility", "No electricity needed", "Smokeless"],
    cons: ["Butane not included", "Small heat radius"],
    popularity: 68,
  },
];

const MARKETS = ["uk", "de", "fr", "it", "es", "nl", "us", "au", "eu"] as const;

function priceFor(def: SeedDef, code: string): number {
  if (def.basePrice[code] != null) return def.basePrice[code];
  if (code === "eu") return def.basePrice.de ?? def.basePrice.uk;
  return def.basePrice.uk;
}

function buildProduct(code: string, def: SeedDef): CatalogRow {
  const cc = getCountry(code === "eu" ? "de" : code);
  const cachedAsin = asinForSlug(def.slug);
  const rawAsin = def.asinByMarket[code] || null;
  // Prefer enrich-cache ASIN for UK only — never stamp a UK ASIN onto DE/FR/US
  const asin =
    (looksLikeRealAsin(rawAsin) && rawAsin) ||
    (code === "uk" && looksLikeRealAsin(cachedAsin) && cachedAsin) ||
    null;
  const price = priceFor(def, code);
  const ebayPrice = Math.round(price * 0.97 * 100) / 100;
  const amazonOffer = asin ? offerAmazon(cc.code, asin, price) : null;
  const offers = [amazonOffer, offerEbay(cc.code, `${def.brand} ${def.name}`, ebayPrice)].filter(
    Boolean,
  ) as Offer[];
  const data: CatalogProductData = {
    slug: def.slug,
    name: def.name,
    brand: def.brand,
    category: def.category,
    season: def.season,
    image: imageForSlug(def.slug) || categoryPhoto(def.category),
    highlights: def.highlights,
    amazon_asin: asin,
    ebay_item_id: null,
    rating: def.rating,
    review_count: 120 + Math.round(def.popularity),
    popularity: def.popularity,
    specs: {
      btu: def.btu ?? null,
      room_size_m2: def.room_size_m2 ?? null,
      features: def.highlights,
    },
    editorial: {
      pros: def.pros,
      cons: def.cons,
      verdict: def.verdict,
      rating: def.rating,
    },
    offers,
  };
  return row(code, data, price);
}

/** Full offline catalog for all markets. */
export const SEED_CATALOG: CatalogRow[] = MARKETS.flatMap((code) =>
  SEEDS.map((def) => buildProduct(code, def)),
);

export function seedProductsForCountry(country: string, category?: string): CatalogRow[] {
  let rows = SEED_CATALOG.filter((r) => r.country_code === country);
  if (category) {
    rows = rows.filter(
      (r) => r.data.category === category || r.data.slug === category,
    );
  }
  return rows.sort((a, b) => (b.data.popularity || 0) - (a.data.popularity || 0));
}

export function seedProductBySlug(country: string, slug: string): CatalogRow | null {
  return (
    SEED_CATALOG.find((r) => r.country_code === country && r.data.slug === slug) ||
    null
  );
}
