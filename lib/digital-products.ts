import type { CategorySlug } from "@/lib/types";
import {
  COOLING_CATEGORIES,
  HEATING_CATEGORIES,
} from "@/lib/catalog/contract";

export type DigitalSkuId =
  | "room-fit-report"
  | "setup-pack"
  | "running-cost-scorecard";

export type DigitalProduct = {
  id: DigitalSkuId;
  name: string;
  tagline: string;
  /** Display price in major units (GBP). */
  priceGbp: number;
  /** Stripe amount in pence. */
  unitAmount: number;
  /** Env key for optional pre-created Stripe Price id. */
  priceEnvKey: string;
  /** Categories where this SKU is the primary upsell. */
  attachCategories: readonly string[];
};

export const DIGITAL_PRODUCTS: Record<DigitalSkuId, DigitalProduct> = {
  "room-fit-report": {
    id: "room-fit-report",
    name: "Room Fit Report",
    tagline: "Will this cool or heat your room? BTU verdict PDF.",
    priceGbp: 4.99,
    unitAmount: 499,
    priceEnvKey: "STRIPE_PRICE_ROOM_FIT",
    attachCategories: [
      "portable-air-conditioners",
      "oil-radiators",
      "evaporative-coolers",
    ],
  },
  "setup-pack": {
    id: "setup-pack",
    name: "First-week Setup Pack",
    tagline: "Hose, drain, placement, noise — printable checklist.",
    priceGbp: 6.99,
    unitAmount: 699,
    priceEnvKey: "STRIPE_PRICE_SETUP_PACK",
    attachCategories: [...COOLING_CATEGORIES, ...HEATING_CATEGORIES],
  },
  "running-cost-scorecard": {
    id: "running-cost-scorecard",
    name: "Running Cost Scorecard",
    tagline: "Local kWh estimate for your device — branded PDF.",
    priceGbp: 3.99,
    unitAmount: 399,
    priceEnvKey: "STRIPE_PRICE_RUNNING_COST",
    attachCategories: [
      "portable-air-conditioners",
      "oil-radiators",
      "dehumidifiers",
      "tumble-dryers",
      "patio-heaters",
      "heated-airers",
    ],
  },
};

export const DIGITAL_SKU_IDS = Object.keys(DIGITAL_PRODUCTS) as DigitalSkuId[];

export function getDigitalProduct(id: string): DigitalProduct | null {
  return DIGITAL_PRODUCTS[id as DigitalSkuId] ?? null;
}

export function formatDigitalPrice(p: DigitalProduct, currencySymbol = "£"): string {
  return `${currencySymbol}${p.priceGbp.toFixed(2)}`;
}

/** Primary companion CTA for a category (ghost link under Buy now). */
export function primaryUpsellForCategory(category: string): DigitalProduct {
  if (DIGITAL_PRODUCTS["room-fit-report"].attachCategories.includes(category)) {
    return DIGITAL_PRODUCTS["room-fit-report"];
  }
  if (
    DIGITAL_PRODUCTS["running-cost-scorecard"].attachCategories.includes(category)
  ) {
    return DIGITAL_PRODUCTS["running-cost-scorecard"];
  }
  return DIGITAL_PRODUCTS["setup-pack"];
}

export function upsellsForCategory(category: string | CategorySlug): DigitalProduct[] {
  return DIGITAL_SKU_IDS.map((id) => DIGITAL_PRODUCTS[id]).filter(
    (p) =>
      p.attachCategories.includes(category) ||
      p.id === "setup-pack" ||
      p.id === "room-fit-report",
  );
}

/** Stripe Price id from env, if Dale created one in Dashboard. */
export function stripePriceIdFor(sku: DigitalSkuId): string | undefined {
  const key = DIGITAL_PRODUCTS[sku].priceEnvKey;
  const v = process.env[key]?.trim();
  return v || undefined;
}
