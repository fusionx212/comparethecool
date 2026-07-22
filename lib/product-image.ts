import { looksLikeRealAsin } from "@/lib/asin";

/**
 * Resolve a product image without LLM / paid APIs.
 * Prefer Amazon CDN (real ASIN) → hosted category art → default.
 * Do not rely on Unsplash IDs (many 404).
 */

const CATEGORY_PHOTOS: Record<string, string> = {
  "portable-air-conditioners": "/img/categories/portable-air-conditioners.svg",
  dehumidifiers: "/img/categories/dehumidifiers.svg",
  "air-purifiers": "/img/categories/air-purifiers.svg",
  "tower-fans": "/img/categories/tower-fans.svg",
  "evaporative-coolers": "/img/categories/evaporative-coolers.svg",
  "oil-radiators": "/img/categories/oil-radiators.svg",
  "electric-blankets": "/img/categories/electric-blankets.svg",
  "heated-airers": "/img/categories/heated-airers.svg",
  "fridges-freezers": "/img/categories/fridges-freezers.svg",
  "patio-heaters": "/img/categories/patio-heaters.svg",
  "towel-radiators": "/img/categories/towel-radiators.svg",
  "ice-makers": "/img/categories/ice-makers.svg",
  "ceiling-fans": "/img/categories/ceiling-fans.svg",
  "mini-fridges": "/img/categories/mini-fridges.svg",
  "wine-coolers": "/img/categories/wine-coolers.svg",
  "chest-freezers": "/img/categories/chest-freezers.svg",
  "tumble-dryers": "/img/categories/tumble-dryers.svg",
  "smart-thermostats": "/img/categories/smart-thermostats.svg",
  "air-quality-monitors": "/img/categories/air-quality-monitors.svg",
};

const DEFAULT_PHOTO = "/img/categories/default.svg";

function isTrustedRemoteImage(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith("ssl-images-amazon.com") ||
      host.endsWith("media-amazon.com") ||
      host.endsWith("images-amazon.com") ||
      host.endsWith("ebayimg.com") ||
      host.endsWith("i.ebayimg.com")
    );
  } catch {
    return false;
  }
}

export function amazonCdnImage(asin: string): string {
  return `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
}

export function resolveProductImage(opts: {
  image?: string | null;
  category?: string | null;
  amazonAsin?: string | null;
}): string {
  const img = opts.image?.trim() || "";
  if (img.startsWith("/img/")) return img;
  if (img && isTrustedRemoteImage(img)) return img;
  if (looksLikeRealAsin(opts.amazonAsin)) return amazonCdnImage(opts.amazonAsin!);
  if (opts.category && CATEGORY_PHOTOS[opts.category]) return CATEGORY_PHOTOS[opts.category];
  return DEFAULT_PHOTO;
}

export function categoryPhoto(category: string): string {
  return CATEGORY_PHOTOS[category] || DEFAULT_PHOTO;
}
