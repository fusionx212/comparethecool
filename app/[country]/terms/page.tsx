import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

export default async function TermsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Terms of Use — {cc.name}
      </h1>

      <div className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance</h2>
          <p>By using Compare the Cool ({cc.name} edition), you accept these terms. If you disagree, please discontinue use.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. Information Accuracy</h2>
          <p>Product prices and stock information are checked periodically and may have changed since last update. We make every effort to keep data accurate but cannot guarantee real-time accuracy. Always verify prices on the retailer&apos;s website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. Affiliate Links</h2>
          <p>Some links on this site are affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you. This helps us maintain the site and keep our content free.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
          <p>All content, reviews, and comparisons are original works of Compare the Cool. Unauthorised reproduction is prohibited.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Limitation of Liability</h2>
          <p>We provide information &ldquo;as is&rdquo;. We are not liable for any loss arising from use of this site or reliance on its data, including purchasing decisions.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Governing Law</h2>
          <p>These terms are governed by English law. Any disputes shall be resolved in the courts of England and Wales.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">7. Contact</h2>
          <p>Contact us at hello@comparethecool.com</p>
        </section>
      </div>
    </div>
  );
}
