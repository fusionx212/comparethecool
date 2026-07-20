"use client";

import { useState } from "react";
import Link from "next/link";

const PRESETS = [
  { label: "Small (5,000 BTU)", btu: 5000, watts: 500 },
  { label: "Medium (9,000 BTU)", btu: 9000, watts: 900 },
  { label: "Large (12,000 BTU)", btu: 12000, watts: 1200 },
  { label: "Extra large (14,000 BTU)", btu: 14000, watts: 1400 },
  { label: "Custom", btu: 0, watts: 0 },
];

const UK_ELECTRICITY_RATE = 24.5; // pence per kWh — Oct 2026 price cap

export function RunningCostCalculator() {
  const [preset, setPreset] = useState(1); // Medium default
  const [watts, setWatts] = useState(PRESETS[1].watts);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [rate, setRate] = useState(UK_ELECTRICITY_RATE);
  const [daysPerYear, setDaysPerYear] = useState(90); // ~3 summer months

  const handlePresetChange = (index: number) => {
    setPreset(index);
    if (PRESETS[index].watts > 0) {
      setWatts(PRESETS[index].watts);
    }
  };

  const kWhPerDay = (watts * hoursPerDay) / 1000;
  const costPerDay = (kWhPerDay * rate) / 100;
  const costPerMonth = costPerDay * 30;
  const costPerSummer = costPerDay * daysPerYear;

  return (
    <div className="border rule-strong bg-surface p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Unit size
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetChange(i)}
                  className={`px-3 py-1.5 text-xs border ${
                    preset === i
                      ? "border-brand bg-brand text-background"
                      : "border-line bg-background hover:border-brand/30"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {PRESETS[preset].watts === 0 && (
              <div className="mt-3">
                <label className="mb-1 block text-xs text-foreground/50">Power draw (watts)</label>
                <input
                  type="number"
                  value={watts}
                  onChange={(e) => setWatts(Number(e.target.value) || 0)}
                  className="w-32 border rule-strong bg-background px-3 py-2 text-sm tabular-nums focus:border-brand focus:outline-none"
                  placeholder="900"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Hours per day
            </label>
            <input
              type="range"
              min={1}
              max={16}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-foreground/50">
              <span>1h</span>
              <span className="tabular-nums font-semibold text-foreground">{hoursPerDay}h</span>
              <span>16h</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Electricity rate (p/kWh)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                step="0.1"
                className="w-24 border rule-strong bg-background px-3 py-2 text-sm tabular-nums focus:border-brand focus:outline-none"
              />
              <span className="text-sm text-foreground/50">p/kWh</span>
              <button
                type="button"
                onClick={() => setRate(UK_ELECTRICITY_RATE)}
                className="text-xs text-brand hover:underline ml-2"
              >
                Reset to cap
              </button>
            </div>
            <p className="mt-1 text-xs text-foreground/40">
              UK price cap Oct 2026: {UK_ELECTRICITY_RATE}p/kWh
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
              Days of use per summer
            </label>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={daysPerYear}
              onChange={(e) => setDaysPerYear(Number(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-foreground/50">
              <span>10</span>
              <span className="tabular-nums font-semibold text-foreground">{daysPerYear} days</span>
              <span>150</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border rule-strong bg-surface-cool p-6 flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-4">
            Estimated running cost
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-foreground/50 mb-1">Per day</div>
              <div className="text-2xl font-bold tabular-nums text-brand-deep">
                £{costPerDay.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/40 mt-0.5">{kWhPerDay.toFixed(1)} kWh</div>
            </div>
            <div className="text-center border-x rule-strong">
              <div className="text-xs text-foreground/50 mb-1">Per month</div>
              <div className="text-2xl font-bold tabular-nums text-brand-deep">
                £{costPerMonth.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/40 mt-0.5">30 days</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-foreground/50 mb-1">Per summer</div>
              <div className="text-2xl font-bold tabular-nums text-brand-deep">
                £{costPerSummer.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/40 mt-0.5">{daysPerYear} days</div>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <div className="text-xs text-foreground/60">
              <span className="font-semibold">Compared to:</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground/50">Pedestal fan (40W)</span>
                <span className="tabular-nums font-semibold text-instock">
                  £{((40 * hoursPerDay * rate) / 100000 * 30).toFixed(2)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Tower fan (60W)</span>
                <span className="tabular-nums font-semibold text-instock">
                  £{((60 * hoursPerDay * rate) / 100000 * 30).toFixed(2)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Fixed split AC (3.5kW)</span>
                <span className="tabular-nums font-semibold">
                  £{((1000 * hoursPerDay * rate) / 100000 * 30).toFixed(2)}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Central AC (5kW)</span>
                <span className="tabular-nums font-semibold">
                  £{((1500 * hoursPerDay * rate) / 100000 * 30).toFixed(2)}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
