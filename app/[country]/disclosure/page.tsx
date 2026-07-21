import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

export default async function DisclosurePage({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);

  const isEU = cc.eu || code === "nl";

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Affiliate Disclosure — {cc.name}
      </h1>

      <div className="mt-10 space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Transparency Matters</h2>
          <p>
            Compare the Cool is an independent review and price comparison website. We want to be completely 
            transparent about how we generate revenue to support our work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Affiliate Partnerships</h2>
          <p>
            We participate in the Amazon Services LLC Associates Program, an affiliate advertising program 
            designed to provide a means for sites to earn advertising fees by advertising and linking to{" "}
            {cc.amazonMarketplace}.
          </p>
          <p className="mt-2">
            We also participate in the eBay Partner Network. When you click an eBay link on our site and 
            make a purchase, we may earn a commission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">eBay Partner Network</h2>
          <p>
            We are a participant in the eBay Partner Network (ePN). When you click on an eBay link 
            on our site and complete a purchase, we may earn a commission. Every eBay link clearly 
            states that clicking will take you to eBay. We do not auto-redirect, modify eBay logos, 
            use eBay in our domain name, or bid on eBay as a paid search term — in full compliance 
            with the ePN Agreement and Code of Conduct.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">What This Means For You</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You pay the same price as any other shopper — commissions do not increase your cost</li>
            <li>Our reviews and rankings are independent and never influenced by affiliate relationships</li>
            <li>We only recommend products we genuinely believe offer good value</li>
            <li>We do not accept payment for positive reviews</li>
          </ul>
        </section>

        {isEU && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">EU Omnibus Compliance</h2>
            <p>
              In compliance with the EU Omnibus Directive, we clearly label all affiliate links and disclose 
              our commercial relationships. Prices shown are accurate at the time of last check and may have 
              changed by the time you visit the retailer.
            </p>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships or how we make money, 
            please contact us at hello@comparethecool.com.
          </p>
        </section>
      </div>
    </div>
  );
}
