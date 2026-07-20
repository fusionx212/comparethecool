import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AIRCON_CATEGORIES, CATEGORIES, getCategory } from "@/lib/categories";
import { getProductsByCategory, isAnyInStock } from "@/lib/data";
import { timeAgo } from "@/lib/format";
import { ProductTable } from "@/components/ProductTable";
import { AnswerLead } from "@/components/AnswerLead";
import { FaqSection } from "@/components/FaqSection";
import { EbayCategoryStrip } from "@/components/EbayCategoryStrip";
import { LochCrossSell } from "@/components/LochCrossSell";
import { categoryAnswerLead, categoryFaqs } from "@/lib/seo-copy";

// ISR: refresh every 5 min so stock statuses don't lie about availability.
// Was 7200 (2h) — too slow for a live stock tracker.
export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  // "Air con" is the dominant UK short form for these two categories
  // specifically (see the query-cluster data behind this change) — the other
  // 21 categories don't get it, it'd be irrelevant keyword stuffing there.
  const airconAside = AIRCON_CATEGORIES.has(cat.slug) ? " Live air con stock checker, updated hourly." : "";
  return {
    title: `${cat.name} in stock — UK price tracker`,
    description: `Live ${cat.name.toLowerCase()} stock and prices across UK retailers.${airconAside} ${cat.blurb}`,
    alternates: { canonical: `/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const now = new Date();
  const products = await getProductsByCategory(cat.slug);
  const inStock = products.filter(isAnyInStock);
  const sorted = [...products].sort((a, b) => Number(isAnyInStock(b)) - Number(isAnyInStock(a)));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} in stock — UK price tracker`,
    description: cat.blurb,
    url: `${baseUrl}/${cat.slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/p/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / {cat.shortName}
          </nav>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            {cat.name} in stock
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/70">{cat.blurb}</p>
          <p className="tnum mt-6 text-sm text-foreground/55">
            <span style={{ color: "var(--instock)" }}>{inStock.length}</span> of {products.length}{" "}
            currently in stock · checked across UK retailers
            <span className="text-foreground/35">{" "}· updated {
              (() => {
                const latest = products.reduce((a, p) =>
                  p.offers.reduce((b, o) => (o.lastChecked > b ? o.lastChecked : b), a),
                  "1970-01-01T00:00:00Z"
                );
                return timeAgo(latest, now);
              })()
            }</span>
          </p>
          <div className="mt-6 max-w-2xl">
            <AnswerLead>{categoryAnswerLead(cat, products, now)}</AnswerLead>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        {products.length ? (
          <ProductTable products={sorted} showBtu={cat.btuRelevant} now={now} />
        ) : (
          <p className="border border-line bg-surface p-8 text-sm text-foreground/60">
            No units tracked in this category yet — the live feed populates this once connected.
          </p>
        )}

        {/* Buying context — original value for users + Google Ads compliance */}
        <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <div className="eyebrow text-brand-deep">Buying guide</div>
            <h2 className="mt-2 text-xl font-semibold">Who {cat.shortName.toLowerCase()} suit</h2>
            <p className="mt-3 text-sm text-foreground/70">
              {cat.btuRelevant
                ? "Match the BTU rating to your room. As a rule of thumb a standard room needs roughly 340 BTU per square metre — south-facing rooms and high ceilings need more. Undersized units run flat-out and never quite cool the space on the hottest days."
                : "Fans move air rather than chill it, so they cool you, not the room. They’re the sensible, low-cost, always-available choice — and the obvious fallback when portable air conditioning is sold out."}
            </p>
            {cat.btuRelevant && (
              <Link href="/tools/btu-calculator" className="eyebrow mt-4 inline-block text-brand hover:underline">
                Work out your BTU →
              </Link>
            )}
          </div>
          <div>
            <div className="eyebrow text-brand-deep">Stock moving fast?</div>
            <h2 className="mt-2 text-xl font-semibold">Get a restock alert</h2>
            <p className="mt-3 text-sm text-foreground/70">
              The best units sell out in hours whenever demand spikes. Set an alert and we email you
              the moment a sold-out model is buyable again.
            </p>
            <Link
              href="/alerts"
              className="mt-4 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
            >
              Set a restock alert
            </Link>
          </div>
        </div>

        <EbayCategoryStrip categoryName={cat.name} />

        <FaqSection faqs={categoryFaqs(cat, products, now)} heading={`${cat.name} — your questions`} />
      </section>

      <LochCrossSell />
    </div>
  );
}
