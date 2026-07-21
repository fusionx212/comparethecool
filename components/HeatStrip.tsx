"use client";

import { useEffect, useState } from "react";

export function HeatStrip() {
  const [heat, setHeat] = useState(false);
  useEffect(() => {
    setHeat(window.location.hostname.toLowerCase().includes("comparetheheat"));
  }, []);
  return (
    <div className={heat ? "bg-heat text-white" : "bg-brand-deep text-white"}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-1.5">
        <span className="text-xs tracking-wide">
          {heat
            ? "Heating season · oil radiators, blankets, airers — live prices"
            : "Expert reviews & live prices · cooling, heating & air quality"}
        </span>
      </div>
    </div>
  );
}
