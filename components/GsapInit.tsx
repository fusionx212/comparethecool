"use client";

import { useGsapPlugins } from "@/lib/gsap/register";

/**
 * Include once in layout.tsx to register GSAP plugins.
 * Must be a client component since GSAP needs window.
 */
export function GsapInit() {
  useGsapPlugins();
  return null;
}
