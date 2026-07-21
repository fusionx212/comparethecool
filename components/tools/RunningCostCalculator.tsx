"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ENERGY_RATES } from "@/lib/energy-rates";
import { getCountry } from "@/lib/countries";

export function RunningCostCalculator({ code }: { code: string }) {
  const defaults = ENERGY_RATES[code] || ENERGY_RATES.uk;
  const cc = getCountry(code);
  const [watts, setWatts] = useState(2000);
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState(30);
  const [rate, setRate] = useState(defaults.rate);

  const cost = useMemo(() => {
    const kwh = (watts / 1000) * hours * days;
    return { kwh, total: kwh * rate };
  }, [watts, hours, days, rate]);

  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-foreground/50">Device watts</span>
          <input
            type="number"
            value={watts}
            onChange={(e) => setWatts(Number(e.target.value) || 0)}
            className="mt-2 w-full border border-line bg-background px-4 py-3 tnum"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-foreground/50">Hours / day</span>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value) || 0)}
            className="mt-2 w-full border border-line bg-background px-4 py-3 tnum"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-foreground/50">Days</span>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value) || 0)}
            className="mt-2 w-full border border-line bg-background px-4 py-3 tnum"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-foreground/50">
            Unit rate ({cc.currencySymbol}/kWh) — {defaults.label}
          </span>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="mt-2 w-full border border-line bg-background px-4 py-3 tnum"
          />
        </label>
      </div>
      <div className="mt-8 border-t border-line pt-6">
        <p className="eyebrow text-brand">Estimated cost</p>
        <p className="tnum mt-2 text-4xl font-bold">
          {cc.currencySymbol}
          {cost.total.toFixed(2)}
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          {cost.kwh.toFixed(1)} kWh over {days} days. Thermostats cut real spend — treat this as a
          ceiling.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/${code}/best/oil-radiators`}
            className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
          >
            Oil radiators →
          </Link>
          <Link
            href={`/${code}/best/portable-air-conditioners`}
            className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
          >
            Portable ACs →
          </Link>
        </div>
      </div>
    </div>
  );
}
