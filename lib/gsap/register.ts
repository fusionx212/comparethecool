"use client";

import { useEffect } from "react";

let registered = false;

/**
 * Call once in layout to register GSAP ScrollTrigger & Flip plugins.
 * GSAP core is loaded via CDN script tag in layout.tsx.
 * This just waits for it and registers plugins. Idempotent.
 */
export function useGsapPlugins() {
  useEffect(() => {
    if (registered) return;

    const tryRegister = () => {
      const gsap = (window as any).gsap;
      if (!gsap) return setTimeout(tryRegister, 100);

      const ScrollTrigger = (window as any).ScrollTrigger;
      const Flip = (window as any).Flip;

      if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      if (Flip) gsap.registerPlugin(Flip);

      registered = true;
    };

    tryRegister();
  }, []);
}
