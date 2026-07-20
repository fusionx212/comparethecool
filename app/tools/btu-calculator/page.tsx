import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, isAnyInStock, bestOffer } from "@/lib/data";
import { gbp } from "@/lib/format";

// ISR: track the 2-hourly stock cron so live counts/statuses don't freeze at deploy time.
export const revalidate = 7200;

export const metadata: Metadata = {
  title: "BTU Calculator — What Size Air Conditioner Do I Need? | UK Air Con Tracker",
  description: "Calculate the right BTU for your room. Enter dimensions, get an instant recommendation, and see matching portable AC units that are in stock right now.",
  alternates: { canonical: "/tools/btu-calculator" },
};

// BTU = room volume (m³) × insulation factor × climate factor
// UK climate factor: 125 (moderate), insulation: 1.0 poor / 0.75 average / 0.5 good
function calculateBTU(length: number, width: number, height: number, insulation: string): number {
  const volume = length * width * height;
  const insFactors: Record<string, number> = { poor: 1.0, average: 0.75, good: 0.5 };
  const factor = insFactors[insulation] ?? 0.75;
  const climate = 125; // UK moderate climate
  return Math.round(volume * factor * climate / 500) * 500; // round to nearest 500 BTU
}

function roomDescription(btu: number): string {
  if (btu <= 5000) return "Small bedroom or home office (up to 15m²)";
  if (btu <= 7000) return "Standard bedroom (15–20m²)";
  if (btu <= 9000) return "Large bedroom or small living room (20–25m²)";
  if (btu <= 12000) return "Living room or open-plan kitchen (25–32m²)";
  if (btu <= 14000) return "Large open-plan space (32–38m²)";
  return "Extra-large room or commercial space (38m²+)";
}

