"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/categories";

const NAV = [
  { href: "/installation", label: "Installation" },
  { href: "/guides/geepas-vs-meaco-dehumidifiers", label: "Guides" },
  { href: "/tools/btu-calculator", label: "BTU Calc" },
  { href: "/alerts", label: "Alerts" },
];

const sortedCategories = [...CATEGORIES].sort((a, b) => a.order - b.order);

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="relative z-40 border-b rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={close}>
            <span className="block h-5 w-5 bg-brand" aria-hidden />
            <span className="text-sm font-bold uppercase tracking-[0.18em] leading-none sm:text-base sm:tracking-[0.22em]">
              UK Air Con Tracker
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 md:flex">
            {/* Categories dropdown */}
            <div className="group relative">
              <button
                type="button"
                className="eyebrow flex items-center gap-1 text-foreground/70 hover:text-brand cursor-pointer"
              >
                Categories
                <svg viewBox="0 0 12 8" className="h-2.5 w-2.5 fill-current" aria-hidden>
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-30 grid w-[560px] grid-cols-3 gap-x-6 gap-y-1 border rule-strong bg-surface p-5 opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                {sortedCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="px-2 py-1.5 text-sm text-foreground/75 hover:bg-surface-cool hover:text-brand"
                  >
                    {c.shortName}
                  </Link>
                ))}
              </div>
            </div>
            {/* Top-level links */}
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="eyebrow text-foreground/70 hover:text-brand whitespace-nowrap">
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 md:hidden cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="eyebrow text-foreground/70">{open ? "Close" : "Menu"}</span>
            <svg viewBox="0 0 18 14" className="h-3.5 w-4.5" aria-hidden>
              {open ? (
                <path d="M2 2l14 10M2 12L16 2" stroke="currentColor" strokeWidth="2" fill="none" />
              ) : (
                <path d="M0 1h18M0 7h18M0 13h12" stroke="currentColor" strokeWidth="2" fill="none" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — full-screen overlay */}
      {open && (
        <div className="fixed inset-0 top-[57px] z-50 overflow-y-auto bg-surface md:hidden">
          <div className="border-b rule-strong px-5 py-4">
            <span className="eyebrow text-foreground/35">Categories</span>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {sortedCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  onClick={close}
                  className="py-1.5 text-sm text-foreground/75 hover:text-brand"
                >
                  {c.shortName}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-b rule-strong px-5 py-4">
            <span className="eyebrow text-foreground/35">Pages</span>
            <div className="mt-3 flex flex-col gap-1">
              {[
                ...NAV,
                { href: "/installation", label: "Installation" },
                { href: "/installers", label: "For installers" },
                { href: "/about", label: "About" },
                { href: "/how-we-track", label: "How we track" },
                { href: "/contact", label: "Contact" },
                { href: "/disclosure", label: "Disclosure" },
              ].map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={close}
                  className="py-1.5 text-sm text-foreground/75 hover:text-brand"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-5 py-4">
            <Link
              href="/alerts"
              onClick={close}
              className="inline-block w-full border border-foreground bg-foreground px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
            >
              Get restock alerts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
