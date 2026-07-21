import Link from "next/link";

const BRAND_COOL = {
  name: "Compare the Cool",
  tagline: "Expert cooling reviews & live price comparison",
  gradient: "from-brand-ink via-brand to-brand",
  icon: "❄️",
};

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="ouac-grid relative overflow-hidden border-b border-line bg-gradient-to-br from-brand-ink via-brand to-brand-deep text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
          <span className="mb-6 inline-block text-5xl md:text-6xl" aria-hidden="true">
            {BRAND_COOL.icon}
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {BRAND_COOL.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            {BRAND_COOL.tagline}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">
            Independent expert reviews, live prices across retailers, and honest buying guides
            for cooling, heating, and air quality products — across Europe, the UK, US, and Australia.
          </p>
        </div>
      </section>

      {/* ── Country Grid ── */}
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CountryCard code="uk" flag="🇬🇧" name="United Kingdom" />
          <CountryCard code="de" flag="🇩🇪" name="Deutschland" />
          <CountryCard code="fr" flag="🇫🇷" name="France" />
          <CountryCard code="it" flag="🇮🇹" name="Italia" />
          <CountryCard code="es" flag="🇪🇸" name="España" />
          <CountryCard code="nl" flag="🇳🇱" name="Nederland" />
          <CountryCard code="us" flag="🇺🇸" name="United States" />
          <CountryCard code="au" flag="🇦🇺" name="Australia" />
        </div>
      </div>

      {/* ── Info strip ── */}
      <div className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-foreground/60">
          Live prices from Amazon and eBay · Updated daily · Independent reviews · Affiliate disclosure
        </div>
      </div>
    </>
  );
}

function CountryCard({ code, flag, name }: { code: string; flag: string; name: string }) {
  return (
    <Link
      href={`/${code}`}
      className="group border border-line bg-surface p-6 transition-colors hover:border-brand hover:bg-white"
    >
      <span className="text-2xl" aria-hidden="true">{flag}</span>
      <h3 className="mt-2 text-lg font-bold group-hover:text-brand">{name}</h3>
      <p className="mt-1 text-sm text-foreground/60">
        Best reviews & prices →</p>
    </Link>
  );
}
