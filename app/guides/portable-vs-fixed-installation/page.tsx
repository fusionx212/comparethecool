import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portable AC vs Fixed Installation — Real 5-Year Cost | UK Air Con Tracker",
  description: "Portable AC (£300-500) vs fixed split-system (£1,500-3,000). We compare upfront cost, running costs, noise, efficiency, and property value over 5 years.",
  alternates: { canonical: "/guides/portable-vs-fixed-installation" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / Portable vs Fixed Installation</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Portable AC vs Fixed Installation — The Real 5-Year Cost Comparison</h1>
      <p className="mt-4 text-base text-foreground/70">A portable air conditioner costs £300-500. A professionally installed split-system costs £1,500-3,000. Which is actually cheaper over 5 years? The answer surprised us.</p>

      <h2 className="mt-10 text-xl font-bold">Head-to-Head Comparison</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Factor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Portable AC (9,000 BTU)</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase bg-brand">Fixed Split-System (9,000 BTU)</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <R label="Upfront cost" p="£300-500" f="£1,500-2,500" />
            <R label="Installation" p="None (DIY)" f="£500-1,000 (professional)" />
            <R label="Noise (indoor)" p="55-65 dB" f="19-30 dB" />
            <R label="Energy efficiency" p="EER 2.5-3.0" f="SEER 5.0-7.0" />
            <R label="Run cost/month" p="£39.60" f="£16.50" />
            <R label="Heats as well?" p="Rarely" f="Yes (heat pump)" />
            <R label="Lifespan" p="3-5 years" f="15-20 years" />
            <R label="Property value" p="No impact" f="Adds £1,000-3,000" />
            <R label="Room coverage" p="1 room (with hose)" f="1 room (wall unit)" />
            <R label="Floor space" p="Yes (0.3m²)" f="None (wall-mounted)" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">The 5-Year Cost Breakdown</h2>
      <p className="mt-3 text-sm text-foreground/70">Assuming 90 days of use per summer, 6 hours per day, at 24.5p/kWh.</p>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Cost</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Portable AC</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase bg-brand">Fixed AC</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <Cost label="Upfront purchase" p="£400" f="£2,000" />
            <Cost label="Installation" p="£0" f="£750" />
            <Cost label="Year 1 electricity" p="£237" f="£99" />
            <Cost label="Year 2 electricity" p="£237" f="£99" />
            <Cost label="Year 3 electricity + replacement" p="£637" f="£99" />
            <Cost label="Year 4 electricity" p="£237" f="£99" />
            <Cost label="Year 5 electricity" p="£237" f="£99" />
            <Cost label="5-year total" p="£1,985" f="£3,245" highlight />
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-foreground/70">The portable AC is cheaper in pure cash terms over 5 years — <strong>£1,985 vs £3,245</strong>. But factor in property value (a split-system adds ~£2,000 to your home) and the fixed install actually comes out ahead. Plus you get silent operation, heating in winter, and no floor space lost.</p>

      <h2 className="mt-10 text-xl font-bold">When Portable Makes Sense</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ You&apos;re renting and can&apos;t modify the property</li>
        <li>✅ You only need cooling for 2-3 weeks a year</li>
        <li>✅ You want to move it between rooms (bedroom at night, office by day)</li>
        <li>✅ You have a limited budget right now</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">When Fixed Installation Wins</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ You own the property and plan to stay 3+ years</li>
        <li>✅ Noise matters — 19dB vs 60dB is life-changing at night</li>
        <li>✅ You want heating too — air-to-air heat pumps are 3-4× more efficient than electric heaters</li>
        <li>✅ You&apos;re adding value before selling</li>
      </ul>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">The verdict:</p>
        <p className="mt-2 text-sm text-foreground/70">If you own your home and plan to stay, get a fixed install. The silence alone is worth it, and the property value bump covers the upfront cost. If you rent or move frequently, a good portable AC like the MeacoCool Pro is the practical choice — just accept the noise and electricity bill.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/portable-air-conditioners" className="border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">Portable AC in stock →</Link>
        <Link href="/installation" className="border border-brand bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:bg-brand-deep">Get installation quotes →</Link>
      </div>
    </div>
  );
}

function R({ label, p, f }: { label: string; p: string; f: string }) {
  return <tr className="hover:bg-surface-cool"><td className="px-4 py-3 font-medium text-sm">{label}</td><td className="px-4 py-3 text-sm">{p}</td><td className="px-4 py-3 text-sm bg-[#f0f9fc] font-medium">{f}</td></tr>;
}

function Cost({ label, p, f, highlight }: { label: string; p: string; f: string; highlight?: boolean }) {
  return <tr className={highlight ? "bg-surface-cool font-bold" : "hover:bg-surface-cool"}><td className="px-4 py-3 text-sm">{label}</td><td className="px-4 py-3 text-right tabular-nums text-sm">{p}</td><td className="px-4 py-3 text-right tabular-nums text-sm bg-[#f0f9fc]">{f}</td></tr>;
}
