"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCountry } from "@/lib/countries";
import { fetchProducts, type ProductRecord, slugLabel } from "@/lib/client-data";

/**
 * Client component that fetches and displays product listings.
 * Rendered inside a server-component wrapper that generates static params.
 */
export default function BestReviewClient({
  code,
  slug,
}: {
  code: string;
  slug: string;
}) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code || !slug) return;
    setLoading(true);
    fetchProducts(code, slug)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code, slug]);

  const cc = getCountry(code);
  const label = slugLabel(slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Best {label} in {cc.name} ({cc.currencySymbol})
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        We&apos;ve researched and compared the top {label.toLowerCase()} available in{" "}
        {cc.name}. Prices are checked live — tap any product to see today&apos;s best
        deal across retailers.
      </p>

      <div className="mt-10 grid gap-6">
        {loading ? (
          <p className="py-10 text-center text-foreground/50">
            Loading products…
          </p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-foreground/50">
            No products found for this category yet. Check back soon for live prices
            on {cc.amazonMarketplace.replace("www.", "")} and eBay.
          </p>
        ) : (
          <ProductsGrid products={products} code={code} cc={cc} />
        )}
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-xl font-bold">How We Test & Compare</h2>
        <p className="mt-3 text-foreground/70">
          Our reviews are independent and data-driven. We analyse specifications, read
          verified customer feedback, and track live prices across retailers to find you
          the best value. We are not paid for positive reviews — every product is judged
          on its merits.
        </p>
      </section>

      <section className="mt-10 border-t border-line pt-10">
        <h2 className="text-xl font-bold">About This Guide</h2>
        <p className="mt-3 text-foreground/70">
          This guide was created specifically for shoppers in {cc.name}. Prices shown are
          in {cc.currency} and we link to {cc.amazonMarketplace} and eBay {cc.name} for
          your convenience. As an Amazon Associate and eBay Partner we earn from qualifying
          purchases.
        </p>
      </section>

      <div className="mt-8">
        <Link
          href={`/${code}/blog`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          📰 Read related articles
        </Link>
      </div>
    </div>
  );
}

/* ─── Product card grid ─── */

function ProductsGrid({
  products,
  code,
  cc,
}: {
  products: ProductRecord[];
  code: string;
  cc: { name: string; currencySymbol: string };
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} code={code} cc={cc} />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  code,
  cc,
}: {
  product: ProductRecord;
  code: string;
  cc: { name: string; currencySymbol: string };
}) {
  const priceDisplay =
    product.price != null
      ? `${cc.currencySymbol}${product.price.toFixed(2)}`
      : null;

  return (
    <Link
      href={`/${code}/p/${product.slug}`}
      className="group flex flex-col rounded-none border border-line bg-surface p-5 transition hover:border-brand hover:shadow-md"
    >
      {/* Image */}
      {product.image_url && (
        <div className="mb-3 flex h-40 items-center justify-center overflow-hidden bg-white">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}

      <h3 className="text-lg font-bold group-hover:text-brand">
        {product.name}
      </h3>

      {/* Rating */}
      {product.rating != null && (
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </span>
          <span className="text-foreground/60">
            {product.rating.toFixed(1)}
            {product.review_count != null && (
              <> ({product.review_count})</>
            )}
          </span>
        </div>
      )}

      {/* Price */}
      {priceDisplay && (
        <p className="mt-2 text-xl font-bold text-brand">{priceDisplay}</p>
      )}

      {/* Retailer chips */}
      <div className="mt-auto flex flex-wrap gap-2 pt-3">
        {product.amazon_asin && (
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            Amazon
          </span>
        )}
        {product.ebay_item_id && (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            eBay
          </span>
        )}
      </div>
    </Link>
  );
}
