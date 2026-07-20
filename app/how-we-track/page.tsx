import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "How we track stock & prices — our method",
  description:
    "How UK Air Con Tracker monitors fan and air-conditioning stock and prices across UK retailers: our data sources, update frequency, how we decide 'in stock', and our independence.",
  alternates: { canonical: "/how-we-track" },
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

export default function HowWeTrackPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "How UK Air Con Tracker tracks stock and prices",
    publisher: { "@type": "Organization", name: "UK Air Con Tracker", url: BASE },
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / How we track
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">How we track stock &amp; prices</h1>
      <p className="mt-5 text-base text-foreground/75">
        UK Air Con Tracker exists to answer one question accurately and fast: what cooling is
        actually buyable in the UK right now, and where it&rsquo;s cheapest. Here&rsquo;s exactly how
        we do it — so you (and the search engines that cite us) know the data is sound.
      </p>

      <div className="mt-10 space-y-8">
        <Method
          n="01"
          title="Where our data comes from"
          body="Stock status and prices are read from retailer product feeds via established UK affiliate networks, supplemented by direct availability checks on the highest-demand models. We track the major UK sellers — Amazon and eBay — across every cooling category."
        />
        <Method
          n="02"
          title="How often we update"
          body="During a heatwave, stock moves by the hour, so we re-check frequently and stamp every figure with the time it was last verified. Look for the 'checked' time on each unit — that timestamp is the whole point of a live tracker, and it's why we can be more current than a static buying guide."
        />
        <Method
          n="03"
          title="How we decide 'in stock'"
          body="A unit is marked in stock only when a retailer reports it as buyable now. Where a retailer publishes low stock levels, we flag it amber so you can move quickly. Sold-out units stay listed so you can set a restock alert rather than hunting for them again."
        />
        <Method
          n="04"
          title="How we make money — and why it doesn't bias the data"
          body="We earn an affiliate commission when you buy through our outbound links, at no extra cost to you. Commission never changes the order we show prices: the cheapest in-stock option is always shown as the cheapest. We don't sell anything ourselves and we aren't owned by any retailer."
        />
        <Method
          n="05"
          title="What we cover"
          body={`We track ${CATEGORIES.length} cooling categories: ${CATEGORIES.map((c) => c.name.toLowerCase()).join(", ")}. New models are added as they reach the UK market.`}
        />
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <p className="text-sm text-foreground/65">
          Spotted a price or stock status that looks wrong? Cooling stock changes fast — always
          confirm on the retailer&rsquo;s own site before buying, and the live figure there is the
          final word.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
        >
          ← Back to the tracker
        </Link>
      </div>
    </div>
  );
}

function Method({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 border-l border-line pl-5">
      <span className="tnum text-sm text-foreground/35">{n}</span>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{body}</p>
      </div>
    </div>
  );
}
