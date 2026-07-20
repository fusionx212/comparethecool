import type { Product, Offer } from "./types";
import { fetchSellerReputations, sellerReputationBoost } from "./seller-reputation";
import { AIRCON_CATEGORIES } from "./categories";

// ── Recommendation engine ────────────────────────────────────────────────
// Single source for how the board ranks products. The goal (Dale's brief):
// present genuinely good, in-stock deals to the customer, but order them in
// our favour — lead with what actually sells and earns, not the cheapest thing.
//
// Logical process, in priority order:
//   1. AVAILABILITY GATE — an in-stock product (Amazon or eBay buyable) always
//      outranks an out-of-stock one. Never lead with something they can't buy.
//   2. CATEGORY TIER — within in-stock, actual air con clusters ahead of
//      cooling-adjacent categories (dehumidifiers, purifiers, fans...) on a
//      mixed list. Not a filter — they still rank normally beneath it.
//   3. REAL SALES — products with verified Amazon order data (a Dale
//      dashboard pull, not an estimate) rank near the top of their tier,
//      scaled by items actually ordered. Ground truth beats every proxy below.
//   4. Within a tier, a weighted score of three "our favour" signals:
//        • demand   — how much people want it (popularity weight + eBay sold count)
//        • earning  — bigger-ticket + higher commission rate (Amazon/Hughes over eBay)
//        • hero     — curated known best-sellers Dale wants surfaced (Meaco 9000…)
//   5. A small freshness nudge so recently-verified stock is trusted first.
//
// Every weight and the hero list live here so tuning is one edit, one file.

const WEIGHTS = {
  demand: 1.0, // how loud the "people want this" signal is
  // Was 0.8 — at the old weight the Amazon-vs-eBay commission gap on a typical
  // £300 unit was ~2.4 points, swamped by demand (a modestly popular item
  // scores 40+). Raised so the rate difference actually moves rank — a
  // higher-commission aircon now visibly outranks an equivalent lower-rate
  // one instead of earning being a rounding error next to popularity.
  earning: 5,
  brand: 20, // flat boost for a recognised, trusted brand
  hero: 40, // flat boost for a curated best-seller
  freshness: 5, // flat boost for stock re-verified in the last 6h
  sellerReputation: 0.3, // weight for seller trust (affects which retailer we prefer)
  // Air con is the site's core identity. On a mixed list (the homepage
  // board's "Recommended" sort spans every category) a popular, high-earning
  // dehumidifier or air purifier could out-rank actual air con — wrong for a
  // page titled "Portable AC" / "Moving now". This is a soft tier, not a
  // gate: big enough to comfortably beat any realistic combination of
  // demand+brand+hero+earning+freshness (~150 max), so aircon clusters at
  // the top and everything else still ranks normally beneath it — present,
  // just further down, not filtered out.
  categoryMatch: 200,
  inStock: 10_000, // availability gate — dwarfs every other signal
};

// Above this the extra commission from a higher sticker price stops counting —
// otherwise an overpriced no-name unit outranks a genuinely good mid-price one
// on price alone, which breaks the "present as a good deal" half of the brief.
const EARNING_PRICE_CAP = 450;

// Real Amazon Associates order data (Dale's dashboard, pulled 14-15 Jul 2026)
// — genuine purchase intent, not a proxy. Distinct from demand/popularity:
// this is money already earned, so it outweighs raw clicks or a guessed
// popularity score. Matched to product ids by title/BTU; two low-volume
// generic-titled tail items (4-6 orders, ambiguous names) were skipped rather
// than risk a wrong match. Snapshot, not a live feed — Amazon has no public
// Associates reporting API — update this table when Dale shares a fresh pull.
const REAL_SALES_ITEMS_ORDERED: Record<string, number> = {
  "meacocool-mc-series-pro-9000": 86,
  "electriq-heavy-12000": 44,
  "probreeze-12000-4in1": 42,
  "delonghi-pinguino-pacem90": 39,
  "delonghi-pinguino-pacn82": 31,
  "meacocool-mc-10000r": 30,
  "meacocool-mc-12000r": 28,
  "meacocool-pro-12000-wifi": 28,
  "probreeze-omnicool-12000": 26,
  "meacocool-mc-14000r": 22,
  "meacocool-pro-16000ch": 18,
  "meaco-fan-1056": 11,
  "trotec-b07q7gpfdx": 9,
  "honeywell-ht900e-turbofan": 5,
  "dyson-am07-cool-tower": 5,
  "dyson-am07-tower-fan": 5,
};

