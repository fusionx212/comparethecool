import Link from "next/link";
import type { Product } from "@/lib/types";
import { isAnyInStock } from "@/lib/data";
import { byRecommended } from "@/lib/ranking";
import { AIRCON_CATEGORIES } from "@/lib/categories";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  // Use the live catalogue rather than a static hand-picked list. This means
  // the block changes as stock, clicks, demand and freshness change, while
  // the recommendation engine still applies the curated hero/brand boosts.
  const featured = byRecommended(
    products.filter((p) => AIRCON_CATEGORIES.has(p.category) && isAnyInStock(p))
  ).slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="eyebrow text-brand-deep">Top picks</div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Best-value air conditioners — in stock now
          </h2>
        </div>
        <Link href="/portable-air-conditioners" className="eyebrow text-foreground/60 hover:text-brand">
          View all air conditioners →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
