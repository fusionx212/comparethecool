import { outboundHref } from "@/lib/affiliate";
import type { Offer } from "@/lib/types";

export function BuyLink({
  productSlug,
  offer,
  label,
}: {
  productSlug: string;
  offer: Offer;
  label?: string;
}) {
  const buyable = offer.status === "in_stock" || offer.status === "low_stock";
  const isEbay = offer.retailer.id === "ebay";
  if (!buyable) {
    // Amazon's offer-listing page still surfaces alternative sellers/refurbished
    // stock for a sold-out ASIN — give it a live link instead of a dead end.
    if (offer.retailer.id === "amazon") {
      return (
        <a
          href={outboundHref(productSlug, offer)}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-block border border-line px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold uppercase tracking-wider text-foreground/70 transition-colors hover:border-brand hover:text-brand"
        >
          Check Other Sellers
        </a>
      );
    }
    return (
      <span className="inline-block border border-line px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold uppercase tracking-wider text-foreground/40">
        Sold out
      </span>
    );
  }
  return (
    <a
      href={outboundHref(productSlug, offer)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="inline-block border-2 border-[var(--instock)] bg-[var(--instock)] px-4 py-2.5 sm:px-5 sm:py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
    >
      {label ?? (isEbay ? "Buy on eBay" : "In Stock — Buy")}
    </a>
  );
}
