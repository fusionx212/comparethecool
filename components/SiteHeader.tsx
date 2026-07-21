'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const SITES = {
  cool: {
    name: "Compare the Cool",
    icon: "❄️",
    brand: "var(--brand)",
  },
  heat: {
    name: "Compare the Heat",
    icon: "🔥",
    brand: "var(--heat)",
  },
} as const;

export function SiteHeader() {
  const [site, setSite] = useState<keyof typeof SITES>("cool");

  useEffect(() => {
    // Detect comparetheheat.com via hostname
    const host = window.location.hostname.toLowerCase();
    if (host === "comparetheheat.com" || host === "www.comparetheheat.com") {
      setSite("heat");
    }
  }, []);

  const s = SITES[site];

  return (
    <header className="border-b rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span
              className="block h-5 w-5"
              style={{ backgroundColor: s.brand }}
              aria-hidden="true"
            />
            <span className="text-sm font-bold uppercase tracking-[0.18em]">
              {s.icon} {s.name}
            </span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/uk" className="text-sm text-foreground/70 hover:text-brand">🇬🇧 UK</Link>
            <Link href="/de" className="text-sm text-foreground/70 hover:text-brand">🇩🇪 DE</Link>
            <Link href="/fr" className="text-sm text-foreground/70 hover:text-brand">🇫🇷 FR</Link>
            <Link href="/it" className="text-sm text-foreground/70 hover:text-brand">🇮🇹 IT</Link>
            <Link href="/us" className="text-sm text-foreground/70 hover:text-brand">🇺🇸 US</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
