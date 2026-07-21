/**
 * GSAP animation presets for Compare the Cool / Compare the Heat.
 * All durations in seconds. All easings from gsap built-ins.
 *
 * Cool site: crisp, precise, cyan-tinted. Think terminal/airport.
 * Heat site: warmer, slower, orange-tinted. Think hearth/comfort.
 */
import gsap from "gsap";

export type SiteVibe = "cool" | "heat";

/* ── Colour accents ── */
const COOL_GLOW = "rgba(7,146,180,0.35)";
const HEAT_GLOW = "rgba(232,93,28,0.35)";

/* ── Shared defaults ── */
const BASE = { ease: "power2.out", duration: 0.55 };

/* ── Card reveal (ScrollTrigger-driven) ── */
export function cardReveal(el: Element | string, vibe: SiteVibe, staggerIdx = 0) {
  const glow = vibe === "cool" ? COOL_GLOW : HEAT_GLOW;
  return gsap.from(el, {
    ...BASE,
    opacity: 0,
    y: 28,
    delay: staggerIdx * 0.12,
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      toggleActions: "play none none none",
    },
  });
}

/* ── Stock LED pulse ── */
export function stockPulse(el: Element | string, vibe: SiteVibe) {
  const color = vibe === "cool" ? "#0f9d54" : "#e85d1c";
  return gsap.to(el, {
    opacity: 0.55,
    duration: 1.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    boxShadow: `0 0 6px ${color}`,
  });
}

/* ── Hero entrance timeline ── */
export function heroEntrance(
  container: Element | string,
  vibe: SiteVibe,
): gsap.core.Timeline {
  const glow = vibe === "cool" ? COOL_GLOW : HEAT_GLOW;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(`${container} h1`, { opacity: 0, y: 24, duration: 0.6 })
    .from(`${container} p`, { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
    .from(`${container} [data-hero-card]`, {
      opacity: 0,
      y: 20,
      duration: 0.45,
      stagger: 0.08,
    }, "-=0.2");
  return tl;
}

/* ── Best Value badge glow ── */
export function bestValueGlow(el: Element | string, vibe: SiteVibe) {
  const color = vibe === "cool" ? COOL_GLOW : HEAT_GLOW;
  return gsap.to(el, {
    boxShadow: `0 0 14px ${color}`,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/* ── Number counter (odometer style) ── */
export function countUp(el: Element | string, target: number, decimals = 1) {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration: 1.2,
    ease: "power2.out",
    onUpdate() {
      (el as HTMLElement).textContent = obj.val.toFixed(decimals);
    },
    scrollTrigger: {
      trigger: el,
      start: "top 92%",
      toggleActions: "play none none none",
    },
  });
}

/* ── Sort transition (FLIP) ── */
export { Flip } from "gsap/Flip";
