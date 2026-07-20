import type { Category } from "./categories";
import type { CategorySlug } from "./types";

// Automated seasonal pivot: which category the homepage leads with. Cooling
// (fans/AC) drives Apr–Sep demand, heating (blankets/radiators) Oct–Mar —
// mirrors the calendar the CATEGORIES blurbs already describe (see
// lib/categories.ts: heated-airers/electric-blankets/oil-radiators are
// written as "the same buyer, the opposite season").
export type Season = "cooling" | "heating";

export function getSeason(now: Date): Season {
  const month = now.getUTCMonth(); // 0 = Jan
  return month >= 3 && month <= 8 ? "cooling" : "heating";
}

const SEASONAL_CATEGORY: Record<Season, CategorySlug> = {
  cooling: "portable-air-conditioners",
  heating: "electric-blankets",
};

// Don't pivot the homepage onto a category that's still a thin seed list —
// that would replace an 11-product board with a near-empty one. The pivot
// activates itself automatically the day the seasonal category is properly
// stocked; until then it quietly falls back to the richest evergreen category.
const MIN_PRODUCTS_TO_FEATURE = 6;
const FALLBACK_CATEGORY: CategorySlug = "portable-air-conditioners";

export interface CategoryCount {
  slug: CategorySlug;
  total: number;
}

export function pickFeaturedCategory(now: Date, categoryCounts: CategoryCount[]): CategorySlug {
  const target = SEASONAL_CATEGORY[getSeason(now)];
  const targetCount = categoryCounts.find((c) => c.slug === target)?.total ?? 0;
  return targetCount >= MIN_PRODUCTS_TO_FEATURE ? target : FALLBACK_CATEGORY;
}

export interface FeaturedCopy {
  h1: string;
  sub: string;
  ctaPrimaryLabel: string;
  boardHeading: string;
}

// Copy is keyed by the FEATURED category, not the calendar season — so it
// always matches whatever pickFeaturedCategory actually chose (including the
// inventory-gated fallback). Add an entry here when a new seasonal category
// is populated with enough real products to feature.
const COPY_BY_CATEGORY: Partial<Record<CategorySlug, FeaturedCopy>> = {
  "portable-air-conditioners": {
    h1: "Cooling that’s actually in stock.",
    sub: "Fans and air conditioning sell out fast whenever demand spikes — heatwaves, cold snaps, Black Friday. We track stock and prices across the major UK retailers so you can see what’s buyable and best value right now, and get alerted the moment a sold-out unit comes back.",
    ctaPrimaryLabel: "See what’s in stock",
    boardHeading: "Moving now — fastest-selling units",
  },
  "electric-blankets": {
    h1: "Home heating that’s actually in stock.",
    sub: "Electric blankets, heated airers and oil radiators sell out fast whenever a cold snap hits. We track stock and prices across the major UK retailers so you can see what’s buyable and best value right now, and get alerted the moment a sold-out unit comes back.",
    ctaPrimaryLabel: "See what’s in stock",
    boardHeading: "Moving now — fastest-selling units",
  },
};

const GENERIC_COPY = (cat: Category): FeaturedCopy => ({
  h1: `${cat.name} that’s actually in stock.`,
  sub: `The best ${cat.name.toLowerCase()} sell out fast whenever demand spikes. We track stock and prices across the major UK retailers so you can see what’s buyable and best value right now, and get alerted the moment a sold-out unit comes back.`,
  ctaPrimaryLabel: "See what’s in stock",
  boardHeading: "Moving now — fastest-selling units",
});

export function getFeaturedCopy(slug: CategorySlug, cat: Category): FeaturedCopy {
  return COPY_BY_CATEGORY[slug] ?? GENERIC_COPY(cat);
}
