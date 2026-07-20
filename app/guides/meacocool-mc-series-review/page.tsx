import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MeacoCool MC Series Review — Which Model Is Right For You? | UK Air Con Tracker",
  description: "Complete MeacoCool MC Series review. Compare the 9,000R, 10,000R, 12,000R, 14,000R, and Pro models — BTU, noise, price, and which size fits your room.",
  alternates: { canonical: "/guides/meacocool-mc-series-review" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / MeacoCool MC Series Review</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">MeacoCool MC Series Review — Which Model Is Right for Your Room?</h1>
      <p className="mt-4 text-base text-foreground/70">Meaco is the UK&apos;s most-awarded cooling brand — multiple Which? Best Buys, and the MC Series is their flagship portable AC range. But with five models ranging from £319 to £549, which one actually fits your room?</p>

      <h2 className="mt-10 text-xl font-bold">The Full Range Compared</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Model</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">BTU</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">Noise</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">Room</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase hidden md:table-cell">Best for</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <MRow model="MC Series Pro 9,000" price="£339" btu="9,000" noise="60dB" room="20m²" best="Bedrooms" highlight />
            <MRow model="MC Series 10,000R" price="£319" btu="10,000" noise="62dB" room="22m²" best="Value pick" />
            <MRow model="MC Series 12,000R" price="£349" btu="12,000" noise="63dB" room="28m²" best="Living rooms" />
            <MRow model="MC Series 14,000R" price="£419" btu="14,000" noise="64dB" room="32m²" best="Open-plan" />
            <MRow model="Pro Series 12,000 Wi-Fi" price="£449" btu="12,000" noise="58dB" room="28m²" best="Smart homes" />
            <MRow model="Pro Series 16,000 CH" price="£549" btu="16,000" noise="65dB" room="36m²" best="Large spaces" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">MC Series Pro vs Standard — What&apos;s the Difference?</h2>
      <p className="mt-3 text-sm text-foreground/70">The Pro models add <strong>Wi-Fi control</strong> (cool your room from your phone before you get home), <strong>heating functionality</strong> (use it year-round, not just summer), and quieter operation. The standard R models are cooling-only but cost £100-130 less.</p>

      <h2 className="mt-8 text-xl font-bold">Which One Should You Buy?</h2>
      <div className="mt-4 space-y-4">
        <div className="border rule-strong p-4 bg-[#f0f9fc]">
          <h3 className="text-sm font-bold">🥇 Best overall: MeacoCool Pro 9,000 BTU (£339)</h3>
          <p className="mt-1 text-sm text-foreground/70">Quietest in class (60dB), heats as well as cools, and the right size for 90% of UK bedrooms. The only one we&apos;d recommend without hesitation. If you only read one recommendation — this is it.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-bold">💰 Best value: MC Series 10,000R (£319)</h3>
          <p className="mt-1 text-sm text-foreground/70">More BTU than the Pro 9,000 for £20 less — but no heating, no Wi-Fi, and slightly louder. If you just want cooling and don&apos;t care about smart features, this is the pound-for-pound winner.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-bold">🏠 For living rooms: MC Series 12,000R (£349)</h3>
          <p className="mt-1 text-sm text-foreground/70">12,000 BTU covers a standard UK living room (25-28m²). At £349 it&apos;s only £30 more than the 10,000R — the best value step-up in the range.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-bold">📱 For smart homes: Pro Series 12,000 Wi-Fi (£449)</h3>
          <p className="mt-1 text-sm text-foreground/70">Wi-Fi + heating + 12,000 BTU + 58dB. The best all-rounder in the Pro range. Schedule it to cool your bedroom before you leave the office.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-bold">🏢 For big spaces: Pro Series 16,000 CH (£549)</h3>
          <p className="mt-1 text-sm text-foreground/70">16,000 BTU covers 36m² — open-plan flats, large living rooms, or garden offices. Only worth it if you genuinely have a large space to cool. Overkill for a bedroom.</p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Things to Know Before Buying</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li>All MeacoCool units are <strong>single-hose</strong> — they vent hot air outside through a window kit. This means negative pressure (warm air gets sucked in from other rooms). Dual-hose units are more efficient but Meaco doesn&apos;t make one.</li>
        <li>The <strong>window kit fits most UK windows</strong> (sliding, casement, tilt-and-turn). You may need to improvise for sash windows.</li>
        <li><strong>Noise is measured at max fan speed.</strong> On low/medium (which is where you&apos;ll actually run it at night), expect 5-8 dB less than the rated figure.</li>
        <li>All models come with a <strong>2-year warranty</strong> as standard. Meaco&apos;s UK customer service is well-reviewed.</li>
      </ul>

      <Link href="/portable-air-conditioners" className="mt-8 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">See MeacoCool stock & prices →</Link>
    </div>
  );
}

function MRow({ model, price, btu, noise, room, best, highlight }: { model: string; price: string; btu: string; noise: string; room: string; best: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-[#f0f9fc]" : "hover:bg-surface-cool"}>
      <td className="px-4 py-3 font-medium text-sm">{model}</td>
      <td className="px-4 py-3 text-right tabular-nums font-semibold text-brand-deep text-sm">{price}</td>
      <td className="px-4 py-3 text-right tabular-nums text-sm">{btu}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden sm:table-cell">{noise}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden sm:table-cell">{room}</td>
      <td className="px-4 py-3 text-xs text-foreground/60 hidden md:table-cell">{best}</td>
    </tr>
  );
}
