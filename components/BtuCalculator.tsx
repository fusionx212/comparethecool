"use client";

import { useState } from "react";
import { recommendBtu, type SunLevel } from "@/lib/btu";

export function BtuCalculator() {
  const [roomM2, setRoomM2] = useState(16);
  const [sun, setSun] = useState<SunLevel>("average");
  const [occupants, setOccupants] = useState(1);
  const [ceilingHigh, setCeilingHigh] = useState(false);

  const result = recommendBtu({ roomM2, sun, occupants, ceilingHigh });

  return (
    <div className="grid gap-0 border-l border-t border-line md:grid-cols-2">
      {/* Inputs */}
      <div className="border-b border-r border-line bg-surface p-7">
        <div className="eyebrow text-brand-deep">Your room</div>

        <label className="mt-6 block">
          <span className="eyebrow text-foreground/60">Floor area — m²</span>
          <input
            type="number"
            min={2}
            max={120}
            value={roomM2}
            onChange={(e) => setRoomM2(Number(e.target.value) || 0)}
            className="tnum mt-2 w-full border border-line bg-background px-3 py-2 text-lg focus:border-brand focus:outline-none"
          />
        </label>

        <fieldset className="mt-6">
          <span className="eyebrow text-foreground/60">Sunlight</span>
          <div className="mt-2 grid grid-cols-3 border-l border-t border-line">
            {(["shaded", "average", "sunny"] as SunLevel[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSun(s)}
                className={`border-b border-r border-line px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                  sun === s ? "bg-foreground text-background" : "bg-surface hover:bg-surface-cool"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block">
          <span className="eyebrow text-foreground/60">People usually in the room</span>
          <input
            type="number"
            min={1}
            max={12}
            value={occupants}
            onChange={(e) => setOccupants(Number(e.target.value) || 1)}
            className="tnum mt-2 w-full border border-line bg-background px-3 py-2 text-lg focus:border-brand focus:outline-none"
          />
        </label>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={ceilingHigh}
            onChange={(e) => setCeilingHigh(e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          <span className="text-sm text-foreground/80">High / vaulted ceiling</span>
        </label>
      </div>

      {/* Readout */}
      <div className="ouac-grid border-b border-r border-line bg-surface p-7">
        <div className="eyebrow text-brand-deep">Recommended size</div>
        <div className="tnum mt-4 text-5xl font-bold leading-none">
          {result.recommendedBtu.toLocaleString("en-GB")}
          <span className="ml-2 text-lg font-semibold text-foreground/50">BTU</span>
        </div>
        <div className="tnum mt-2 text-sm text-foreground/55">
          ≈ {result.approxKilowatts} kW cooling
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <div className="eyebrow text-foreground/50">Sensible buying band</div>
          <div className="tnum mt-2 text-lg font-semibold">
            {result.bandLow.toLocaleString("en-GB")} – {result.bandHigh.toLocaleString("en-GB")} BTU
          </div>
        </div>

        <p className="mt-6 text-xs text-foreground/55">{result.note}</p>
      </div>
    </div>
  );
}
