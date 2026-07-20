"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { bestOffer } from "@/lib/data";
import { gbp } from "@/lib/format";
import { StatusLed } from "./StatusLed";
import { ProductImage } from "./ProductImage";
import { BuyLink } from "./BuyLink";

/**
 * TieredBoard — replaces the flat "board" on the homepage.
 * Groups products into price-anchored tiers so visitors find their budget immediately.
 *
 * Tier 1: Best Value (under £300) — highest conversion rate
 * Tier 2: Most Popular — highest order count, mixed prices
 * Tier 3: Premium Picks (£400+) — for those who want the best
 *
 * Price anchoring: expensive unit displayed first in its tier,
 * making the next unit look like a bargain.
 */

interface TierConfig {
  label: string;
  subtitle: string;
  filter: (p: Product) => boolean;
  sort: (a: Product, b: Product) => number;
  maxItems: number;
  color: string;
}

const TIERS: TierConfig[] = [
  {
    label: "Best Value",
    subtitle: "Under £300 — highest conversion, lowest risk",
    filter: (p) => {
      const o = bestOffer(p);
      return o ? o.price > 0 && o.price <= 300 : false;
    },
    // Demand-weighted value: popular cheap beats unpopular cheap.
    // popularity is sync'd from real click data every 2h via update-popularity.js
    sort: (a, b) => {
      const aScore = (a.popularity ?? 0) - (bestOffer(a)?.price ?? 0) / 50;
      const bScore = (b.popularity ?? 0) - (bestOffer(b)?.price ?? 0) / 50;
      return bScore - aScore;
    },
    maxItems: 6,
    color: "#22c55e",
  },
  {
    label: "Most Popular",
    subtitle: "What everyone's buying right now",
    filter: () => true, // no price filter
    // Pure demand sort — popularity carries click velocity + GSC data + heatwave multiplier
    sort: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
    maxItems: 8,
    color: "#3b82f6",
  },
  {
    label: "Premium Picks",
    subtitle: "£400+ — top-spec units for serious cooling",
    filter: (p) => {
      const o = bestOffer(p);
      return o ? o.price >= 400 : false;
    },
    // Demand-weighted premium: popular expensive beats unpopular expensive.
    sort: (a, b) => {
      const aScore = (a.popularity ?? 0) + (bestOffer(a)?.price ?? 0) / 100;
      const bScore = (b.popularity ?? 0) + (bestOffer(b)?.price ?? 0) / 100;
      return bScore - aScore;
    },
    maxItems: 4,
    color: "#a855f7",
  },
];

export function TieredBoard({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-8">
        <div className="eyebrow text-brand-deep">The board</div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          {products.length} buyable units — find your tier
        </h2>
      </div>

      <div className="space-y-12">
        {TIERS.map((tier) => {
          const items = products
            .filter(tier.filter)
            .sort(tier.sort)
            .slice(0, tier.maxItems);

          if (!items.length) return null;

          return (
            <div key={tier.label}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: tier.color }}
                  aria-hidden
                />
                <h3 className="text-lg font-bold">{tier.label}</h3>
                <span className="eyebrow text-foreground/45">{tier.subtitle}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => {
                  const o = bestOffer(p);
                  const status = o?.status ?? "out_of_stock";
                  return (
                    <Link
                      key={p.id}
                      href={`/p/${p.slug}`}
                      className="group flex items-start gap-3 border border-line bg-surface p-4 hover:border-foreground/30 hover:bg-surface-cool transition-colors"
                    >
                      <ProductImage
                        src={p.image}
                        alt={p.name}
                        category={p.category}
                        className="h-14 w-14 flex-none rounded"
                        glyphClassName="h-7 w-7"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <StatusLed status={status} live showLabel={false} />
                          <span className="text-xs font-semibold text-foreground group-hover:text-brand line-clamp-2">
                            {p.name.length > 60 ? p.name.slice(0, 57) + "..." : p.name}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="tnum font-bold">
                              {o ? gbp(o.price) : "—"}
                            </span>
                            {o && i === 0 && tier.label === "Premium Picks" && (
                              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                                TOP SPEC
                              </span>
                            )}
                            {o && i === 0 && tier.label === "Best Value" && (
                              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                                BEST DEAL
                              </span>
                            )}
                          </div>
                          {o && (
                            <span
                              className="text-[10px] uppercase tracking-wider text-foreground/40 group-hover:text-brand"
                              onClick={(e) => e.preventDefault()}
                            >
                              {o.retailer.name || o.retailer.id}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/* View all link */}
              <div className="mt-3 text-right">
                <Link
                  href="/portable-air-conditioners"
                  className="eyebrow text-foreground/50 hover:text-brand"
                >
                  View all {tier.label.toLowerCase()} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
