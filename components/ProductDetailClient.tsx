"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCountry } from "@/lib/countries";
import {
  fetchProductBySlug,
  type ProductRecord,
  slugLabel,
} from "@/lib/client-data";

/**
 * Client component that fetches and displays a single product's details.
 * Rendered inside a server-component wrapper that generates static params.
 */
export default function ProductDetailClient({
  code,
  slug,
}: {
  code: string;
  slug: string;
}) {
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code || !slug) return;
    setLoading(true);
    fetchProductBySlug(slug, code)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code, slug]);

  const cc = getCountry(code);
  const label = slugLabel(slug);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12">
        <Link
          href={`/${code}`}
          className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
        >
          ← Back to {cc.name}
        </Link>
        <p className="py-10 text-center text-foreground/50">
          Loading product details…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12">
        <Link
          href={`/${code}`}
          className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
        >
          ← Back to {cc.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {label}
        </h1>
        <p className="py-10 text-center text-foreground/50">
          Product details not found in our database. Check back soon.
        </p>
      </div>
    );
  }

  const priceDisplay =
    product.price != null
      ? `${cc.currencySymbol}${product.price.toFixed(2)}`
      : null;

  /* Parse extra specs from the data JSONB field */
  const specs: { label: string; value: string }[] = [];
  if (product.data) {
    const d = product.data;
    for (const [key, val] of Object.entries(d)) {
      if (val != null && typeof val !== "object") {
        specs.push({
          label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: String(val),
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}/best`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Best {slugLabel(product.category || slug)} in {cc.name}
      </Link>

      {/* Hero section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        {product.image_url && (
          <div className="flex items-center justify-center rounded border border-line bg-white p-6">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-80 max-w-full object-contain"
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating != null && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl text-yellow-500">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span className="text-lg font-semibold">
                {product.rating.toFixed(1)}
              </span>
              {product.review_count != null && (
                <span className="text-foreground/60">
                  ({product.review_count} reviews)
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {priceDisplay && (
            <p className="mt-4 text-3xl font-bold text-brand">
              {priceDisplay}
            </p>
          )}

          {/* Buy buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {product.amazon_asin && (
              <a
                href={`https://${cc.amazonMarketplace}/dp/${product.amazon_asin}?tag=${cc.amazonTagCool}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-none bg-[#FF9900] px-6 py-3 text-sm font-bold text-white hover:brightness-110"
              >
                Buy on Amazon
              </a>
            )}
            {product.ebay_item_id && (
              <a
                href={`https://www.ebay.${cc.code === "uk" ? "co.uk" : cc.code}/itm/${product.ebay_item_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-none bg-[#E53238] px-6 py-3 text-sm font-bold text-white hover:brightness-110"
              >
                Buy on eBay
              </a>
            )}
          </div>

          {/* Retailer info */}
          <div className="mt-4 text-sm text-foreground/60">
            {product.amazon_asin && <p>Amazon ASIN: {product.amazon_asin}</p>}
            {product.ebay_item_id && <p>eBay Item ID: {product.ebay_item_id}</p>}
          </div>
        </div>
      </div>

      {/* Specs table */}
      {specs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Specifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {specs.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={i % 2 === 0 ? "bg-surface" : "bg-white/50"}
                  >
                    <td className="border border-line px-4 py-2 text-sm font-medium text-foreground/70">
                      {spec.label}
                    </td>
                    <td className="border border-line px-4 py-2 text-sm">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link
          href={`/${code}/best/${product.category || slug}`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          ← Back to Best {slugLabel(product.category || slug)}
        </Link>
      </div>
    </div>
  );
}
