import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate disclosure & how we make money",
  description:
    "How UK Air Con Tracker stays free: we earn affiliate commission when you buy through our outbound links, at no extra cost to you. Our stock and price data is independent.",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Disclosure
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
        Affiliate disclosure &amp; how we make money
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/75">
        <p>
          UK Air Con Tracker is free to use. We keep it that way by earning a commission when you buy
          through some of the outbound links on this site. If you click through to a retailer and buy,
          we may receive a small payment <strong>at no extra cost to you</strong> — you pay the same
          price you would have anyway.
        </p>
        <div>
          <h2 className="text-base font-semibold text-foreground">Our independence</h2>
          <p className="mt-2">
            Commission never changes what we show you. Stock status and prices come from retailer data,
            not from who pays us most. The cheapest in-stock option is always shown as the cheapest —
            full stop.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Prices &amp; stock change fast</h2>
          <p className="mt-2">
            During a heatwave, stock and prices move by the hour. We check regularly and timestamp every
            figure, but always confirm the live price and availability on the retailer&rsquo;s own site
            before you buy.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Who we work with</h2>
          <p className="mt-2">
            Links are monetised through established affiliate networks covering major UK retailers
            including Amazon and eBay. As an Amazon Associate, UK Air Con
            Tracker earns from qualifying purchases. We are not owned by, or speaking for, any of
            them.
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
      >
        ← Back to the tracker
      </Link>
    </div>
  );
}
