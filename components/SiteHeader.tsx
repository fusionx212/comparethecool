"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [heat, setHeat] = useState(false);

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const isHeat = host.includes("comparetheheat");
    setHeat(isHeat);
    document.documentElement.dataset.site = isHeat ? "heat" : "cool";
  }, []);

  const name = heat ? "Compare the Heat" : "Compare the Cool";

  return (
    <header className="border-b rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="block h-5 w-5 bg-brand" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-[0.18em]">{name}</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/uk" className="text-sm text-foreground/70 hover:text-brand">UK</Link>
            <Link href="/de" className="text-sm text-foreground/70 hover:text-brand">DE</Link>
            <Link href="/fr" className="text-sm text-foreground/70 hover:text-brand">FR</Link>
            <Link href="/us" className="text-sm text-foreground/70 hover:text-brand">US</Link>
            <Link href="/au" className="text-sm text-foreground/70 hover:text-brand">AU</Link>
            <Link href="/uk/tools/btu-calculator" className="text-sm text-foreground/70 hover:text-brand">
              Tools
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
