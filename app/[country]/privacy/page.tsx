import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

export default async function PrivacyPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);

  const isEU = cc.eu || code === "uk" || code === "nl";

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Privacy Policy — {cc.name}
      </h1>

      <div className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
          <p>
            Compare the Cool (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy. 
            This policy explains how we collect, use, and protect your personal data when you visit our {cc.name} website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email address</strong> — only if you subscribe to price-drop alerts</li>
            <li><strong>Usage data</strong> — anonymised page views to improve our content</li>
            <li><strong>Affiliate referral data</strong> — standard HTTP headers when you click out to retailers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. Cookies</h2>
          <p>We use only essential cookies for site operation. Affiliate tracking scripts load only with your explicit consent via our cookie banner.</p>
          {isEU && (
            <p className="mt-2">
              This site complies with the UK GDPR and EU ePrivacy Directive. You can withdraw consent at any time.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Third Parties</h2>
          <p>We link to {cc.amazonMarketplace}, eBay {cc.name}, and other retailers. These sites have their own privacy policies. We share no personal data with them unless you explicitly click through.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your data. Email us at privacy@comparethecool.com to exercise these rights. We respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Contact</h2>
          <p>Privacy questions: privacy@comparethecool.com</p>
        </section>
      </div>
    </div>
  );
}
