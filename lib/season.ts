import type { CategorySlug } from "@/lib/types";
import { COOLING_CATEGORIES, HEATING_CATEGORIES } from "@/lib/catalog/contract";
import type { SiteBrand } from "@/lib/site-brand";

/** Calendar cooling season (AU inverted). */
export function isCoolingSeasonCalendar(code: string): boolean {
  const month = new Date().getUTCMonth();
  const southern = code === "au";
  return southern ? month >= 9 || month <= 2 : month >= 3 && month <= 8;
}

/**
 * Brand-aware season:
 * - heat site → always heating-first
 * - cool site → always cooling-first
 * - no brand → calendar
 */
export function isCoolingSeason(code: string, brand?: SiteBrand): boolean {
  if (brand === "heat") return false;
  if (brand === "cool") return true;
  return isCoolingSeasonCalendar(code);
}

/** Season-primary category for the fastest land → buy path. */
export function primaryCategoryFor(code: string, brand?: SiteBrand): CategorySlug {
  return isCoolingSeason(code, brand) ? COOLING_CATEGORIES[0] : HEATING_CATEGORIES[0];
}
