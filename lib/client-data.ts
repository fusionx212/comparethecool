import { supabase } from "./supabase";

/** Shape of a product record from the ctc_products table */
export interface ProductRecord {
  id: number;
  slug: string;
  name: string;
  category: string;
  country_code: string;
  image_url: string | null;
  price: number | null;
  currency: string | null;
  retailer: string | null;
  amazon_asin: string | null;
  ebay_item_id: string | null;
  rating: number | null;
  review_count: number | null;
  data: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Slug → display label */
export function slugLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Fetch products for a given country and optional category.
 * Called from the browser — works with static export.
 */
export async function fetchProducts(
  country: string,
  category?: string,
): Promise<ProductRecord[]> {
  let query = supabase
    .from("ctc_products")
    .select("*")
    .eq("country_code", country);

  if (category) {
    // Try slug match first, then name match
    query = query.or(`category.eq.${category},slug.eq.${category}`);
  }

  const { data, error } = await query.order("rating", { ascending: false });

  if (error) {
    console.error("fetchProducts error:", error);
    return [];
  }

  return (data ?? []) as ProductRecord[];
}

/**
 * Fetch a single product by slug and country.
 */
export async function fetchProductBySlug(
  slug: string,
  country: string,
): Promise<ProductRecord | null> {
  const { data, error } = await supabase
    .from("ctc_products")
    .select("*")
    .eq("slug", slug)
    .eq("country_code", country)
    .single();

  if (error) {
    console.error("fetchProductBySlug error:", error);
    return null;
  }

  return data as ProductRecord | null;
}
