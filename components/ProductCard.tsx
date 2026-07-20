import Link from "next/link";
import type { Product } from "@/lib/types";
import { bestOffer } from "@/lib/data";
import { gbp } from "@/lib/format";
import { StatusLed } from "./StatusLed";
import { ProductImage } from "./ProductImage";
import { BuyLink } from "./BuyLink";

// Single shared product/offer card, replacing six independently-coded
// bespoke implementations (FeaturedProducts, HotDeals, stock-selector, plus
// the two guide pages left for a fast follow). Every visual variant is built
// from the same canonical helpers — bestOffer() for offer selection,
// StatusLed for the stock label (never a hand-rolled ternary that can
// default to a wrong status), BuyLink for the CTA (including Amazon's
// "Check Other Sellers" sold-out recovery, which none of the six had).
//
// variant:
//   grid    — FeaturedProducts' "Top picks" look: prominent image, 2
//             highlights, retailer badge, price + CTA row.
//   compact — HotDeals' "Price drops" look: smaller tile, optional
//             price-drop badge, no highlights.
//   row     — horizontal list row: stock-selector's results list.
export function ProductCard({
  product,
  variant,
  priceDropBadge,
  highlightCount,
}: {
  product: Product;
  variant: "grid" | "compact" | "row";
  priceDropBadge?: { previousPrice: number; dropPct: number };
  highlightCount?: number;
}) {
  const offer = bestOffer(product);
  if (!offer) return null;

  const retailerLabel = offer.retailer.id === "ebay" ? "eBay" : offer.retailer.name;

  if (variant === "compact") {
    return (
      <div className="group flex flex-col border rule-strong bg-surface hover:border-heat transition-colors">
        <Link href={`/p/${product.slug}`} className="flex flex-1 flex-col">
          <div className="bg-white p-2 flex items-center justify-center h-24">
            <ProductImage
              src={product.image}
              alt={product.name}
              category={product.category}
              className="h-full w-full border-0"
              glyphClassName="h-12 w-12"
            />
          </div>
          <div className="p-2.5 flex flex-col flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <StatusLed status={offer.status} live showLabel={false} />
              <span className="text-[10px] uppercase tracking-wider text-foreground/35">{product.brand}</span>
            </div>
            <span className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-heat">
              {product.name}
            </span>
            <div className="mt-auto pt-2 flex items-baseline gap-1.5">
              <span className="tnum text-sm font-bold text-heat">{gbp(offer.price)}</span>
              {priceDropBadge && (
                <>
                  <span className="tnum text-[10px] text-foreground/35 line-through">
                    {gbp(priceDropBadge.previousPrice)}
                  </span>
                  <span className="text-[10px] font-bold text-heat ml-auto">-{priceDropBadge.dropPct}%</span>
                </>
              )}
            </div>
            <div className="mt-1.5">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                {retailerLabel}
              </span>
            </div>
          </div>
        </Link>
        <div className="px-2.5 pb-2.5">
          <BuyLink productSlug={product.slug} offer={offer} />
        </div>
      </div>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/p/${product.slug}`}
        className="flex items-center gap-4 border border-line bg-surface p-4 hover:border-brand transition-colors"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          className="h-16 w-16 flex-none"
          glyphClassName="h-8 w-8"
        />
        <div className="flex-1 min-w-0">
          <div className="eyebrow text-foreground/45">{product.brand}</div>
          <div className="mt-0.5 text-sm font-semibold truncate">{product.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-foreground/50">
            {product.btu && <span>{product.btu.toLocaleString()} BTU</span>}
            {product.coverageM2 && <span>Up to {product.coverageM2}m²</span>}
            {product.noise && <span>{product.noise}dB</span>}
            {product.highlights?.slice(0, highlightCount ?? 2).map((h) => (
              <span key={h} className="text-brand/70">{h}</span>
            ))}
          </div>
        </div>
        <div className="text-right flex-none">
          <div className="text-lg font-bold text-brand">{gbp(offer.price)}</div>
          <div className="mt-0.5">
            <StatusLed status={offer.status} live showLabel />
          </div>
          <div className="text-xs text-foreground/40">{retailerLabel}</div>
        </div>
      </Link>
    );
  }

  // grid — default
  return (
    <div className="group flex flex-col border rule-strong bg-surface hover:border-brand/30 transition-colors">
      <Link href={`/p/${product.slug}`} className="block bg-surface-cool p-4">
        <div className="flex items-center justify-center h-36">
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            className="h-full w-full border-0"
            glyphClassName="h-16 w-16"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-1">
          <StatusLed status={offer.status} live showLabel={false} />
          <span className="eyebrow text-foreground/35">{product.brand}</span>
        </div>

        <Link href={`/p/${product.slug}`} className="font-semibold text-sm leading-snug hover:text-brand line-clamp-2">
          {product.name}
        </Link>

        <ul className="mt-2 space-y-0.5 flex-1">
          {product.highlights.slice(0, highlightCount ?? 2).map((h, i) => (
            <li key={i} className="text-xs text-foreground/55 leading-snug">• {h}</li>
          ))}
        </ul>

        <div className="mt-1.5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-amber-600">
            {retailerLabel}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <div>
            <span className="tnum text-lg font-bold text-foreground">{gbp(offer.price)}</span>
            {product.priceHistory && product.priceHistory.length >= 2 && (
              <span className="ml-1.5 text-xs text-drop font-semibold">
                ↓ £{(product.priceHistory[0].price - product.priceHistory[product.priceHistory.length - 1].price).toFixed(0)}
              </span>
            )}
          </div>
          <BuyLink productSlug={product.slug} offer={offer} />
        </div>
      </div>
    </div>
  );
}
