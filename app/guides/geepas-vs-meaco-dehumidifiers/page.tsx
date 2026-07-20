import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { outboundHref } from "@/lib/affiliate";
import type { Product, Offer } from "@/lib/types";

export const metadata: Metadata = {
  title: "Geepas vs Meaco Dehumidifiers — Budget vs Premium 2026",
  description:
    "Geepas dehumidifiers start at £90. Meaco starts at £140 and is Which? Best Buy. We compare extraction rates, noise, running costs and real owner reviews to help you pick.",
  alternates: { canonical: "/guides/geepas-vs-meaco-dehumidifiers" },
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

const geepas = SAMPLE_PRODUCTS.filter((p) => p.brand === "Geepas" && p.category === "dehumidifiers");
const meaco = SAMPLE_PRODUCTS.filter((p) => p.brand === "Meaco" && p.category === "dehumidifiers");

export default function GeepasVsMeacoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Geepas vs Meaco Dehumidifiers — Budget vs Premium 2026",
    description:
      "Side-by-side comparison of Geepas and Meaco dehumidifiers: price, extraction rate, noise, running costs, and which is right for your home.",
    publisher: { "@type": "Organization", name: "UK Air Con Tracker", url: BASE },
    datePublished: "2026-07-07",
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/dehumidifiers" className="hover:text-brand">Dehumidifiers</Link> / Geepas vs Meaco
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
        Geepas vs Meaco Dehumidifiers
      </h1>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand">
        Budget vs Premium — Which One Actually Dries Your House?
      </p>

      <p className="mt-5 text-base leading-relaxed text-foreground/75">
        Meaco is the UK&rsquo;s best-selling dehumidifier brand. Which? has given them Best Buy awards for years.
        Geepas is the new budget challenger — a 12L model for £90 when Meaco&rsquo;s equivalent is £140.
        But does cheaper mean worse? We put the numbers side by side so you can decide.
      </p>

      {/* ── The Contenders ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">The Contenders</h2>
      </div>

      {[geepas[0], geepas[1], meaco[0]].filter(Boolean).map((p, i) => (
        <ProductCard key={p!.id} product={p!} index={i} />
      ))}

      {/* ── Head-to-Head Table ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">Head-to-Head: Geepas 12L vs Meaco DD8L</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Comparing the entry-level 12L models — the most popular size for a 3-bed UK home.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-3 pr-4 font-semibold text-foreground/75">Feature</th>
                <th className="py-3 px-4 font-semibold text-brand">Geepas GDH21217UK</th>
                <th className="py-3 pl-4 font-semibold text-foreground/75">Meaco DD8L Zambezi</th>
              </tr>
            </thead>
            <tbody className="tnum">
              <TableRow label="Price" g="£89.99" m="£139.99" />
              <TableRow label="Extraction" g="12L / day" m="8L / day" />
              <TableRow label="Noise" g="~39 dB" m="39 dB" />
              <TableRow label="Tank capacity" g="2.0L" m="2.5L" />
              <TableRow label="Laundry mode" g="Yes" m="Yes" />
              <TableRow label="Continuous drain" g="Yes" m="Yes" />
              <TableRow label="Humidity sensor" g="Touchscreen" m="Digital" />
              <TableRow label="Timer" g="24h" m="24h" />
              <TableRow label="Warranty" g="2 years" m="2 years" />
              <TableRow label="Which? Best Buy" g="—" m="Yes ✓" />
              <TableRow label="Energy rating" g="Not rated" m="A-rated" />
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Verdict ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">The Verdict</h2>

        <div className="mt-6 space-y-6">
          <div className="border-l-4 border-instocks px-4">
            <h3 className="font-semibold text-instocks">Buy the Geepas if&hellip;</h3>
            <ul className="mt-2 space-y-1 text-sm text-foreground/70">
              <li>• You want the lowest upfront cost — £90 vs £140</li>
              <li>• You need higher daily extraction — 12L beats 8L for larger homes</li>
              <li>• You&rsquo;re buying your first dehumidifier and don&rsquo;t want to overspend</li>
              <li>• Free next-day delivery matters to you</li>
            </ul>
            {geepas[0] && (
              <ProductBuy productSlug={geepas[0].slug} offer={geepas[0].offers[0]} />
            )}
          </div>

          <div className="border-l-4 border-line-strong px-4">
            <h3 className="font-semibold text-foreground">Buy the Meaco if&hellip;</h3>
            <ul className="mt-2 space-y-1 text-sm text-foreground/70">
              <li>• You want a Which? Best Buy with years of proven reliability</li>
              <li>• You need it to work below 10°C — desiccant tech handles unheated rooms</li>
              <li>• Energy efficiency matters — Meaco is A-rated, Geepas is unrated</li>
              <li>• You&rsquo;re in a 5-bed home — the DD8L scales up</li>
            </ul>
            {meaco[0] && (
              <ProductBuy productSlug={meaco[0].slug} offer={meaco[0].offers[0]} />
            )}
          </div>
        </div>
      </div>

      {/* ── Running Costs ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">Running Costs</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Based on 6 hours daily use at the October 2026 energy price cap (24.5p/kWh).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm tnum">
          <div className="border border-line p-4">
            <span className="text-foreground/45">Geepas 12L (210W)</span>
            <div className="mt-1 text-lg font-bold text-foreground">~£0.31/day</div>
            <span className="text-xs text-foreground/45">~£9.30/month</span>
          </div>
          <div className="border border-line p-4">
            <span className="text-foreground/45">Meaco DD8L (330W desiccant)</span>
            <div className="mt-1 text-lg font-bold text-foreground">~£0.49/day</div>
            <span className="text-xs text-foreground/45">~£14.70/month</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          Desiccant dehumidifiers use more power but work in colder rooms (garages, conservatories, unheated basements).
          Compressor models (Geepas) are cheaper to run but lose efficiency below 15°C.
        </p>
      </div>

      {/* ── Bottom Line ── */}
      <div className="mt-10 border-t-2 border-line-strong pt-8">
        <h2 className="text-xl font-bold tracking-tight">Bottom Line</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          The Geepas 12L is a legitimate budget alternative that extracts <em>more</em> water per day
          than the Meaco while costing £50 less upfront and £5 less per month to run. It lacks the
          Which? badge and the cold-room desiccant tech, but for a standard 3-bed UK home with
          central heating, it does the job.
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          The Meaco DD8L is the safer bet if your damp room is unheated (garage, basement, spare bedroom)
          or if you want the peace of mind of the UK&rsquo;s most-awarded dehumidifier brand. It costs
          more but it&rsquo;s a known quantity.
        </p>
      </div>

      {/* ── See also ── */}
      <div className="mt-10 border-t border-line pt-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-foreground/45">See also</p>
        <div className="mt-3 space-y-2">
          <Link href="/dehumidifiers" className="block text-sm text-brand hover:underline">
            → All dehumidifiers — live stock &amp; prices
          </Link>
          <Link href="/guides/best-oil-radiators-under-50" className="block text-sm text-brand hover:underline">
            → Best Oil-Filled Radiators Under £50 — 2026 Winter Prep
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
        >
          ← Back to the tracker
        </Link>
      </div>
    </div>
  );
}

