"use client";

import Link from "next/link";
import type { BestOfProductDTO } from "@/lib/best-of-dto";
import { ProductImage } from "@/components/ProductImage";
import { DealActions, type DealOption } from "@/components/DealActions";

function dealOptions(
  p: BestOfProductDTO,
  currencySymbol: string,
  marketplaceHint: string,
): DealOption[] {
  if (p.amazonUrl && p.amazonPrice != null) {
    return [
      {
        id: "amazon",
        label: "Buy",
        priceLabel: `${currencySymbol}${p.amazonPrice.toFixed(2)}`,
        href: p.amazonUrl,
        hint: `Opens ${marketplaceHint}`,
      },
    ];
  }
  if (p.ebayUrl && p.ebayPrice != null) {
    return [
      {
        id: "ebay",
        label: "Buy",
        priceLabel: `${currencySymbol}${p.ebayPrice.toFixed(2)}`,
        href: p.ebayUrl,
        hint: "Opens local marketplace",
      },
    ];
  }
  return [];
}

const BADGES = ["Best overall", "Best value", "Editor's pick"];

/**
 * Land → buy in one click: top picks with direct retailer CTAs.
 */
export function HomeTopBuys({
  code,
  currencySymbol,
  marketplaceHint,
  categorySlug,
  categoryLabel,
  products,
}: {
  code: string;
  currencySymbol: string;
  marketplaceHint: string;
  categorySlug: string;
  categoryLabel: string;
  products: BestOfProductDTO[];
}) {
  if (!products.length) return null;
  const top = products.slice(0, 3);

  return (
    <section id="top-buys" className="border border-line bg-surface">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="eyebrow text-brand">Buy in one tap</p>
          <h2 className="text-xl font-bold md:text-2xl">Top {categoryLabel} right now</h2>
        </div>
        <Link
          href={`/${code}/best/${categorySlug}`}
          className="text-sm font-semibold text-foreground/60 hover:text-brand"
        >
          Compare all →
        </Link>
      </div>
      <div className="grid gap-0 md:grid-cols-3">
        {top.map((p, i) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 p-5 ${i < top.length - 1 ? "border-b border-line md:border-b-0 md:border-r" : ""}`}
          >
            <ProductImage
              name={p.name}
              image={p.image}
              category={p.category}
              amazonAsin={p.amazonAsin}
              className="aspect-square w-full"
            />
            <p className="eyebrow text-brand">{BADGES[i] || `Pick #${i + 1}`}</p>
            <h3 className="text-lg font-bold leading-snug">
              <Link href={`/${code}/p/${p.slug}`} className="hover:text-brand">
                {p.name}
              </Link>
            </h3>
            <p className="tnum text-2xl font-bold text-brand">
              {currencySymbol}
              {(p.price ?? 0).toFixed(2)}
            </p>
            <DealActions
              country={code}
              productSlug={p.slug}
              options={dealOptions(p, currencySymbol, marketplaceHint)}
              primaryLabel="Buy now"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
