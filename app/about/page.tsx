import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About UK Air Con Tracker — an independent live tracker of fan and air-conditioning stock and prices across UK retailers, and the team that runs it.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / About
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">About the tracker</h1>
      <p className="mt-5 text-base text-foreground/75">
        When a heatwave hits, fans and portable air conditioners sell out in hours and prices jump. The
        usual &ldquo;best cooling to buy&rdquo; guides are written once and left to rot — they tell you
        what&rsquo;s good, not what&rsquo;s actually <em>buyable right now</em>. {SITE.name} exists to
        answer that one question accurately and fast.
      </p>

      <div className="mt-10 space-y-9 text-sm leading-relaxed text-foreground/75">
        <Section title="What we do">
          <p>
            We track stock and prices for fans, air conditioners and coolers across the major UK
            retailers — Amazon and eBay — and show you what&rsquo;s in
            stock, where, and for how much, with the time each figure was last checked. When something is
            sold out, you can set a free restock alert instead of refreshing retailer pages yourself.
          </p>
        </Section>

        <Section title="Independent by design">
          <p>
            We don&rsquo;t sell anything. We make money through affiliate commission when you buy via our
            outbound links, at no extra cost to you — but commission never changes what we show: the
            cheapest in-stock option is always shown as the cheapest. Read exactly{" "}
            <Link href="/how-we-track" className="text-brand hover:underline">how we track</Link> and our{" "}
            <Link href="/disclosure" className="text-brand hover:underline">affiliate disclosure</Link>.
          </p>
        </Section>

        <Section title="Who runs it">
          <p>
            {SITE.name} is built and operated by {SITE.company} (company number {SITE.companyNumber}), a
            UK company based in Bedford. We&rsquo;re a small independent team — there&rsquo;s a real
            person behind the data and behind the inbox.
          </p>
        </Section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-block border border-foreground bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
        >
          See what&rsquo;s in stock
        </Link>
        <Link
          href="/contact"
          className="inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
        >
          Contact us
        </Link>
      </div>
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
