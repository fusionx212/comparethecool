"use client";

import { useEffect, useRef } from "react";
import { useGsapPlugins } from "@/lib/gsap/register";
import { stockPulse, type SiteVibe } from "@/lib/gsap/presets";

/**
 * Animated status dot. Subtle pulse — signals live data.
 * Vibe: "cool" = green pulse, "heat" = orange pulse.
 */
export function StockPulse({
  vibe = "cool",
  className = "",
}: {
  vibe?: SiteVibe;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGsapPlugins();

  useEffect(() => {
    if (!ref.current) return;
    const anim = stockPulse(ref.current, vibe);
    return () => {
      anim.kill();
    };
  }, [vibe]);

  return (
    <span
      ref={ref}
      className={`led led-live ${className}`}
      style={{
        backgroundColor: vibe === "cool" ? "var(--instock)" : "var(--heat)",
      }}
    />
  );
}
