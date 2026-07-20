"use client";

import { useEffect, useState } from "react";

interface LiveCounts {
  inStock: number;
  tracked: number;
  amazon: number;
  ebay: number;
}

export function LiveStats({
  initialInStock,
  initialTracked,
}: {
  initialInStock: number;
  initialTracked: number;
}) {
  const [counts, setCounts] = useState<LiveCounts>({
    inStock: initialInStock,
    tracked: initialTracked,
    amazon: 0,
    ebay: 0,
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: any[]) => {
        let amazon = 0;
        let ebay = 0;
        let inStock = 0;
        for (const p of products) {
          let productBuyable = false;
          for (const o of p.offers || []) {
            if (o.status === "in_stock" || o.status === "low_stock") {
              if (o.retailer?.id === "amazon") amazon++;
              if (o.retailer?.id === "ebay") ebay++;
              productBuyable = true;
            }
          }
          if (productBuyable) inStock++;
        }
        setCounts({
          inStock,
          tracked: products.length,
          amazon,
          ebay,
        });
      })
      .catch(() => {}); // keep SSR values on error
  }, []);

  return (
    <div className="ouac-grid border-t border-line bg-surface md:border-l md:border-t-0 md:rule-strong">
      <Stat
        label="In stock now"
        value={counts.inStock}
        token="var(--instock)"
        sub={`${counts.amazon} Amazon · ${counts.ebay} eBay`}
      />
      <Stat
        label="Units tracked"
        value={counts.tracked}
        token="var(--brand)"
        border
        sub="Live prices & stock"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  token,
  border,
  sub,
}: {
  label: string;
  value: number;
  token: string;
  border?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-6 py-6 ${
        border ? "border-t border-line" : ""
      }`}
    >
      <span
        className="block h-8 w-8 flex-none"
        style={{ backgroundColor: token }}
        aria-hidden
      />
      <div>
        <div className="tnum text-3xl font-bold leading-none">{value}</div>
        <div className="eyebrow mt-1 text-foreground/55">{label}</div>
        {sub && (
          <div className="mt-0.5 text-[10px] text-foreground/35">{sub}</div>
        )}
      </div>
    </div>
  );
}
