import Link from "next/link";
import { getCountry } from "@/lib/countries";
import { getProducts } from "@/lib/catalog/products";
import { slugLabel } from "@/lib/catalog/contract";
import { wrapOfferUrl } from "@/lib/affiliate";
import { BuyButton } from "@/components/BuyButton";
import { StatusLed } from "@/components/StatusLed";
import { getReviewContent } from "@/lib/reviews";
import type { CatalogRow } from "@/lib/catalog/contract";
import type { StockStatus } from "@/lib/types";

export const revalidate = 3600;

function TopPicks({
  products,
  code,
  currencySymbol,
}: {
  products: CatalogRow[];
  code: string;
  currencySymbol: string;
}) {
  const top = products.slice(0, 3);
  if (!top.length) return null;
  const badges = ["Best overall", "Best value", "Best for large rooms"];
  return (
    <section className="mt-10 border border-line bg-surface">
      <div className="border-b border-line px-5 py-3">
        <p className="eyebrow text-foreground/50">Top 3 picks</p>
      </div>
      <div className="grid gap-0 md:grid-cols-3">
        {top.map((p, i) => {
          const amazon = p.data.offers.find((o) => o.retailer.id === "amazon");
          const href = amazon
            ? wrapOfferUrl(code, "amazon", amazon.url, p.data.amazon_asin)
            : `/${code}/p/${p.data.slug}`;
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-3 p-5 ${i < top.length - 1 ? "border-b border-line md:border-b-0 md:border-r" : ""}`}
            >
              <p className="eyebrow text-brand">{badges[i] || `Pick #${i + 1}`}</p>
              <h3 className="text-lg font-bold leading-snug">
                <Link href={`/${code}/p/${p.data.slug}`} className="hover:text-brand">
                  {p.data.name}
                </Link>
              </h3>
              <p className="tnum text-2xl font-bold text-brand">
                {currencySymbol}
                {(p.price ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-foreground/70 line-clamp-3">
                {p.data.editorial?.verdict || p.data.highlights.join(" · ")}
              </p>
              <BuyButton
                href={href}
                label="Check price"
                variant="amazon"
                country={code}
                productSlug={p.data.slug}
                retailerId="amazon"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CompareTable({
  products,
  code,
  currencySymbol,
}: {
  products: CatalogRow[];
  code: string;
  currencySymbol: string;
}) {
  if (!products.length) return null;
  return (
    <section className="mt-12 overflow-x-auto border border-line bg-surface">
      <div className="border-b border-line px-5 py-3">
        <p className="eyebrow text-foreground/50">Compare prices</p>
        <h2 className="text-xl font-bold">Amazon vs eBay at last check</h2>
      </div>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface-cool text-xs uppercase tracking-wider text-foreground/60">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Amazon</th>
            <th className="px-4 py-3 font-semibold">eBay</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
            <th className="px-4 py-3 font-semibold">Buy</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const amazon = p.data.offers.find((o) => o.retailer.id === "amazon");
            const ebay = p.data.offers.find((o) => o.retailer.id === "ebay");
            const amazonUrl = amazon
              ? wrapOfferUrl(code, "amazon", amazon.url, p.data.amazon_asin)
              : null;
            const ebayUrl = ebay
              ? wrapOfferUrl(code, "ebay", ebay.url, null, p.data.ebay_item_id)
              : null;
            return (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/${code}/p/${p.data.slug}`} className="hover:text-brand">
                    {p.data.name}
                  </Link>
                </td>
                <td className="px-4 py-3 tnum">{(p.data.rating ?? 0).toFixed(1)}</td>
                <td className="px-4 py-3 tnum">
                  {amazon ? `${currencySymbol}${amazon.price.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3 tnum">
                  {ebay ? `${currencySymbol}${ebay.price.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <StatusLed status={(p.stock_status || "in_stock") as StockStatus} showLabel={false} />
                    <span className="text-xs uppercase">{p.stock_status.replace(/_/g, " ")}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {amazonUrl && (
                      <BuyButton
                        href={amazonUrl}
                        label="Amazon"
                        variant="amazon"
                        country={code}
                        productSlug={p.data.slug}
                        retailerId="amazon"
                      />
                    )}
                    {ebayUrl && (
                      <BuyButton
                        href={ebayUrl}
                        label="eBay"
                        variant="ebay"
                        country={code}
                        productSlug={p.data.slug}
                        retailerId="ebay"
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-5 py-2 text-xs text-foreground/50">
        Prices at last check · we earn from qualifying purchases via Amazon Associates and eBay Partner Network
      </p>
    </section>
  );
}

export async function BestOfView({
  code,
  slug,
}: {
  code: string;
  slug: string;
}) {
  const cc = getCountry(code);
  const label = slugLabel(slug);
  const products = await getProducts(code, slug);
  const review = getReviewContent(code, slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <p className="eyebrow text-brand">Best of · {cc.code.toUpperCase()}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
        {review?.title || `Best ${label} in ${cc.name}`}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        {review?.intro?.[0] ||
          `Independent picks for ${cc.name} with Amazon and eBay prices baked from our catalog. Updated on rebuild — not regenerated by AI on each visit.`}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#compare" className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110">
          Jump to comparison
        </a>
        <Link
          href={`/${code}/tools/btu-calculator`}
          className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
        >
          BTU calculator
        </Link>
      </div>

      <TopPicks products={products} code={code} currencySymbol={cc.currencySymbol} />

      <div id="compare">
        <CompareTable products={products} code={code} currencySymbol={cc.currencySymbol} />
      </div>

      {products.length === 0 && (
        <p className="mt-10 border border-line bg-surface p-8 text-foreground/60">
          No products seeded for this category yet. Catalog lives in Supabase / offline seeds.
        </p>
      )}

      <section className="mt-14 space-y-8">
        {products.map((p) => {
          const amazon = p.data.offers.find((o) => o.retailer.id === "amazon");
          const ebay = p.data.offers.find((o) => o.retailer.id === "ebay");
          return (
            <article key={p.id} className="border border-line bg-surface p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    <Link href={`/${code}/p/${p.data.slug}`} className="hover:text-brand">
                      {p.data.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-foreground/60">{p.data.brand}</p>
                </div>
                <p className="tnum text-2xl font-bold text-brand">
                  {cc.currencySymbol}
                  {(p.price ?? 0).toFixed(2)}
                </p>
              </div>
              <p className="mt-4 text-foreground/80">
                {p.data.editorial?.verdict || p.data.highlights.join(" · ")}
              </p>
              {(p.data.editorial?.pros?.length || p.data.editorial?.cons?.length) && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="eyebrow mb-2 text-instock">Pros</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {(p.data.editorial?.pros || []).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow mb-2 text-sold">Cons</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {(p.data.editorial?.cons || []).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {amazon && (
                  <BuyButton
                    href={wrapOfferUrl(code, "amazon", amazon.url, p.data.amazon_asin)}
                    label={`Amazon ${cc.currencySymbol}${amazon.price.toFixed(2)}`}
                    variant="amazon"
                    country={code}
                    productSlug={p.data.slug}
                    retailerId="amazon"
                  />
                )}
                {ebay && (
                  <BuyButton
                    href={wrapOfferUrl(code, "ebay", ebay.url, null, p.data.ebay_item_id)}
                    label={`eBay ${cc.currencySymbol}${ebay.price.toFixed(2)}`}
                    variant="ebay"
                    country={code}
                    productSlug={p.data.slug}
                    retailerId="ebay"
                  />
                )}
              </div>
            </article>
          );
        })}
      </section>

      {review?.buyingGuide && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">Buying guide</h2>
          {review.buyingGuide.map((p) => (
            <p key={p.slice(0, 24)} className="mt-3 text-foreground/75">
              {p}
            </p>
          ))}
        </section>
      )}

      {review?.faq && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-6 space-y-4">
            {review.faq.map((f) => (
              <details key={f.question} className="border border-line bg-surface p-4">
                <summary className="cursor-pointer font-semibold">{f.question}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="text-xl font-bold">How we compare</h2>
        <p className="mt-3 text-foreground/70">
          Specs, verified customer feedback, and catalog prices from Amazon and eBay. We are not paid for positive
          reviews — income is affiliate commission only, at no extra cost to you.
        </p>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Best ${label} in ${cc.name}`,
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://comparethecool.com/${code}/p/${p.data.slug}`,
              name: p.data.name,
            })),
          }),
        }}
      />
      {review?.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: review.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
