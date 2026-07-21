import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

const CATEGORIES: { slug: string; label: string; icon: string }[] = [
  { slug: "portable-air-conditioners", label: "Portable Air Conditioners", icon: "❄️" },
  { slug: "dehumidifiers", label: "Dehumidifiers", icon: "💧" },
  { slug: "air-purifiers", label: "Air Purifiers", icon: "🌬️" },
  { slug: "tower-fans", label: "Tower Fans", icon: "🌀" },
  { slug: "evaporative-coolers", label: "Evaporative Coolers", icon: "💨" },
  { slug: "electric-blankets", label: "Electric Blankets", icon: "🛌" },
  { slug: "fridges-freezers", label: "Fridges & Freezers", icon: "🧊" },
  { slug: "chest-freezers", label: "Chest Freezers", icon: "📦" },
  { slug: "wine-coolers", label: "Wine Coolers", icon: "🍷" },
  { slug: "mini-fridges", label: "Mini Fridges", icon: "🧰" },
  { slug: "tumble-dryers", label: "Tumble Dryers", icon: "👕" },
  { slug: "ceiling-fans", label: "Ceiling Fans", icon: "🔁" },
  { slug: "patio-heaters", label: "Patio Heaters", icon: "🔥" },
  { slug: "towel-radiators", label: "Towel Radiators", icon: "🛁" },
];

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const { country: code } = await params;
  const cc = getCountry(code);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-10 ouac-grid border border-line bg-surface p-8 text-center">
        <p className="eyebrow mb-2 text-foreground/60">{cc.flag} {cc.name}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Best Cooling & Heating Products in {cc.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Expert reviews, live prices, and honest buying guides for {cc.name}. We track stock and prices across top retailers so you get the best deal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={`/${code}/best/portable-air-conditioners`}
            className="rounded-none bg-brand px-6 py-3 text-sm font-bold text-white hover:brightness-110"
          >
            Best Portable Air Conditioners
          </Link>
          <Link
            href={`/${code}/best/dehumidifiers`}
            className="rounded-none border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:border-brand hover:text-brand"
          >
            Best Dehumidifiers
          </Link>
          <Link
            href={`/${code}/best/air-purifiers`}
            className="rounded-none border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:border-brand hover:text-brand"
          >
            Best Air Purifiers
          </Link>
          <Link
            href={`/${code}/best/fridges-freezers`}
            className="rounded-none border border-foreground px-6 py-3 text-sm font-bold text-foreground hover:border-brand hover:text-brand"
          >
            Best Fridges & Freezers
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Latest Reviews & Guides</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} code={code} {...cat} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href={`/${code}/blog`} className="rounded-none border border-line bg-surface px-6 py-4 text-sm font-semibold hover:border-brand hover:text-brand">
            📰 Blog & Articles
          </Link>
          <Link href={`/${code}/privacy`} className="rounded-none border border-line bg-surface px-6 py-4 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand">
            Privacy Policy
          </Link>
          <Link href={`/${code}/terms`} className="rounded-none border border-line bg-surface px-6 py-4 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand">
            Terms of Use
          </Link>
          <Link href={`/${code}/disclosure`} className="rounded-none border border-line bg-surface px-6 py-4 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand">
            Affiliate Disclosure
          </Link>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ code, slug, label, icon }: { code: string; slug: string; label: string; icon: string }) {
  return (
    <Link
      href={`/${code}/best/${slug}`}
      className="group border border-line bg-surface p-6 transition-colors hover:border-brand"
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <h3 className="mb-1 mt-2 text-lg font-bold group-hover:text-brand">{label}</h3>
      <p className="text-sm text-foreground/60">Read our expert review →</p>
    </Link>
  );
}
