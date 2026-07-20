"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bestOffer } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const ROOM_SIZES = [
  { label: "Small bedroom / office (≤15m²)", btuMin: 0, btuMax: 7000 },
  { label: "Standard bedroom (15–20m²)", btuMin: 5000, btuMax: 9000 },
  { label: "Living room (20–30m²)", btuMin: 7000, btuMax: 12000 },
  { label: "Large open-plan (30–40m²)", btuMin: 10000, btuMax: 16000 },
  { label: "Any size — show all", btuMin: 0, btuMax: 99999 },
];

const BUDGETS = [
  { label: "Under £200", max: 200 },
  { label: "£200 – £400", min: 200, max: 400 },
  { label: "£400 – £600", min: 400, max: 600 },
  { label: "£600+", min: 600, max: 99999 },
  { label: "Any budget", min: 0, max: 99999 },
];

const FEATURES = [
  { id: "wifi", label: "📱 WiFi / Smart", match: (p: Product) => p.name?.toLowerCase().includes("wifi") || p.name?.toLowerCase().includes("smart") || p.highlights?.some(h => h.toLowerCase().includes("wifi")) },
  { id: "heating", label: "🔥 Heating mode", match: (p: Product) => p.name?.toLowerCase().includes("heat") || p.highlights?.some(h => h.toLowerCase().includes("heat")) },
  { id: "quiet", label: "🤫 Quiet (<60dB)", match: (p: Product) => (p.noise ?? 99) < 60 },
  { id: "dehumidifier", label: "💧 Dehumidifier built-in", match: (p: Product) => p.name?.toLowerCase().includes("dehumidif") || p.highlights?.some(h => h.toLowerCase().includes("dehumidif")) },
  { id: "energy", label: "⚡ Class A energy", match: (p: Product) => p.name?.toLowerCase().includes("class a") || p.highlights?.some(h => h.toLowerCase().includes("class a") || h.toLowerCase().includes("energy")) },
];

export default function StockSelector() {
  const [products, setProducts] = useState<Product[]>([]);
  const [room, setRoom] = useState(2); // default: living room
  const [budget, setBudget] = useState(4); // default: any budget
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState<"price" | "btu" | "noise">("price");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const roomRange = ROOM_SIZES[room];
  const budgetRange = BUDGETS[budget];

  const filtered = products
    .filter(p => p.category === "portable-air-conditioners")
    .filter(p => {
      const btu = p.btu ?? 0;
      return btu >= roomRange.btuMin && btu <= roomRange.btuMax;
    })
    .filter(p => {
      // Was p.offers[0] — whichever offer happened to sit first in the array
      // (usually Amazon, an artifact of insertion order), ignoring eBay/Hughes
      // entirely. bestOffer() considers every offer and picks the cheapest
      // buyable one, same helper the rest of the site already uses.
      const price = bestOffer(p)?.price ?? 0;
      return price >= (budgetRange.min ?? 0) && price <= (budgetRange.max ?? 99999);
    })
    .filter(p => {
      if (features.length === 0) return true;
      return features.every(fid => {
        const feat = FEATURES.find(f => f.id === fid);
        return feat ? feat.match(p) : true;
      });
    })
    .filter(p => p.offers?.some(o => o.status === "in_stock" || o.status === "low_stock"))
    .sort((a, b) => {
      const priceA = bestOffer(a)?.price ?? 0;
      const priceB = bestOffer(b)?.price ?? 0;
      const btuA = a.btu ?? 0;
      const btuB = b.btu ?? 0;
      const noiseA = a.noise ?? 99;
      const noiseB = b.noise ?? 99;
      if (sort === "price") return priceA - priceB;
      if (sort === "btu") return btuA - btuB;
      return noiseA - noiseB;
    });

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-surface rounded" />
          <div className="h-4 w-96 bg-surface rounded" />
          <div className="h-64 bg-surface rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Tools / Stock Selector
      </nav>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: filters */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find your air conditioner
          </h1>
          <p className="mt-3 text-base text-foreground/70">
            Three questions, instant results. Only shows units that are actually in stock right now.
          </p>

          {/* Step 1: Room size */}
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">1</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Room size</h2>
            </div>
            <div className="mt-3 space-y-1">
              {ROOM_SIZES.map((rs, i) => (
                <button
                  key={rs.label}
                  onClick={() => setRoom(i)}
                  className={`block w-full text-left px-4 py-3 text-sm border transition-colors ${
                    room === i
                      ? "border-brand bg-brand/5 text-brand font-semibold"
                      : "border-line bg-surface text-foreground/70 hover:border-foreground/20"
                  }`}
                >
                  {rs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Budget */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">2</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Budget</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {BUDGETS.map((b, i) => (
                <button
                  key={b.label}
                  onClick={() => setBudget(i)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    budget === i
                      ? "border-brand bg-brand/5 text-brand font-semibold"
                      : "border-line bg-surface text-foreground/70 hover:border-foreground/20"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Features */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">3</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Must-have features</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURES.map(f => {
                const active = features.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => setFeatures(active ? features.filter(x => x !== f.id) : [...features, f.id])}
                    className={`px-3 py-2 text-xs border transition-colors ${
                      active
                        ? "border-brand bg-brand/10 text-brand font-semibold"
                        : "border-line bg-surface text-foreground/60 hover:border-foreground/20"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            {features.length > 0 && (
              <button
                onClick={() => setFeatures([])}
                className="mt-2 text-xs text-brand hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Right: results */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {filtered.length} unit{filtered.length !== 1 ? "s" : ""} in stock
            </h2>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="border border-line bg-surface px-3 py-1.5 text-xs"
            >
              <option value="price">Sort: Price ↑</option>
              <option value="btu">Sort: Power ↑</option>
              <option value="noise">Sort: Quietest</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 border rule-strong bg-surface p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm text-foreground/60">
                No units match all your filters. Try a wider budget or different features.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filtered.map(p => (
                <ProductCard key={p.slug} product={p} variant="row" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seasonal pitch */}
      <div className="mt-16 border-t rule-strong pt-12">
        <div className="rounded-lg border border-brand/20 bg-brand/5 p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h2 className="text-xl font-bold">Not sure if now is the right time?</h2>
          <p className="mt-2 max-w-lg mx-auto text-sm text-foreground/65">
            AC prices follow a predictable seasonal pattern. Spring is for prep, summer is for urgency, 
            autumn is for bargains, winter is for heat pumps. We track prices year-round — use our BTU 
            calculator to nail the size, then set a price alert for your target.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/tools/btu-calculator" className="border border-brand bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep">
              BTU Calculator →
            </Link>
            <Link href="/products/home-cooling-handbook" className="border border-line bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-brand">
              Cooling Handbook £4.99 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
