import type { CategorySlug } from "./types";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  blurb: string; // sells the category — shown on tiles + category page intro
  btuRelevant: boolean; // AC/coolers show BTU + room-size columns
  order: number;
}

// SSOT for the cooling taxonomy. Add a category here and it appears in nav,
// homepage tiles, sitemap and routing automatically.
export const CATEGORIES: Category[] = [
  {
    slug: "portable-air-conditioners",
    name: "Portable Air Conditioners",
    shortName: "Portable AC",
    blurb:
      "Free-standing units that actively chill a room — the fastest-selling category in a heatwave. Sized in BTU; check it matches your room.",
    btuRelevant: true,
    order: 1,
  },
  {
    slug: "air-con-units",
    name: "Air Conditioning Units",
    shortName: "AC Units",
    blurb:
      "Fixed, split and window units for permanent cooling. Higher output, professional fit, best value over a hot summer.",
    btuRelevant: true,
    order: 2,
  },
  {
    slug: "evaporative-coolers",
    name: "Evaporative Coolers",
    shortName: "Air Coolers",
    blurb:
      "Water-cooled, low running cost, no exhaust hose. Great in dry heat and for spot cooling without the energy bill of an AC.",
    btuRelevant: false,
    order: 3,
  },
  {
    slug: "tower-fans",
    name: "Tower Fans",
    shortName: "Tower Fans",
    blurb:
      "Slim, quiet, oscillating airflow that fits anywhere. The sensible first buy when AC is sold out.",
    btuRelevant: false,
    order: 4,
  },
  {
    slug: "pedestal-fans",
    name: "Pedestal Fans",
    shortName: "Pedestal Fans",
    blurb:
      "High-volume air movement for living rooms and offices. The big-name pedestal fans sell out first — track them here.",
    btuRelevant: false,
    order: 5,
  },
  {
    slug: "portable-fans",
    name: "Portable & Rechargeable Fans",
    shortName: "Portable Fans",
    blurb:
      "Cordless, battery and handheld fans — neck fans, clip fans and camping fans you can take anywhere. The fastest-growing heatwave category.",
    btuRelevant: false,
    order: 6,
  },
  {
    slug: "desk-usb-fans",
    name: "Desk & USB Fans",
    shortName: "Desk Fans",
    blurb:
      "Mains and USB-powered personal cooling for a desk or bedside. Cheap, always-useful, rarely out of stock.",
    btuRelevant: false,
    order: 7,
  },
  {
    slug: "dehumidifiers",
    name: "Dehumidifiers",
    shortName: "Dehumidifiers",
    blurb:
      "Pull damp, muggy moisture out of the air — cooler-feeling rooms in summer, condensation-free windows in winter. The one cooling-adjacent buy that earns its keep all year.",
    btuRelevant: false,
    order: 8,
  },
  {
    slug: "air-purifiers",
    name: "Air Purifiers",
    shortName: "Air Purifiers",
    blurb:
      "HEPA, ioniser and smart air purifiers for allergy relief, cleaner air, and better sleep. The natural partner to any cooling setup.",
    btuRelevant: false,
    order: 9,
  },
  {
    slug: "ice-makers",
    name: "Ice Makers",
    shortName: "Ice Makers",
    blurb:
      "Countertop and portable ice makers — 9 cubes in 6 minutes. The heatwave impulse buy that keeps on giving.",
    btuRelevant: false,
    order: 10,
  },
  {
    slug: "garden-parasols",
    name: "Garden Parasols & Shade",
    shortName: "Parasols",
    blurb:
      "Cantilever, market and standard garden parasols. Keep the patio usable when the sun is relentless.",
    btuRelevant: false,
    order: 11,
  },
  {
    slug: "cooling-bedding",
    name: "Cooling Bedding & Mattress Toppers",
    shortName: "Cooling Bedding",
    blurb:
      "Gel-infused mattress toppers, cooling pillows, bamboo sheets. For when it's too hot to sleep — and you're not the only one buying.",
    btuRelevant: false,
    order: 12,
  },
  {
    slug: "dog-cooling",
    name: "Dog Cooling Mats & Accessories",
    shortName: "Dog Cooling",
    blurb:
      "Pressure-activated cooling mats, paddling pools, travel bowls and cooling bandanas for dogs. They can't tell you they're overheating.",
    btuRelevant: false,
    order: 13,
  },
  {
    slug: "blackout-curtains",
    name: "Blackout Curtains & Blinds",
    shortName: "Blackout Curtains",
    blurb:
      "Thermal blackout curtains that block the sun and keep rooms 3-5°C cooler — the cheapest home cooling upgrade there is.",
    btuRelevant: false,
    order: 14,
  },
  {
    slug: "window-film",
    name: "Window Film & Reflective Shields",
    shortName: "Window Film",
    blurb:
      "One-way mirror film, UV-blocking film and reflective solar shields. Stick it on, cut the sun, keep the room cool — no AC needed.",
    btuRelevant: false,
    order: 15,
  },
  {
    slug: "paddling-pools",
    name: "Paddling Pools & Garden Water Fun",
    shortName: "Paddling Pools",
    blurb:
      "Family paddling pools, splash pads and inflatable water parks. The Amazon category that sells out first when the mercury hits 28°C.",
    btuRelevant: false,
    order: 16,
  },
  {
    slug: "car-sun-shades",
    name: "Car Sun Shades & Window Blinds",
    shortName: "Car Shades",
    blurb:
      "UV-blocking windscreen shades, side window blinds and baby car shade covers. A parked car hits 50°C in 30 minutes — these stop it.",
    btuRelevant: false,
    order: 17,
  },
  {
    slug: "ac-accessories",
    name: "Air Conditioner Accessories",
    shortName: "AC Accessories",
    blurb:
      "Window seal kits, exhaust hoses, universal remotes, cleaning spray, and smart plugs. Everything you need to actually make your portable AC work properly.",
    btuRelevant: false,
    order: 18,
  },
  {
    slug: "heated-airers",
    name: "Heated Airers & Clothes Dryers",
    shortName: "Heated Airers",
    blurb:
      "Electric heated clothes airers for winter drying. The same home-appliance buyer, the opposite season — keeps the site earning when the heatwave ends.",
    btuRelevant: false,
    order: 19,
  },
  {
    slug: "electric-blankets",
    name: "Electric Blankets & Heated Throws",
    shortName: "Electric Blankets",
    blurb:
      "Underblankets, heated throws and foot warmers. Winter's answer to the portable AC — and every bit as sell-out-prone.",
    btuRelevant: false,
    order: 20,
  },
  {
    slug: "oil-radiators",
    name: "Oil-Filled Radiators",
    shortName: "Oil Radiators",
    blurb:
      "Portable oil-filled radiators for spot heating. Quiet, efficient, and the obvious cold-weather counterpart to a portable air conditioner.",
    btuRelevant: false,
    order: 21,
  },
  {
    slug: "smart-thermostats",
    name: "Smart Thermostats & Heating Controls",
    shortName: "Smart Thermostats",
    blurb:
      "Nest, Hive, Tado, Drayton Wiser. Smart thermostats pay for themselves in a single winter — and they schedule your AC too.",
    btuRelevant: false,
    order: 22,
  },
  {
    slug: "car-air-con",
    name: "Car Air Conditioning & Recharge Kits",
    shortName: "Car AC",
    blurb:
      "DIY air con regas kits, sanitisers, cabin filters and 12V coolers. A car with dead AC in a heatwave is a nightmare — fix it before the summer run.",
    btuRelevant: false,
    order: 23,
  },
];

export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

// The site's core identity — air conditioning. Cooling-adjacent categories
// (dehumidifiers, fans, purifiers...) earn too and rank normally within
// themselves, but shouldn't lead ahead of actual air con on a mixed list
// (the homepage board, "Recommended" sort). Single source so the
// recommendation engine and Top Picks agree on what counts as core.
export const AIRCON_CATEGORIES = new Set<CategorySlug>([
  "portable-air-conditioners",
  "air-con-units",
]);

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG[slug];
}