function TableRow({ label, g, m }: { label: string; g: string; m: string }) {
  return (
    <tr className="border-b border-line/50">
      <td className="py-2.5 pr-4 text-foreground/65">{label}</td>
      <td className="py-2.5 px-4 font-semibold text-brand">{g}</td>
      <td className="py-2.5 pl-4 text-foreground/75">{m}</td>
    </tr>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const offer = product.offers[0];
  const statusColor =
    offer?.status === "in_stock" ? "text-instocks" :
    offer?.status === "low_stock" ? "text-low" : "text-sold";

  return (
    <div className="mt-6 border border-line">
      <div className="flex items-start gap-4 p-4">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-24 flex-shrink-0 object-contain"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/35">
              {index === 0 ? "Budget Pick" : index === 1 ? "Also from Geepas" : "Premium Pick"}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold leading-tight">{product.name}</h3>
          <ul className="mt-2 space-y-0.5">
            {product.highlights.map((h, i) => (
              <li key={i} className="text-xs text-foreground/60">• {h}</li>
            ))}
          </ul>
          {offer && (
            <div className="mt-3 flex items-center gap-3">
              <span className="tnum text-lg font-bold text-foreground">£{offer.price.toFixed(2)}</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                {offer.status === "low_stock" ? `Only ${offer.stockQuantity} left` : "In Stock"}
              </span>
              <ProductBuy productSlug={product.slug} offer={offer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductBuy({ productSlug, offer }: { productSlug: string; offer: Offer }) {
  const buyable = offer.status === "in_stock" || offer.status === "low_stock";
  if (!buyable) return null;
  return (
    <a
      href={outboundHref(productSlug, offer)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="ml-auto flex-shrink-0 border border-foreground bg-foreground px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:border-brand hover:bg-brand"
    >
      {offer.retailer.id === "ebay" ? "View on eBay →" : "View Deal →"}
    </a>
  );
}
