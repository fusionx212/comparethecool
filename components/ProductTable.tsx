"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { bestOffer, isRealBrand } from "@/lib/data";
import { recommendationScore } from "@/lib/ranking";
import { gbp, timeAgo } from "@/lib/format";
import { StatusLed } from "./StatusLed";
import { ProductImage } from "./ProductImage";
import { BuyLink } from "./BuyLink";
import { StockSignalBadge } from "./StockSignalBadge";
import { CATEGORY_BY_SLUG } from "@/lib/categories";
import { matchSearchDefinition } from "@/lib/search-definitions";

interface SignalMap {
  [slug: string]: {
    clicksToday: number;
    alertCount: number;
    urgency: "none" | "low" | "medium" | "high";
    trending: boolean;
    manyWaiting: boolean;
  };
}

export function ProductTable({
  products,
  showBtu,
  now,
}: {
  products: Product[];
  showBtu: boolean;
  now: Date;
}) {
  const [search, setSearch] = useState("");
  const [stockOnly, setStockOnly] = useState(false); // Default: show ALL, not just in-stock
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recommended" | "instock" | "price-asc" | "price-desc" | "brand">("recommended");

  // New filters
  const [btuMin, setBtuMin] = useState("");
  const [btuMax, setBtuMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [retailerFilter, setRetailerFilter] = useState<string>("");
  const [visible, setVisible] = useState(12);

  // Stock signals from API
  const [signals, setSignals] = useState<SignalMap>({});

  const slugs = useMemo(() => products.map((p) => p.slug), [products]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSignals() {
      try {
        const res = await fetch(`/api/stock-signals?slugs=${slugs.join(",")}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSignals(data.signals || {});
      } catch {
        // Silent — signals are optional
      }
    }
    if (slugs.length > 0 && slugs.length <= 200) {
      fetchSignals();
    }
    return () => { cancelled = true; };
  }, [slugs.join(",")]);

  // Extract unique brands, retailers from products
  // Only offer real manufacturer names as filter options — the raw field is
  // full of spec fragments parsed from marketplace titles ("12000", "550W",
  // "3-in-1"). Products themselves are never filtered out by this; see
  // isRealBrand.
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].filter(isRealBrand).sort(),
    [products]
  );

  const retailers = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      for (const o of p.offers) {
        set.add(o.retailer.name || o.retailer.id);
      }
    }
    return [...set].sort();
  }, [products]);

  // Collate all BTU values for filter range
  const btuRange = useMemo(() => {
    if (!showBtu) return null;
    const btus = products.map((p) => p.btu).filter((b): b is number => typeof b === "number" && b > 0);
    if (!btus.length) return null;
    return { min: Math.min(...btus), max: Math.max(...btus) };
  }, [products, showBtu]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...products];

    // Stock filter
    if (stockOnly) {
      list = list.filter((p) => p.offers.some((o) => o.status === "in_stock" || o.status === "low_stock"));
    }

    // Brand filter
    if (brandFilter) {
      list = list.filter((p) => p.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    // Retailer filter
    if (retailerFilter) {
      list = list.filter((p) =>
        p.offers.some((o) => (o.retailer.name || o.retailer.id) === retailerFilter)
      );
    }

    // BTU range filter
    if (btuMin || btuMax) {
      const min = btuMin ? parseInt(btuMin) : 0;
      const max = btuMax ? parseInt(btuMax) : Infinity;
      list = list.filter((p) => {
        if (p.btu == null) return false;
        return p.btu >= min && p.btu <= max;
      });
    }

    // Price range filter
    if (priceMin || priceMax) {
      const pMin = priceMin ? parseInt(priceMin) : 0;
      const pMax = priceMax ? parseInt(priceMax) : Infinity;
      list = list.filter((p) => {
        const o = bestOffer(p);
        if (!o) return false;
        return o.price >= pMin && o.price <= pMax;
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const def = matchSearchDefinition(q);
      list = list.filter((p) => {
        if (def?.excludeCategories?.includes(p.category)) return false;
        if (def?.includeCategories && !def.includeCategories.includes(p.category)) return false;
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.highlights.some((h) => h.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => {
        const ao = bestOffer(a);
        const bo = bestOffer(b);
        return (ao?.price ?? 99999) - (bo?.price ?? 99999);
      });
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => {
        const ao = bestOffer(a);
        const bo = bestOffer(b);
        return (bo?.price ?? 0) - (ao?.price ?? 0);
      });
    } else if (sortBy === "brand") {
      list.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sortBy === "instock") {
      list.sort((a, b) => {
        const aIn = a.offers.some((o) => o.status === "in_stock" || o.status === "low_stock");
        const bIn = b.offers.some((o) => o.status === "in_stock" || o.status === "low_stock");
        if (aIn !== bIn) return aIn ? -1 : 1;
        const ao = bestOffer(a);
        const bo = bestOffer(b);
        return (ao?.price ?? 99999) - (bo?.price ?? 99999);
      });
    } else {
      const scored = new Map(list.map((p) => [p.id, recommendationScore(p)]));
      list.sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));
    }

    return list;
  }, [products, search, stockOnly, brandFilter, retailerFilter, btuMin, btuMax, priceMin, priceMax, sortBy]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const clearFilters = () => {
    setSearch("");
    setBrandFilter("");
    setRetailerFilter("");
    setBtuMin("");
    setBtuMax("");
    setPriceMin("");
    setPriceMax("");
    setStockOnly(false);
    setSortBy("recommended");
  };

  const hasActiveFilters = search || brandFilter || retailerFilter || btuMin || btuMax || priceMin || priceMax || stockOnly;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 space-y-3">
        {/* Row 1: Search + Brand + Sort */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="eyebrow block text-foreground/45" htmlFor="product-search">
              Search
            </label>
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Meaco, dehumidifier, 12000 BTU..."
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
            />
          </div>

          <div className="min-w-[120px]">
            <label className="eyebrow block text-foreground/45" htmlFor="brand-filter">
              Brand
            </label>
            <select
              id="brand-filter"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none cursor-pointer"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[110px]">
            <label className="eyebrow block text-foreground/45" htmlFor="sort-by">
              Sort
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="instock">In-stock first</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
              <option value="brand">Brand A–Z</option>
            </select>
          </div>

          <div className="min-w-[110px]">
            <label className="eyebrow block text-foreground/45" htmlFor="retailer-filter">
              Retailer
            </label>
            <select
              id="retailer-filter"
              value={retailerFilter}
              onChange={(e) => setRetailerFilter(e.target.value)}
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none cursor-pointer"
            >
              <option value="">All retailers</option>
              {retailers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="h-4 w-4 border-line accent-brand cursor-pointer"
              />
              <span className="eyebrow text-foreground/70">In stock only</span>
            </label>
          </div>
        </div>

        {/* Row 2: BTU + Price range filters (collapsible) */}
        {(showBtu || true) && (
          <div className="flex flex-wrap items-end gap-3">
            {showBtu && btuRange && (
              <>
                <div className="min-w-[90px]">
                  <label className="eyebrow block text-foreground/45">BTU min</label>
                  <input
                    type="number"
                    value={btuMin}
                    onChange={(e) => setBtuMin(e.target.value)}
                    placeholder={String(btuRange.min)}
                    className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                  />
                </div>
                <div className="min-w-[90px]">
                  <label className="eyebrow block text-foreground/45">BTU max</label>
                  <input
                    type="number"
                    value={btuMax}
                    onChange={(e) => setBtuMax(e.target.value)}
                    placeholder={String(btuRange.max)}
                    className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="min-w-[90px]">
              <label className="eyebrow block text-foreground/45">Price min</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="£0"
                className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
              />
            </div>
            <div className="min-w-[90px]">
              <label className="eyebrow block text-foreground/45">Price max</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="£500"
                className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="pb-1.5 text-xs text-foreground/50 hover:text-brand"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow text-foreground/45">
          {filtered.length} of {products.length} products
          {filtered.length !== products.length && " · filtered"}
        </p>
        {hasActiveFilters && (
          <span className="text-[10px] uppercase tracking-wider text-brand">
            Filters active
          </span>
        )}
      </div>

      {/* Table — desktop only. On a 390px phone this table renders 849px wide:
          515px of it (Price, Retailer, Checked, Buy) sits off-screen, so the
          83% of sessions that are mobile never see a price or a buy button —
          they see an unlabelled status dot, a wrapped name, and a truncated BTU
          column. Mobile gets stacked cards below instead: the same split
          /p/[slug] already uses for its offers table. */}
      {shown.length > 0 ? (
        <>
        <div className="hidden sm:block overflow-x-auto border rule-strong bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b rule-strong text-left">
                <th className="eyebrow px-4 py-3 font-semibold">Status</th>
                <th className="eyebrow px-4 py-3 font-semibold">Unit</th>
                {showBtu && <th className="eyebrow px-4 py-3 text-right font-semibold">BTU</th>}
                {showBtu && <th className="eyebrow px-4 py-3 text-right font-semibold">Room</th>}
                <th className="eyebrow px-4 py-3 text-right font-semibold">Price</th>
                <th className="eyebrow px-4 py-3 text-right font-semibold">Retailer</th>
                <th className="eyebrow px-4 py-3 text-right font-semibold">Checked</th>
                <th className="eyebrow px-4 py-3 text-right font-semibold">Buy</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => {
                const o = bestOffer(p);
                const status = o?.status ?? "out_of_stock";
                const cat = CATEGORY_BY_SLUG[p.category];
                const sig = signals[p.slug] || null;
                const isTrending = sig && sig.urgency !== "none";

                return (
                  <tr
                    key={p.id}
                    className="border-b border-line last:border-b-0 hover:bg-surface-cool"
                    style={isTrending ? { borderLeft: "3px solid var(--brand, #e94560)" } : {}}
                  >
                    <td className="px-4 py-3">
                      <StatusLed status={status} live showLabel={false} />
                    </td>
                    <td className="px-4 py-3">
                      {/* The whole cell links, not just the name. The image and
                          brand line were inert, and that is where the dead
                          clicks land — 11% of PC sessions and 23% of tablet on
                          this page, because desktop can see the full row and
                          clicks the parts of it that aren't links. */}
                      <Link href={`/p/${p.slug}`} className="group flex items-center gap-3">
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          category={p.category}
                          className="h-11 w-11 flex-none"
                          glyphClassName="h-6 w-6"
                        />
                        <div>
                          <div className="font-medium group-hover:text-brand">{p.name}</div>
                          <div className="eyebrow mt-0.5 flex items-center gap-2 text-foreground/45">
                            {p.brand}
                            <StockSignalBadge signal={sig} />
                          </div>
                        </div>
                      </Link>
                    </td>
                    {showBtu && (
                      <td className="px-4 py-3 text-right tnum">{p.btu ?? "—"}</td>
                    )}
                    {showBtu && (
                      <td className="px-4 py-3 text-right tnum">
                        {p.coverageM2 ? `${p.coverageM2}m²` : "—"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right tnum font-semibold">
                      {o ? (
                        <span>
                          {gbp(o.price)}
                          {sig?.clicksToday >= 5 && (
                            <span className="ml-1 text-[10px] text-brand">↑hot</span>
                          )}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tnum text-foreground/45">
                      {o?.retailer.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-right tnum text-foreground/45">
                      {o ? timeAgo(o.lastChecked, now) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {o ? <BuyLink productSlug={p.slug} offer={o} /> : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards. Price, stock label and buy button are all on
            screen with no horizontal scroll. Desktop users (who can see the
            whole table) spend 60s active and 1.21 pages/session; mobile users
            spend 20s and 1.01 — same page, same content, the only difference
            being whether the buy button fits. */}
        <div className="sm:hidden divide-y divide-line border rule-strong bg-surface">
          {shown.map((p) => {
            const o = bestOffer(p);
            const status = o?.status ?? "out_of_stock";
            const sig = signals[p.slug] || null;
            const isTrending = sig && sig.urgency !== "none";

            return (
              <div
                key={p.id}
                className="p-4"
                style={isTrending ? { borderLeft: "3px solid var(--brand, #e94560)" } : {}}
              >
                <Link href={`/p/${p.slug}`} className="flex items-start gap-3">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    category={p.category}
                    className="h-16 w-16 flex-none"
                    glyphClassName="h-8 w-8"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-snug">{p.name}</div>
                    <div className="eyebrow mt-1 flex items-center gap-2 text-foreground/45">
                      {p.brand}
                      <StockSignalBadge signal={sig} />
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    {/* showLabel defaults true. The desktop table passes false,
                        which left an unlabelled coloured dot as the only stock
                        cue — on a site whose entire value is live stock. */}
                    <StatusLed status={status} live />
                    <div className="tnum mt-1.5 text-2xl font-bold leading-none">
                      {o ? gbp(o.price) : "—"}
                    </div>
                    <div className="eyebrow mt-1 text-foreground/45">
                      {showBtu && p.btu ? `${p.btu} BTU · ` : ""}
                      {o ? `${o.retailer.name} · ${timeAgo(o.lastChecked, now)}` : "—"}
                    </div>
                  </div>
                  {o ? <BuyLink productSlug={p.slug} offer={o} /> : null}
                </div>
              </div>
            );
          })}
        </div>
        </>
      ) : (
        <div className="border rule-strong bg-surface p-8 text-center text-sm text-foreground/50">
          <p>No products match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-brand hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Show more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 24)}
            className="border border-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand cursor-pointer"
          >
            Show more ({filtered.length - shown.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
