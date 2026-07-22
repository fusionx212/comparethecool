import Link from "next/link";
import { COUNTRIES, getCountry } from "@/lib/countries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export default async function ToolsIndex({
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
      <h1 className="mt-4 text-3xl font-bold">Free tools — {cc.name}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Free calculators below. Paid Room Fit / Setup / Running Cost PDFs live on the
        country home next to Buy now.
      </p>
      <div className="mt-8 grid gap-0 border border-line">
        <Link
          href={`/${country}/tools/btu-calculator`}
          className="border-b border-line bg-surface px-5 py-5 hover:bg-surface-cool"
        >
          <span className="font-bold">BTU / room-size calculator</span>
          <p className="mt-1 text-sm text-foreground/60">Size a portable AC before you buy</p>
        </Link>
        <Link
          href={`/${country}/tools/running-cost`}
          className="bg-surface px-5 py-5 hover:bg-surface-cool"
        >
          <span className="font-bold">Running-cost calculator</span>
          <p className="mt-1 text-sm text-foreground/60">Estimate kWh cost for heat &amp; cool devices</p>
        </Link>
      </div>
    </div>
  );
}
