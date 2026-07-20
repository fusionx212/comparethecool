import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms for using UK Air Con Tracker: we provide independent stock and price information for guidance only; always confirm live price and availability on the retailer's own site before buying.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Terms
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Terms of use</h1>
      <p className="mt-5 text-sm text-foreground/60">Last updated {SITE.legalUpdated}.</p>

      <div className="mt-10 space-y-9 text-sm leading-relaxed text-foreground/75">
        <Section title="About these terms">
          <p>
            {SITE.name} ({SITE.domain}) is operated by {SITE.company} (company number{" "}
            {SITE.companyNumber}). By using the site you agree to these terms. If you don&rsquo;t agree,
            please don&rsquo;t use the site.
          </p>
        </Section>

        <Section title="What the site is — and isn't">
          <p>
            We are an independent tracker that shows stock availability and prices for fans, air
            conditioners and coolers across UK retailers. We are <strong>not a shop</strong>: you can&rsquo;t
            buy anything from us. Every purchase is made directly with the retailer, on their site and
            under their terms. We are not the seller, agent or guarantor for any product or retailer.
          </p>
        </Section>

        <Section title="Accuracy & 'always check the retailer'">
          <p>
            Stock and prices change extremely fast in a heatwave. We check and timestamp our data, but
            it is provided <strong>for guidance only</strong> and may be out of date by the time you read
            it. The price and availability shown on the retailer&rsquo;s own checkout is always the
            authoritative one — confirm it there before you buy. We don&rsquo;t warrant that the
            information is complete, current or error-free.
          </p>
        </Section>

        <Section title="Affiliate links">
          <p>
            Some outbound links are affiliate links: if you buy after clicking, we may earn a commission
            at no extra cost to you. This never changes the prices or ranking we show. See our{" "}
            <Link href="/disclosure" className="text-brand hover:underline">affiliate disclosure</Link>{" "}
            for the detail.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            To the fullest extent permitted by law, we are not liable for any loss arising from reliance
            on the information here, from acting on a price or stock status that has since changed, or
            from your dealings with any retailer. Nothing in these terms limits liability that cannot be
            limited by law. Your statutory rights as a consumer — which sit with the retailer you buy
            from — are unaffected.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            The site&rsquo;s design, text and original data compilation belong to {SITE.company}. Product
            names and retailer brands are the property of their respective owners and are used for
            identification only. You may link to us freely.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of England and Wales, and the courts of England and
            Wales have exclusive jurisdiction.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email{" "}
            <a className="text-brand hover:underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>.
          </p>
        </Section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
      >
        ← Back to the tracker
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
