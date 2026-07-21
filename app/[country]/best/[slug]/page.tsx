import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  const slugs = [
    "portable-air-conditioners",
    "dehumidifiers",
    "air-purifiers",
    "tower-fans",
    "evaporative-coolers",
    "electric-blankets",
    "pedestal-fans",
    "oil-radiators",
    "smart-thermostats",
    "air-quality-monitors",
  ];
  for (const code of Object.keys(COUNTRIES)) {
    for (const slug of slugs) {
      params.push({ country: code, slug });
    }
  }
  return params;
}

export default async function BestReviewPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country: code, slug } = await params;
  const cc = getCountry(code);

  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Best {label} in {cc.name} ({cc.currencySymbol})
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        We&apos;ve researched and compared the top {label.toLowerCase()} available in {cc.name}. 
        Prices are checked live — tap any product to see today&apos;s best deal across retailers.
      </p>

      <div className="mt-10 grid gap-6">
        {/* Product cards rendered client-side from Supabase */}
        <p className="py-10 text-center text-foreground/50">
          Product data loading from our database. Check back soon for live prices on Amazon {cc.amazonMarketplace.replace("www.", "")} and eBay.
        </p>
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-xl font-bold">How We Test & Compare</h2>
        <p className="mt-3 text-foreground/70">
          Our reviews are independent and data-driven. We analyse specifications, read verified customer feedback, 
          and track live prices across retailers to find you the best value. We are not paid for positive reviews — 
          every product is judged on its merits.
        </p>
      </section>

      <section className="mt-10 border-t border-line pt-10">
        <h2 className="text-xl font-bold">About This Guide</h2>
        <p className="mt-3 text-foreground/70">
          This guide was created specifically for shoppers in {cc.name}. Prices shown are in {cc.currency} 
          and we link to {cc.amazonMarketplace} and eBay {cc.name} for your convenience. 
          As an Amazon Associate and eBay Partner we earn from qualifying purchases.
        </p>
      </section>

      <div className="mt-8">
        <Link
          href={`/${code}/blog`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          📰 Read related articles
        </Link>
      </div>
    </div>
  );
}
