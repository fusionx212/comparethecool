"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

/** Call once in layout to register GSAP plugins. Idempotent. */
export function useGsapPlugins() {
  useEffect(() => {
    if (registered) return;
    gsap.registerPlugin(ScrollTrigger, Flip);
    registered = true;
  }, []);
}

export { gsap, ScrollTrigger, Flip };
