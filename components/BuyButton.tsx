"use client";

import { logAffiliateClick } from "@/lib/clicks";

export function BuyButton({
  href,
  label,
  variant = "amazon",
  country,
  productSlug,
  retailerId,
}: {
  href: string;
  label: string;
  variant?: "amazon" | "ebay" | "neutral";
  country: string;
  productSlug: string;
  retailerId: string;
}) {
  const cls =
    variant === "amazon"
      ? "bg-[#ff9900] text-[#111] hover:brightness-105"
      : variant === "ebay"
        ? "bg-[#e53238] text-white hover:brightness-105"
        : "border border-foreground text-foreground hover:border-brand hover:text-brand";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored nofollow"
      className={`inline-flex items-center justify-center px-5 py-3 text-sm font-bold ${cls}`}
      onClick={() => {
        void logAffiliateClick({
          country_code: country,
          product_slug: productSlug,
          retailer_id: retailerId,
        });
      }}
    >
      {label}
    </a>
  );
}
