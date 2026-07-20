import type { Metadata } from "next";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "UK Home Cooling Handbook — Choose, Install & Save | UK Air Con Tracker",
  description: "The complete guide to staying cool in a British summer. How to pick the right AC, install it properly, cut running costs, and avoid the mistakes everyone makes. £4.99 — instant PDF download.",
};

export default function CoolingHandbookPage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / Products / UK Home Cooling Handbook
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1">
                <span className="text-xs font-semibold text-brand">Instant PDF download — £4.99</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                The UK Home Cooling Handbook
              </h1>
              <p className="mt-4 text-lg text-foreground/70">
                Everything you need to stay cool this summer — without wasting money on the wrong unit or paying a fortune in electricity. 28 pages. Written for British homes. Updated July 2026.
              </p>

              <div className="mt-6 space-y-2">
                {[
                  { title: "How to pick the right AC", detail: "Room size, BTU, insulation, window type — the 5-minute decision guide. Never buy an undersized unit again." },
                  { title: "Install it yourself in an afternoon", detail: "Window kit hacks, avoiding draughts, sealing trick that drops noise by 6dB. No tradie needed." },
                  { title: "Cut your running costs", detail: "The real cost per hour, timer strategies, which temperature actually saves money, and why 'auto' mode costs more." },
                  { title: "Maintenance that doubles lifespan", detail: "Filter cleaning schedule, coil de-icing, what to do before winter storage. Most units die at year 3 — here's how to make yours last 8." },
                  { title: "The £25 emergency cooling kit", detail: "What to buy when every AC is sold out. All on Amazon Prime, all under £25 total." },
                  { title: "Winter mode explained", detail: "How heat pump ACs slash your heating bill. The numbers for UK electricity vs gas prices." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">✓</span>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{item.title}</span>
                      <p className="text-xs text-foreground/55">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <BuyButton productId="cooling-handbook" price="£4.99" label="Buy Now — £4.99" />
                <span className="text-xs text-foreground/50">28-page PDF · Instant download · Read on any device</span>
              </div>

              <p className="mt-4 text-xs text-foreground/40">
                One-off purchase. No subscription. We may earn from product links inside the guide (all clearly marked).
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center border rule-strong bg-surface p-12">
              <div className="text-center">
                <div className="mx-auto w-48 border-2 border-brand/30 bg-brand/5 p-8 shadow-lg">
                  <div className="text-6xl mb-4">❄️</div>
                  <div className="text-lg font-bold leading-tight text-brand">
                    UK Home Cooling Handbook
                  </div>
                  <div className="mt-2 text-xs text-foreground/50">
                    2026 Edition
                  </div>
                </div>
                <p className="mt-4 text-xs text-foreground/40">Cover illustration — actual PDF is text + diagrams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t rule-strong bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="text-2xl font-bold tracking-tight">Who is this for?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { emoji: "🏠", title: "First-time AC buyer", body: "You've never bought an air conditioner before and don't want to waste £300+ on the wrong unit. This guide walks you through the decision in plain English." },
              { emoji: "💰", title: "Running-cost conscious", body: "You want to stay cool but you're worried about the electricity bill. We show you exactly how to run your AC for 30-40% less without sacrificing comfort." },
              { emoji: "🏡", title: "Property manager / landlord", body: "You're buying AC for a rental. We cover what tenants actually use, which units survive heavy use, and the install method that prevents wall damage." },
            ].map((item) => (
              <div key={item.title} className="border rule-strong bg-background p-5">
                <div className="text-3xl">{item.emoji}</div>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/65">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="text-2xl font-bold tracking-tight">Quick answers</h2>
          <dl className="mt-6 max-w-2xl space-y-4">
            {[
              { q: "Is this just a PDF?", a: "Yes — a 28-page PDF you can read on your phone, tablet, or print out. No app, no login, no DRM. Buy it once, keep it forever." },
              { q: "What if I already own an AC?", a: "Sections 3-5 (running costs, maintenance, winter storage) are written for current owners. You'll probably find a way to cut your bill." },
              { q: "Why £4.99 and not free?", a: "The site is free because retailers pay us a small commission when you buy through our links. This guide has no retailer links — it's independent advice, so we charge a small one-off fee to keep the lights on." },
              { q: "Can I get a refund?", a: "If the guide doesn't help you, email us within 14 days and we'll refund you. No questions asked." },
            ].map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold text-foreground">{faq.q}</dt>
                <dd className="mt-1 text-sm text-foreground/65">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t rule-strong bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight">£4.99 to never buy the wrong AC again</h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-white/70">
            Most people overspend by £100+ because they don&rsquo;t know what size they need. This guide pays for itself before you even click &ldquo;buy.&rdquo;
          </p>
          <BuyButton
            productId="cooling-handbook"
            price="£4.99"
            label="Get the handbook — £4.99"
            variant="inverse"
            className="mt-6 inline-block"
          />
        </div>
      </section>
    </div>
  );
}
