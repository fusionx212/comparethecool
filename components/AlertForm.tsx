"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type Opt = { slug: string; name: string; popularity?: number };

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_path?: string;
};

function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const p = new URL(window.location.href).searchParams;
  const out: Attribution = {};

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const) {
    const v = p.get(key);
    if (v) out[key] = v;
  }

  out.referrer = document.referrer || undefined;
  out.landing_path = window.location.pathname;

  return out;
}

export function AlertForm({
  products,
  initialProduct,
}: {
  products: Opt[];
  initialProduct?: string;
}) {
  const [email, setEmail] = useState("");
  const [productSlug, setProductSlug] = useState(initialProduct ?? "");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  // Combobox state
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sort by popularity (highest first), then alphabetically
  const sorted = useMemo(
    () =>
      [...products].sort((a, b) => {
        const pa = a.popularity ?? 0;
        const pb = b.popularity ?? 0;
        if (pa !== pb) return pb - pa;
        return a.name.localeCompare(b.name);
      }),
    [products],
  );

  // Filter by query — match anywhere in name (case-insensitive)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((p) => p.name.toLowerCase().includes(q));
  }, [sorted, query]);

  const selectedName = products.find((p) => p.slug === productSlug)?.name ?? "";

  // Reset highlight when filtered results change
  useEffect(() => {
    setHighlightIdx(0);
  }, [filtered.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && open) {
      const item = listRef.current.children[highlightIdx] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx, open]);

  function select(slug: string) {
    setProductSlug(slug);
    setQuery("");
    setOpen(false);
    setHighlightIdx(0);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIdx]) select(filtered[highlightIdx].slug);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!productSlug) return;
    setState("sending");
    try {
      const attribution = readAttribution();
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug, ...attribution }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("done");
      setMessage(data.message ?? "You're on the list. We'll email you the moment it's back.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="border rule-strong bg-surface p-7">
        <span className="led" style={{ backgroundColor: "var(--instock)" }} aria-hidden />
        <h2 className="mt-4 text-lg font-semibold">Alert set</h2>
        <p className="mt-2 text-sm text-foreground/70">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border rule-strong bg-surface p-7">
      <label className="block">
        <span className="eyebrow text-foreground/60">Which unit?</span>

        {/* Combobox */}
        <div className="relative mt-2">
          <input
            ref={inputRef}
            type="text"
            value={open ? query : selectedName || query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder={selectedName ? "" : "Search for a product…"}
            className="w-full border border-line bg-background px-3 py-2.5 pr-8 text-sm focus:border-brand focus:outline-none"
            autoComplete="off"
          />
          {/* Chevron */}
          <svg
            className={`pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 12 8"
            aria-hidden
          >
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Dropdown */}
          {open && (
            <ul
              ref={listRef}
              className="absolute left-0 right-0 top-full z-50 mt-0.5 max-h-64 overflow-y-auto border border-line bg-background shadow-lg"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-sm text-foreground/40">No products found</li>
              ) : (
                filtered.map((p, i) => (
                  <li
                    key={p.slug}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(p.slug);
                    }}
                    onMouseEnter={() => setHighlightIdx(i)}
                    className={`cursor-pointer px-3 py-2.5 text-sm ${
                      i === highlightIdx
                        ? "bg-brand/10 text-brand"
                        : "text-foreground/80 hover:bg-surface-cool"
                    } ${p.slug === productSlug ? "font-semibold" : ""}`}
                  >
                    {p.name}
                    {p.popularity !== undefined && p.popularity > 0 && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-foreground/25">
                        #{p.popularity}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </label>

      <label className="mt-5 block">
        <span className="eyebrow text-foreground/60">Your email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending" || !productSlug}
        className="mt-6 w-full border border-foreground bg-foreground px-5 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand disabled:opacity-50"
      >
        {state === "sending" ? "Setting alert…" : "Email me when it's back"}
      </button>

      {state === "error" && <p className="mt-3 text-xs" style={{ color: "var(--sold)" }}>{message}</p>}

      <p className="mt-4 text-xs text-foreground/50">
        Double opt-in. One email per restock, unsubscribe any time. We never sell your address.
      </p>
    </form>
  );
}
