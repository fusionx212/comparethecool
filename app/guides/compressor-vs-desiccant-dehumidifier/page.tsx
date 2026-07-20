import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compressor vs Desiccant Dehumidifier — UK Buyer's Guide | UK Air Con Tracker",
  description: "Compressor or desiccant dehumidifier? We explain the difference, running costs, and which type works best for UK homes — including cold rooms, garages, and winter use.",
  alternates: { canonical: "/guides/compressor-vs-desiccant-dehumidifier" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / Compressor vs Desiccant Dehumidifier</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Compressor vs Desiccant Dehumidifier — Which Type for Your UK Home?</h1>
      <p className="mt-4 text-base text-foreground/70">There are two completely different technologies inside dehumidifiers — and picking the wrong one means it won&apos;t work when you actually need it. Here&apos;s how to choose.</p>

      <h2 className="mt-10 text-xl font-bold">How They Work</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border rule-strong p-5">
          <h3 className="text-sm font-bold">Compressor (Refrigerant)</h3>
          <p className="mt-2 text-sm text-foreground/70">Works like a fridge in reverse. A cold coil condenses moisture from the air — exactly like water droplets on a cold drink can. <strong>Best above 15°C.</strong> Most common type. Cheaper to run.</p>
          <p className="mt-2 text-xs text-foreground/50">Example: Geepas 12L, MeacoDry Arete One</p>
        </div>
        <div className="border rule-strong p-5 bg-[#f0f9fc]">
          <h3 className="text-sm font-bold">Desiccant (Absorption)</h3>
          <p className="mt-2 text-sm text-foreground/70">Uses a rotating wheel of moisture-absorbing material, heated to release the water. <strong>Works at any temperature — even below freezing.</strong> Uses more electricity but performs in cold rooms.</p>
          <p className="mt-2 text-xs text-foreground/50">Example: Meaco DD8L Zambezi</p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Head-to-Head Comparison</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Factor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Compressor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Desiccant</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <TR2 label="Best temperature" c="15-35°C" d="0-35°C" />
            <TR2 label="Fails below" c="~10°C" d="Never (works at 0°C)" />
            <TR2 label="Power draw" c="200-300W" d="330-650W" />
            <TR2 label="Run cost/month" c="£5-8" d="£8-15" />
            <TR2 label="Noise" c="35-45 dB" d="39-48 dB" />
            <TR2 label="Dries laundry?" c="Yes (warm room)" d="Yes (any room)" />
            <TR2 label="Warms room?" c="+1-2°C" d="+3-5°C (bonus in winter)" />
            <TR2 label="Typical price" c="£50-200" d="£130-300" />
            <TR2 label="Lifespan" c="5-8 years" d="8-10 years" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Which Type for Which Room?</h2>
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3 border rule-strong p-4">
          <span className="mt-0.5 text-brand font-bold">01</span>
          <div><h3 className="text-sm font-semibold">Heated bedroom or living room → Compressor</h3><p className="text-sm text-foreground/60">If the room stays above 15°C (most UK homes with central heating), a compressor dehumidifier is cheaper to buy, cheaper to run, and quieter.</p></div>
        </div>
        <div className="flex items-start gap-3 border rule-strong p-4">
          <span className="mt-0.5 text-brand font-bold">02</span>
          <div><h3 className="text-sm font-semibold">Unheated room, garage, basement, conservatory → Desiccant</h3><p className="text-sm text-foreground/60">Compressor dehumidifiers basically stop working below 10°C. If your damp room isn&apos;t heated, desiccant is your only option. It also warms the room slightly — a bonus in winter.</p></div>
        </div>
        <div className="flex items-start gap-3 border rule-strong p-4">
          <span className="mt-0.5 text-brand font-bold">03</span>
          <div><h3 className="text-sm font-semibold">Drying laundry indoors → Desiccant</h3><p className="text-sm text-foreground/60">Desiccant dehumidifiers produce drier, warmer air that speeds up laundry drying significantly. A compressor unit works too, but slower in cooler rooms.</p></div>
        </div>
      </div>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">For most UK homes:</p>
        <p className="mt-2 text-sm text-foreground/70">If your damp room has a radiator and stays warm, buy a compressor dehumidifier — it&apos;s cheaper and quieter. The Geepas 12L at £89.99 is excellent value. If you&apos;re dealing with a cold, unheated space (garage, basement, spare bedroom in winter), the Meaco DD8L Zambezi desiccant unit is the gold standard — it works when compressor units have given up.</p>
      </div>

      <Link href="/dehumidifiers" className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">See all dehumidifiers in stock →</Link>
    </div>
  );
}

function TR2({ label, c, d }: { label: string; c: string; d: string }) {
  return <tr className="hover:bg-surface-cool"><td className="px-4 py-3 font-medium text-sm">{label}</td><td className="px-4 py-3 text-sm">{c}</td><td className="px-4 py-3 text-sm">{d}</td></tr>;
}
