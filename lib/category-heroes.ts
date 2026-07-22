import type { CategorySlug } from "@/lib/types";
import { CATEGORY_SLUGS, CATEGORY_LABELS } from "@/lib/catalog/contract";

export type HeroSpecHint = { label: string; placeholder: string };

/** Categories with photoreal hero PNGs (SVG studio art is always present as fallback). */
const HERO_PNG_SLUGS = new Set<string>([
  "portable-air-conditioners",
  "tower-fans",
  "evaporative-coolers",
  "ice-makers",
  "ceiling-fans",
  "dehumidifiers",
  "air-purifiers",
  "air-quality-monitors",
  "fridges-freezers",
  "chest-freezers",
  "wine-coolers",
  "mini-fridges",
  "tumble-dryers",
  "smart-thermostats",
  "oil-radiators",
  "electric-blankets",
  "heated-airers",
  "patio-heaters",
  "towel-radiators",
]);

/** Studio hero art for category browse + showroom fallbacks. Prefer WebP when present. */
export function categoryHeroPath(slug: string): string {
  if (HERO_PNG_SLUGS.has(slug)) return `/img/categories/heroes/${slug}.webp`;
  if ((CATEGORY_SLUGS as string[]).includes(slug)) {
    return `/img/categories/heroes/${slug}.svg`;
  }
  return "/img/categories/heroes/portable-air-conditioners.webp";
}

/** Default spec chips when a live product has no specs yet. */
export const CATEGORY_SPEC_HINTS: Record<string, HeroSpecHint[]> = {
  "portable-air-conditioners": [
    { label: "BTU", placeholder: "7–12k" },
    { label: "Room", placeholder: "15–30 m²" },
    { label: "Noise", placeholder: "~52 dB" },
  ],
  "tower-fans": [
    { label: "Height", placeholder: "90–110 cm" },
    { label: "Modes", placeholder: "3–8" },
    { label: "Oscillation", placeholder: "Yes" },
  ],
  "evaporative-coolers": [
    { label: "Tank", placeholder: "5–15 L" },
    { label: "Room", placeholder: "20–40 m²" },
    { label: "Power", placeholder: "60–100 W" },
  ],
  "ice-makers": [
    { label: "Output", placeholder: "10–15 kg/day" },
    { label: "Cycle", placeholder: "~8 min" },
    { label: "Tank", placeholder: "1–2 L" },
  ],
  "ceiling-fans": [
    { label: "Span", placeholder: "42–56\"" },
    { label: "Speeds", placeholder: "3–6" },
    { label: "Remote", placeholder: "Often" },
  ],
  dehumidifiers: [
    { label: "Extract", placeholder: "10–20 L/day" },
    { label: "Tank", placeholder: "2–4 L" },
    { label: "Room", placeholder: "20–40 m²" },
  ],
  "air-purifiers": [
    { label: "CADR", placeholder: "High" },
    { label: "Filter", placeholder: "HEPA" },
    { label: "Room", placeholder: "20–50 m²" },
  ],
  "oil-radiators": [
    { label: "Power", placeholder: "1.5–3 kW" },
    { label: "Fins", placeholder: "7–11" },
    { label: "Room", placeholder: "15–30 m²" },
  ],
  "electric-blankets": [
    { label: "Heat", placeholder: "3 levels" },
    { label: "Timer", placeholder: "Yes" },
    { label: "Size", placeholder: "Single–King" },
  ],
  "heated-airers": [
    { label: "Power", placeholder: "200–300 W" },
    { label: "Rails", placeholder: "10–20" },
    { label: "Folding", placeholder: "Yes" },
  ],
  "patio-heaters": [
    { label: "Power", placeholder: "1–3 kW" },
    { label: "Coverage", placeholder: "Outdoor" },
    { label: "Type", placeholder: "Electric / gas" },
  ],
  "towel-radiators": [
    { label: "Power", placeholder: "40–150 W" },
    { label: "Bars", placeholder: "6–12" },
    { label: "Mount", placeholder: "Wall" },
  ],
  "fridges-freezers": [
    { label: "Capacity", placeholder: "250–400 L" },
    { label: "Energy", placeholder: "A–E" },
    { label: "Frost", placeholder: "No-frost" },
  ],
  "chest-freezers": [
    { label: "Capacity", placeholder: "100–300 L" },
    { label: "Energy", placeholder: "A–E" },
    { label: "Lock", placeholder: "Often" },
  ],
  "wine-coolers": [
    { label: "Bottles", placeholder: "12–50" },
    { label: "Zones", placeholder: "1–2" },
    { label: "Noise", placeholder: "Quiet" },
  ],
  "mini-fridges": [
    { label: "Capacity", placeholder: "40–100 L" },
    { label: "Energy", placeholder: "A–E" },
    { label: "Use", placeholder: "Desk / bar" },
  ],
  "tumble-dryers": [
    { label: "Load", placeholder: "7–9 kg" },
    { label: "Type", placeholder: "Heat pump" },
    { label: "Energy", placeholder: "A++" },
  ],
  "smart-thermostats": [
    { label: "App", placeholder: "Yes" },
    { label: "Schedule", placeholder: "Yes" },
    { label: "Sensors", placeholder: "Room" },
  ],
  "air-quality-monitors": [
    { label: "PM2.5", placeholder: "Yes" },
    { label: "CO₂", placeholder: "Often" },
    { label: "Display", placeholder: "Live" },
  ],
};

export function categoryHeroLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug;
}

export function isKnownCategory(slug: string): slug is CategorySlug {
  return (CATEGORY_SLUGS as string[]).includes(slug);
}
