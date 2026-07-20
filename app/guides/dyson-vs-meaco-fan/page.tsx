import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dyson Cool vs Meaco Fan — Which Is Worth the Money? | UK Air Con Tracker",
  description: "Dyson Purifier Cool TP07 (£479) vs Meaco Fan 1056 (£80). Is the Dyson worth 6× the price? We compare cooling power, noise, features, and running costs.",
  alternates: { canonical: "/guides/dyson-vs-meaco-fan" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / Dyson vs Meaco Fan</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Dyson Purifier Cool vs Meaco Fan 1056 — Worth 6× the Price?</h1>
      <p className="mt-4 text-base text-foreground/70">Dyson charges £479.99 for a fan. Meaco charges £79.99. Both move air. So what exactly does the extra £400 buy you — and is it worth it during a UK heatwave?</p>

      <h2 className="mt-10 text-xl font-bold">The Short Answer</h2>
      <p className="mt-3 text-sm text-foreground/70">The Dyson is a HEPA air purifier that also moves air. The Meaco is a fan that moves air really well. If you need air purification (allergies, asthma, city pollution), the Dyson justifies its price. If you just want cooling airflow, the Meaco is the smarter buy — and it&apos;s actually quieter.</p>

      <h2 className="mt-10 text-xl font-bold">Head-to-Head</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Feature</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Meaco Fan 1056</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase bg-brand">Dyson TP07</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <CompRow label="Price" meaco="£79.99" dyson="£479.99" />
            <CompRow label="Type" meaco="Air circulator" dyson="Purifier + fan" />
            <CompRow label="Noise (min)" meaco="20 dB" dyson="42 dB" />
            <CompRow label="Noise (max)" meaco="55 dB" dyson="62 dB" />
            <CompRow label="Power" meaco="24W" dyson="40W" />
            <CompRow label="Run cost/month" meaco="£1.06" dyson="£1.76" />
            <CompRow label="Oscillation" meaco="Vertical tilt" dyson="350° rotation" />
            <CompRow label="HEPA filter" meaco="No" dyson="Yes ✓" />
            <CompRow label="Smart features" meaco="No" dyson="Wi-Fi + Alexa + app" />
            <CompRow label="Warranty" meaco="2 years" dyson="2 years" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">When to Buy the Dyson (£479.99)</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ You have allergies, asthma, or live in a high-pollution area — the HEPA filter captures 99.95% of particles</li>
        <li>✅ You want a single device for cooling + air purification year-round</li>
        <li>✅ Smart home integration matters — Alexa, Google Home, Dyson app</li>
        <li>✅ Design is a priority — the bladeless look is iconic</li>
        <li>✅ You can claim it as a health expense (some UK employers cover air purifiers)</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">When to Buy the Meaco (£79.99)</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>✅ You just want effective cooling airflow at the lowest price</li>
        <li>✅ Noise matters — the Meaco is genuinely whisper-quiet at 20dB (the Dyson starts at 42dB)</li>
        <li>✅ Running costs matter — the Meaco uses nearly half the power</li>
        <li>✅ You don&apos;t need smart features or air purification</li>
        <li>✅ Which? Best Buy award winner — independently verified quality</li>
      </ul>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">The brutal truth:</p>
        <p className="mt-2 text-sm text-foreground/70">The Dyson is a brilliant air purifier that happens to move air. The Meaco is a brilliant fan. If you&apos;re not specifically shopping for HEPA filtration, buy the Meaco and put the £400 saving toward an actual portable air conditioner — which will cool the room in a way no fan ever can.</p>
      </div>

      <Link href="/tower-fans" className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">See all tower fans in stock →</Link>
    </div>
  );
}

function CompRow({ label, meaco, dyson }: { label: string; meaco: string; dyson: string }) {
  return (
    <tr className="hover:bg-surface-cool">
      <td className="px-4 py-3 font-medium text-sm">{label}</td>
      <td className="px-4 py-3 text-sm">{meaco}</td>
      <td className="px-4 py-3 text-sm bg-[#f0f9fc] font-medium">{dyson}</td>
    </tr>
  );
}