// Recognised UK cooling brands. A trusted brand both converts better and keeps
// junk no-name listings (random-string "brands") out of the lead. Edit freely.
const REPUTABLE_BRANDS = new Set(
  [
    "Meaco", "MeacoCool", "De'Longhi", "Pro Breeze", "Honeywell", "Dyson",
    "Igenix", "electriQ", "ElectriQ", "Shinco", "AEG", "EcoAir", "Wood's",
    "Duux", "Princess", "Russell Hobbs", "Black+Decker", "Netta", "Tower",
    "VonHaus", "Beldray", "Daewoo", "Geepas", "Dimplex", "Olimpia Splendid",
    "Trotec", "Arlec", "Status", "Challenge", "Devola", "Avalla", "MYLEK",
  ].map((b) => b.toLowerCase()),
);

// Curated best-sellers Dale wants to lead regardless of raw click data.
// Match on product id OR (brand + btu) so a re-slugged listing still hits.
// Seed = the known UK hot-sellers; edit freely.
const HERO_PRODUCTS: { id?: string; brand?: string; btu?: number }[] = [
  { id: "meacocool-mc-series-pro-9000" }, // Meaco 9000 — Dale's flagship hot-seller
  { brand: "Meaco", btu: 9000 },
  { brand: "De'Longhi", btu: 9000 }, // Pinguino — top GSC demand
  { brand: "Pro Breeze" }, // consistent budget best-seller
];

const buyable = (o: Offer) => o.status === "in_stock" || o.status === "low_stock";

export function isInStock(p: Product): boolean {
  return p.offers.some(buyable);
}

/** Cheapest buyable offer, else cheapest of any. */
function leadOffer(p: Product): Offer | undefined {
  const pool = p.offers.filter(buyable);
  const from = pool.length ? pool : p.offers;
  return [...from].sort((a, b) => a.price - b.price)[0];
}

/** eBay listings carry "487 sold" / "143 sold — proven seller" in highlights. */
function soldCount(p: Product): number {
  let total = 0;
  for (const h of p.highlights ?? []) {
    const m = h.match(/([\d,]+)\s*sold/i);
    if (m) total += parseInt(m[1].replace(/,/g, ""), 10) || 0;
  }
  return total;
}

/** Demand: intrinsic popularity weight + eBay sold count, log-damped so one
 *  runaway number can't monopolise the top of the board. */
function demandSignal(p: Product): number {
  const raw = (p.popularity ?? 0) + soldCount(p);
  return Math.log10(raw + 1) * 25; // 0 → 0, 100 → ~50, 500 → ~68
}

// Real per-retailer commission rates, not a binary amazon-vs-everyone guess.
// Was `id === "amazon" ? 0.03 : 0.02` — silently scored Hughes (verified 2.5%
// flat, Awin merchant profile) as if it earned the same as eBay, and every
// future Awin merchant would fall into that same wrong "everyone else" rate
// instead of its own. Adding a merchant now = one line here.
// amazon/ebay rates are Dale's existing tuning, unchanged/unverified further.
const COMMISSION_RATES: Record<string, number> = {
  amazon: 0.03,
  ebay: 0.02,
  hughes: 0.025, // Awin merchant 3133 — 2.5% flat on net sales, verified
};
const DEFAULT_COMMISSION_RATE = 0.02;