export default async function BtucalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string; w?: string; h?: string; ins?: string }>;
}) {
  const params = await searchParams;
  const length = parseFloat(params.l ?? "");
  const width = parseFloat(params.w ?? "");
  const height = parseFloat(params.h ?? "2.4"); // default UK ceiling height
  const insulation = params.ins ?? "average";
  const hasInput = !isNaN(length) && !isNaN(width);

  let btu = 0;
  let matchingProducts: Awaited<ReturnType<typeof getAllProducts>> = [];

  if (hasInput && length > 0 && width > 0) {
    btu = calculateBTU(length, width, height, insulation);
    const all = await getAllProducts();
    matchingProducts = all
      .filter((p) => {
        const cat = p.category;
        return cat === "portable-air-conditioners";
      })
      .filter((p) => p.btu && p.btu >= btu * 0.7 && p.btu <= btu * 1.5)
      .sort((a, b) => (a.btu ?? 0) - (b.btu ?? 0))
      .slice(0, 8);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Tools / BTU Calculator
      </nav>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: calculator form */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            What size air conditioner do I need?
          </h1>
          <p className="mt-4 text-base text-foreground/70">
            Enter your room dimensions and we&rsquo;ll tell you the exact BTU rating you need — then show you matching units that are actually in stock right now.
          </p>

          <form method="get" action="/tools/btu-calculator" className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Room length (m)" name="l" defaultValue={params.l} placeholder="e.g. 4.5" />
              <Field label="Room width (m)" name="w" defaultValue={params.w} placeholder="e.g. 3.0" />
            </div>
            <Field label="Ceiling height (m)" name="h" defaultValue={params.h} placeholder="2.4" hint="Standard UK ceiling is 2.4m" />
            
            <div>
              <label className="block text-sm font-semibold text-foreground">Insulation</label>
              <select name="ins" defaultValue={insulation} className="mt-2 w-full border border-line bg-background px-4 py-3 text-sm">
                <option value="poor">Poor — old house, single glazing, draughty</option>
                <option value="average">Average — double glazing, loft insulated (most UK homes)</option>
                <option value="good">Good — new build, cavity walls, well sealed</option>
              </select>
            </div>

            <button type="submit" className="w-full border border-brand bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep">
              Calculate my BTU →
            </button>
          </form>

          <p className="mt-6 text-xs text-foreground/45">
            Rough guide: UK rooms need ~340 BTU per square metre. Our calculator adjusts for ceiling height and insulation for a more accurate number.
          </p>
        </div>

        {/* Right: results */}
        <div>
          {hasInput && btu > 0 ? (
            <>
              <div className="border rule-strong bg-brand/5 p-6">
                <div className="eyebrow text-brand-deep">Your recommendation</div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tracking-tight">{btu.toLocaleString()}</span>
                  <span className="text-lg font-semibold text-foreground/60">BTU</span>
                </div>
                <p className="mt-2 text-sm text-foreground/65">
                  {roomDescription(btu)}{" "}
                  — {length}m × {width}m × {height}m, {insulation} insulation
                </p>
              </div>

              {matchingProducts.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold">
                    Matching units in stock right now
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    These units match your {btu.toLocaleString()} BTU recommendation.
                    Prices and stock checked live.
                  </p>
                  <div className="mt-4 space-y-3">
                    {matchingProducts.map((p) => {
                      const offer = bestOffer(p);
                      const inStock = isAnyInStock(p);
                      return (
                        <Link
                          key={p.slug}
                          href={`/p/${p.slug}`}
                          className="flex items-center gap-4 border border-line bg-surface p-4 hover:border-brand"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="eyebrow text-foreground/45">{p.brand}</div>
                            <div className="mt-0.5 text-sm font-semibold truncate">{p.name}</div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-foreground/50">
                              {p.btu && <span>{p.btu.toLocaleString()} BTU</span>}
                              {p.coverageM2 && <span>· Up to {p.coverageM2}m²</span>}
                              {p.noise && <span>· {p.noise}dB</span>}
                            </div>
                          </div>
                          <div className="text-right flex-none">
                            {offer && (
                              <div className="text-lg font-bold text-brand">{gbp(offer.price)}</div>
                            )}
                            <div className={`mt-1 text-xs font-semibold ${inStock ? "text-[var(--instock)]" : "text-[var(--sold)]"}`}>
                              {inStock ? "In Stock" : "Sold Out"}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-8 border rule-strong bg-surface p-6 text-center">
                  <p className="text-sm text-foreground/60">
                    No units match {btu.toLocaleString()} BTU right now. 
                    Try a slightly different room size or{" "}
                    <Link href="/" className="text-brand hover:underline">browse all portable ACs</Link>.
                  </p>
                </div>
              )}

              {/* Email capture CTA */}
              <div className="mt-6 border rule-strong bg-surface p-6">
                <div className="eyebrow text-brand-deep">Want the full cooling plan?</div>
                <h3 className="mt-1 text-lg font-semibold">Get your free BTU report by email</h3>
                <p className="mt-2 text-sm text-foreground/65">
                  We&rsquo;ll send you your personalised recommendation, a shortlist of matching units,
                  and a buying guide — plus alerts if any of them sell out.
                </p>
                <form method="post" action="/api/alerts" className="mt-4 flex gap-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    required
                    className="flex-1 border border-line bg-background px-3 py-2.5 text-sm"
                  />
                  <input type="hidden" name="productSlug" value={`btu-${btu}`} />
                  <input type="hidden" name="utm_source" value="btu-calculator" />
                  <input type="hidden" name="utm_campaign" value={`btu-${btu}-${length}x${width}`} />
                  <button type="submit" className="border border-brand bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep">
                    Send it →
                  </button>
                </form>
                <p className="mt-2 text-xs text-foreground/40">One email with your plan. No spam. Unsub any time.</p>
              </div>
            </>
          ) : (
            <div className="border rule-strong bg-surface p-8 text-center">
              <div className="text-5xl">📐</div>
              <h2 className="mt-4 text-lg font-semibold">Enter your room dimensions →</h2>
              <p className="mt-2 text-sm text-foreground/55 max-w-xs mx-auto">
                We&rsquo;ll calculate your BTU, then show you matching air conditioners that are in stock right now.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAQ section for SEO */}
      <div className="mt-16 border-t rule-strong pt-12">
        <h2 className="text-2xl font-bold">Common questions</h2>
        <dl className="mt-6 space-y-6 max-w-2xl">
          {[
            { q: "What does BTU mean?", a: "BTU (British Thermal Unit) measures how much heat an air conditioner can remove from a room per hour. Higher BTU = cools bigger rooms. For UK homes, aim for about 340 BTU per square metre of floor space." },
            { q: "What happens if I buy too small an AC?", a: "An undersized unit will run constantly without ever cooling the room properly. It'll also use more electricity and wear out faster because it never reaches its target temperature." },
            { q: "Is bigger always better?", a: "No. An oversized unit will cool the room too quickly and shut off before it's dehumidified properly — leaving you with a cold, clammy room. Always match BTU to room size." },
            { q: "Does ceiling height matter?", a: "Yes — taller rooms have more air volume to cool. A room with 3m ceilings needs ~25% more BTU than the same floor area with standard 2.4m ceilings." },
            { q: "How much does it cost to run a portable AC?", a: "A 9,000 BTU unit costs about 25-35p per hour at current UK electricity rates (July 2026). Running it 8 hours a day for a month ≈ £60-85." },
          ].map((faq) => (
            <div key={faq.q}>
              <dt className="font-semibold text-foreground">{faq.q}</dt>
              <dd className="mt-1 text-sm text-foreground/65">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue, placeholder, hint }: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">{label}</label>
      <input
        id={name}
        name={name}
        type="number"
        step="0.1"
        min="1"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full border border-line bg-background px-4 py-3 text-sm"
      />
      {hint && <p className="mt-1 text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}
