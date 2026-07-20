import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heatwave Survival Kit — What to Buy Before It Hits 35°C | UK Air Con Tracker",
  description: "Essential kit for surviving a UK heatwave: portable AC, fans, blackout curtains, cooling bedding, window film, and hydration gear. Buy before the panic.",
  alternates: { canonical: "/guides/heatwave-survival-kit" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / Heatwave Survival Kit</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">UK Heatwave Survival Kit — What to Buy Before It Hits 35°C</h1>
      <p className="mt-4 text-base text-foreground/70">British homes are designed to trap heat — not release it. When the mercury hits 30°C+, every portable AC sells out within hours. Here&apos;s exactly what to buy now, before the panic, ranked by effectiveness.</p>

      <h2 className="mt-10 text-xl font-bold">The Hierarchy of Cooling (Most to Least Effective)</h2>

      <div className="mt-6 space-y-4">
        <KitItem num={1} title="Portable Air Conditioner" price="£270-550" impact="★★★★★" desc="The only thing that actually reduces room temperature. Everything else just moves air. A 9,000-12,000 BTU unit will cool a standard UK bedroom from 32°C to 22°C in about 20 minutes. Buy before June — they sell out within 48 hours of the first heatwave warning." href="/portable-air-conditioners" linkText="In stock now →" />

        <KitItem num={2} title="Blackout Curtains or Window Film" price="£15-40" impact="★★★★☆" desc="The most underrated cooling purchase. South-facing windows act like radiators during a heatwave. Blackout curtains with a white thermal backing reflect heat back out. Window film reduces solar gain by up to 78%. Cost: £15-40. Impact: reduces room temperature by 3-5°C before you even turn the AC on." href="/blackout-curtains" linkText="Blackout curtains →" />

        <KitItem num={3} title="Air Circulator or Tower Fan" price="£30-100" impact="★★★☆☆" desc="Fans don&apos;t cool air — but they make you feel 4-5°C cooler through the wind chill effect. An air circulator (like the Meaco 1056) is more effective than a standard fan because it moves all the air in the room, not just a cone in front of it. Point it at the ceiling at night to push hot air down and out an open window." href="/tower-fans" linkText="Tower fans →" />

        <KitItem num={4} title="Cooling Bedding & Mattress Topper" price="£20-60" impact="★★★☆☆" desc="A cooling mattress topper with gel-infused memory foam or phase-change material actually draws heat away from your body. Paired with bamboo or linen sheets (which breathe better than cotton), this is the difference between sleeping and staring at the ceiling at 2am." href="/cooling-bedding" linkText="Cooling bedding →" />

        <KitItem num={5} title="Dehumidifier" price="£90-170" impact="★★☆☆☆" desc="UK heatwaves are often humid — and humidity makes heat feel worse. A dehumidifier doesn&apos;t cool the air, but removing moisture makes 30°C feel like 27°C. It also speeds up sweat evaporation (your body&apos;s natural cooling mechanism). Bonus: dry laundry indoors in 4 hours." href="/dehumidifiers" linkText="Dehumidifiers →" />

        <KitItem num={6} title="Pedestal Fan + Bowl of Ice" price="£15-40" impact="★★☆☆☆" desc="The classic student hack that actually works. A pedestal fan blowing across a bowl of ice or frozen water bottles creates a crude evaporative cooler. It won&apos;t transform a 35°C room into a fridge, but it takes the edge off for about £20 total. Position the ice directly in the airflow path." href="/pedestal-fans" linkText="Pedestal fans →" />

        <KitItem num={7} title="Insulated Water Bottle" price="£10-25" impact="★☆☆☆☆" desc="Not cooling your room — but keeping you cool. Dehydration amplifies heat stress. A double-walled insulated bottle keeps water cold for 12+ hours. Fill it with ice water before bed and it&apos;ll still be cold at 3am when you wake up sweating." />
      </div>

      <h2 className="mt-12 text-xl font-bold">The £100 Emergency Heatwave Kit</h2>
      <p className="mt-3 text-sm text-foreground/70">If you had £100 and a heatwave tomorrow, here&apos;s the optimal spend:</p>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background"><th className="px-4 py-3 text-left text-xs font-semibold uppercase">Item</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase">Cost</th></tr></thead>
          <tbody className="divide-y rule-strong">
            <EItem item="Pedestal fan (Honeywell HT900E)" cost="£27.99" />
            <EItem item="Window film (reflective)" cost="£12.99" />
            <EItem item="Cooling mattress topper (single)" cost="£24.99" />
            <EItem item="Insulated water bottle (1L)" cost="£14.99" />
            <EItem item="Spray bottle (misting yourself)" cost="£3.99" />
            <EItem item="Total" cost="£84.95" highlight />
          </tbody>
        </table>
      </div>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">The golden rule of UK heatwaves:</p>
        <p className="mt-2 text-sm text-foreground/70">Buy your cooling gear in May, not July. Every single year, portable ACs, fans, and even ice cube trays sell out nationwide within 48 hours of the Met Office issuing a heatwave warning. The retailers know this — prices rarely drop during heatwaves because demand is infinite. The best time to buy is the coldest, rainiest day in spring.</p>
        <p className="mt-3 text-sm text-foreground/70">📡 <Link href="/guides/find-portable-air-conditioner-in-stock" className="text-brand font-semibold hover:underline">Find a portable air conditioner in stock right now →</Link></p>
      </div>

      <Link href="/portable-air-conditioners" className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">Stock up before the heatwave →</Link>
    </div>
  );
}

function KitItem({ num, title, price, impact, desc, href, linkText }: { num: number; title: string; price: string; impact: string; desc: string; href?: string; linkText?: string }) {
  return (
    <div className="border rule-strong p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-foreground text-xs font-bold text-background">{num}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold">{title}</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-foreground/50">{price}</span>
              <span className="tabular-nums text-brand-deep font-semibold">{impact}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-foreground/70">{desc}</p>
          {href && linkText && (
            <Link href={href} className="mt-2 inline-block text-xs font-semibold text-brand hover:underline">{linkText}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EItem({ item, cost, highlight }: { item: string; cost: string; highlight?: boolean }) {
  return <tr className={highlight ? "bg-surface-cool font-bold" : ""}><td className="px-4 py-3 text-sm">{item}</td><td className="px-4 py-3 text-right tabular-nums text-sm font-semibold">{cost}</td></tr>;
}
