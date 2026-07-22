/**
 * Baked retailer image URLs from Amazon Creators / eBay Browse enrich script.
 * Safe to import on server — no secrets.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";

export type ProductImageEntry = {
  image: string;
  source: "amazon" | "ebay";
  asin?: string;
  updatedAt: string;
};

let cached: Record<string, ProductImageEntry> | null = null;

function cachePath(): string {
  return join(process.cwd(), "data", "product-images.json");
}

export function getProductImageCache(): Record<string, ProductImageEntry> {
  if (cached) return cached;
  const path = cachePath();
  if (!existsSync(path)) {
    cached = {};
    return cached;
  }
  try {
    cached = JSON.parse(readFileSync(path, "utf8")) as Record<string, ProductImageEntry>;
  } catch {
    cached = {};
  }
  return cached;
}

export function imageForSlug(slug: string): string | null {
  return getProductImageCache()[slug]?.image || null;
}

export function asinForSlug(slug: string): string | null {
  const asin = getProductImageCache()[slug]?.asin || null;
  return asin || null;
}
