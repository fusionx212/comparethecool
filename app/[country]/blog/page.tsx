import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

export default async function BlogListPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        {cc.flag} Blog & Articles — {cc.name}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        Expert advice, buying guides, and product comparisons for cooling and heating products available in {cc.name}. 
        All prices in {cc.currencySymbol}.
      </p>

      <div className="mt-10">
        <p className="py-10 text-center text-foreground/50">
          Blog articles loading from our database. Check back for the latest guides.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/${code}/best/portable-air-conditioners`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          Best Portable Air Conditioners
        </Link>
        <Link
          href={`/${code}/best/dehumidifiers`}
          className="rounded-none border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          Best Dehumidifiers
        </Link>
      </div>
    </div>
  );
}
