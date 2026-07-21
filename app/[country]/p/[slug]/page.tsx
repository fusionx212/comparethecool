import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

// Product pages — params generated at build time from country list
export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  const slugs = [
    "portable-air-conditioner",
    "dehumidifier",
    "air-purifier",
    "tower-fan",
    "pedestal-fan",
    "evaporative-cooler",
    "oil-radiator",
    "electric-blanket",
    "smart-thermostat",
  ];
  for (const code of Object.keys(COUNTRIES)) {
    for (const slug of slugs) {
      params.push({ country: code, slug });
    }
  }
  return params;
}

export default async function ProductPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
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
        {label}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        Detailed product information and pricing for {label.toLowerCase()} in {cc.name}. 
        Compare live prices across {cc.amazonMarketplace} and eBay.
      </p>

      <div className="mt-10">
        <p className="py-10 text-center text-foreground/50">
          Product details loading from our database. Prices in {cc.currencySymbol}.
        </p>
      </div>
    </div>
  );
}
