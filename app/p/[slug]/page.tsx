import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getProductsByCategory, lowestPrice, isAnyInStock, bestOffer, EARNING_RETAILERS } from "@/lib/data";
import { getCategory } from "@/lib/categories";
import { gbp, timeAgo, STATUS_LABEL, safeDeliveryNote } from "@/lib/format";
import { StatusLed } from "@/components/StatusLed";
import { BuyLink } from "@/components/BuyLink";
import { ProductImage } from "@/components/ProductImage";
import { AnswerLead } from "@/components/AnswerLead";
import { FaqSection } from "@/components/FaqSection";
import { productAnswerLead, productFaqs, freshestCheck } from "@/lib/seo-copy";
import { CrossSellStrip } from "@/components/CrossSellWidget";
import { EditorialReview } from "@/components/EditorialReview";
import { InstallationCTA } from "@/components/InstallationCTA";
import { outboundHref } from "@/lib/affiliate";
import { ToolStrip } from "@/components/ToolStrip";
import { EbayOffers } from "@/components/EbayOffers";
import { BEST_OF_PAGES } from "@/lib/best-of-data";
import type { CrossSellTarget } from "@/lib/best-of-data";

function getCrossSellForCategory(category: string): CrossSellTarget | undefined {
  // Map product categories to Dale-owned products
  const map: Record<string, CrossSellTarget> = {
    "portable-air-conditioners": {
      productName: "Holiday Let Agreement Template",
      url: "https://holidayletcontracts.co.uk",
      price: "£29/yr",
      why: "If you're buying AC for a property, get the legal paperwork sorted — autofilled contracts in 5 minutes.",
      siteName: "HolidayLetContracts",
    },
    "tower-fans": {
      productName: "Cleaning Contract Template",
      url: "https://cleanercontracts.co.uk",
      price: "£29/yr",
      why: "Running a cleaning business? Client contracts, quote templates and key holding agreements — autofilled.",
      siteName: "CleanerContracts",
    },
    "dehumidifiers": {
      productName: "Policy & Play — Childminder Membership",
      url: "https://policyandplay.co.uk",
      price: "£14.99/mo",
      why: "Dehumidifiers keep nurseries mould-free. Childminders — get Ofsted-ready policies with Polly AI.",
      siteName: "Policy & Play",
    },
    "pedestal-fans": {
      productName: "Personal Training Contract Template",
      url: "https://ptdocuments.co.uk",
      price: "£29/yr",
      why: "Personal trainers — get your client contracts, PAR-Q forms and waivers sorted.",
      siteName: "PT Documents",
    },
  };
  return map[category];
}

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
  const low = lowestPrice(p);
  return {
    title: `${p.name} — price & stock`,
    description: `Live UK stock and prices for the ${p.name}${low ? ` from ${gbp(low)}` : ""}. Compare retailers and get a restock alert.`,
    alternates: { canonical: `/p/${p.slug}` },
  };
}

