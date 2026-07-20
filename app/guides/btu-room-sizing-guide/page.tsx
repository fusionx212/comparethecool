import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Many BTUs Do You Need? Room-by-Room Sizing Guide | UK Air Con Tracker",
  description: "Work out the right BTU for every room in your home. Bedroom, living room, kitchen, home office — with adjustments for sunlight, ceiling height, and UK climate.",
  alternates: { canonical: "/guides/btu-room-sizing-guide" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45"><Link href="/" className="hover:text-brand">Home</Link> / Guides / BTU Room Sizing Guide</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">How Many BTUs Do You Need? Room-by-Room Sizing Guide</h1>
      <p className="mt-4 text-base text-foreground/70">Buying an undersized air conditioner is the most common mistake — and the most expensive. A unit that&apos;s too small runs continuously, never reaches the set temperature, and wears out faster. Here&apos;s exactly what BTU you need for every room type.</p>

      <h2 className="mt-10 text-xl font-bold">Quick Reference Table</h2>
      <div className="mt-4 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="bg-foreground text-background">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Room</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Typical Size</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Min BTU</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Recommended</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">Max BTU</th>
          </tr></thead>
          <tbody className="divide-y rule-strong">
            <BRow room="Small bedroom" size="9-12 m²" min="5,000" rec="7,000" max="8,000" />
            <BRow room="Master bedroom" size="14-18 m²" min="7,000" rec="9,000" max="10,000" />
            <BRow room="Living room" size="18-25 m²" min="9,000" rec="12,000" max="14,000" />
            <BRow room="Open-plan living/kitchen" size="25-35 m²" min="12,000" rec="14,000" max="16,000" />
            <BRow room="Home office" size="8-12 m²" min="5,000" rec="7,000" max="8,000" />
            <BRow room="Kitchen" size="10-15 m²" min="8,000" rec="10,000" max="12,000" />
            <BRow room="Conservatory" size="12-18 m²" min="10,000" rec="14,000" max="16,000" />
            <BRow room="Garage/gym" size="15-20 m²" min="9,000" rec="12,000" max="14,000" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">The BTU Formula for UK Homes</h2>
      <p className="mt-3 text-sm text-foreground/70">Start with <strong>340 BTU per square metre</strong> for a standard UK room with 2.4m ceilings. Then adjust:</p>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        <li><strong>+10%</strong> if the room faces south or west (direct afternoon sun)</li>
        <li><strong>+10%</strong> for each additional person regularly in the room</li>
        <li><strong>+15%</strong> if it&apos;s a kitchen (appliances generate heat)</li>
        <li><strong>+20%</strong> for conservatories or rooms with large windows</li>
        <li><strong>+15%</strong> if ceiling is higher than 2.4m</li>
        <li><strong>-10%</strong> if the room faces north and is well-shaded</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">Example: Master Bedroom (16m²)</h2>
      <p className="mt-3 text-sm text-foreground/70">
        Base: 16 × 340 = <strong>5,440 BTU</strong><br />
        South-facing (+10%) → 5,984<br />
        Two people (+10%) → 6,582<br />
        Standard ceiling → no adjustment<br />
        <strong>Final recommendation: 7,000-9,000 BTU</strong>
      </p>

      <h2 className="mt-8 text-xl font-bold">Common Sizing Mistakes</h2>
      <div className="mt-4 space-y-4">
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-semibold text-sold">❌ Buying Too Small</h3>
          <p className="mt-1 text-sm text-foreground/70">A 5,000 BTU unit in a 20m² living room will run flat-out, never cool the room, and burn out in 2 years. The compressor never cycles off — it just runs until it dies.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-semibold text-sold">❌ Buying Too Large</h3>
          <p className="mt-1 text-sm text-foreground/70">A 14,000 BTU unit in a small bedroom will short-cycle — blasting cold air for 3 minutes, shutting off, then restarting. This is inefficient, noisy, and doesn&apos;t dehumidify properly.</p>
        </div>
        <div className="border rule-strong p-4">
          <h3 className="text-sm font-semibold text-sold">❌ Ignoring Heat Sources</h3>
          <p className="mt-1 text-sm text-foreground/70">A kitchen with an oven, fridge, and dishwasher generates far more heat than a bedroom. A conservatory with floor-to-ceiling glass is a greenhouse. Size up accordingly.</p>
        </div>
      </div>

      <div className="mt-8 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">Golden rule:</p>
        <p className="mt-2 text-sm text-foreground/70">When in doubt, size up by one step. A slightly oversized unit will still cycle properly in UK temperatures (we rarely hit 40°C). An undersized unit is useless on the one day you actually need it — the heatwave.</p>
      </div>

      <Link href="/tools/btu-calculator" className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand">Try the BTU calculator →</Link>
    </div>
  );
}

function BRow({ room, size, min, rec, max }: { room: string; size: string; min: string; rec: string; max: string }) {
  return (
    <tr className="hover:bg-surface-cool">
      <td className="px-4 py-3 font-medium text-sm">{room}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60">{size}</td>
      <td className="px-4 py-3 text-right tabular-nums text-sm">{min}</td>
      <td className="px-4 py-3 text-right tabular-nums text-sm font-semibold text-brand-deep">{rec}</td>
      <td className="px-4 py-3 text-right tabular-nums text-xs text-foreground/60 hidden sm:table-cell">{max}</td>
    </tr>
  );
}
