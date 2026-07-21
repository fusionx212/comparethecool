/**
 * Browser helpers — prefer server catalog bake; these remain for progressive use.
 */
import { getProducts, getProductBySlug } from "./catalog/products";
import type { CatalogRow } from "./catalog/contract";
export { slugLabel } from "./catalog/contract";

export type ProductRecord = {
  id: string;
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
  data: CatalogRow["data"] | null;
  created_at: string | null;
  updated_at: string | null;
};

function toRecord(row: CatalogRow): ProductRecord {
  return {
    id: row.id,
    slug: row.data.slug,
    name: row.data.name,
    category: row.data.category,
    country_code: row.country_code,
    image_url: row.image,
    price: row.price,
    currency: null,
    retailer: null,
    amazon_asin: row.data.amazon_asin ?? null,
    ebay_item_id: row.data.ebay_item_id ?? null,
    rating: row.data.rating ?? null,
    review_count: row.data.review_count ?? null,
    data: row.data,
    created_at: null,
    updated_at: null,
  };
}

export async function fetchProducts(
  country: string,
  category?: string,
): Promise<ProductRecord[]> {
  const rows = await getProducts(country, category);
  return rows.map(toRecord);
}

export async function fetchProductBySlug(
  slug: string,
  country: string,
): Promise<ProductRecord | null> {
  const row = await getProductBySlug(country, slug);
  return row ? toRecord(row) : null;
}
