"use client";

import { useEffect, useRef } from "react";
import { useGsapPlugins } from "@/lib/gsap/register";
import { bestValueGlow, type SiteVibe } from "@/lib/gsap/presets";

/**
 * Wraps the "Best Value" badge with a subtle glow animation.
 * Only fires when the badge text is exactly "Best value".
 */
export function BestValueBadge({
  children,
  vibe = "cool",
}: {
  children: React.ReactNode;
  vibe?: SiteVibe;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGsapPlugins();

  useEffect(() => {
    if (!ref.current) return;
    const anim = bestValueGlow(ref.current, vibe);
    return () => {
      anim.kill();
    };
  }, [vibe]);

  return <p ref={ref} className="eyebrow text-brand">{children}</p>;
}