/** Earning: estimated absolute commission of the lead offer, with the price
 *  capped so overpriced junk can't buy its way up on sticker price alone.
 *  Bigger-ticket units and higher-rate retailers score higher. */
function earningSignal(p: Product): number {
  const o = leadOffer(p);
  if (!o) return 0;
  const rate = COMMISSION_RATES[o.retailer.id] ?? DEFAULT_COMMISSION_RATE;
  return Math.min(o.price, EARNING_PRICE_CAP) * rate; // £339 Amazon → ~10.2
}

function categorySignal(p: Product): number {
  return AIRCON_CATEGORIES.has(p.category) ? WEIGHTS.categoryMatch : 0;
}

// Base tier kept below categoryMatch(200) — a proven-but-non-aircon seller
// (the fans/circulator in this data) still can't outrank actual air con on a
// mixed list; real sales order the ranking WITHIN a tier, category decides
// the tier itself. Log-scaled bonus on top so the #1 seller (86 orders)
// visibly leads the tail (5 orders) instead of tying with it.
function realSalesSignal(p: Product): number {
  const itemsOrdered = REAL_SALES_ITEMS_ORDERED[p.id];
  if (!itemsOrdered) return 0;
  return 140 + Math.log10(itemsOrdered + 1) * 30;
}

function brandSignal(p: Product): number {
  return REPUTABLE_BRANDS.has(p.brand.toLowerCase()) ? WEIGHTS.brand : 0;
}

function isHero(p: Product): boolean {
  return HERO_PRODUCTS.some(
    (h) =>
      (h.id && h.id === p.id) ||
      (h.brand &&
        p.brand.toLowerCase() === h.brand.toLowerCase() &&
        (h.btu == null || p.btu === h.btu)),
  );
}

function freshnessBoost(p: Product, now = Date.now()): number {
  const o = leadOffer(p);
  if (!o || !buyable(o)) return 0;
  const age = now - Date.parse(o.lastChecked);
  return age < 6 * 3600_000 ? WEIGHTS.freshness : 0;
}

function sellerReputationSignal(
  p: Product,
  sellerReps: Map<string, any> | null
): number {
  if (!sellerReps || sellerReps.size === 0) return 0;
  // Get the boost for the cheapest buyable offer's seller
  const o = leadOffer(p);
  if (!o) return 0;
  const sellerId = o.retailer.id; // "amazon" or "ebay"
  const rep = sellerReps.get(sellerId);
  return rep ? rep.boost || 0 : 0;
}

/**
 * The board's ranking score. Higher = shown first. In-stock always beats
 * out-of-stock via the availability gate; within a tier the "our favour"
 * signals decide order.
 */
export function recommendationScore(
  p: Product,
  now = Date.now(),
  sellerReps: Map<string, any> | null = null
): number {
  let score = 0;
  if (isInStock(p)) score += WEIGHTS.inStock;
  score += categorySignal(p);
  score += realSalesSignal(p);
  score += demandSignal(p) * WEIGHTS.demand;
  score += earningSignal(p) * WEIGHTS.earning;
  score += brandSignal(p);
  if (isHero(p)) score += WEIGHTS.hero;
  score += freshnessBoost(p, now);
  score += sellerReputationSignal(p, sellerReps) * WEIGHTS.sellerReputation;
  return score;
}

/** Sort a copy of the list by recommendation score, best first. */
export function byRecommended(
  products: Product[],
  now = Date.now(),
  sellerReps: Map<string, any> | null = null
): Product[] {
  return [...products]
    .map((p) => ({ p, s: recommendationScore(p, now, sellerReps) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}

/** Fetch seller reputations and apply them to ranking. */
export async function byRecommendedWithReputation(
  products: Product[],
  now = Date.now()
): Promise<Product[]> {
  // Collect all unique retailers
  const allOffers = products.flatMap((p) => p.offers);
  const sellerReps = await fetchSellerReputations(allOffers);
  return byRecommended(products, now, sellerReps);
}
