import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandName, getProductsByBrand, isAnyInStock, bestOffer, BRAND_SLUGS } from "@/lib/data";
import { timeAgo, gbp } from "@/lib/format";
import { ProductTable } from "@/components/ProductTable";
import { AnswerLead } from "@/components/AnswerLead";
import { FaqSection } from "@/components/FaqSection";
import { brandStockCheckerAnswer, brandStockCheckerFaqs, freshestCheck } from "@/lib/seo-copy";
import { getCategory } from "@/lib/categories";

// ISR: track the 2-hourly stock cron so live counts/statuses don't freeze at deploy time.
export const revalidate = 7200;

// Single source of truth for brand slugs = lib/data BRAND_SLUGS (also drives the sitemap).
export function generateStaticParams() {
  return Object.keys(BRAND_SLUGS).map((brand) => ({ brand }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const name = getBrandName(brand);
  if (!name) return {};
  return {
    title: `${name} stock checker — live UK availability & prices`,
    description: `Check live ${name} stock in the UK. See which ${name} air conditioners, fans and dehumidifiers are in stock now, compare prices, and set restock alerts.`,
    alternates: { canonical: `/stock-checker/${brand}` },
  };
}

export default async function BrandStockCheckerPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const brandName = getBrandName(brand);
  if (!brandName) notFound();

  const now = new Date();
  const products = await getProductsByBrand(brandName);
  if (!products.length) notFound();

  const inStock = products.filter(isAnyInStock);
  const sorted = [...products].sort((a, b) => Number(isAnyInStock(b)) - Number(isAnyInStock(a)));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

  // Freshest check across all products
  const globalChecked = products.reduce(
    (latest, p) => (freshestCheck(p) > latest ? freshestCheck(p) : latest),
    "1970-01-01T00:00:00Z",
  );

  const cheapestInStock = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brandName} stock checker — live UK availability`,
    description: `Live stock and prices for ${brandName} cooling products across UK retailers.`,
    url: `${baseUrl}/stock-checker/${brand}`,
    numberOfItems: products.length,
    dateModified: globalChecked,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/back-in-stock/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / {brandName} stock checker
          </nav>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            {brandName} stock checker
          </h1>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">
            Live UK stock and prices for {products.length} {brandName} product{products.length === 1 ? "" : "s"}.
            See what&rsquo;s in stock right now and where to buy.
          </p>
          <p className="tnum mt-6 text-sm text-foreground/55">
            <span style={{ color: "var(--instock)" }}>{inStock.length}</span> of {products.length}{" "}
            currently in stock across UK retailers
            <span className="text-foreground/35">
              {" "}· updated {timeAgo(globalChecked, now)}
            </span>
          </p>

          <div className="mt-6 max-w-2xl">
            <AnswerLead>{brandStockCheckerAnswer(brandName, products, now)}</AnswerLead>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <ProductTable products={sorted} showBtu={true} now={now} />

        {/* Brand-specific context */}
        {cheapestInStock && isAnyInStock(cheapestInStock.p) && (
          <div className="mt-8 border border-line bg-surface p-6">
            <div className="eyebrow text-brand-deep">Best-value {brandName} right now</div>
            <p className="mt-2 text-sm text-foreground/70">
              The cheapest in-stock {brandName} is the{" "}
              <Link href={`/p/${cheapestInStock.p.slug}`} className="text-brand hover:underline">
                {cheapestInStock.p.name}
              </Link>{" "}
              at {gbp(cheapestInStock.o.price)} from {cheapestInStock.o.retailer.name}.
            </p>
          </div>
        )}

        {/* Crosslinks */}
        <div className="mt-10 border-t border-line pt-8">
          <div className="eyebrow text-foreground/50">Related pages</div>
          <div className="mt-3 flex flex-wrap gap-4">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/back-in-stock/${p.slug}`}
                className="text-sm text-brand hover:underline"
              >
                When will the {p.name} be back in stock?
              </Link>
            ))}
            <Link href="/alerts" className="text-sm text-brand hover:underline">
              All restock alerts
            </Link>
          </div>
        </div>

        <FaqSection faqs={brandStockCheckerFaqs(brandName, products, now)} heading={`${brandName} — stock questions`} />
      </section>
    </div>
  );
}
