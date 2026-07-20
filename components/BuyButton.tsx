"use client";

import { useState } from "react";

interface BuyButtonProps {
  productId: string;
  price: string;
  label?: string;
  variant?: "primary" | "inverse";
  className?: string;
}

export default function BuyButton({
  productId,
  price,
  label,
  variant = "primary",
  className = "",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/buy-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const baseClasses =
    variant === "inverse"
      ? "border border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-ink hover:bg-transparent hover:text-white"
      : "border border-brand bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep";

  return (
    <div className={className}>
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`${baseClasses} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
      >
        {loading ? "Redirecting to checkout…" : label || `Buy Now — ${price}`}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
