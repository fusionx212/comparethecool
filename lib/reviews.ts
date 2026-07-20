import type { CountryConfig } from "./countries";

// Digital products — impulse-buy "no brainer" upsells
// Positioned as tools that save money vs the AC they're about to buy

export interface DigitalProduct {
  id: string;
  name: string;
  price: string;          // "£2.99"
  description: string;
  whyNoBrainer: string;   // one-line impulse trigger
  stripeLink: string;     // or payhip/gumroad
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "ac-recommendation-quiz",
    name: "Personalised AC Finder",
    price: "£2.99",
    description: "Answer 5 questions about your room size, budget, and noise tolerance. Get your perfect AC match — guaranteed to work for your space. Instant results.",
    whyNoBrainer: "Cheaper than buying the wrong AC and returning it",
    stripeLink: "https://buy.stripe.com/ac-finder",
  },
  {
    id: "energy-savings-calculator",
    name: "True Running Cost Calculator",
    price: "£1.99",
    description: "Enter your electricity rate and usage pattern. See exactly how much each AC will cost to run per day, per month, per year. Includes comparison against fans and evaporative coolers.",
    whyNoBrainer: "One heatwave's electricity bill is more than £1.99",
    stripeLink: "https://buy.stripe.com/energy-calc",
  },
  {
    id: "heatwave-survival-bundle",
    name: "Ultimate Heatwave Survival Bundle",
    price: "£4.99",
    description: "Emergency cooling plan + BTU room calculator + 'Which AC?' decision tree + maintenance schedule + energy-saving tips. Everything you need before the next heatwave hits.",
    whyNoBrainer: "£4.99 today vs £80 hotel room during a heatwave",
    stripeLink: "https://buy.stripe.com/heatwave-bundle",
  },
  {
    id: "room-cooling-planner",
    name: "Room-by-Room Cooling Planner",
    price: "£3.99",
    description: "Interactive planner: map your home, calculate BTU per room, compare portable vs fixed installation costs. Includes printable floor plan template.",
    whyNoBrainer: "Avoid buying AC too small for your largest room",
    stripeLink: "https://buy.stripe.com/room-planner",
  },
];

// Dale's own products — cross-sell per buyer persona
export interface DaleProduct {
  site: string;
  name: string;
  price: string;
  url: string;
  trigger: string;       // when to show this cross-sell
}

export const DALE_PRODUCTS: DaleProduct[] = [
  {
    site: "HolidayLetContracts",
    name: "Holiday Let Agreement Template",
    price: "£29/yr",
    url: "https://holidayletcontracts.co.uk",
    trigger: "Buying AC for a holiday let or Airbnb",
  },
  {
    site: "CleanerContracts",
    name: "Cleaning Business Contract Pack",
    price: "£29/yr",
    url: "https://cleanercontracts.co.uk",
    trigger: "Buying AC for an office or commercial space",
  },
  {
    site: "Policy & Play",
    name: "Childminder Policy Pack",
    price: "£14.99/mo",
    url: "https://policyandplay.co.uk",
    trigger: "Buying AC for a nursery or childminding setting",
  },
  {
    site: "HelprDash",
    name: "Tradesperson Business Platform",
    price: "£99/mo",
    url: "https://helprdash.com",
    trigger: "You install ACs — get leads and manage jobs",
  },
];

// Cross-sell mapping: review category → relevant Dale product
export const CROSS_SELL_MAP: Record<string, DaleProduct> = {
  "portable-air-conditioners": DALE_PRODUCTS[0],  // holiday lets
  "air-con-units": DALE_PRODUCTS[3],               // installers
  "dehumidifiers": DALE_PRODUCTS[2],               // childminders (mould-free nurseries)
  "air-purifiers": DALE_PRODUCTS[2],               // childminders
  "oil-radiators": DALE_PRODUCTS[1],               // offices
  "tower-fans": DALE_PRODUCTS[1],                  // offices
};

// ── Review page template — the universal "10 Best" format ──────────────

export interface ReviewProduct {
  rank: number;
  slug: string;
  name: string;
  rating: number;        // 1-5 stars
  award?: string;        // "Best Overall", "Best Budget", "Quietest"
  pros: string[];
  cons: string[];
  verdict: string;        // 1-2 sentence summary
  bestFor: string;        // "Bedrooms under 20m²", "Open-plan living"
  amazonPrice?: number;
  amazonUrl?: string;
  ebayPrice?: number;
  ebayUrl?: string;
  image?: string;
}

export interface ReviewPage {
  slug: string;
  title: string;           // H1: "Best Portable Air Conditioners UK 2026"
  country: string;         // "uk", "de", "fr"
  language: string;        // "en", "de", "fr"
  intro: string;           // 2-3 sentence hook
  atAGlance: string;       // "Our top pick after comparing 134 units"
  products: ReviewProduct[];
  buyingGuide: string[];   // paragraphs
  faq: Array<{ q: string; a: string }>;
  methodology: string;
  digitalUpsells: string[]; // which DIGITAL_PRODUCTS IDs to show
  crossSell?: string;      // which DALE_PRODUCTS site
  updatedAt: string;       // ISO date
}
