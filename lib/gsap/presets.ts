/**
 * GSAP animation presets for Compare the Cool / Compare the Heat.
 * Uses CDN-loaded GSAP (window.gsap). All durations in seconds.
 *
 * Cool site: crisp, cyan-tinted. Heat site: warmer, orange-tinted.
 */

export type SiteVibe = "cool" | "heat";

const COOL_GLOW = "rgba(7,146,180,0.35)";
const HEAT_GLOW = "rgba(232,93,28,0.35)";
const BASE = { ease: "power2.out", duration: 0.55 };

function gs() {
  return (window as any).gsap;
}

/* ── Card reveal (ScrollTrigger-driven) ── */
export function cardReveal(el: Element, vibe: SiteVibe, staggerIdx = 0) {
  const g = gs();
  if (!g) return;
  return g.from(el, {
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
export function stockPulse(el: Element, vibe: SiteVibe) {
  const g = gs();
  if (!g) return;
  const color = vibe === "cool" ? "#0f9d54" : "#e85d1c";
  return g.to(el, {
    opacity: 0.55,
    duration: 1.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    boxShadow: `0 0 6px ${color}`,
  });
}

/* ── Hero entrance timeline ── */
export function heroEntrance(container: Element, vibe: SiteVibe) {
  const g = gs();
  if (!g) return;
  const tl = g.timeline({ defaults: { ease: "power3.out" } });
  tl.from(container.querySelector("h1"), { opacity: 0, y: 24, duration: 0.6 })
    .from(container.querySelector("p"), { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
    .from(
      container.querySelectorAll("[data-hero-card]"),
      { opacity: 0, y: 20, duration: 0.45, stagger: 0.08 },
      "-=0.2",
    );
  return tl;
}

/* ── Best Value badge glow ── */
export function bestValueGlow(el: Element, vibe: SiteVibe) {
  const g = gs();
  if (!g) return;
  const color = vibe === "cool" ? COOL_GLOW : HEAT_GLOW;
  return g.to(el, {
    boxShadow: `0 0 14px ${color}`,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
