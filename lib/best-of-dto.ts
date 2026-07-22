import type { CatalogRow } from "@/lib/catalog/contract";
import type { StockStatus } from "@/lib/types";
import { wrapOfferUrl } from "@/lib/affiliate";
import type { SiteBrand } from "@/lib/site-brand";
import { looksLikeRealAsin } from "@/lib/asin";

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

export function toBestOfDTO(
  row: CatalogRow,
  code: string,
  siteBrand?: SiteBrand,
): BestOfProductDTO {
  const amazon = row.data.offers.find((o) => o.retailer.id === "amazon");
  const ebay = row.data.offers.find((o) => o.retailer.id === "ebay");
  const asin = row.data.amazon_asin;
  const amazonBuyable =
    amazon &&
    looksLikeRealAsin(asin) &&
    amazon.status !== "out_of_stock" &&
    row.stock_status !== "out_of_stock";
  const ebayBuyable = ebay && ebay.status !== "out_of_stock";

  return {
    id: row.id,
    slug: row.data.slug,
    name: row.data.name,
    brand: row.data.brand,
    category: row.data.category,
    image: row.image || row.data.image || null,
    amazonAsin: looksLikeRealAsin(asin) ? (asin as string) : null,
    price: row.price,
    rating: row.data.rating ?? null,
    stockStatus: row.stock_status,
    verdict: row.data.editorial?.verdict || row.data.highlights.join(" · "),
    pros: row.data.editorial?.pros || [],
    cons: row.data.editorial?.cons || [],
    highlights: row.data.highlights || [],
    amazonPrice: amazonBuyable ? (amazon?.price ?? null) : null,
    ebayPrice: ebayBuyable ? (ebay?.price ?? null) : null,
    amazonUrl: amazonBuyable
      ? wrapOfferUrl(code, "amazon", amazon!.url, asin, null, siteBrand)
      : null,
    ebayUrl: ebayBuyable
      ? wrapOfferUrl(code, "ebay", ebay!.url, null, row.data.ebay_item_id, siteBrand)
      : null,
  };
}
