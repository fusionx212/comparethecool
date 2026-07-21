import Link from "next/link";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { BtuCalculator } from "@/components/tools/BtuCalculator";

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export default async function BtuToolPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const cc = getCountry(country);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href={`/${country}`} className="eyebrow text-foreground/50 hover:text-brand">
        ← {cc.name}
      </Link>
      <h1 className="mt-4 text-3xl font-bold md:text-4xl">BTU / room-size calculator</h1>
      <p className="mt-3 text-foreground/70">
        Estimate the cooling power you need, then jump to live Amazon and eBay comparisons for{" "}
        {cc.name}. Runs entirely in your browser.
      </p>
      <div className="mt-8">
        <BtuCalculator code={country} currencySymbol={cc.currencySymbol} />
      </div>
    </div>
  );
}
