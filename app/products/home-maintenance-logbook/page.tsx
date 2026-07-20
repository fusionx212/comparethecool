import type { Metadata } from "next";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Home Maintenance Logbook — Track Everything, Miss Nothing | UK Air Con Tracker",
  description: "Never miss a boiler service, AC filter change, or warranty expiry again. Editable spreadsheet + printable PDF. £7.99 — instant download.",
};

export default function LogbookPage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <nav className="eyebrow text-foreground/45">
            <Link href="/" className="hover:text-brand">Home</Link> / Products / Home Maintenance Logbook
          </nav>
          <div className="mt-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1">
              <span className="text-xs font-semibold text-brand">Digital product — £7.99</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Home Maintenance Logbook</h1>
            <p className="mt-4 text-lg text-foreground/70">
              You just spent £300+ on a portable AC. Do you know when the filter needs cleaning? When the boiler was last serviced? When the home insurance renews? This logbook tracks all of it — so nothing lapses.
            </p>
            <div className="mt-6 space-y-2">
              {[
                "AC service log — filter cleans, deep cleans, warranty expiry",
                "Boiler & heating — annual service dates, pressure checks, radiator bleeds",
                "Appliance register — serial numbers, purchase dates, warranty periods",
                "Insurance tracker — home, contents, boiler cover renewal dates",
                "EPC & gas safety — expiry dates and certificate numbers (landlords need this)",
                "Editable spreadsheet + printable PDF — use it how you want",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">✓</span>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <BuyButton productId="maintenance-logbook" price="£7.99" label="Buy Now — £7.99" />
              <span className="text-xs text-foreground/50">Editable spreadsheet + PDF · Instant download</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t rule-strong bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight">£7.99 to protect thousands in appliances</h2>
          <p className="mt-3 max-w-md mx-auto text-sm text-white/70">One missed boiler service, one lapsed warranty, one forgotten EPC renewal — any of those costs more than £7.99. The logbook pays for itself the first time it saves you from a lapse.</p>
          <BuyButton
            productId="maintenance-logbook"
            price="£7.99"
            label="Get the Logbook — £7.99"
            variant="inverse"
            className="mt-6 inline-block"
          />
        </div>
      </section>
    </div>
  );
}
