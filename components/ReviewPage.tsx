// Review page — "10 Best X" format with Amazon + eBay + digital upsells
// Universal template, localised per country

import Link from "next/link";
import type { ReviewPage, ReviewProduct, DigitalProduct } from "@/lib/reviews";
import type { CountryConfig } from "@/lib/countries";
import { FaqSection } from "@/components/FaqSection";
import { BuyButton } from "@/components/BuyButton";

export function ReviewPageTemplate({
  page,
  country,
  digitalProducts,
  daleProduct,
}: {
  page: ReviewPage;
  country: CountryConfig;
  digitalProducts: DigitalProduct[];
  daleProduct?: { name: string; price: string; url: string; why: string };
}) {
  const sym = country.currencySymbol;
  const top3 = page.products.slice(0, 3);
  const all = page.products;

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Compare the Cool</Link>
            {" / "}
            <Link href={`/${country.code}`} className="hover:text-brand">{country.name}</Link>
            {" / "}Reviews
          </nav>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">{page.intro}</p>
          <p className="tnum mt-4 text-sm text-foreground/50">
            Updated {page.updatedAt} · {all.length} products compared · {all.length} in-depth reviews
          </p>
        </div>
      </section>

      {/* ── AT-A-GLANCE TOP 3 ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-xl font-bold tracking-tight">{page.atAGlance}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {top3.map((p) => (
            <AtAGlanceCard key={p.slug} product={p} currency={sym} country={country.code} />
          ))}
        </div>
      </section>

      {/* ── FULL COMPARISON TABLE ───────────────────────── */}
      <section className="border-t rule-strong bg-surface-cool py-10">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-xl font-bold tracking-tight">All {all.length} compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b rule-strong text-left">
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Best for</th>
                  <th className="px-3 py-2 text-right">Amazon</th>
                  <th className="px-3 py-2 text-right">eBay</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {all.map((p) => (
                  <tr key={p.slug} className="border-b border-line hover:bg-surface">
                    <td className="px-3 py-3 font-bold">#{p.rank}</td>
                    <td className="px-3 py-3">
                      <Link href={`/p/${p.slug}`} className="font-medium hover:text-brand">
                        {p.name.slice(0, 50)}
                      </Link>
                      {p.award && (
                        <span className="ml-2 inline-block rounded bg-brand/10 px-2 py-0.5 text-xs text-brand">
                          {p.award}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}</td>
                    <td className="px-3 py-3 text-foreground/60 text-xs">{p.bestFor}</td>
                    <td className="px-3 py-3 text-right">
                      {p.amazonPrice ? (
                        <a href={p.amazonUrl} target="_blank" rel="nofollow sponsored" className="font-semibold text-brand hover:underline">
                          {sym}{p.amazonPrice}
                        </a>
                      ) : <span className="text-foreground/30">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {p.ebayPrice ? (
                        <a href={p.ebayUrl} target="_blank" rel="nofollow sponsored" className="font-semibold text-brand hover:underline">
                          {sym}{p.ebayPrice}
                        </a>
                      ) : <span className="text-foreground/30">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/p/${p.slug}`} className="text-xs font-bold uppercase text-brand hover:underline">
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── INDIVIDUAL REVIEWS ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-xl font-bold tracking-tight">In-depth reviews</h2>
        {all.map((p) => (
          <div key={p.slug} className="mt-8 border-t rule-strong pt-8">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <div>
                {p.image && (
                  <img src={p.image} alt={p.name} className="w-full rounded-lg border border-line" loading="lazy" />
                )}
                {p.award && (
                  <div className="mt-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                    🏆 {p.award}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  #{p.rank}. {p.name}
                </h3>
                <div className="mt-2 text-brand">{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}</div>
                
                {/* Pros & Cons */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-700">Pros</h4>
                    <ul className="mt-2 space-y-1">
                      {p.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-foreground/70">✓ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-600">Cons</h4>
                    <ul className="mt-2 space-y-1">
                      {p.cons.map((con, i) => (
                        <li key={i} className="text-sm text-foreground/70">✗ {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Verdict */}
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  <strong>Verdict:</strong> {p.verdict}
                </p>
                <p className="mt-1 text-xs text-foreground/50">Best for: {p.bestFor}</p>

                {/* Buy buttons — Amazon + eBay side by side */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {p.amazonPrice && p.amazonUrl && (
                    <a
                      href={p.amazonUrl}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
                    >
                      🅰️ {sym}{p.amazonPrice} at Amazon →
                    </a>
                  )}
                  {p.ebayPrice && p.ebayUrl && (
                    <a
                      href={p.ebayUrl}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      🅱️ {sym}{p.ebayPrice} on eBay →
                    </a>
                  )}
                  {!p.amazonPrice && !p.ebayPrice && (
                    <Link
                      href={`/alerts?product=${p.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
                    >
                      🔔 Alert me when in stock
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── DIGITAL UPSELLS ─────────────────────────────── */}
      {digitalProducts.length > 0 && (
        <section className="border-t rule-strong bg-brand/5 py-10">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-xl font-bold tracking-tight">Save money before you buy</h2>
            <p className="mt-2 text-sm text-foreground/60">These tools pay for themselves — literally</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {digitalProducts.map((dp) => (
                <div key={dp.id} className="rounded-xl border border-line bg-surface p-5">
                  <h3 className="font-bold">{dp.name}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{dp.description}</p>
                  <p className="mt-2 text-xs italic text-brand">{dp.whyNoBrainer}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold">{dp.price}</span>
                    <a
                      href={dp.stripeLink}
                      target="_blank"
                      rel="noopener"
                      className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                    >
                      Get Instant Access →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DALE PRODUCT CROSS-SELL ─────────────────────── */}
      {daleProduct && (
        <section className="border-t rule-strong bg-surface py-8">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground/40">Also from us</p>
            <p className="mt-2 text-sm text-foreground/70">
              <strong>{daleProduct.name}</strong> — {daleProduct.why}
            </p>
            <a
              href={daleProduct.url}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block rounded-lg border-2 border-brand px-6 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white transition-colors"
            >
              Learn more · from {daleProduct.price}
            </a>
          </div>
        </section>
      )}

      {/* ── BUYING GUIDE ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-xl font-bold tracking-tight">How to choose</h2>
        <div className="mt-4 space-y-4">
          {page.buyingGuide.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/70" dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </section>

      {/* ── METHODOLOGY ─────────────────────────────────── */}
      <section className="border-t rule-strong bg-surface-cool py-10">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-lg font-bold tracking-tight">How we test and compare</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">{page.methodology}</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FaqSection faqs={page.faq} heading="Frequently asked" />
    </div>
  );
}

// ── At-a-Glance Card Component ──────────────────────────────────────

function AtAGlanceCard({
  product,
  currency,
  country,
}: {
  product: ReviewProduct;
  currency: string;
  country: string;
}) {
  return (
    <div className="rounded-xl border-2 border-line bg-surface p-5 hover:border-brand/30 transition-colors">
      {product.award && (
        <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
          {product.award}
        </span>
      )}
      {product.image && (
        <div className="mt-3 flex justify-center">
          <img src={product.image} alt={product.name} className="h-32 object-contain" loading="lazy" />
        </div>
      )}
      <h3 className="mt-3 text-sm font-bold leading-snug">{product.name.slice(0, 50)}</h3>
      <div className="mt-1 text-brand">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</div>
      <p className="mt-2 text-xs text-foreground/60">{product.verdict.slice(0, 80)}…</p>

      {/* Amazon + eBay CTAs */}
      <div className="mt-3 space-y-2">
        {product.amazonPrice && product.amazonUrl && (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="nofollow sponsored"
            className="flex items-center justify-between rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600"
          >
            <span>🅰️ Amazon</span>
            <span>{currency}{product.amazonPrice}</span>
          </a>
        )}
        {product.ebayPrice && product.ebayUrl && (
          <a
            href={product.ebayUrl}
            target="_blank"
            rel="nofollow sponsored"
            className="flex items-center justify-between rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <span>🅱️ eBay</span>
            <span>{currency}{product.ebayPrice}</span>
          </a>
        )}
      </div>

      <Link
        href={`/p/${product.slug}`}
        className="mt-3 block text-center text-xs font-medium text-brand hover:underline"
      >
        Full review →
      </Link>
    </div>
  );
}
