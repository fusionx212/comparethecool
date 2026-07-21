"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { getGermanReview, type GermanReviewData } from "@/lib/reviews/de-reviews";

interface ProductRecord {
  id: number;
  slug: string;
  name: string;
  category: string;
  country_code: string;
  image_url: string | null;
  price: number | null;
  currency: string | null;
  retailer: string | null;
  amazon_asin: string | null;
  ebay_item_id: string | null;
  rating: number | null;
  review_count: number | null;
  data: Record<string, unknown> | null;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("★");
    else stars.push("☆");
  }
  return (
    <span className="text-xl tracking-tighter" style={{ color: "#eab308" }}>
      {stars.join("")}
      <span className="ml-1.5 text-sm font-bold text-foreground/70">{rating.toFixed(1)}</span>
    </span>
  );
}

function slugLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BestReviewPageClient({
  params: paramsPromise,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const [{ country: code, slug }, setParams] = useState<{ country: string; slug: string }>({ country: "", slug: "" });
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!code || !slug) return;

    if (code === "de") {
      supabase
        .from("ctc_products")
        .select("*")
        .eq("country_code", "de")
        .or(`category.eq.${slug},slug.eq.${slug}`)
        .order("rating", { ascending: false })
        .then(({ data, error }) => {
          if (error) console.error("Supabase fetch error:", error);
          setProducts((data ?? []) as ProductRecord[]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [code, slug]);

  const cc = getCountry(code);
  const review = getGermanReview(slug);
  const label = slugLabel(slug);

  // Fallback for UK / other countries or categories without review data
  if (!review || code !== "de") {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12">
        <Link
          href={`/${code}`}
          className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
        >
          ← Back to {cc.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Best {label} in {cc.name}
        </h1>
        <p className="mt-3 max-w-3xl text-foreground/70">
          We&apos;ve researched and compared the top {label.toLowerCase()} available in {cc.name}.
          Prices are checked live — tap any product to see today&apos;s best deal across retailers.
        </p>
        <div className="mt-10 grid gap-6">
          <p className="py-10 text-center text-foreground/50">
            Product data loading from our database. Check back soon for live prices on Amazon {cc.amazonMarketplace.replace("www.", "")} and eBay.
          </p>
        </div>

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-xl font-bold">How We Test & Compare</h2>
          <p className="mt-3 text-foreground/70">
            Our reviews are independent and data-driven. We analyse specifications, read verified customer feedback,
            and track live prices across retailers to find you the best value. We are not paid for positive reviews —
            every product is judged on its merits.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="text-xl font-bold">About This Guide</h2>
          <p className="mt-3 text-foreground/70">
            This guide was created specifically for shoppers in {cc.name}. Prices shown are in {cc.currency}
            and we link to {cc.amazonMarketplace} and eBay {cc.name} for your convenience.
            As an Amazon Associate and eBay Partner we earn from qualifying purchases.
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Breadcrumb */}
      <Link href={`/${code}`} className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand">
        ← {cc.name}
      </Link>

      {/* Title */}
      <div className="border-b border-line pb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{review.title}</h1>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-foreground/70">
          {review.intro[0].substring(0, 200)}…
        </p>
      </div>

      {/* ── Editorial Intro ── */}
      <section className="mt-10">
        {review.intro.map((p, i) => (
          <p key={i} className="mt-4 max-w-4xl text-base leading-relaxed text-foreground/80 first:mt-0">
            {p}
          </p>
        ))}
      </section>

      {/* ── Top 3 Picks ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Unsere Top 3 Empfehlungen</h2>
        <p className="mt-2 text-foreground/60">Nach intensiven Tests und Vergleichen haben wir die drei besten Produkte für Sie ausgewählt.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {review.topPicks.map((pick) => {
            const prizeColors = ["bg-yellow-500 text-black", "bg-gray-300 text-black", "bg-amber-600 text-white"];
            return (
              <div key={pick.rank} className="border border-line bg-surface p-6">
                <span className={`eyebrow inline-block px-2 py-1 text-xs font-bold ${prizeColors[pick.rank - 1]}`}>
                  Platz {pick.rank}
                </span>
                <h3 className="mt-3 text-lg font-bold">{pick.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{pick.reason}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Produktvergleich</h2>
        <p className="mt-2 text-foreground/60">Alle wichtigen Daten auf einen Blick.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="border border-line p-3 font-bold">Produkt</th>
                {review.products[0]?.keySpecs.map((spec) => (
                  <th key={spec.label} className="border border-line p-3 font-bold">{spec.label}</th>
                ))}
                <th className="border border-line p-3 font-bold">Preis</th>
                <th className="border border-line p-3 font-bold">Bewertung</th>
              </tr>
            </thead>
            <tbody>
              {review.products.map((rp, idx) => {
                const dbProduct = products.find((p) => p.slug === rp.slug);
                return (
                  <tr key={rp.slug} className={idx % 2 === 0 ? "bg-surface/50" : "bg-white/50"}>
                    <td className="border border-line p-3 font-semibold">{rp.name}</td>
                    {rp.keySpecs.map((spec) => (
                      <td key={spec.label} className="border border-line p-3 text-foreground/70">{spec.value}</td>
                    ))}
                    <td className="border border-line p-3 tnum font-medium text-brand">
                      {dbProduct?.price != null
                        ? `${cc.currencySymbol}${dbProduct.price.toFixed(2)}`
                        : rp.price}
                    </td>
                    <td className="border border-line p-3"><StarRating rating={rp.rating} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          *Preise können variieren. Aktuelle Preise auf Amazon.de und eBay.de prüfen.
        </p>
      </section>

      {/* ── Product Spotlights ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">Produkte im Detail</h2>

        {review.products.map((rp, idx) => (
          <div key={rp.slug} className="mb-10 border border-line bg-surface p-6 last:mb-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{rp.name}</h3>
                <div className="mt-1">
                  <StarRating rating={rp.rating} />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="eyebrow text-instock">Vorteile</h4>
                    <ul className="mt-2 space-y-1.5">
                      {rp.pros.map((pro, pi) => (
                        <li key={pi} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-0.5 text-instock">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="eyebrow text-sold">Nachteile</h4>
                    <ul className="mt-2 space-y-1.5">
                      {rp.cons.map((con, ci) => (
                        <li key={ci} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-0.5 text-sold">−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <h4 className="eyebrow mb-2 text-brand">Unser Urteil</h4>
                  <p className="text-sm leading-relaxed text-foreground/80">{rp.verdict}</p>
                </div>
              </div>

              <div className="w-full shrink-0 md:w-64">
                <div className="border border-line bg-white/50 p-4">
                  <h4 className="eyebrow mb-3 text-foreground/60">Technische Daten</h4>
                  <div className="space-y-2">
                    {rp.keySpecs.map((spec) => (
                      <div key={spec.label} className="text-xs">
                        <span className="block text-foreground/50">{spec.label}</span>
                        <span className="block font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 tnum text-lg font-bold text-brand">{rp.price}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Buying Guide ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Kaufberatung</h2>
        <p className="mt-2 text-foreground/60">Worauf Sie beim Kauf achten sollten – unsere Experten-Tipps.</p>
        <div className="mt-6 space-y-5">
          {review.buyingGuide.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/80">
              <span className="eyebrow mr-2 text-brand">0{i + 1}</span>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Häufig gestellte Fragen (FAQ)</h2>
        <div className="mt-6 space-y-0">
          {review.faq.map((item, i) => (
            <div key={i} className="border-b border-line py-5 last:border-0">
              <h3 className="text-base font-bold">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="mt-12 border-t border-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Methodik & Testverfahren</h2>
        <div className="mt-4 space-y-3">
          {review.methodology.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/70">{p}</p>
          ))}
        </div>
      </section>

      {/* ── Affiliate Disclosure ── */}
      <div className="mt-12 border-t border-line pt-6">
        <p className="text-xs leading-relaxed text-foreground/50">
          <strong>Affiliate-Offenlegung:</strong> Als Amazon-Partner und eBay-Partner verdienen wir an qualifizierten Verkäufen.
          Für Sie entstehen dadurch keine zusätzlichen Kosten. Alle Preise können abweichen – bitte prüfen Sie den aktuellen Preis auf der jeweiligen Webseite.
        </p>
      </div>

      {/* ── Back link ── */}
      <div className="mt-8">
        <Link
          href={`/${code}/blog`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          📰 Alle Ratgeber & Artikel
        </Link>
      </div>
    </div>
  );
}
