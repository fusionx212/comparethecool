import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { AlertForm } from "@/components/AlertForm";

// ISR: track the 2-hourly stock cron so live counts/statuses don't freeze at deploy time.
export const revalidate = 7200;

export const metadata: Metadata = {
  title: "Restock alerts — get told when sold-out cooling is back in stock",
  description:
    "Set a free restock alert and we'll email you the moment a sold-out fan or portable air conditioner is buyable again at a UK retailer.",
  alternates: { canonical: "/alerts" },
};

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; confirmed?: string; unsubscribed?: string }>;
}) {
  const { product, confirmed, unsubscribed } = await searchParams;
  const products = (await getAllProducts()).map((p) => ({ slug: p.slug, name: p.name, popularity: p.popularity }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Restock alerts
      </nav>

      {confirmed === "1" && (
        <StatusBanner tone="ok" text="Confirmed — you're locked in. We'll email you the moment it's back in stock." />
      )}
      {confirmed === "0" && (
        <StatusBanner tone="error" text="That confirmation link is invalid or has expired — set a new alert below." />
      )}
      {unsubscribed === "1" && (
        <StatusBanner tone="ok" text="You're unsubscribed — we won't email you about this alert again." />
      )}
      {unsubscribed === "0" && (
        <StatusBanner tone="error" text="That unsubscribe link is invalid or has expired." />
      )}

      <div className="mt-5 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
            Get the restock alert.
          </h1>
          <p className="mt-5 max-w-md text-base text-foreground/70">
            The best fans and portable air conditioners sell out in hours during a heatwave. Pick a
            unit, leave your email, and we&rsquo;ll tell you the instant it&rsquo;s back — usually
            before it sells out again.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "We watch stock across Amazon and eBay",
              "One email per restock — no spam, no daily digest",
              "Works for sold-out units and price drops alike",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm text-foreground/80">
                <span className="led mt-1.5 flex-none" style={{ backgroundColor: "var(--brand)" }} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <AlertForm products={products} initialProduct={product} />
      </div>
    </div>
  );
}

function StatusBanner({ tone, text }: { tone: "ok" | "error"; text: string }) {
  return (
    <div
      className="mt-5 border px-4 py-3 text-sm rule-strong"
      style={{
        borderColor: tone === "ok" ? "var(--instock)" : "var(--sold)",
        color: tone === "ok" ? "var(--instock)" : "var(--sold)",
      }}
    >
      {text}
    </div>
  );
}
