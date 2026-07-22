"use client";

import { useState } from "react";
import {
  DIGITAL_PRODUCTS,
  DIGITAL_SKU_IDS,
  formatDigitalPrice,
  primaryUpsellForCategory,
  type DigitalSkuId,
} from "@/lib/digital-products";

async function startCheckout(opts: {
  sku: DigitalSkuId;
  country: string;
  productSlug?: string;
  category?: string;
}) {
  const res = await fetch("/api/checkout/digital", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Checkout unavailable");
  }
  window.location.href = data.url;
}

/** Compact ghost CTA under Buy now — never steals the primary click. */
export function DigitalUpsellInline({
  country,
  category,
  productSlug,
  currencySymbol = "£",
}: {
  country: string;
  category: string;
  productSlug?: string;
  currencySymbol?: string;
}) {
  const product = primaryUpsellForCategory(category);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setErr(null);
          setBusy(true);
          try {
            await startCheckout({
              sku: product.id,
              country,
              productSlug,
              category,
            });
          } catch (e) {
            setErr(e instanceof Error ? e.message : "Try again");
            setBusy(false);
          }
        }}
        className="text-left text-sm font-semibold text-foreground/55 underline-offset-4 hover:text-brand hover:underline disabled:opacity-50"
      >
        {busy
          ? "Opening checkout…"
          : `+ ${product.name} · ${formatDigitalPrice(product, currencySymbol)}`}
      </button>
      {err && <p className="mt-1 text-xs text-sold">{err}</p>}
    </div>
  );
}

/** Full strip of companions under the showroom. */
export function DigitalUpsellStrip({
  country,
  category,
  currencySymbol = "£",
}: {
  country: string;
  category?: string;
  currencySymbol?: string;
}) {
  const [busy, setBusy] = useState<DigitalSkuId | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <section className="border border-line bg-surface">
      <div className="border-b border-line px-5 py-4">
        <p className="eyebrow text-brand">After you buy the hardware</p>
        <h2 className="text-lg font-bold md:text-xl">
          Digital companions — small fee, less buyer&apos;s remorse
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-foreground/60">
          Amazon ships the box. We ship the certainty: room fit, setup, running cost.
        </p>
      </div>
      <div className="grid gap-0 md:grid-cols-3">
        {DIGITAL_SKU_IDS.map((id, i) => {
          const p = DIGITAL_PRODUCTS[id];
          return (
            <div
              key={id}
              className={`flex flex-col gap-3 p-5 ${i < 2 ? "border-b border-line md:border-b-0 md:border-r" : ""}`}
            >
              <p className="tnum text-sm font-bold text-brand">
                {formatDigitalPrice(p, currencySymbol)}
              </p>
              <h3 className="font-bold">{p.name}</h3>
              <p className="flex-1 text-sm text-foreground/65">{p.tagline}</p>
              <button
                type="button"
                disabled={busy === id}
                onClick={async () => {
                  setErr(null);
                  setBusy(id);
                  try {
                    await startCheckout({ sku: id, country, category });
                  } catch (e) {
                    setErr(e instanceof Error ? e.message : "Try again");
                    setBusy(null);
                  }
                }}
                className="self-start border border-foreground px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {busy === id ? "Opening…" : "Get PDF"}
              </button>
            </div>
          );
        })}
      </div>
      {err && (
        <p className="border-t border-line px-5 py-3 text-sm text-sold">{err}</p>
      )}
      <p className="border-t border-line px-5 py-3 text-xs text-foreground/45">
        Paid digital products are sold by Compare the Cool — separate from retailer affiliate links.
      </p>
    </section>
  );
}
