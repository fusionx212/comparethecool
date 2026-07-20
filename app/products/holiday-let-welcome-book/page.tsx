import type { Metadata } from "next";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Holiday Let Welcome Book Template — Editable PDF | UK Air Con Tracker",
  description: "Professional editable welcome book template for holiday lets. Cover guest info, house rules, AC instructions, WiFi, emergency contacts. £14.99 — instant download.",
};

export default function WelcomeBookPage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / Products / Holiday Let Welcome Book
          </nav>
          <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1">
                <span className="led" style={{ backgroundColor: "var(--brand)" }} aria-hidden />
                <span className="text-xs font-semibold text-brand">Digital product</span>
              </div>
              <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
                Holiday Let Welcome Book Template
              </h1>
              <p className="mt-4 max-w-lg text-base text-foreground/70">
                The editable welcome book your guests actually read. Instructions for the AC, WiFi, bins, heating, parking, local tips — all professionally laid out. Customise in 10 minutes, PDF download, reuse forever.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Editable PDF — fill in your details, print or email",
                  "AC & heating instructions section (guests will actually read it)",
                  "House rules, WiFi password, emergency contacts",
                  "Local recommendations page — pubs, walks, takeaways",
                  "Checkout instructions — stops guests leaving the heating on",
                  "Reuse for every booking, every property, forever",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">✓</span>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <BuyButton productId="welcome-book" price="£14.99" label="Buy Now — £14.99" />
                <span className="text-xs text-foreground/50">Instant download · No subscription · VAT receipt</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm rounded-xl border-2 border-dashed border-line bg-surface p-8 text-center">
                <div className="mx-auto h-48 w-36 rounded border border-line bg-white shadow-sm">
                  <div className="mt-6 space-y-2 px-3">
                    <div className="h-2 w-full rounded bg-brand/20" />
                    <div className="h-2 w-3/4 rounded bg-brand/10" />
                    <div className="h-2 w-5/6 rounded bg-brand/10" />
                    <div className="mt-4 h-2 w-1/2 rounded bg-brand/30" />
                    <div className="h-2 w-full rounded bg-brand/10" />
                    <div className="h-2 w-full rounded bg-brand/10" />
                    <div className="h-2 w-2/3 rounded bg-brand/10" />
                  </div>
                </div>
                <p className="mt-4 text-xs font-medium text-foreground/50">Welcome Book preview — 12-page editable PDF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl font-bold tracking-tight">What&rsquo;s inside the template</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Welcome page", desc: "Personal greeting, your contact details, check-in/out times." },
            { title: "AC & heating guide", desc: "How to use the air con, thermostat, and heating — stops guests calling at midnight." },
            { title: "WiFi & entertainment", desc: "Network name, password, TV instructions, streaming services." },
            { title: "House rules", desc: "Noise, smoking, pets, parties, bin day — clear and polite." },
            { title: "Kitchen instructions", desc: "Oven, microwave, dishwasher, recycling — no mystery appliances." },
            { title: "Emergency contacts", desc: "Plumber, electrician, doctor, vet, your number — guests feel safer." },
            { title: "Checkout checklist", desc: "Strip beds, empty bins, lock up, where to leave keys." },
            { title: "Local recommendations", desc: "Your favourite pub, the best walk, the reliable taxi number." },
            { title: "Parking & transport", desc: "Where to park, bus routes, nearest station, EV charging points." },
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
          <h2 className="text-2xl font-bold tracking-tight">One template. Every booking. Forever.</h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-white/70">
            £14.99. Editable PDF. Instant download. Use it for every property, every guest, every year. No subscription, no upsell.
          </p>
          <BuyButton
            productId="welcome-book"
            price="£14.99"
            label="Get the Welcome Book — £14.99"
            variant="inverse"
            className="mt-6 inline-block"
          />
          <p className="mt-3 text-xs text-white/40">Payment by Stripe · Instant download · VAT receipt · 30-day money-back</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl font-bold tracking-tight">Questions</h2>
        <dl className="mt-6 border-y border-line">
          {[
            { q: "Is this a physical book?", a: "No — it's an editable PDF. You download it instantly after payment, fill in your details, and either print it or email it to guests. Nothing ships." },
            { q: "Can I use it for multiple properties?", a: "Yes. One purchase covers you for all your properties. Edit the template per property and save a separate copy for each." },
            { q: "Do I need special software?", a: "No. It's a standard PDF with fillable fields. Works in Adobe Reader (free), Preview on Mac, or any PDF editor. You can also print it blank and write by hand." },
            { q: "Can I change the colours or add my logo?", a: "The editable fields let you add your property name and details. For full customisation (colours, logo, branding), we include a Canva template link — edit it however you like." },
            { q: "What if I don't like it?", a: "30-day money-back guarantee. If the template doesn't work for you, email us and we'll refund you — no questions asked." },
          ].map((item) => (
            <div key={item.q} className="border-b border-line py-5 last:border-b-0">
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 max-w-2xl text-sm text-foreground/70">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-line bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="eyebrow text-foreground/50">Bundle and save</div>
              <p className="text-sm text-foreground/80">
                <strong>Holiday Let Agreement Template</strong> — the legal contract to go with your welcome book. From £29/yr at HolidayLetContracts.
              </p>
            </div>
            <a
              href="https://holidayletcontracts.co.uk"
              target="_blank"
              rel="noopener"
              className="self-start border border-brand bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep sm:self-center"
            >
              Get the contract →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
