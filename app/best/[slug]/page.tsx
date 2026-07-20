import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BEST_OF_PAGES,
  getBestOfPage,
  getProductsForPage,
} from "@/lib/best-of-data";
import { isAnyInStock, bestOffer } from "@/lib/data";
import { gbp } from "@/lib/format";
import { ProductTable } from "@/components/ProductTable";
import { FaqSection } from "@/components/FaqSection";
import { CrossSellStrip } from "@/components/CrossSellWidget";
import type { Faq } from "@/lib/seo-copy";

export const dynamic = "force-dynamic"; // live Supabase data, no static build

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getBestOfPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    keywords: page.targetKeywords.join(", "),
    alternates: { canonical: `/best/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://ukaircontracker.co.uk/best/${page.slug}`,
      type: "article",
    },
  };
}

export default async function BestOfPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getBestOfPage(slug);
  if (!page) notFound();

  const now = new Date();
  const products = await getProductsForPage(page);
  const inStock = products.filter(isAnyInStock);
  const sorted = [...products].sort(
    (a, b) => Number(isAnyInStock(b)) - Number(isAnyInStock(a)),
  );
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

  // Dynamically build FAQs from live data
  const faqs: Faq[] = [
    {
      q: `What's the best ${page.categoryFilter ? page.categoryFilter.replace(/-/g, " ") : "cooling unit"} to buy right now?`,
      a:
        inStock.length > 0
          ? `Right now, ${inStock.length} of ${products.length} units we track are in stock. ${
              (() => {
                const top = inStock
                  .map((p) => ({ p, o: bestOffer(p)! }))
                  .sort((a, b) => a.o.price - b.o.price);
                if (!top.length) return "";
                return `The cheapest in-stock option is the ${top[0].p.name} at ${gbp(top[0].o.price)} from ${top[0].o.retailer.name}.`;
              })()
            } Prices and stock change throughout the day — the table below is live.`
          : `All ${products.length} units we track are currently sold out across UK retailers. This is common whenever demand spikes. Set a restock alert and we'll email you the moment stock returns.`,
    },
    {
      q: "How often are these prices updated?",
      a: `We check every retailer multiple times per day. The table shows the most recent check time for each offer. During hot weather we increase the check frequency as stock moves fastest then. Last full sweep: ${new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/London" }).format(now)}.`,
    },
    {
      q: "Are these affiliate links?",
      a: "Yes — when you click through and buy from a retailer, we may earn a small commission at no extra cost to you. This is how the site stays free and ad-free. We also link to our own products (contract templates, childminder policies) where relevant — those go directly to our Stripe checkout. Full details on our disclosure page.",
    },
  ];

  if (page.categoryFilter === "portable-air-conditioners" || page.categoryFilter === "dehumidifiers") {
    faqs.push({
      q: page.categoryFilter === "portable-air-conditioners"
        ? "Do I need planning permission for a portable air conditioner?"
        : "Will a dehumidifier help with condensation?",
      a: page.categoryFilter === "portable-air-conditioners"
        ? "No — portable air conditioners don't require planning permission in the UK. They vent through a window kit (included with most units) rather than being permanently installed. The only exception is if you're in a listed building or conservation area — check with your local council."
        : "Yes, a dehumidifier is one of the most effective ways to reduce condensation on windows and walls. It pulls moisture from the air before it can settle on cold surfaces. For a typical UK home, a 10-litre/day desiccant dehumidifier (like the Meaco DD8L) placed centrally can eliminate window condensation within 24-48 hours.",
    });
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: `${baseUrl}/best/${page.slug}`,
    datePublished: "2026-07-04",
    dateModified: now.toISOString().slice(0, 10),
    publisher: {
      "@type": "Organization",
      name: "UK Air Con Tracker",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      name: page.title,
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/p/${p.slug}`,
        name: p.name,
      })),
    },
  };

  // FAQ schema (separate for Google rich results)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>{" "}
            / <Link href="/portable-air-conditioners" className="hover:text-brand">
              Cooling
            </Link>{" "}
            / Best of
          </nav>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/70">
            {page.description}
          </p>
          <p className="tnum mt-5 text-sm text-foreground/55">
            <span style={{ color: "var(--instock)" }}>{inStock.length}</span> of{" "}
            {products.length} in stock ·{" "}
            {[...new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.name)))].length}{" "}
            retailers tracked · updated{" "}
            {new Intl.DateTimeFormat("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/London",
            }).format(now)}
          </p>
        </div>
      </section>

      {/* Cross-sell to Dale product */}
      <CrossSellStrip target={page.crossSellSlot} />

      {/* Editorial sections */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          {page.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold tracking-tight">{s.heading}</h2>
              <p
                className="mt-3 text-sm leading-relaxed text-foreground/70"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="eyebrow text-brand-deep">Live comparison</div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              All {page.categoryFilter ? page.categoryFilter.replace(/-/g, " ") : "products"} — stock &amp; price
            </h2>
          </div>
        </div>
        <ProductTable
          products={sorted}
          showBtu={page.categoryFilter === "portable-air-conditioners"}
          now={now}
        />

        {/* Bottom CTA: restock alerts */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-foreground/70">
            These units sell out fast whenever demand spikes.{" "}
            <Link
              href="/alerts"
              className="font-semibold text-brand hover:underline"
            >
              Set a restock alert
            </Link>{" "}
            and we&rsquo;ll email you the moment a sold-out unit is back.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        faqs={faqs}
        heading="Buying guide FAQ"
      />
    </div>
  );
}
