import type { Metadata } from "next";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Heatwave Emergency Checklist — Survive When AC Is Sold Out | UK Air Con Tracker",
  description: "All AC units sold out? Don't panic. One-page PDF checklist: cooling without AC, heatstroke signs, pet safety, what to buy now. £2.99 — instant download.",
};

export default function HeatwaveChecklistPage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / Products / Heatwave Emergency Checklist
          </nav>
          <div className="mt-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1">
              <span className="text-xs font-semibold text-brand">Digital checklist — £2.99</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Heatwave Emergency Checklist</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Every AC unit you want is sold out. The temperature is climbing. The kids can&rsquo;t sleep. This is the checklist you need <em>right now</em> — what to do, what to buy, and when to get medical help. One page. Print it. Stick it on the fridge.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "8 immediate things you can do right now to drop room temperature",
                "The £25 emergency cooling kit (all on Amazon Prime, in stock)",
                "How to set up a cross-breeze with just two fans and open windows",
                "Heat exhaustion vs heatstroke — how to tell the difference (and when to call 999)",
                "Pet safety: cooling mats, paddling pools, signs of overheating in dogs",
                "Baby and toddler cooling: what's safe, what isn't, what the NHS says",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">✓</span>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <BuyButton productId="heatwave-checklist" price="£2.99" label="Buy Now — £2.99" />
              <span className="text-xs text-foreground/50">One-page PDF · Print or keep on phone</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t rule-strong bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight">£2.99 to know what to do when the heat hits</h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-white/70">Sold out everywhere? This checklist is never out of stock. Download, print, breathe. You&rsquo;ve got this.</p>
          <BuyButton
            productId="heatwave-checklist"
            price="£2.99"
            label="Get the checklist — £2.99"
            variant="inverse"
            className="mt-6 inline-block"
          />
        </div>
      </section>
    </div>
  );
}
