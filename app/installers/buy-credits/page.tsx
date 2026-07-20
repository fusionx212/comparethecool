"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CREDIT_PACKS } from "@/lib/credits";

function BuyCreditsContent() {
  const searchParams = useSearchParams();
  const installerId = searchParams.get("id") || "";
  const installerEmail = searchParams.get("email") || "";
  const cancelled = searchParams.get("status") === "cancelled";

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleBuy = async (packId: string) => {
    if (!installerId) {
      setError("Missing installer ID. Go back to your account page.");
      return;
    }
    setLoading(packId);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, installerId, installerEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-2xl font-bold">Buy lead credits</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Credits never expire. Pay once, use whenever leads come in. All payments processed securely via Stripe.
      </p>

      {cancelled && (
        <div className="mt-4 border border-line bg-surface-cool px-4 py-3 text-sm">
          Purchase cancelled. No payment was taken.
        </div>
      )}

      {error && (
        <div className="mt-4 border border-sold bg-[#fef2f2] px-4 py-3 text-sm text-sold">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`border rule-strong p-6 ${
              pack.popular
                ? "border-brand-deep bg-[#f0f9fc] ring-1 ring-brand-deep"
                : "bg-surface"
            }`}
          >
            {pack.popular && (
              <div className="mb-3 inline-block border border-brand bg-brand px-2 py-0.5 text-xs font-semibold uppercase text-background">
                Most popular
              </div>
            )}
            <div className="text-sm font-semibold uppercase tracking-wider">{pack.name}</div>
            <div className="mt-2 text-3xl font-bold tabular-nums">{pack.priceLabel}</div>
            <div className="text-xs text-foreground/50">{pack.perLead}</div>

            <ul className="mt-4 space-y-1.5 text-sm text-foreground/60">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-2.5 w-2.5 flex-shrink-0 bg-instock" />
                {pack.credits} pre-qualified leads
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-2.5 w-2.5 flex-shrink-0 bg-instock" />
                No monthly fees
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 block h-2.5 w-2.5 flex-shrink-0 bg-instock" />
                Credits never expire
              </li>
            </ul>

            <button
              onClick={() => handleBuy(pack.id)}
              disabled={loading !== null || !installerId}
              className={`mt-5 w-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider ${
                pack.popular
                  ? "border-brand-deep bg-brand-deep text-background hover:bg-brand"
                  : "border-foreground bg-foreground text-background hover:border-brand hover:bg-brand"
              } disabled:opacity-50`}
            >
              {loading === pack.id ? "Redirecting..." : `Buy ${pack.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border rule-strong bg-surface-cool p-4 text-sm text-foreground/60">
        <strong className="text-foreground">How it works:</strong> Credits are added to your account instantly after payment. Each lead you claim deducts 1 credit. You can buy more anytime — credits never expire.
      </div>
    </div>
  );
}

export default function BuyCreditsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BuyCreditsContent />
    </Suspense>
  );
}
