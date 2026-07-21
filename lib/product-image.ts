/**
 * Resolve a product image without LLM / paid APIs.
 * Prefer stored URL → category photo → ASIN CDN attempt → SVG placeholder.
 */

const CATEGORY_PHOTOS: Record<string, string> = {
  "portable-air-conditioners":
    "https://images.unsplash.com/photo-1631545806609-34d5bdabe783?auto=format&fit=crop&w=640&h=640&q=80",
  dehumidifiers:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&h=640&q=80",
  "air-purifiers":
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=640&h=640&q=80",
  "tower-fans":
    "https://images.unsplash.com/photo-1615874959471-d3addb0c4f1f?auto=format&fit=crop&w=640&h=640&q=80",
  "evaporative-coolers":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=640&h=640&q=80",
  "oil-radiators":
    "https://images.unsplash.com/photo-1545259741-2eaacc3865b7?auto=format&fit=crop&w=640&h=640&q=80",
  "electric-blankets":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=640&h=640&q=80",
  "heated-airers":
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=640&h=640&q=80",
  "fridges-freezers":
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=640&h=640&q=80",
  "patio-heaters":
    "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=640&h=640&q=80",
  "towel-radiators":
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=640&h=640&q=80",
  "ice-makers":
    "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=640&h=640&q=80",
  "ceiling-fans":
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=640&h=640&q=80",
  "mini-fridges":
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=640&h=640&q=80",
  "wine-coolers":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=640&h=640&q=80",
  "chest-freezers":
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=640&h=640&q=80",
  "tumble-dryers":
    "https://images.unsplash.com/photo-1626806787461-74be3a8e0e0c?auto=format&fit=crop&w=640&h=640&q=80",
  "smart-thermostats":
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=640&h=640&q=80",
  "air-quality-monitors":
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=640&h=640&q=80",
};

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&h=640&q=80";

function looksLikeRealAsin(asin: string | null | undefined): boolean {
  if (!asin) return false;
  // Real ASINs are 10 chars; our seed placeholders often embed XYZ/FALLBACK
  if (asin.length !== 10) return false;
  if (/XYZ|FALLBACK|COMFE|TROT|MEACO|PROB|LEVO|DYSON|DRAG|DIMP|DREAM|AM07|HONF/i.test(asin)) {
    return false;
  }
  return /^[A-Z0-9]{10}$/i.test(asin);
}

export function amazonCdnImage(asin: string): string {
  return `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
}

export function resolveProductImage(opts: {
  image?: string | null;
  category?: string | null;
  amazonAsin?: string | null;
}): string {
  if (opts.image && /^https?:\/\//i.test(opts.image)) return opts.image;
  if (looksLikeRealAsin(opts.amazonAsin)) return amazonCdnImage(opts.amazonAsin!);
  if (opts.category && CATEGORY_PHOTOS[opts.category]) return CATEGORY_PHOTOS[opts.category];
  return DEFAULT_PHOTO;
}

export function categoryPhoto(category: string): string {
  return CATEGORY_PHOTOS[category] || DEFAULT_PHOTO;
}
