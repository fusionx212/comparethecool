"use client";

import { useEffect, useId, useState } from "react";
import { logAffiliateClick } from "@/lib/clicks";

export type DealOption = {
  id: string;
  label: string;
  priceLabel: string;
  href: string;
  hint: string;
};

/**
 * Soft exit: stay on-site until shopper picks a deal.
 * Same brand styling for every retailer — no Amazon orange / eBay red.
 * Disclosure stays; links remain sponsored + new tab.
 */
export function DealActions({
  country,
  productSlug,
  options,
  primaryLabel = "See today's deals",
  compact = false,
}: {
  country: string;
  productSlug: string;
  options: DealOption[];
  primaryLabel?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!options.length) return null;

  const best = options[0];

  return (
    <>
      <div className={compact ? "flex flex-wrap gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          {primaryLabel}
        </button>
        {!compact && (
          <a
            href={best.href}
            target="_blank"
            rel="noopener sponsored nofollow"
            className="border border-foreground px-5 py-3 text-center text-sm font-bold hover:border-brand hover:text-brand"
            onClick={() => {
              void logAffiliateClick({
                country_code: country,
                product_slug: productSlug,
                retailer_id: best.id,
              });
            }}
          >
            Quick deal · {best.priceLabel}
          </a>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md border border-line-strong bg-surface shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-line px-5 py-4">
              <p className="eyebrow text-foreground/50">Choose a deal</p>
              <h3 id={titleId} className="mt-1 text-lg font-bold">
                Compare today&apos;s prices
              </h3>
              <p className="mt-1 text-xs text-foreground/55">
                You&apos;ll open the retailer in a new tab. We may earn a commission at no extra
                cost to you.
              </p>
            </div>
            <ul className="divide-y divide-line">
              {options.map((opt, i) => (
                <li key={opt.id}>
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener sponsored nofollow"
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-cool"
                    onClick={() => {
                      void logAffiliateClick({
                        country_code: country,
                        product_slug: productSlug,
                        retailer_id: opt.id,
                      });
                      setOpen(false);
                    }}
                  >
                    <span>
                      <span className="eyebrow text-brand">
                        {i === 0 ? "Best today" : `Option ${i + 1}`}
                      </span>
                      <span className="mt-1 block font-semibold">{opt.label}</span>
                      <span className="text-xs text-foreground/50">{opt.hint}</span>
                    </span>
                    <span className="tnum text-right text-lg font-bold text-brand">
                      {opt.priceLabel}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-3">
              <button
                type="button"
                className="text-sm font-semibold text-foreground/60 hover:text-brand"
                onClick={() => setOpen(false)}
              >
                Stay on this page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
