import type { Metadata } from "next";
import Link from "next/link";
import { RunningCostCalculator } from "@/components/RunningCostCalculator";

export const metadata: Metadata = {
  title: "Running Cost Calculator — what your AC costs to run | UK Air Con Tracker",
  description:
    "Calculate exactly what your portable air conditioner, fan, or fixed AC costs to run per day, month, and summer. Uses the current UK energy price cap rate.",
  alternates: { canonical: "/tools/running-cost-calculator" },
};

export default function RunningCostPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Tools / Running cost calculator
      </nav>
      <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
        How much does it cost to run an air conditioner?
      </h1>
      <p className="mt-4 max-w-2xl text-base text-foreground/70">
        Portable AC running costs depend on the unit&apos;s power draw, how long you run it, and your
        electricity rate. Use the calculator below — it uses the current UK price cap rate by default.
      </p>

      <div className="mt-10">
        <RunningCostCalculator />
      </div>

      <div className="mt-12 max-w-2xl border-t border-line pt-8">
        <h2 className="text-lg font-semibold">How running costs are calculated</h2>
        <p className="mt-3 text-sm text-foreground/70">
          The formula is simple: <strong>(watts × hours) ÷ 1,000 = kWh per day</strong>, then multiply by
          your electricity rate. A 9,000 BTU portable AC drawing 900W, run for 6 hours at 24.5p/kWh,
          costs roughly £1.32/day or £39.60/month.
        </p>

        <h3 className="mt-6 text-sm font-semibold">Why portable ACs cost more than you think</h3>
        <p className="mt-2 text-sm text-foreground/70">
          A portable air conditioner&apos;s compressor cycles on and off, so actual power draw varies. The
          rated wattage is the maximum — real-world usage is typically 60-80% of that. The numbers
          above are worst-case estimates. Using a timer, closing curtains, and sealing window gaps can
          cut your real cost by 30-40%.
        </p>

        <h3 className="mt-6 text-sm font-semibold">Fan vs portable AC — the real difference</h3>
        <p className="mt-2 text-sm text-foreground/70">
          A pedestal fan draws about 40W — roughly <strong>£1.76/month</strong> for 6 hours daily use.
          A portable AC at 900W costs about <strong>£39.60/month</strong> for the same usage. That&apos;s
          22× more. Fans don&apos;t actually cool the air — they just move it — but for UK nights where
          the temperature drops below 20°C, a fan in the window is often enough.
        </p>

        <Link
          href="/portable-air-conditioners"
          className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
        >
          See portable AC in stock →
        </Link>
      </div>
    </div>
  );
}
