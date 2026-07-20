import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with UK Air Con Tracker — report a wrong price or stock status, ask a privacy question, or reach the team behind the tracker.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Contact
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Contact us</h1>
      <p className="mt-5 text-base text-foreground/75">
        A real person reads these. Whether you&rsquo;ve spotted a price or stock status that looks
        wrong, have a privacy request, or want to talk to the team behind the tracker, here&rsquo;s how
        to reach us.
      </p>

      <div className="mt-10 border rule-strong bg-surface p-7">
        <div className="eyebrow text-foreground/50">Email</div>
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="tnum mt-2 block text-lg font-semibold text-brand hover:underline"
        >
          {SITE.contactEmail}
        </a>
        <p className="mt-4 text-sm text-foreground/65">
          We aim to reply within two working days. For a wrong price or stock figure, please include
          the product name and the retailer so we can check it quickly.
        </p>
      </div>

      <div className="mt-8 grid gap-6 text-sm text-foreground/70 sm:grid-cols-2">
        <div className="border-l border-line pl-5">
          <div className="eyebrow text-foreground/50">Operated by</div>
          <p className="mt-2">
            {SITE.company}
            <br />
            Company no. {SITE.companyNumber}
          </p>
        </div>
        <div className="border-l border-line pl-5">
          <div className="eyebrow text-foreground/50">Registered address</div>
          <p className="mt-2">{SITE.registeredAddress}</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-foreground/60">
        Looking for how we handle your data? See our{" "}
        <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>.
      </p>

      <Link
        href="/"
        className="mt-10 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
      >
        ← Back to the tracker
      </Link>
    </div>
  );
}
