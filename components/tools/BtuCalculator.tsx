"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/** Pure client BTU / room-size calculator — zero Netlify / LLM burn. */
export function BtuCalculator({
  code,
  currencySymbol,
}: {
  code: string;
  currencySymbol: string;
}) {
  const [sqm, setSqm] = useState(20);
  const [sunny, setSunny] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  const result = useMemo(() => {
    let btu = sqm * 70;
    if (sunny) btu *= 1.1;
    if (kitchen) btu *= 1.15;
    const low = Math.round(btu * 0.9);
    const high = Math.round(btu * 1.1);
    return { mid: Math.round(btu), low, high };
  }, [sqm, sunny, kitchen]);

  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <label className="block">
        <span className="eyebrow text-foreground/50">Room size (m²)</span>
        <input
          type="number"
          min={5}
          max={120}
          value={sqm}
          onChange={(e) => setSqm(Number(e.target.value) || 0)}
          className="mt-2 w-full border border-line bg-background px-4 py-3 tnum text-lg"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sunny} onChange={(e) => setSunny(e.target.checked)} />
          Sunny / south-facing
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} />
          Kitchen / heat sources
        </label>
      </div>
      <div className="mt-8 border-t border-line pt-6">
        <p className="eyebrow text-brand">Recommended BTU</p>
        <p className="tnum mt-2 text-4xl font-bold">
          {result.low.toLocaleString()}–{result.high.toLocaleString()}
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Mid estimate {result.mid.toLocaleString()} BTU for {sqm} m². Then compare live{" "}
          {currencySymbol} prices:
        </p>
        <Link
          href={`/${code}/best/portable-air-conditioners`}
          className="mt-4 inline-block bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          Best portable ACs →
        </Link>
      </div>
    </div>
  );
}
