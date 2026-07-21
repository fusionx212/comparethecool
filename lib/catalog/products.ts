/**
 * Server-only catalog access for static/ISR bake.
 * Prefer Supabase ctc_products; fall back to offline seeds (zero Netlify function burn at serve).
 */

import { supabase } from "@/lib/supabase";
import {
  normalizeRow,
  type CatalogRow,
} from "./contract";
import {
  seedProductBySlug,
  seedProductsForCountry,
} from "./seed-data";

export const REVALIDATE_SECONDS = 3600;

function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return Boolean(url && key && !url.includes("placeholder") && !url.includes("YOUR_"));
}

async function fromSupabase(
  country: string,
  category?: string,
): Promise<CatalogRow[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    let query = supabase
      .from("ctc_products")
      .select("id, country_code, data, stock_status, price, image, last_checked")
      .eq("country_code", country);

    const { data, error } = await query;
    if (error || !data?.length) return [];

    let rows = data
      .map((r) => normalizeRow(r as Record<string, unknown>))
      .filter((r): r is CatalogRow => r != null);

    if (category) {
      rows = rows.filter(
        (r) => r.data.category === category || r.data.slug === category,
      );
    }

    return rows.sort((a, b) => (b.data.popularity || 0) - (a.data.popularity || 0));
  } catch {
    return [];
  }
}

export async function getProducts(
  country: string,
  category?: string,
): Promise<CatalogRow[]> {
  const remote = await fromSupabase(country, category);
  if (remote.length) return remote;
  return seedProductsForCountry(country, category);
}

export async function getProductBySlug(
  country: string,
  slug: string,
): Promise<CatalogRow | null> {
  if (hasSupabaseEnv()) {
    try {
      const { data, error } = await supabase
        .from("ctc_products")
        .select("id, country_code, data, stock_status, price, image, last_checked")
        .eq("country_code", country)
        .filter("data->>slug", "eq", slug)
        .limit(1);
      if (!error && data?.[0]) {
        return normalizeRow(data[0] as Record<string, unknown>);
      }
    } catch {
      /* fall through */
    }
  }
  return seedProductBySlug(country, slug);
}

export async function getRelatedProducts(
  country: string,
  excludeId: string,
  limit = 4,
): Promise<CatalogRow[]> {
  const all = await getProducts(country);
  return all.filter((r) => r.id !== excludeId).slice(0, limit);
}
