import type { CategorySlug } from "@/lib/types";
import { COOLING_CATEGORIES, HEATING_CATEGORIES } from "@/lib/catalog/contract";

/** Season-primary category for the fastest land → buy path. */
export function primaryCategoryFor(code: string): CategorySlug {
  const month = new Date().getUTCMonth();
  const southern = code === "au";
  const coolingSeason = southern ? month >= 9 || month <= 2 : month >= 3 && month <= 8;
  return coolingSeason ? COOLING_CATEGORIES[0] : HEATING_CATEGORIES[0];
}

export function isCoolingSeason(code: string): boolean {
  const month = new Date().getUTCMonth();
  const southern = code === "au";
  return southern ? month >= 9 || month <= 2 : month >= 3 && month <= 8;
}
