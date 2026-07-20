import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Portable Air Conditioners Under £350 — 2026 UK Guide | UK Air Con Tracker",
  description: "Compare the best portable air conditioners under £350 for UK homes. Meaco, De'Longhi, Pro Breeze reviewed with running costs, noise levels, and real BTU ratings.",
  alternates: { canonical: "/guides/best-portable-ac-under-350" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Guides / Best Portable AC Under £350
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Best Portable Air Conditioners Under £350 — UK 2026</h1>
      <p className="mt-4 text-base text-foreground/70">You don&apos;t need to spend £500 to survive a British heatwave. We tested the specs on every portable AC under £350 to find the ones that actually cool a room — not just make noise.</p>

      <h2 className="mt-10 text-xl font-bold">The Contenders</h2>
      
      <div className="mt-6 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Model</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">BTU</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">Noise</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden md:table-cell">Room</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Verdict</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <Row name="MeacoCool MC Series Pro 9,000" price="£339" btu="9,000" noise="60dB" room="20m²" verdict="Best overall" highlight />
            <Row name="De'Longhi Pinguino PACEM90" price="£289.99" btu="9,800" noise="47dB" room="24m²" verdict="Quietest" />
            <Row name="Pro Breeze OmniCool 12,000 Wi-Fi" price="£329" btu="12,000" noise="58dB" room="28m²" verdict="Best value" />
            <Row name="MeacoCool MC Series 10,000R" price="£319" btu="10,000" noise="62dB" room="22m²" verdict="Solid mid-range" />
            <Row name="De'Longhi Pinguino PACN82" price="£269.99" btu="9,400" noise="63dB" room="22m²" verdict="Budget pick" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">1. MeacoCool MC Series Pro 9,000 BTU — Best Overall</h2>
      <p className="mt-3 text-sm text-foreground/70"><strong>Price: £339</strong> (was £369). The quietest in its class at 60dB — that&apos;s conversation-level, not vacuum-cleaner. Cools and heats year-round, so it&apos;s not just a summer appliance. Coverage: roughly 20m². Running cost at 24.5p/kWh for 6 hours: ~£1.32/day, ~£39.60/month.</p>

      <h2 className="mt-8 text-xl font-bold">2. De&apos;Longhi Pinguino PACEM90 — Quietest</h2>
      <p className="mt-3 text-sm text-foreground/70"><strong>Price: £289.99</strong> (was £329.99). The standout feature is noise — De&apos;Longhi&apos;s Silent Technology runs at 47-63dB. At the low end, that&apos;s quieter than a library. A-rated energy efficiency means lower running costs than most competitors. 9,800 BTU covers about 24m².</p>

      <h2 className="mt-8 text-xl font-bold">3. Pro Breeze OmniCool 12,000 BTU Wi-Fi — Best Value</h2>
      <p className="mt-3 text-sm text-foreground/70"><strong>Price: £329</strong>. The most BTU per pound on this list. 12,000 BTU for £329 is exceptional — most 12K units cost £400+. Smart WiFi means you can cool the room from your phone before you get home. 4-in-1: cool, heat, fan, dehumidify. Ultra-quiet at 58dB.</p>

      <h2 className="mt-8 text-xl font-bold">What to Look For in a Portable AC Under £350</h2>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li><strong>BTU rating:</strong> 9,000 BTU minimum for a UK bedroom. 12,000+ for living rooms. Below 7,000 BTU is a fan with delusions.</li>
        <li><strong>Noise:</strong> Under 65dB is acceptable. Under 55dB is genuinely quiet. Anything above 70dB and you won&apos;t sleep with it on.</li>
        <li><strong>Energy rating:</strong> An A-rated unit costs ~30% less to run than an unrated one. That&apos;s £12/month saved.</li>
        <li><strong>Hose type:</strong> Single-hose units are cheaper but less efficient. Dual-hose units cool faster but are rare under £350.</li>
        <li><strong>Heating function:</strong> If it heats as well as cools, it&apos;s not a seasonal purchase — you use it year-round.</li>
      </ul>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">Bottom line:</p>
        <p className="mt-2 text-sm text-foreground/70">The MeacoCool Pro 9,000 BTU at £339 is the sweet spot — quiet enough to sleep with, powerful enough for a bedroom, and heats in winter. If budget is tight, the De&apos;Longhi PACN82 at £269.99 does the job for £70 less. For max cooling per pound, the Pro Breeze 12,000 BTU at £329 is unbeatable.</p>
      </div>

      <Link href="/portable-air-conditioners" className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">
        See all portable AC in stock →
      </Link>

      <p className="mt-6 text-sm text-foreground/70">
        📡 Not sure where to look? Read our guide on{" "}
        <Link href="/guides/find-portable-air-conditioner-in-stock" className="text-brand font-semibold hover:underline">how to find a portable air conditioner in stock</Link>{" "}
        — we cover which retailers restock fastest and how to beat the heatwave rush.
      </p>
    </div>
  );
}

function Row({ name, price, btu, noise, room, verdict, highlight }: { name: string; price: string; btu: string; noise: string; room: string; verdict: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-[#f0f9fc]" : "hover:bg-surface-cool"}>
      <td className="px-4 py-3 font-medium text-sm">{name}</td>
      <td className="px-4 py-3 text-right tabular-nums font-semibold text-brand-deep text-sm">{price}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden sm:table-cell">{btu}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden sm:table-cell">{noise}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden md:table-cell">{room}</td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase ${highlight ? "bg-brand text-background" : "bg-surface-cool text-foreground/60"}`}>{verdict}</span>
      </td>
    </tr>
  );
}
