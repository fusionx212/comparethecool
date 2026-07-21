/**
 * Canonical product contract for ctc_products.
 * Source of truth: Supabase JSONB `data` (+ root columns for filters).
 * Pages bake from this at build/ISR — never from an LLM at request time.
 */

import type { CategorySlug, Offer, ProductEditorial, ProductSpecs, StockStatus } from "@/lib/types";

export interface CatalogProductData {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  season: "summer" | "winter" | "all-year";
  image?: string | null;
  highlights: string[];
  specs?: ProductSpecs;
  offers: Offer[];
  editorial?: ProductEditorial;
  amazon_asin?: string | null;
  ebay_item_id?: string | null;
  rating?: number | null;
  review_count?: number | null;
  popularity?: number;
}

export interface CatalogRow {
  id: string;
  country_code: string;
  data: CatalogProductData;
  stock_status: StockStatus;
  price: number | null;
  image: string | null;
  last_checked: string;
}

export const CATEGORY_SLUGS: CategorySlug[] = [
  "portable-air-conditioners",
  "dehumidifiers",
  "air-purifiers",
  "tower-fans",
  "evaporative-coolers",
  "electric-blankets",
  "oil-radiators",
  "heated-airers",
  "fridges-freezers",
  "chest-freezers",
  "wine-coolers",
  "mini-fridges",
  "tumble-dryers",
  "ceiling-fans",
  "patio-heaters",
  "towel-radiators",
  "ice-makers",
  "smart-thermostats",
  "air-quality-monitors",
];

export const COOLING_CATEGORIES: CategorySlug[] = [
  "portable-air-conditioners",
  "tower-fans",
  "evaporative-coolers",
  "ice-makers",
  "ceiling-fans",
];

export const HEATING_CATEGORIES: CategorySlug[] = [
  "oil-radiators",
  "electric-blankets",
  "heated-airers",
  "patio-heaters",
  "towel-radiators",
];

export const ALL_YEAR_CATEGORIES: CategorySlug[] = [
  "dehumidifiers",
  "air-purifiers",
  "fridges-freezers",
  "chest-freezers",
  "wine-coolers",
  "mini-fridges",
  "tumble-dryers",
  "smart-thermostats",
  "air-quality-monitors",
];

export const CATEGORY_LABELS: Record<string, string> = {
  "portable-air-conditioners": "Portable Air Conditioners",
  dehumidifiers: "Dehumidifiers",
  "air-purifiers": "Air Purifiers",
  "tower-fans": "Tower Fans",
  "evaporative-coolers": "Evaporative Coolers",
  "electric-blankets": "Electric Blankets",
  "oil-radiators": "Oil Radiators",
  "heated-airers": "Heated Airers",
  "fridges-freezers": "Fridges & Freezers",
  "chest-freezers": "Chest Freezers",
  "wine-coolers": "Wine Coolers",
  "mini-fridges": "Mini Fridges",
  "tumble-dryers": "Tumble Dryers",
  "ceiling-fans": "Ceiling Fans",
  "patio-heaters": "Patio Heaters",
  "towel-radiators": "Towel Radiators",
  "ice-makers": "Ice Makers",
  "smart-thermostats": "Smart Thermostats",
  "air-quality-monitors": "Air Quality Monitors",
};

export function slugLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeRow(raw: Record<string, unknown>): CatalogRow | null {
  const data = (raw.data ?? {}) as Partial<CatalogProductData>;
  const slug = (data.slug as string) || (raw.slug as string);
  if (!slug) return null;

  const country = String(raw.country_code || "uk");
  const id = String(raw.id || `${country}-${slug}`);
  const offers = Array.isArray(data.offers) ? (data.offers as Offer[]) : [];
  const price =
    typeof raw.price === "number"
      ? raw.price
      : offers.length
        ? Math.min(...offers.map((o) => o.price))
        : null;

  return {
    id,
    country_code: country,
    data: {
      slug,
      name: data.name || slug,
      brand: data.brand || "",
      category: (data.category || slug) as CategorySlug,
      season: data.season || "all-year",
      image: data.image ?? (raw.image as string) ?? null,
      highlights: data.highlights || [],
      specs: data.specs,
      offers,
      editorial: data.editorial,
      amazon_asin: data.amazon_asin ?? null,
      ebay_item_id: data.ebay_item_id ?? null,
      rating: data.rating ?? data.editorial?.rating ?? null,
      review_count: data.review_count ?? null,
      popularity: data.popularity ?? 0,
    },
    stock_status: (raw.stock_status as StockStatus) || "in_stock",
    price,
    image: (data.image as string) || (raw.image as string) || null,
    last_checked: String(raw.last_checked || new Date().toISOString()),
  };
}
