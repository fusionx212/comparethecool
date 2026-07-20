import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { outboundHref } from "@/lib/affiliate";
import type { Offer } from "@/lib/types";

export const metadata: Metadata = {
  title: "Best Oil-Filled Radiators Under £50 — 2026 Winter Prep",
  description:
    "Oil-filled radiators that won't break the bank. We compare Geepas, De'Longhi and budget picks under £50 — with live stock, prices and running costs.",
  alternates: { canonical: "/guides/best-oil-radiators-under-50" },
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

const radiators = SAMPLE_PRODUCTS
  .filter((p) => p.category === "oil-radiators")
  .filter((p) => p.offers[0]?.price && p.offers[0].price < 50)
  .sort((a, b) => (a.offers[0]?.price ?? 999) - (b.offers[0]?.price ?? 999));

export default function BestOilRadiatorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Oil-Filled Radiators Under £50 — 2026 Winter Prep",
    description:
      "Budget oil-filled radiators compared: Geepas 5-model range from £36 to £70, running costs, room sizing, and which fin count you actually need.",
    publisher: { "@type": "Organization", name: "UK Air Con Tracker", url: BASE },
    datePublished: "2026-07-07",
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/oil-radiators" className="hover:text-brand">Oil Radiators</Link> / Best Under £50
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
        Best Oil-Filled Radiators Under £50
      </h1>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand">
        2026 Winter Prep — Stay Warm Without the Central Heating Bill
      </p>

      <p className="mt-5 text-base leading-relaxed text-foreground/75">
        With energy prices still high, heating one room with an oil-filled radiator costs about 30–60p
        per hour vs £2–4 for central heating. Every one of these picks is under £50 to buy — meaning
        they pay for themselves within a month of targeted use. Here are the best options live right now.
      </p>

      {/* ── Quick Picks ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">The Line-Up</h2>
      </div>

      <div className="mt-6 space-y-4">
        {radiators.slice(0, 5).map((p, i) => (
          <RadiatorCard key={p.id} product={p} position={i + 1} />
        ))}
        {radiators.length === 0 && (
          <p className="text-sm text-foreground/50">No sub-£50 radiators in stock right now. Check the full category for more options.</p>
        )}
      </div>

      {/* ── What Fin Count Means ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">What Fin Count Actually Means</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Oil radiators are measured in fins — the more fins, the more surface area and the faster they heat a room.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FinCard n="5–7 fins" room="Small bedroom / home office" watt="700–1500W" />
          <FinCard n="9 fins" room="Medium bedroom / living room" watt="1500–2000W" />
          <FinCard n="11 fins" room="Large room / open-plan" watt="2000–2500W" />
        </div>
      </div>

      {/* ── Running Costs ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">Running Costs</h2>
        <p className="mt-2 text-sm text-foreground/65">
          At 24.5p/kWh (October 2026 price cap). An oil radiator on medium for 6 hours.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm tnum">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-3 pr-4 font-semibold text-foreground/75">Radiator</th>
                <th className="py-3 px-4 font-semibold text-foreground/75">Watts (medium)</th>
                <th className="py-3 px-4 font-semibold text-foreground/75">Per hour</th>
                <th className="py-3 pl-4 font-semibold text-foreground/75">Per day (6h)</th>
                <th className="py-3 pl-4 font-semibold text-foreground/75">Per month</th>
              </tr>
            </thead>
            <tbody>
              <CostRow label="7-fin 1500W" watt="1000W" />
              <CostRow label="9-fin 2000W" watt="1300W" />
              <CostRow label="11-fin 2500W" watt="1700W" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          These are estimates at the medium heat setting. Using the built-in thermostat to cycle on/off
          cuts actual costs by 30–50%. A timer (included on most) lets you pre-heat the room before
          you get home then switch off.
        </p>
      </div>

      {/* ── Oil vs Fan vs Convector ── */}
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold tracking-tight">Oil Radiator vs Fan Heater vs Convector</h2>
        <p className="mt-2 text-sm text-foreground/65">
          If you&rsquo;re deciding which type of electric heater to buy, here&rsquo;s the quick breakdown.
        </p>
        <div className="mt-4 space-y-3">
          <HeaterType
            type="Oil-Filled Radiator"
            pros="Silent. Holds heat after switching off. Best for bedrooms and all-day use."
            cons="Slow to warm up (15–20 min). Heavy. Bulky to store in summer."
            best="✓ Best for bedrooms, living rooms, all-day heating"
          />
          <HeaterType
            type="Fan Heater"
            pros="Instant heat. Cheap (£15–30). Tiny — fits in a cupboard."
            cons="Noisy. Room goes cold immediately when off. Expensive to run continuously."
            best="Best for quick bathroom warm-up or desk use"
          />
          <HeaterType
            type="Convector Heater"
            pros="Fast heat-up. Slim profile — wall-mounts or freestanding. Quieter than fan."
            cons="Room cools faster than oil. No residual heat."
            best="Best for living rooms where you want quick heat"
          />
        </div>
      </div>

      {/* ── The Geepas Angle ── */}
      <div className="mt-10 border-t-2 border-line-strong pt-8">
        <h2 className="text-xl font-bold tracking-tight">Why Geepas Dominates the Budget Space</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          Geepas is the only brand offering <strong>five different oil-filled radiator models</strong> under £70,
          three of them under £50. Compare that to De&rsquo;Longhi where the cheapest oil radiator starts at £80+.
          The build quality is solid for the price — metal fins, mechanical or digital thermostat,
          2-year warranty — and with free next-day delivery, there&rsquo;s no hidden shipping cost.
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          If you&rsquo;re heating a bedroom or home office and don&rsquo;t want to turn on the central heating
          for one room, a £36 Geepas 7-fin will pay for itself in about three weeks of targeted use.
          The maths is simple: central heating costs £2–4/hour for a whole house. An oil radiator
          costs 25–42p/hour for one room. That&rsquo;s an 85–90% saving every time you use it.
        </p>
      </div>

      {/* ── See also ── */}
      <div className="mt-10 border-t border-line pt-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-foreground/45">See also</p>
        <div className="mt-3 space-y-2">
          <Link href="/oil-radiators" className="block text-sm text-brand hover:underline">
            → All oil-filled radiators — live stock &amp; prices
          </Link>
          <Link href="/electric-blankets" className="block text-sm text-brand hover:underline">
            → Electric blankets — the £23 way to stay warm in bed
          </Link>
          <Link href="/guides/geepas-vs-meaco-dehumidifiers" className="block text-sm text-brand hover:underline">
            → Geepas vs Meaco Dehumidifiers — budget vs premium
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

function RadiatorCard({ product, position }: { product: import("@/lib/types").Product; position: number }) {
  const offer = product.offers[0];
  const statusColor =
    offer?.status === "in_stock" ? "text-instocks" :
    offer?.status === "low_stock" ? "text-low" : "text-sold";

  return (
    <div className="border border-line">
      <div className="flex items-start gap-4 p-4">
        <span className="tnum flex h-10 w-10 flex-shrink-0 items-center justify-center border border-line text-lg font-bold text-foreground/25">
          {position}
        </span>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-20 w-20 flex-shrink-0 object-contain"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-tight">{product.name}</h3>
          <ul className="mt-1.5 space-y-0.5">
            {product.highlights.map((h, i) => (
              <li key={i} className="text-xs text-foreground/60">• {h}</li>
            ))}
          </ul>
          {offer && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="tnum text-lg font-bold text-foreground">£{offer.price.toFixed(2)}</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                {offer.status === "low_stock" && offer.stockQuantity ? `Only ${offer.stockQuantity} left` : "In Stock"}
              </span>
              <BuyButton productSlug={product.slug} offer={offer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BuyButton({ productSlug, offer }: { productSlug: string; offer: Offer }) {
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

function FinCard({ n, room, watt }: { n: string; room: string; watt: string }) {
  return (
    <div className="border border-line p-4">
      <div className="tnum text-lg font-bold text-foreground">{n}</div>
      <div className="mt-1 text-xs text-foreground/65">{room}</div>
      <div className="mt-0.5 text-xs font-semibold text-brand">{watt}</div>
    </div>
  );
}

function CostRow({ label, watt }: { label: string; watt: string }) {
  const w = parseInt(watt);
  const perHour = ((w / 1000) * 0.245).toFixed(2);
  const perDay = ((w / 1000) * 0.245 * 6).toFixed(2);
  const perMonth = ((w / 1000) * 0.245 * 6 * 30).toFixed(2);

  return (
    <tr className="border-b border-line/50">
      <td className="py-2.5 pr-4 font-semibold text-foreground/75">{label}</td>
      <td className="py-2.5 px-4">{watt}</td>
      <td className="py-2.5 px-4">£{perHour}</td>
      <td className="py-2.5 px-4">£{perDay}</td>
      <td className="py-2.5 pl-4">£{perMonth}</td>
    </tr>
  );
}

function HeaterType({ type, pros, cons, best }: { type: string; pros: string; cons: string; best: string }) {
  return (
    <div className="border border-line p-4">
      <h3 className="font-bold text-foreground">{type}</h3>
      <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
        <div>
          <span className="font-semibold text-instocks">Pros:</span>
          <span className="ml-1 text-foreground/65">{pros}</span>
        </div>
        <div>
          <span className="font-semibold text-sold">Cons:</span>
          <span className="ml-1 text-foreground/65">{cons}</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-brand">{best}</p>
    </div>
  );
}
