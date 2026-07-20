import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tower Fans vs Pedestal Fans — Which Cools Better? | UK Air Con Tracker",
  description: "Tower fan vs pedestal fan — we compare cooling power, noise, floor space, energy use, and price. Which fan type actually keeps you cooler during a UK heatwave?",
  alternates: { canonical: "/guides/tower-vs-pedestal-fans" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / Tower vs Pedestal Fans</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Tower Fans vs Pedestal Fans — Which Actually Cools Better?</h1>
      <p className="mt-4 text-base text-foreground/70">Both move air. Both cost pennies to run. But one is better for bedrooms, one is better for living rooms, and one is completely wrong for your use case. Here&apos;s the definitive UK comparison.</p>

      <h2 className="mt-10 text-xl font-bold">The Fundamental Difference</h2>
      <p className="mt-3 text-sm text-foreground/70">Tower fans use a vertical cylinder with a spinning impeller that draws air in through the sides and pushes it out through a narrow vertical vent. They produce a <strong>wide, gentle sheet of air</strong>. Pedestal fans use traditional blades on a motor — they produce a <strong>focused, powerful cone of air</strong> that reaches further.</p>

      <h2 className="mt-10 text-xl font-bold">Head-to-Head Comparison</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Factor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Tower Fan</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Pedestal Fan</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <TR label="Typical price" tower="£30-100" ped="£15-60" />
            <TR label="Footprint" tower="Small (25cm²)" ped="Large (50cm base)" />
            <TR label="Airflow pattern" tower="Wide, gentle sheet" ped="Focused, powerful cone" />
            <TR label="Range" tower="2-3 metres" ped="4-6 metres" />
            <TR label="Noise (low)" tower="25-35 dB" ped="30-45 dB" />
            <TR label="Noise (high)" tower="45-55 dB" ped="55-65 dB" />
            <TR label="Power (typical)" tower="40-60W" ped="40-55W" />
            <TR label="Run cost/month" tower="£1.76-2.65" ped="£1.76-2.42" />
            <TR label="Oscillation" tower="60-90° typical" ped="60-90° typical" />
            <TR label="Remote control" tower="Common" ped="Less common" />
            <TR label="Child/pet safety" tower="Safer (hidden blades)" ped="Blades accessible" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">When a Tower Fan Wins</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ <strong>Bedrooms:</strong> Quieter at low speed, takes up less floor space, safer around children</li>
        <li>✅ <strong>Small rooms:</strong> The wide airflow pattern covers the whole room without blasting one spot</li>
        <li>✅ <strong>Modern interiors:</strong> Tower fans look better — slim profile, no visible blades</li>
        <li>✅ <strong>Offices:</strong> Quiet enough for calls, remote control means no getting up</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">When a Pedestal Fan Wins</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ <strong>Living rooms:</strong> Longer range — you can feel it from across the room</li>
        <li>✅ <strong>Hot days:</strong> At max speed, a pedestal fan moves significantly more air</li>
        <li>✅ <strong>Budget:</strong> Decent pedestal fans start at £15 — towers start at £30</li>
        <li>✅ <strong>DIY cooling:</strong> Point a pedestal fan at a bowl of ice or a damp sheet for improvised evaporative cooling</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">The One Nobody Talks About: Air Circulators</h2>
      <p className="mt-3 text-sm text-foreground/70">There&apos;s a third category — air circulators like the Meaco Fan 1056. These aren&apos;t designed to blow air directly at you. They create <strong>whole-room air movement</strong> that evens out temperature. Point one at the ceiling and it eliminates the hot-air trap effect. They&apos;re more effective than either tower or pedestal fans for actually cooling a room — but you won&apos;t feel the same direct blast of air.</p>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">The verdict:</p>
        <p className="mt-2 text-sm text-foreground/70">For a bedroom, buy a tower fan — quieter and safer. For a living room on a scorching day, buy a pedestal fan — more raw air movement where you need it. For actually cooling the whole room (not just you), buy an air circulator like the Meaco. And for actual temperature reduction rather than airflow — buy a portable air conditioner.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tower-fans" className="border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">Tower fans in stock →</Link>
        <Link href="/pedestal-fans" className="border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">Pedestal fans in stock →</Link>
      </div>
    </div>
  );
}

function TR({ label, tower, ped }: { label: string; tower: string; ped: string }) {
  return <tr className="hover:bg-surface-cool"><td className="px-4 py-3 font-medium text-sm">{label}</td><td className="px-4 py-3 text-sm">{tower}</td><td className="px-4 py-3 text-sm">{ped}</td></tr>;
}