export const dynamic = "force-static";
export const revalidate = 120; // ISR: revalidate every 2 min for live stock/prices

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const now = new Date();
  const cat = getCategory(p.category);
  const low = lowestPrice(p);
  // Only show monetised retailers. Was hardcoded to amazon/ebay — silently
  // dropped every Hughes offer, so Hughes products (genuinely in stock)
  // showed as "sold out" with no buy button. Sort: buyable first, then by price.
  const offers = [...p.offers]
    .filter((o) => EARNING_RETAILERS.has(o.retailer.id))
    .sort((a, b) => {
      const aBuyable = a.status === "in_stock" || a.status === "low_stock";
      const bBuyable = b.status === "in_stock" || b.status === "low_stock";
      if (aBuyable !== bBuyable) return aBuyable ? -1 : 1;
      return a.price - b.price;
    });
  const buyable = offers.some((o) => o.status === "in_stock" || o.status === "low_stock");
  const checked = freshestCheck(p);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

  // When this unit isn't buyable, surface real in-stock alternatives from the
  // same category instead of just an alert signup — don't let the visitor bounce.
  const alternatives = buyable
    ? []
    : (await getProductsByCategory(p.category))
        .filter((alt) => alt.slug !== p.slug && isAnyInStock(alt))
        .map((alt) => ({ product: alt, offer: bestOffer(alt)! }))
        .sort((a, b) => a.offer.price - b.offer.price)
        .slice(0, 3);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: `Live UK stock and prices for the ${p.name}${low ? ` from ${gbp(low)}` : ""}. Compare across retailers and get restock alerts.`,
    url: `${baseUrl}/p/${p.slug}`,
    brand: { "@type": "Brand", name: p.brand },
    category: cat?.name,
    dateModified: checked,
  };

  // Individual Offer entries for each retailer
  const offerEntries = offers.map((o) => {
    const offerValidUntil = new Date(o.lastChecked);
    offerValidUntil.setDate(offerValidUntil.getDate() + 90);
    const entry: Record<string, unknown> = {
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: "GBP",
      priceValidUntil: offerValidUntil.toISOString().slice(0, 10),
      availability: o.status === "in_stock" || o.status === "low_stock"
        ? "https://schema.org/InStock"
        : o.status === "preorder"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: o.retailer.name },
    };
    if (o.stockQuantity) entry.inventoryLevel = o.stockQuantity;
    return entry;
  });

  if (offers.length > 1) {
    jsonLd.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: low,
      highPrice: Math.max(...offers.map((o) => o.price)),
      offerCount: offers.length,
      availability: buyable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      offers: offerEntries,
    };
  } else if (offers.length === 1) {
    jsonLd.offers = offerEntries[0];
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link>
        {cat && (
          <>
            {" / "}
            <Link href={`/${cat.slug}`} className="hover:text-brand">{cat.shortName}</Link>
          </>
        )}
        {" / "}
        {p.brand}
      </nav>

      {/* Tool strip: BTU calculator + handbook */}
      <ToolStrip />

      <div className="mt-5 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        {/* Left: identity + specs + offers */}
        <div>
          <div className="eyebrow text-brand-deep">{p.brand}</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{p.name}</h1>

          <div className="mt-4 flex items-center gap-4">
            <StatusLed status={offers.find(o => o.status === "in_stock" || o.status === "low_stock")?.status ?? bestOffer(p)?.status ?? "out_of_stock"} live />
            {low && (
              <span className="tnum text-sm text-foreground/60">
                from <span className="font-semibold text-foreground">{gbp(low)}</span>
              </span>
            )}
            <span className="tnum ml-auto text-xs text-foreground/35">
              Updated {timeAgo(checked, now)}
            </span>
          </div>

          <div className="mt-6">
            <AnswerLead>{productAnswerLead(p, now)}</AnswerLead>
          </div>

          {/* Hero CTA — prominent buy button. Was its own "prefer Amazon"
              computation, independent of the "Where to buy" table below —
              could disagree (hero shows Amazon while the table badges a
              cheaper eBay/Hughes offer "Best price" on the same page). Reads
              offers[0] instead: the exact same buyable-first/cheapest-sorted
              value the table's "Best price" badge is computed from, so the
              two can never contradict each other again. */}
          {buyable && (() => {
            const best = offers[0];
            if (!best) return null;
            return (
              <div className="mt-5">
                <a
                  href={outboundHref(p.slug, best)}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="flex w-full items-center justify-center gap-3 border-2 border-[var(--instock)] bg-[var(--instock)] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-[0.98] sm:text-base"
                >
                  <span>Buy from {best.retailer.name}</span>
                  <span className="tnum opacity-90">{gbp(best.price)}</span>
                  <span aria-hidden className="text-lg">→</span>
                </a>
                <p className="mt-2 text-center text-xs text-foreground/40">
                  We may earn a commission. Price confirmed {timeAgo(checked, now)}.
                </p>
              </div>
            );
          })()}

          {!buyable && (
            <div className="mt-6 border rule-strong bg-surface p-5">
              <div className="eyebrow text-brand-deep">Stock alert</div>
              <h2 className="mt-1 text-lg font-semibold">
                {p.name} is sold out
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Get notified the moment it comes back in stock.
              </p>
              <Link
                href={`/alerts?product=${encodeURIComponent(p.name)}`}
                className="mt-3 inline-block border border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep"
              >
                Set restock alert →
              </Link>

              {alternatives.length > 0 && (
                <>
                  <div className="mt-6 border-t border-line pt-6">
                    <div className="eyebrow text-brand-deep">In stock right now</div>
                    <h3 className="mt-1 text-base font-semibold">
                      Similar {cat?.shortName.toLowerCase() ?? "units"} available
                    </h3>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {alternatives.map(({ product: alt, offer }) => (
                      <Link
                        key={alt.slug}
                        href={`/p/${alt.slug}`}
                        className="block border border-line bg-background p-3 hover:border-brand"
                      >
                        <div className="eyebrow text-foreground/45">{alt.brand}</div>
                        <div className="mt-1 text-sm font-semibold leading-snug">{alt.name}</div>
                        <div className="tnum mt-2 text-sm font-bold text-brand">{gbp(offer.price)}</div>
                        {safeDeliveryNote(offer.deliveryNote) && (
                          <div className="mt-1 text-xs text-foreground/50">{safeDeliveryNote(offer.deliveryNote)}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <ul className="mt-6 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-foreground/80">
                <span className="led mt-1.5 flex-none" style={{ backgroundColor: "var(--brand)" }} aria-hidden />
                {h}
              </li>
            ))}
          </ul>

          {/* spec strip */}
          <div className="mt-8 grid grid-cols-3 border-l border-t border-line">
            <Spec label="BTU" value={p.btu ? String(p.btu) : "—"} />
            <Spec label="Room" value={p.coverageM2 ? `${p.coverageM2}m²` : "—"} />
            <Spec label="Noise" value={p.noise ? `${p.noise}dB` : "—"} />
          </div>

          {/* offers table — buy buttons FIRST, before editorial content */}
          <h2 className="mt-10 text-lg font-semibold">Where to buy</h2>
          <div className="mt-3 border rule-strong bg-surface">
            {/* Mobile: card layout. Desktop: table. */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b rule-strong text-left">
                    <th className="eyebrow px-4 py-3 font-semibold w-[30%]">Retailer</th>
                    <th className="eyebrow px-4 py-3 text-right font-semibold w-[15%]">Price</th>
                    <th className="eyebrow px-4 py-3 text-right font-semibold hidden md:table-cell w-[15%]">Checked</th>
                    <th className="eyebrow px-4 py-3 text-right font-semibold w-[40%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o, i) => {
                    const buyable = o.status === "in_stock" || o.status === "low_stock";
                    const isBest = buyable && i === offers.findIndex(off => off.status === "in_stock" || off.status === "low_stock");
                    return (
                      <tr
                        key={o.retailer.id}
                        className={`border-b border-line last:border-b-0 ${
                          buyable ? "bg-[color-mix(in_srgb,var(--instock)_6%,transparent)]" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{o.retailer.name}</span>
                            {isBest && (
                              <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--instock)_15%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--instock)" }}>
                                Best price
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5">
                            <span className="text-xs" style={{ color: `var(--${buyable ? "instock" : o.status === "preorder" ? "drop" : "sold"})` }}>
                              {STATUS_LABEL[o.status]}
                            </span>
                            {safeDeliveryNote(o.deliveryNote) && (
                              <span className="ml-2 text-xs text-foreground/40">{safeDeliveryNote(o.deliveryNote)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right tnum">
                          <span className="text-lg font-bold">{gbp(o.price)}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right tnum text-foreground/45 hidden md:table-cell">
                          {timeAgo(o.lastChecked, now)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <BuyLink
                            productSlug={p.slug}
                            offer={o}
                            label={buyable ? (o.retailer.id === "ebay" ? "View on eBay" : "View deal") : undefined}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <EbayOffers productName={p.name} referencePrice={low} />
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="sm:hidden divide-y divide-line">
              {offers.map((o, i) => {
                const buyable = o.status === "in_stock" || o.status === "low_stock";
                const isBest = buyable && i === offers.findIndex(off => off.status === "in_stock" || off.status === "low_stock");
                return (
                  <div
                    key={o.retailer.id}
                    className={`p-4 ${buyable ? "bg-[color-mix(in_srgb,var(--instock)_6%,transparent)]" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{o.retailer.name}</span>
                        {isBest && (
                          <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--instock)_15%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--instock)" }}>
                            Best price
                          </span>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: `var(--${buyable ? "instock" : o.status === "preorder" ? "drop" : "sold"})` }}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <div>
                        <span className="tnum text-2xl font-bold">{gbp(o.price)}</span>
                        {safeDeliveryNote(o.deliveryNote) && (
                          <div className="mt-0.5 text-xs text-foreground/45">{safeDeliveryNote(o.deliveryNote)}</div>
                        )}
                      </div>
                      <BuyLink
                        productSlug={p.slug}
                        offer={o}
                        label={buyable ? (o.retailer.id === "ebay" ? "View on eBay" : "View deal") : undefined}
                      />
                    </div>
                  </div>
                );
              })}
              <EbayOffers productName={p.name} referencePrice={low} />
            </div>
          </div>
          <p className="mt-3 text-xs text-foreground/50">
            We may earn a commission from these links, at no extra cost to you. Always confirm price
            and stock on the retailer&rsquo;s site before buying.
          </p>

          {/* Our verdict — editorial review BELOW the buy buttons */}
          <EditorialReview productId={p.id} />

          {/* Cross-sell to Dale product */}
          <div className="mt-6">
            <CrossSellStrip target={getCrossSellForCategory(p.category)} />
          </div>

          {/* Installation referral CTA — only for AC categories */}
          {(p.category === "portable-air-conditioners" || p.category === "air-con-units") && (
            <div className="mt-4">
              <InstallationCTA />
            </div>
          )}
        </div>

        {/* Right: image + restock alert + price history */}
        <aside>
          <ProductImage
            src={p.image}
            alt={p.name}
            category={p.category}
            className="mb-6 aspect-square w-full"
            glyphClassName="h-1/3 w-1/3"
          />
          <div className="border rule-strong bg-surface p-6">
            <div className="eyebrow text-brand-deep">{buyable ? "Track the price" : "Out of stock?"}</div>
            <h2 className="mt-2 text-lg font-semibold">
              {buyable ? "Get told if it sells out or drops" : "Get the restock alert"}
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              We&rsquo;ll email you the moment this unit comes back in stock or its price falls.
            </p>
            <Link
              href={`/alerts?product=${p.slug}`}
              className="mt-4 inline-block w-full border border-foreground bg-foreground px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
            >
              Set alert for this unit
            </Link>
            <Link
              href={`/back-in-stock/${p.slug}`}
              className="mt-3 block text-center text-xs text-foreground/50 hover:text-brand hover:underline"
            >
              When does this usually restock? →
            </Link>
          </div>

          {p.priceHistory && p.priceHistory.length > 1 && (
            <div className="mt-6 border border-line bg-surface p-6">
              <div className="eyebrow text-foreground/50">Price history</div>
              <ul className="mt-3 space-y-1.5">
                {p.priceHistory.map((pt) => (
                  <li key={pt.at} className="tnum flex justify-between text-sm">
                    <span className="text-foreground/50">{pt.at}</span>
                    <span className="font-medium">{gbp(pt.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <FaqSection faqs={productFaqs(p, now)} heading={`${p.name} — your questions`} />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-line bg-surface px-5 py-4">
      <div className="eyebrow text-foreground/50">{label}</div>
      <div className="tnum mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
