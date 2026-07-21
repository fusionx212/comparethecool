"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BestOfProductDTO } from "@/lib/best-of-dto";
import { ProductImage } from "@/components/ProductImage";
import { DealActions, type DealOption } from "@/components/DealActions";
import { StatusLed } from "@/components/StatusLed";

export type { BestOfProductDTO };

/** One local exit only — Amazon for this country; eBay only if Amazon missing. */
function dealOptions(
  p: BestOfProductDTO,
  currencySymbol: string,
  marketplaceHint: string,
): DealOption[] {
  if (p.amazonUrl && p.amazonPrice != null) {
    return [
      {
        id: "amazon",
        label: "Check today's price",
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
        label: "Check today's price",
        priceLabel: `${currencySymbol}${p.ebayPrice.toFixed(2)}`,
        href: p.ebayUrl,
        hint: "Opens local marketplace",
      },
    ];
  }
  return [];
}

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export function BestOfClient({
  code,
  currencySymbol,
  marketplaceHint,
  products,
}: {
  code: string;
  currencySymbol: string;
  marketplaceHint: string;
  products: BestOfProductDTO[];
}) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [brand, setBrand] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products],
  );

  const priceCeiling = useMemo(() => {
    const prices = products.map((p) => p.price ?? 0).filter(Boolean);
    return prices.length ? Math.ceil(Math.max(...prices) / 50) * 50 : 1000;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.highlights.some((h) => h.toLowerCase().includes(q)),
      );
    }
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    if (maxPrice !== "all") list = list.filter((p) => (p.price ?? 0) <= maxPrice);

    if (sort === "price-asc") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [products, sort, brand, maxPrice, query]);

  const top = filtered.slice(0, 3);
  const badges = ["Best overall", "Best value", "Best for large rooms"];

  return (
    <div>
      {/* Filters */}
      <section className="mt-8 border border-line bg-surface p-4 md:p-5">
        <p className="eyebrow text-foreground/50">Filter &amp; sort</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <label className="block text-sm">
            <span className="text-foreground/60">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Brand or model"
              className="mt-1 w-full border border-line bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-foreground/60">Brand</span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 w-full border border-line bg-background px-3 py-2"
            >
              <option value="all">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-foreground/60">Max price</span>
            <select
              value={maxPrice === "all" ? "all" : String(maxPrice)}
              onChange={(e) =>
                setMaxPrice(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="mt-1 w-full border border-line bg-background px-3 py-2"
            >
              <option value="all">Any</option>
              {[100, 200, 300, 400, 500, 750, priceCeiling].map((n) => (
                <option key={n} value={n}>
                  Under {currencySymbol}
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-foreground/60">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="mt-1 w-full border border-line bg-background px-3 py-2"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          Showing {filtered.length} of {products.length} · prices at last catalog check
        </p>
      </section>

      {/* Top 3 */}
      {top.length > 0 && (
        <section className="mt-10 border border-line bg-surface">
          <div className="border-b border-line px-5 py-3">
            <p className="eyebrow text-foreground/50">Top picks</p>
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
                <p className="eyebrow text-brand">{badges[i] || `Pick #${i + 1}`}</p>
                <h3 className="text-lg font-bold leading-snug">
                  <Link href={`/${code}/p/${p.slug}`} className="hover:text-brand">
                    {p.name}
                  </Link>
                </h3>
                <p className="tnum text-2xl font-bold text-brand">
                  {currencySymbol}
                  {(p.price ?? 0).toFixed(2)}
                </p>
                <p className="text-sm text-foreground/70 line-clamp-3">{p.verdict}</p>
                <DealActions
                  country={code}
                  productSlug={p.slug}
                  options={dealOptions(p, currencySymbol, marketplaceHint)}
                  primaryLabel="See deals"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Compare table */}
      <section id="compare" className="mt-12 overflow-x-auto border border-line bg-surface">
        <div className="border-b border-line px-5 py-3">
          <p className="eyebrow text-foreground/50">Side-by-side</p>
          <h2 className="text-xl font-bold">Live catalog prices</h2>
        </div>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-cool text-xs uppercase tracking-wider text-foreground/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Also seen</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Buy</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const price = p.amazonPrice ?? p.ebayPrice;
              const alsoSeen =
                p.amazonPrice != null && p.ebayPrice != null && p.ebayPrice !== p.amazonPrice
                  ? p.ebayPrice
                  : null;
              return (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        name={p.name}
                        image={p.image}
                        category={p.category}
                        amazonAsin={p.amazonAsin}
                        className="h-14 w-14 flex-none"
                      />
                      <Link href={`/${code}/p/${p.slug}`} className="font-semibold hover:text-brand">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 tnum">{(p.rating ?? 0).toFixed(1)}</td>
                  <td className="px-4 py-3 tnum font-semibold">
                    {price != null ? `${currencySymbol}${price.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 tnum text-foreground/60">
                    {alsoSeen != null ? `${currencySymbol}${alsoSeen.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <StatusLed status={p.stockStatus} showLabel={false} />
                      <span className="text-xs uppercase">
                        {p.stockStatus.replace(/_/g, " ")}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DealActions
                      country={code}
                      productSlug={p.slug}
                      options={dealOptions(p, currencySymbol, marketplaceHint)}
                      primaryLabel="Deals"
                      compact
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="border-t border-line px-5 py-2 text-xs text-foreground/50">
          Prices open your local store in a new tab. We earn from qualifying purchases —
          disclosed in our affiliate policy.
        </p>
      </section>

      {/* Full cards */}
      <section className="mt-14 space-y-8">
        {filtered.map((p) => (
          <article key={p.id} className="border border-line bg-surface p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              <ProductImage
                name={p.name}
                image={p.image}
                category={p.category}
                amazonAsin={p.amazonAsin}
                className="aspect-square w-full"
              />
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-brand">{p.brand}</p>
                    <h2 className="text-2xl font-bold">
                      <Link href={`/${code}/p/${p.slug}`} className="hover:text-brand">
                        {p.name}
                      </Link>
                    </h2>
                  </div>
                  <p className="tnum text-2xl font-bold text-brand">
                    {currencySymbol}
                    {(p.price ?? 0).toFixed(2)}
                  </p>
                </div>
                <p className="mt-4 text-foreground/80">{p.verdict}</p>
                {(p.pros.length > 0 || p.cons.length > 0) && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="eyebrow mb-2 text-instock">Pros</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {p.pros.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="eyebrow mb-2 text-sold">Cons</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {p.cons.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <DealActions
                    country={code}
                    productSlug={p.slug}
                    options={dealOptions(p, currencySymbol, marketplaceHint)}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="mt-10 border border-line bg-surface p-8 text-foreground/60">
          No products match these filters. Clear search or raise the max price.
        </p>
      )}
    </div>
  );
}
