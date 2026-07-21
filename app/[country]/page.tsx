import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";
import {
  ALL_YEAR_CATEGORIES,
  CATEGORY_LABELS,
  COOLING_CATEGORIES,
  HEATING_CATEGORIES,
} from "@/lib/catalog/contract";
import type { CategorySlug } from "@/lib/types";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

function orderedCategories(code: string): { slug: CategorySlug; label: string; lane: string }[] {
  const month = new Date().getUTCMonth();
  const southern = code === "au";
  const coolingSeason = southern ? month >= 9 || month <= 2 : month >= 3 && month <= 8;

  const primary = (coolingSeason ? COOLING_CATEGORIES : HEATING_CATEGORIES).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: coolingSeason ? "Cooling" : "Heating",
  }));
  const secondary = (coolingSeason ? HEATING_CATEGORIES : COOLING_CATEGORIES).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: coolingSeason ? "Heating" : "Cooling",
  }));
  const yearRound = ALL_YEAR_CATEGORIES.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: "All year",
  }));

  const seen = new Set<string>();
  const out: { slug: CategorySlug; label: string; lane: string }[] = [];
  for (const item of [...primary, ...yearRound, ...secondary]) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
  }
  return out;
}

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);
  const cats = orderedCategories(code);
  const featured = cats.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-10 ouac-grid border border-line bg-surface p-8 md:p-10">
        <p className="eyebrow mb-2 text-foreground/60">{cc.name}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Best cooling &amp; heating products in {cc.name}
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Season-aware guides with Amazon and eBay prices from our catalog — built for year-round
          demand, not one heatwave spike.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {featured.map((c) => (
            <Link
              key={c.slug}
              href={`/${code}/best/${c.slug}`}
              className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
            >
              Best {c.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/${code}/tools/btu-calculator`}
            className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
          >
            BTU calculator
          </Link>
          <Link
            href={`/${code}/tools/running-cost`}
            className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
          >
            Running-cost calculator
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <div className="mt-6 grid gap-0 border border-line sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${code}/best/${cat.slug}`}
              className="group border-b border-line last:border-b-0 sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n+1)]:border-l-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/img/categories/${cat.slug}.svg`}
                alt=""
                className="aspect-[4/3] w-full object-cover bg-surface-cool"
                loading="lazy"
              />
              <span className="flex items-center justify-between px-5 py-4">
                <span>
                  <span className="eyebrow text-foreground/40">{cat.lane}</span>
                  <span className="mt-1 block font-bold group-hover:text-brand">{cat.label}</span>
                </span>
                <span className="text-sm text-foreground/50">Review →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${code}/blog`} className="border border-line bg-surface px-5 py-3 text-sm font-semibold hover:border-brand hover:text-brand">
            Blog &amp; articles
          </Link>
          <Link href={`/${code}/disclosure`} className="border border-line bg-surface px-5 py-3 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand">
            Affiliate disclosure
          </Link>
          <Link href={`/${code}/privacy`} className="border border-line bg-surface px-5 py-3 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand">
            Privacy
          </Link>
        </div>
      </section>
    </div>
  );
}
