"use client";

import { useEffect, useRef } from "react";
import { useGsapPlugins } from "@/lib/gsap/register";
import { cardReveal, type SiteVibe } from "@/lib/gsap/presets";

/**
 * Wraps children in a div that animates in on scroll via GSAP ScrollTrigger.
 * Each card staggers 120ms after the previous.
 */
export function RevealCard({
  children,
  vibe = "cool",
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  vibe?: SiteVibe;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapPlugins();

  useEffect(() => {
    if (!ref.current) return;
    cardReveal(ref.current, vibe, index);
  }, [vibe, index]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
