"use client";

import Link from "next/link";
import { HeroEntrance } from "@/components/HeroEntrance";

export const dynamic = "force-static";

export default function Home() {
  return (
    <HeroEntrance>
      <section className="ouac-grid border-b border-line bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="eyebrow text-white/60">Compare the Cool · Compare the Heat</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
            Expert reviews &amp; live prices
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Cooling, heating, and air-quality products across the UK, EU, US, and Australia —
            year-round catalog, not a one-season spike.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/uk" className="bg-brand px-6 py-3 text-sm font-bold text-white hover:brightness-110">
              Shop UK
            </Link>
            <Link href="/de" className="border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              Shop Deutschland
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-0 border border-line sm:grid-cols-2 lg:grid-cols-4">
          <CountryCard code="uk" name="United Kingdom" />
          <CountryCard code="de" name="Deutschland" />
          <CountryCard code="fr" name="France" />
          <CountryCard code="it" name="Italia" />
          <CountryCard code="es" name="España" />
          <CountryCard code="nl" name="Nederland" />
          <CountryCard code="us" name="United States" />
          <CountryCard code="au" name="Australia" />
        </div>
      </div>

      <div className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-foreground/60">
          Independent reviews · We may earn from qualifying purchases —{" "}
          <Link href="/uk/disclosure" className="underline hover:text-brand">
            disclosure
          </Link>
        </div>
      </div>
    </HeroEntrance>
  );
}

function CountryCard({ code, name }: { code: string; name: string }) {
  return (
    <Link
      href={`/${code}`}
      className="group border-b border-r border-line bg-surface p-6 transition-colors hover:bg-surface-cool"
      data-hero-card
    >
      <p className="eyebrow text-foreground/40">{code.toUpperCase()}</p>
      <h3 className="mt-2 text-lg font-bold group-hover:text-brand">{name}</h3>
      <p className="mt-1 text-sm text-foreground/60">Best reviews &amp; prices →</p>
    </Link>
  );
}
