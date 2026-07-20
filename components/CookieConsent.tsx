"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// PECR/UK GDPR-compliant consent gate. Non-essential cookies (the auto-link
// rewriter — Sovrn/VigLink) must not load until the user actively accepts.
// The choice is stored locally and broadcast so the auto-link script can react
// without a reload.
export const CONSENT_KEY = "uact-cookie-consent";
export const CONSENT_EVENT = "uact-consent";

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

function setConsent(value: Consent) {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function CookieConsent() {
  const [choice, setChoice] = useState<Consent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setChoice(readConsent());
  }, []);

  // Don't render anything on the server or until we know the stored choice —
  // avoids a hydration flash and never shows the banner to those who've decided.
  if (!mounted || choice !== null) return null;

  function decide(value: Consent) {
    setConsent(value);
    setChoice(value);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t rule-strong bg-surface"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/75">
          We use only essential cookies to run the site. With your consent, we also load affiliate
          link tracking so retailers can credit us when you buy — at no extra cost to you. No
          advertising or profiling cookies, ever. See our{" "}
          <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>.
        </p>
        <div className="flex flex-none gap-3">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="border border-foreground px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="border border-foreground bg-foreground px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
