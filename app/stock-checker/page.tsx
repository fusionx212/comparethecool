import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, isAnyInStock, BRAND_SLUGS } from "@/lib/data";
import { AIRCON_CATEGORIES, CATEGORIES } from "@/lib/categories";
import { ProductTable } from "@/components/ProductTable";
import { AnswerLead } from "@/components/AnswerLead";
import { FaqSection } from "@/components/FaqSection";
import { stockCheckerHubAnswer, stockCheckerHubFaqs } from "@/lib/seo-copy";

// ISR: track the 2-hourly stock cron so live counts/statuses don't freeze at deploy time.
export const revalidate = 7200;

export const metadata: Metadata = {
  title: "Air Con Stock Checker — Live UK Stock & Prices, Every Retailer",
  description:
    "Free air con stock checker for the UK. See which portable air conditioners, fixed air con units and evaporative coolers are actually in stock right now, by brand or category, updated throughout the day.",
  alternates: { canonical: "/stock-checker" },
};

export default async function StockCheckerHubPage() {
  const now = new Date();
  const all = await getAllProducts();
  const products = all.filter((p) => AIRCON_CATEGORIES.has(p.category));
  const inStock = products.filter(isAnyInStock);
  const sorted = [...products].sort((a, b) => Number(isAnyInStock(b)) - Number(isAnyInStock(a)));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

  const airconCategories = CATEGORIES.filter((c) => AIRCON_CATEGORIES.has(c.slug) || c.slug === "evaporative-coolers");
  const brandSlugs = Object.keys(BRAND_SLUGS);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Air Con Stock Checker — Live UK Stock & Prices",
    description: "Live UK air con stock checker covering portable, fixed and evaporative units by brand and category.",
    url: `${baseUrl}/stock-checker`,
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
            <Link href="/" className="hover:text-brand">Home</Link> / Air Con Stock Checker
          </nav>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Air Con Stock Checker
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/70">
            Free live stock checker for air conditioning in the UK — portable AC, fixed air con units and evaporative coolers, checked across Amazon, eBay and more.
          </p>
          <p className="tnum mt-6 text-sm text-foreground/55">
            <span style={{ color: "var(--instock)" }}>{inStock.length}</span> of {products.length}{" "}
            air con units currently in stock · checked across UK retailers
          </p>
          <div className="mt-6 max-w-2xl">
            <AnswerLead>{stockCheckerHubAnswer(products, now)}</AnswerLead>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="eyebrow text-foreground/50">Browse by category</div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {airconCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="border border-line bg-surface p-5 hover:border-brand"
            >
              <div className="text-sm font-bold">{c.name}</div>
              <div className="mt-2 text-xs text-foreground/60">{c.blurb}</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 eyebrow text-foreground/50">Browse by brand</div>
        <div className="mt-4 flex flex-wrap gap-3">
          {brandSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/stock-checker/${slug}`}
              className="border border-line px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand"
            >
              {BRAND_SLUGS[slug]} stock checker
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <ProductTable products={sorted} showBtu={true} now={now} />
        </div>

        <FaqSection faqs={stockCheckerHubFaqs(products, now)} heading="Air con stock checker — common questions" />
      </section>
    </div>
  );
}
