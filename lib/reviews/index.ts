/**
 * Localized review content bridge — DE editorial + EN mirrors for UK.
 */

import { getGermanReview } from "@/lib/reviews/de-reviews";

export interface ReviewContent {
  title: string;
  intro: string[];
  buyingGuide: string[];
  faq: { question: string; answer: string }[];
  methodology?: string[];
}

const UK_PAC: ReviewContent = {
  title: "Best Portable Air Conditioners in the UK (2026)",
  intro: [
    "UK summers are short but intense. A portable AC is often the only practical option for renters who cannot install a split system.",
    "We compare BTU, noise, energy use, and live Amazon.co.uk / eBay prices so you buy once — not twice after a heatwave panic.",
  ],
  buyingGuide: [
    "Match BTU to room size (roughly 60–80 BTU per m²). Undersized units run constantly and still feel warm.",
    "Plan the exhaust hose: sash, tilt, or sliding windows need different kits. No hose vent = no real cooling.",
    "Check night-mode dB if the unit will sit in a bedroom. Anything over ~50 dB will wake light sleepers.",
  ],
  faq: [
    {
      question: "Do I need landlord permission for a portable AC?",
      answer:
        "Usually no permanent works are required — just a temporary window seal. Always check your tenancy terms.",
    },
    {
      question: "Portable AC or dehumidifier in a damp flat?",
      answer:
        "If the main issue is moisture/mould rather than peak heat, start with a dehumidifier — it costs less to run year-round.",
    },
  ],
};

const UK_DEHUM: ReviewContent = {
  title: "Best Dehumidifiers in the UK (2026)",
  intro: [
    "Damp and mould are a year-round UK problem — not a heatwave niche. The right dehumidifier protects health and fabric.",
  ],
  buyingGuide: [
    "Size by litres/day and room volume. Flats often need 10–12L; basements 20L+.",
    "Quiet night modes matter in open-plan homes. Continuous drain saves emptying tanks.",
  ],
  faq: [
    {
      question: "What humidity should I target?",
      answer: "Aim for roughly 40–60% relative humidity indoors.",
    },
  ],
};

const UK_HEAT: ReviewContent = {
  title: "Best Oil Radiators in the UK (2026)",
  intro: [
    "Spot-heating one room with an oil radiator can beat cranking the whole boiler — if you size wattage and use the thermostat.",
  ],
  buyingGuide: [
    "2000W covers most medium rooms; smaller offices can use 1500W.",
    "Oil-filled units stay warm after shut-off; oil-free heat faster then cool faster.",
  ],
  faq: [
    {
      question: "Are oil radiators expensive to run?",
      answer:
        "At full tilt, cost ≈ unit rate × kW. Thermostats and timers cut real spend sharply — use our running-cost calculator.",
    },
  ],
};

export function getReviewContent(country: string, slug: string): ReviewContent | null {
  if (country === "de") {
    const de = getGermanReview(slug);
    if (de) {
      return {
        title: de.title,
        intro: de.intro,
        buyingGuide: de.buyingGuide,
        faq: de.faq,
        methodology: de.methodology,
      };
    }
  }
  if (country === "uk" || country === "us" || country === "au") {
    if (slug === "portable-air-conditioners") return UK_PAC;
    if (slug === "dehumidifiers") return UK_DEHUM;
    if (slug === "oil-radiators") return UK_HEAT;
  }
  return null;
}
