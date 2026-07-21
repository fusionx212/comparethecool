import Link from "next/link";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { RunningCostCalculator } from "@/components/tools/RunningCostCalculator";

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export default async function RunningCostPage({
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
      <h1 className="mt-4 text-3xl font-bold md:text-4xl">Running-cost calculator</h1>
      <p className="mt-3 text-foreground/70">
        Estimate electricity cost for heaters, portable ACs, and dehumidifiers in {cc.name}. Edit
        the unit rate to match your bill.
      </p>
      <div className="mt-8">
        <RunningCostCalculator code={country} />
      </div>
    </div>
  );
}
