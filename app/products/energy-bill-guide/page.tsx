import type { Metadata } from "next";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Energy Bill Crash Course — Run Your AC Without Doubling Your Bills | UK Air Con Tracker",
  description: "How to stay cool without the £300 energy bill. Timer scheduling, off-peak tariffs, window film, fan+AC combos. £4.99 — instant digital download.",
};

export default function EnergyGuidePage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / Products / Energy Bill Guide
          </nav>
          <div className="mt-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1">
              <span className="text-xs font-semibold text-brand">Digital guide — £4.99</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              The Energy Bill Crash Course
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              Your portable AC doesn&rsquo;t have to cost £200/month to run. This 8-page guide shows you exactly how to cut your summer energy bill — without sweating through the heatwave.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "When to run the AC (and when a £20 fan does the same job)",
                "The off-peak tariff trick that saves £80-120 per summer",
                "Timer scheduling: cool the room before you get home, not all day",
                "Window film + curtains: cut heat gain by 5°C before the AC even turns on",
                "Fan + AC combo: the science of why it works and how to set it up",
                "The 5 appliances secretly driving your summer bill (that aren't the AC)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">✓</span>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <BuyButton productId="energy-guide" price="£4.99" label="Buy Now — £4.99" />
              <span className="text-xs text-foreground/50">Instant PDF · 8 pages · Practical, not academic</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl font-bold tracking-tight">What&rsquo;s in the guide</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "The tariff decoder", desc: "Economy 7, time-of-use, Agile Octopus — which one actually saves you money when you run AC." },
            { title: "The timer strategy", desc: "How to schedule cooling so you walk into a cold room but the AC only ran for 2 hours." },
            { title: "The fan multiplier", desc: "A £20 pedestal fan placed correctly makes your AC 30% more effective. Here's where to put it." },
            { title: "Stop cooling the street", desc: "Window seal gaps, curtain tricks, door snakes. The cheap fixes that pay back in a week." },
            { title: "Room zoning", desc: "Why cooling the whole house is a mistake — and how to zone your AC for max comfort at min cost." },
            { title: "The appliance audit", desc: "Your fridge, freezer, and dehumidifier might be heating the room your AC is trying to cool." },
          ].map((item) => (
            <div key={item.title} className="border border-line bg-surface p-5">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-foreground/65">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t rule-strong bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight">£4.99 to save £100+ this summer</h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-white/70">Eight pages. Concrete numbers. No vague advice. You'll either save the £4.99 on your next bill or we'll refund it.</p>
          <BuyButton
            productId="energy-guide"
            price="£4.99"
            label="Get the guide — £4.99"
            variant="inverse"
            className="mt-6 inline-block"
          />
        </div>
      </section>
    </div>
  );
}
