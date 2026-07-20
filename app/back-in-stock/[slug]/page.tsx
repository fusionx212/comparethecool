import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, bestOffer, isAnyInStock, getBrandSlug, EARNING_RETAILERS } from "@/lib/data";
import { getCategory } from "@/lib/categories";
import { gbp, timeAgo, STATUS_LABEL } from "@/lib/format";
import { StatusLed } from "@/components/StatusLed";
import { BuyLink } from "@/components/BuyLink";
import { AnswerLead } from "@/components/AnswerLead";
import { FaqSection } from "@/components/FaqSection";
import { backInStockAnswer, backInStockFaqs, freshestCheck } from "@/lib/seo-copy";

// ISR: track the 2-hourly stock cron so live counts/statuses don't freeze at deploy time.
export const revalidate = 7200;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: `When will the ${p.name} be back in stock in the UK?`,
    description: `Live stock check for the ${p.name}. See if it's available now across UK retailers, compare prices, and set a restock alert.`,
    alternates: { canonical: `/back-in-stock/${p.slug}` },
  };
}

export default async function BackInStockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const now = new Date();
  const cat = getCategory(p.category);
  // Data arriving here is already stripped to earning retailers upstream
  // (getProductBySlug -> getAllProducts -> stripNonEarningRetailers), so this
  // filter is defense-in-depth, not an active-bug fix — added for consistency
  // with app/p/[slug]/page.tsx's identical explicit filter.
  const offers = [...p.offers]
    .filter((o) => EARNING_RETAILERS.has(o.retailer.id))
    .sort((a, b) => a.price - b.price);
  const buyable = isAnyInStock(p);
  const checked = freshestCheck(p);
  const cheapestBuyable = offers.find((o) => o.status === "in_stock" || o.status === "low_stock");

  // No Product/Offer JSON-LD here — /p/[slug] already carries the canonical
  // Product+AggregateOffer schema for this exact product+offers. Duplicating
  // it on this page was two URLs both claiming to be the canonical schema.org
  // representation of the same entity, which is a real duplicate-content
  // signal (confirmed live: Google Search Console showed /back-in-stock/
  // pages as "Unknown to Google" while the matching /p/ page was indexed).
  // The FaqSection below still emits FAQPage schema — that content genuinely
  // differs page to page (restock-timing questions, not product questions).
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">

      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link>
        {cat && (
          <>
            {" / "}
            <Link href={`/${cat.slug}`} className="hover:text-brand">{cat.shortName}</Link>
          </>
        )}
        {" / "}
        Back in stock
      </nav>

      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
        When will the {p.name} be back in stock in the UK?
      </h1>

      <div className="mt-4 flex items-center gap-4">
        <StatusLed status={bestOffer(p)?.status ?? "out_of_stock"} live />
        {buyable && bestOffer(p) && (
          <span className="tnum text-sm text-foreground/60">
            from <span className="font-semibold text-foreground">{gbp(bestOffer(p)!.price)}</span>
          </span>
        )}
        <span className="tnum ml-auto text-xs text-foreground/35">
          Updated {timeAgo(checked, now)}
        </span>
      </div>

      <div className="mt-6">
        <AnswerLead>{backInStockAnswer(p, now)}</AnswerLead>
      </div>

      {/* Cheapest-offer callout — was a full offers table duplicating /p/[slug]'s
          "Where to buy" table (same retailers/prices/buy links). That literal
          overlap is very likely why Google folded these pages as near-duplicates
          (confirmed live: back-in-stock pages showed "Unknown to Google" while
          the matching /p/ page was indexed). Condensed to the one fact this
          page needs — is it back, and where cheapest — full comparison lives
          on /p/, linked below. */}
      <h2 className="mt-10 text-lg font-semibold">
        {buyable ? "It's back — cheapest right now" : "Last checked across retailers"}
      </h2>
      {buyable && cheapestBuyable ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border rule-strong bg-surface p-5">
          <div>
            <div className="font-medium">{cheapestBuyable.retailer.name}</div>
            <span className="eyebrow" style={{ color: "var(--instock)" }}>{STATUS_LABEL[cheapestBuyable.status]}</span>
          </div>
          <span className="tnum text-2xl font-bold">{gbp(cheapestBuyable.price)}</span>
          <BuyLink productSlug={p.slug} offer={cheapestBuyable} />
        </div>
      ) : (
        <div className="mt-3 border rule-strong bg-surface p-5">
          <p className="text-sm text-foreground/70">
            Checked {offers.length} retailer{offers.length === 1 ? "" : "s"} — all sold out as of {timeAgo(checked, now)}.
          </p>
        </div>
      )}
      <p className="mt-3 text-xs text-foreground/50">
        {buyable && "We may earn a commission from this link, at no extra cost to you. "}
        <Link href={`/p/${p.slug}`} className="text-brand hover:underline">Compare every retailer on the full product page →</Link>
      </p>

      {/* Product details */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="eyebrow text-brand-deep">About this product</div>
          <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
          <p className="mt-2 text-sm text-foreground/70">
            A {p.brand} cooling product{p.btu ? ` rated at ${p.btu.toLocaleString("en-GB")} BTU` : ""}
            {p.coverageM2 ? ` suitable for rooms up to ${p.coverageM2}m²` : ""}. Full specs, our verdict and every
            retailer on the <Link href={`/p/${p.slug}`} className="text-brand hover:underline">product page →</Link>
          </p>
        </div>
        <div>
          <div className="eyebrow text-brand-deep">Need it sooner?</div>
          <h2 className="mt-2 text-lg font-semibold">
            {buyable ? "Price might drop — set an alert" : "Get the restock alert"}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            {buyable
              ? `We'll email you if the ${p.name} drops in price or sells out so you never miss a deal.`
              : `We'll email you the moment this unit comes back in stock. During heatwaves, stock returns and sells out fast — our alert catches it before the rush.`}
          </p>
          <Link
            href={`/alerts?product=${p.slug}`}
            className="mt-4 inline-block border border-foreground bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
          >
            Set alert for this unit
          </Link>
        </div>
      </div>

      {/* Internal links */}
      <div className="mt-10 border-t border-line pt-8">
        <div className="eyebrow text-foreground/50">Related pages</div>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link href={`/p/${p.slug}`} className="text-sm text-brand hover:underline">
            {p.name} — full product page
          </Link>
          {cat && (
            <Link href={`/${cat.slug}`} className="text-sm text-brand hover:underline">
              Browse all {cat.name.toLowerCase()}
            </Link>
          )}
          {getBrandSlug(p.brand) && (
            <Link href={`/stock-checker/${getBrandSlug(p.brand)}`} className="text-sm text-brand hover:underline">
              {p.brand} stock checker
            </Link>
          )}
          <Link href="/alerts" className="text-sm text-brand hover:underline">
            All restock alerts
          </Link>
        </div>
      </div>

      <FaqSection faqs={backInStockFaqs(p, now)} heading={`${p.name} — stock questions`} />
    </div>
  );
}
