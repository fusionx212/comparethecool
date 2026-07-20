import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How UK Air Con Tracker handles your data: what we collect (restock-alert emails, anonymous click stats), cookies and affiliate tracking, who processes it, and your rights under UK GDPR.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Privacy
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Privacy policy</h1>
      <p className="mt-5 text-sm text-foreground/60">Last updated {SITE.legalUpdated}.</p>

      <div className="mt-10 space-y-9 text-sm leading-relaxed text-foreground/75">
        <Section title="Who we are">
          <p>
            {SITE.name} ({SITE.domain}) is operated by {SITE.company}, a company registered in England
            and Wales (company number {SITE.companyNumber}), registered address {SITE.registeredAddress}.
            We are the data controller for the personal data described here. For any privacy question or
            request, email{" "}
            <a className="text-brand hover:underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>.
          </p>
        </Section>

        <Section title="The short version">
          <p>
            We are a stock and price tracker — not a shop. We collect as little as possible. The only
            personal data we ever store is the email address you give us <em>if</em> you set a restock
            alert. We never sell your data. Outbound clicks are logged anonymously so we know which
            products people want. We don&rsquo;t run advertising or profiling cookies, and we don&rsquo;t
            load any affiliate tracking until you accept cookies.
          </p>
        </Section>

        <Section title="What we collect, and why">
          <h3 className="text-sm font-semibold text-foreground">1. Restock-alert emails</h3>
          <p className="mt-1">
            When you ask to be told a sold-out unit is back, we store your email address and which
            product you chose. We use it only to send that restock notification, on a double opt-in
            basis, and you can unsubscribe from any email. <strong>Legal basis: your consent.</strong>
          </p>
          <h3 className="mt-4 text-sm font-semibold text-foreground">2. Anonymous outbound-click stats</h3>
          <p className="mt-1">
            When you click through to a retailer, we record which product and retailer you clicked and
            the page you came from. This is not linked to your name or email and we do not store your IP
            address — it tells us, in aggregate, which products are in demand.{" "}
            <strong>Legal basis: our legitimate interest</strong> in understanding what to track.
          </p>
          <h3 className="mt-4 text-sm font-semibold text-foreground">3. Technical data</h3>
          <p className="mt-1">
            Our hosting provider processes standard server request data (such as IP address and browser
            type) to deliver and secure the site, as any website does. We don&rsquo;t use it to identify
            you.
          </p>
        </Section>

        <Section title="Cookies & affiliate tracking">
          <p>
            We don&rsquo;t set any non-essential cookies until you accept them in our cookie banner. If
            you accept:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              When you click through to a retailer (Amazon, eBay and others), the
              relevant affiliate network ({SITE.networks.join(", ")}) sets its own cookie on that
              retailer&rsquo;s site to credit the referral. We only ever see whether a sale happened, in
              anonymous, aggregate commission reports — never what you bought or who you are.
            </li>
          </ul>
          <p className="mt-3">
            If you reject cookies, none of the above loads and the site works normally — you simply go
            to retailers via plain links. You can change your mind any time using the cookie banner, or
            by clearing this site&rsquo;s data in your browser.
          </p>
        </Section>

        <Section title="Who processes your data">
          <p>
            We use trusted providers who act on our instructions: <strong>Supabase</strong> (database
            that stores alert sign-ups and anonymous click stats), <strong>Netlify</strong> (website
            hosting), and an email-delivery provider to send restock alerts. Outbound monetisation runs
            through the affiliate networks named above. Some of these providers process data outside the
            UK/EEA (including the United States); where they do, that transfer is covered by appropriate
            safeguards such as the UK International Data Transfer Agreement or equivalent.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep your restock-alert email only until you unsubscribe or the alert is no longer
            relevant, after which it is deleted. Anonymous click stats are retained in aggregate and
            contain no personal data.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under UK GDPR you have the right to access, correct, delete or restrict the personal data we
            hold about you, to object to processing, to data portability, and to withdraw consent at any
            time. To exercise any of these, email{" "}
            <a className="text-brand hover:underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>. You also have the right to complain to the UK&rsquo;s Information Commissioner&rsquo;s
            Office (ICO) at{" "}
            <a className="text-brand hover:underline" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy as the site evolves. The date at the top shows when it was last
            reviewed; material changes will be reflected here.
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
