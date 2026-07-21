"use client";

import { useEffect, useRef, useState } from "react";
import { useGsapPlugins } from "@/lib/gsap/register";
import { heroEntrance, type SiteVibe } from "@/lib/gsap/presets";

/**
 * Wraps the hero section. Detects ctc vs cth hostname for vibe.
 * Fires entrance animation once on mount.
 */
export function HeroEntrance({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vibe, setVibe] = useState<SiteVibe>("cool");
  useGsapPlugins();

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    setVibe(host.includes("comparetheheat") ? "heat" : "cool");
  }, []);

  useEffect(() => {
    if (!ref.current || !vibe) return;
    const tl = heroEntrance(ref.current, vibe);
    return () => {
      tl.kill();
    };
  }, [vibe]);

  return <div ref={ref}>{children}</div>;
}
