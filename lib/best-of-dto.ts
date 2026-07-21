import type { CatalogRow } from "@/lib/catalog/contract";
import type { StockStatus } from "@/lib/types";
import { wrapOfferUrl } from "@/lib/affiliate";

export type BestOfProductDTO = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string | null;
  amazonAsin: string | null;
  price: number | null;
  rating: number | null;
  stockStatus: StockStatus;
  verdict: string;
  pros: string[];
  cons: string[];
  highlights: string[];
  amazonPrice: number | null;
  ebayPrice: number | null;
  amazonUrl: string | null;
  ebayUrl: string | null;
};

export function toBestOfDTO(row: CatalogRow, code: string): BestOfProductDTO {
  const amazon = row.data.offers.find((o) => o.retailer.id === "amazon");
  const ebay = row.data.offers.find((o) => o.retailer.id === "ebay");
  return {
    id: row.id,
    slug: row.data.slug,
    name: row.data.name,
    brand: row.data.brand,
    category: row.data.category,
    image: row.image || row.data.image || null,
    amazonAsin: row.data.amazon_asin ?? null,
    price: row.price,
    rating: row.data.rating ?? null,
    stockStatus: row.stock_status,
    verdict: row.data.editorial?.verdict || row.data.highlights.join(" · "),
    pros: row.data.editorial?.pros || [],
    cons: row.data.editorial?.cons || [],
    highlights: row.data.highlights || [],
    amazonPrice: amazon?.price ?? null,
    ebayPrice: ebay?.price ?? null,
    amazonUrl: amazon
      ? wrapOfferUrl(code, "amazon", amazon.url, row.data.amazon_asin)
      : null,
    ebayUrl: ebay
      ? wrapOfferUrl(code, "ebay", ebay.url, null, row.data.ebay_item_id)
      : null,
  };
}
