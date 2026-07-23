"use client";

import Link from "next/link";
import type { BestOfProductDTO } from "@/components/BestOfClient";
import { ProductImage } from "@/components/ProductImage";

function threeCheapest(products: BestOfProductDTO[]): BestOfProductDTO[] {
  return [...products]
    .filter((p) => p.price != null && p.stockStatus !== "out_of_stock")
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    .slice(0, 3);
}

export function BudgetStrip({
  products,
  code,
  currencySymbol,
}: {
  products: BestOfProductDTO[];
  code: string;
  currencySymbol: string;
}) {
  const picks = threeCheapest(products);
  if (picks.length < 2) return null;

  const badges = ["Cheapest", "Best Value", "Budget Pick"];

  return (
    <section className="mb-10 border border-line bg-surface">
      <div
        className="border-b border-line px-5 py-3"
        style={{ background: "linear-gradient(135deg, var(--instock), #0a7c42)" }}
      >
        <p className="eyebrow text-white/90">💷 Budget Picks — cheapest in stock right now</p>
      </div>
      <div className="grid gap-0 sm:grid-cols-3">
        {picks.map((p, i) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 p-5 ${
              i < picks.length - 1 ? "border-b border-line sm:border-b-0 sm:border-r" : ""
            }`}
          >
            <span className="inline-block w-fit bg-foreground/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {badges[i]}
            </span>
            <div className="flex items-start gap-3">
              <ProductImage
                name={p.name}
                image={p.image}
                category={p.category}
                className="h-16 w-16 flex-none"
              />
              <div>
                <Link
                  href={`/${code}/p/${p.slug}`}
                  className="text-sm font-semibold leading-snug hover:text-brand"
                >
                  {p.name.length > 50 ? p.name.slice(0, 47) + "…" : p.name}
                </Link>
                <p className="mt-0.5 text-xs text-foreground/50">{p.brand}</p>
              </div>
            </div>
            <div className="mt-auto flex items-end justify-between">
              <p className="tnum text-xl font-bold text-brand">
                {currencySymbol}
                {(p.price ?? 0).toFixed(2)}
              </p>
              <Link
                href={`/${code}/p/${p.slug}`}
                className="bg-brand px-3 py-1.5 text-xs font-bold text-white hover:brightness-110"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
