import type { Category } from "./categories";
import type { Product } from "./types";
import { bestOffer, isAnyInStock } from "./data";
import { gbp } from "./format";

// Deterministic, data-driven GEO copy. Answer-first leads + FAQ pairs are what
// Google AI Mode / AI Overviews extract and cite — and because they carry a live
// timestamp + our own cross-retailer data, they're the freshness/novelty signal a
// new domain can win on. No LLM here: every string is derived from the data.

function clock(now: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(now);
}

const retailerCount = (p: Product) => new Set(p.offers.map((o) => o.retailer.id)).size;
const plural = (n: number) => (n === 1 ? "" : "s");

export function productAnswerLead(p: Product, now: Date): string {
  const n = retailerCount(p);
  const best = bestOffer(p);
  if (!isAnyInStock(p) || !best) {
    return `As of ${clock(now)}, the ${p.name} is sold out across the ${n} UK retailer${plural(n)} we track. Set a restock alert and we'll email you the moment it's back in stock.`;
  }
  const spec =
    p.btu && p.coverageM2
      ? ` It's a ${p.btu.toLocaleString("en-GB")} BTU unit rated for rooms up to ${p.coverageM2}m².`
      : "";
  const delivery = best.deliveryNote ? ` (${best.deliveryNote.toLowerCase()})` : "";
  return `As of ${clock(now)}, the ${p.name} is in stock — cheapest at ${best.retailer.name} for ${gbp(best.price)}${delivery}.${spec} We track it across ${n} UK retailer${plural(n)} and update prices through the day.`;
}

export function categoryAnswerLead(cat: Category, products: Product[], now: Date): string {
  const total = products.length;
  if (!total) {
    return `We're not tracking any ${cat.name.toLowerCase()} yet — check back as the live feed connects.`;
  }
  const inStock = products.filter(isAnyInStock);
  if (!inStock.length) {
    return `As of ${clock(now)}, all ${total} ${cat.name.toLowerCase()} we track are sold out in the UK. Set a restock alert to be told the moment stock returns.`;
  }
  const cheapest = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];
  return `As of ${clock(now)}, ${inStock.length} of ${total} ${cat.name.toLowerCase()} we track are in stock in the UK. The cheapest in-stock option is the ${cheapest.p.name} at ${gbp(cheapest.o.price)} from ${cheapest.o.retailer.name}.`;
}

export interface Faq {
  q: string;
  a: string;
}

export function productFaqs(p: Product, now: Date): Faq[] {
  const best = bestOffer(p);
  const buyable = isAnyInStock(p);
  const faqs: Faq[] = [
    {
      q: `Is the ${p.name} in stock in the UK?`,
      a:
        buyable && best
          ? `Yes — as of ${clock(now)} it's in stock, cheapest at ${best.retailer.name} for ${gbp(best.price)}.`
          : `Not right now — as of ${clock(now)} it's sold out across the retailers we track. Set a restock alert to be notified when it returns.`,
    },
    {
      q: `Where is the cheapest place to buy the ${p.name}?`,
      a: best
        ? `${best.retailer.name} at ${gbp(best.price)}${buyable ? "" : " (currently out of stock)"} is the lowest price we're tracking.`
        : `We don't have a live price for this unit yet.`,
    },
  ];
  if (p.btu && p.coverageM2) {
    faqs.push({
      q: `What size room does the ${p.name} cool?`,
      a: `It's rated at ${p.btu.toLocaleString("en-GB")} BTU, suitable for rooms up to roughly ${p.coverageM2}m². Use our BTU calculator to check it against your room.`,
    });
  }
  if (p.priceHistory && p.priceHistory.length > 1) {
    const prices = p.priceHistory.map((x) => x.price);
    faqs.push({
      q: `Has the ${p.name} price changed recently?`,
      a: `Recently it's ranged from ${gbp(Math.min(...prices))} to ${gbp(Math.max(...prices))}. We track every price change and can alert you on a drop.`,
    });
  }
  return faqs;
}

export function categoryFaqs(cat: Category, products: Product[], now: Date): Faq[] {
  const inStock = products.filter(isAnyInStock);
  const retailers = [...new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.name)))];
  const cheapest = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];

  const faqs: Faq[] = [
    {
      q: `What ${cat.name.toLowerCase()} are in stock in the UK right now?`,
      a: inStock.length
        ? `As of ${clock(now)}, ${inStock.length} of ${products.length} we track are in stock${cheapest ? `, the cheapest being the ${cheapest.p.name} at ${gbp(cheapest.o.price)}` : ""}.`
        : `As of ${clock(now)}, they're all sold out — set a restock alert to be told when stock returns.`,
    },
  ];
  if (cat.btuRelevant) {
    faqs.push({
      q: `How many BTU do I need for my room?`,
      a: `As a rule of thumb, around 340 BTU per square metre for a standard UK room — more for sunny rooms or high ceilings. Our free BTU calculator gives you a sensible buying range.`,
    });
  }
  if (retailers.length) {
    faqs.push({
      q: `Which retailers do you track for ${cat.name.toLowerCase()}?`,
      a: `We track stock and prices across ${retailers.join(", ")}, updated through the day.`,
    });
  }
  return faqs;
}

// The homepage carries the site's highest link equity but had no AnswerLead
// — every other high-priority page (category, brand, hub) has one. Season-
// aware like homepageFaqs below, and leads with "air con" when that's the
// featured category so the site's strongest page reinforces the exact head
// term it's trying to rank for.
export function homepageAnswerLead(products: Product[], now: Date, featured: Category): string {
  const featuredProducts = products.filter((p) => p.category === featured.slug);
  const featuredInStock = featuredProducts.filter(isAnyInStock);
  const checked = clock(now);
  const isAircon = featured.slug === "portable-air-conditioners" || featured.slug === "air-con-units";
  const label = isAircon ? "air con and portable AC units" : featured.name.toLowerCase();

  if (!featuredProducts.length) {
    return `As of ${checked}, we track live UK stock and prices across ${products.length} cooling and home-climate products. Browse a category to see what's in stock right now.`;
  }
  if (!featuredInStock.length) {
    return `As of ${checked}, all ${featuredProducts.length} ${label} we track are sold out across UK retailers. Set a free restock alert and we'll email you the moment any unit comes back in stock.`;
  }
  const cheapest = featuredInStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];
  return `As of ${checked}, ${featuredInStock.length} of ${featuredProducts.length} ${label} we track are in stock in the UK. The cheapest in-stock option is the ${cheapest.p.name} at ${gbp(cheapest.o.price)} from ${cheapest.o.retailer.name}. This is a free air con stock checker — we check every listing across UK retailers throughout the day.`;
}

// ── Homepage FAQ: the 3 real queries that drive impressions ──────────────
// Parameterised by whichever category is currently featured (see
// lib/season.ts) so the homepage's SEO-critical FAQ block stays relevant
// year-round instead of hardcoding portable air conditioners.
export function homepageFaqs(products: Product[], now: Date, featured: Category): Faq[] {
  const total = products.length;
  const inStock = products.filter(isAnyInStock);
  const cheapestOverall = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];

  const retailers = [...new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.name)))];
  const name = featured.name.toLowerCase();
  const featuredProducts = products.filter((p) => p.category === featured.slug);
  const featuredInStock = featuredProducts.filter(isAnyInStock);

  return [
    {
      q: `When will ${name} be back in stock in the UK?`,
      a:
        featuredInStock.length > 0
          ? `Right now, ${featuredInStock.length} of ${featuredProducts.length} ${name} we track are in stock across UK retailers. Stock changes throughout the day as retailers receive shipments. The best way to know when a sold-out unit returns is to set a restock alert — we email you the moment it's buyable again, often before it sells out a second time.`
          : `As of right now, all ${featuredProducts.length} ${name} we track are sold out across UK retailers. This happens fast whenever demand spikes — a heatwave, a cold snap, or any seasonal rush. Set a restock alert and we'll email you the instant any unit comes back in stock — usually ahead of the general public.`,
    },
    {
      q: `How do I check ${name} stock?`,
      a:
        inStock.length > 0
          ? `We track live stock across ${retailers.length} major UK retailers — Amazon and eBay. Browse any category to see exactly what's in stock right now, compare prices across retailers, and set restock alerts for sold-out units. Every price and stock level is checked regularly throughout the day so you're not wasting time on sold-out listings.`
          : `We track stock across ${retailers.length} major UK retailers — Amazon and eBay. Browse any category to see live stock levels, compare prices, and set restock alerts. Every listing is checked regularly, so you always see the current picture in one place rather than hopping between retailer sites.`,
    },
    {
      q: `Where is the cheapest place to buy ${name.replace(/s$/, "")}?`,
      a:
        cheapestOverall && featuredInStock.length > 0
          ? `Right now, the cheapest in-stock option is the ${cheapestOverall.p.name} at ${gbp(cheapestOverall.o.price)} from ${cheapestOverall.o.retailer.name}. We compare prices across all the major UK retailers so you can see at a glance who has the best deal on every unit. Prices change regularly — especially when demand spikes — so check back for the latest.`
          : `Prices vary by retailer and change frequently. We compare prices across Amazon and eBay so you can find the best deal. When demand spikes, prices can rise daily as stock tightens, so checking our live comparison is the quickest way to spot value.`,
    },
  ];
}

// Freshest "checked" time across a product's offers — used as schema dateModified.
export function freshestCheck(p: Product): string {
  return p.offers.reduce(
    (latest, o) => (o.lastChecked > latest ? o.lastChecked : latest),
    p.offers[0]?.lastChecked ?? new Date(0).toISOString(),
  );
}

// ── Scarcity pages (when-will-X-be-back-in-stock + brand stock checkers) ──

export function backInStockAnswer(p: Product, now: Date): string {
  const best = bestOffer(p);
  const buyable = isAnyInStock(p);
  const checked = clock(now);
  if (buyable && best) {
    const delivery = best.deliveryNote ? ` (${best.deliveryNote.toLowerCase()})` : "";
    return `Good news — as of ${checked} the ${p.name} is currently in stock and available to buy. The best price right now is ${gbp(best.price)} at ${best.retailer.name}${delivery}. Stock levels change quickly during hot weather, so we check across all retailers throughout the day and update this page the moment anything changes.`;
  }
  return `As of ${checked}, the ${p.name} is sold out across the UK retailers we track. During high-demand periods, stock returns unpredictably — some units come back within days while others take weeks depending on the brand and retailer. The fastest way to know when it's buyable again is to set a restock alert: we email you the instant any retailer shows stock, often before it sells out again.`;
}

export function backInStockFaqs(p: Product, now: Date): Faq[] {
  const best = bestOffer(p);
  const buyable = isAnyInStock(p);
  const faqs: Faq[] = [
    {
      q: `Is the ${p.name} currently in stock?`,
      a: buyable && best
        ? `Yes — as of ${clock(now)} it's available at ${best.retailer.name} for ${gbp(best.price)}. Check the offer table for the latest from all retailers.`
        : `No — as of ${clock(now)} all retailers we track show it as sold out. We check regularly and will update this page the moment stock returns.`,
    },
    {
      q: `When will the ${p.name} be back in stock in the UK?`,
      a: buyable
        ? `It's already in stock right now at ${best?.retailer.name ?? "UK retailers"}. Popular units can sell out fast whenever demand spikes — if you see it available, we recommend acting quickly.`
        : `We don't have a confirmed restock date from any retailer yet. Restock timing varies: Amazon often gets stock within days, while smaller retailers may take 2–4 weeks. Set a restock alert and we'll email you the moment it's buyable again — the fastest way to know before it sells out again.`,
    },
    {
      q: `Where can I buy the ${p.name} in the UK?`,
      a: p.offers.length
        ? `We track offers from ${[...new Set(p.offers.map((o) => o.retailer.name))].join(", ")}. The offer table below shows current prices and stock status across all retailers.`
        : `We're not tracking any live offers for this unit yet.`,
    },
  ];
  return faqs;
}

// ── Air con stock checker hub (/stock-checker) ────────────────────────────
// Targets the site's single biggest ungapped query cluster — "air con stock
// checker" / "aircon stock checker" — which had no exact-match page before.
// Aggregates across the aircon-relevant categories only (not fans/dehumidifiers).

export function stockCheckerHubAnswer(products: Product[], now: Date): string {
  const total = products.length;
  const inStock = products.filter(isAnyInStock);
  const checked = clock(now);
  if (!total) {
    return `We're not tracking any air con stock yet — check back shortly.`;
  }
  const cheapest = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];
  if (inStock.length && cheapest) {
    return `As of ${checked}, ${inStock.length} of ${total} air conditioners and portable AC units we track are in stock across UK retailers. The cheapest in-stock option right now is the ${cheapest.p.name} at ${gbp(cheapest.o.price)} from ${cheapest.o.retailer.name}. We check every listing throughout the day — this is our free air con stock checker, covering portable, fixed and evaporative units by brand and category.`;
  }
  return `As of ${checked}, all ${total} air conditioners and portable AC units we track are currently sold out across UK retailers. This happens fast when a heatwave hits — set a restock alert and we'll email you the moment any unit comes back in stock.`;
}

export function stockCheckerHubFaqs(products: Product[], now: Date): Faq[] {
  const inStock = products.filter(isAnyInStock);
  const retailers = [...new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.name)))];
  return [
    {
      q: `Is there a free air con stock checker for the UK?`,
      a: `Yes — this page. We track live stock and prices for portable air conditioners, fixed air con units and evaporative coolers across ${retailers.length ? retailers.join(", ") : "major UK retailers"}, updated throughout the day, at no cost to you.`,
    },
    {
      q: `How do I check if air con is in stock near me?`,
      a: inStock.length
        ? `Right now ${inStock.length} of ${products.length} air con units we track are in stock online. Browse by category or brand below to see exactly which models are available and where, or use the BTU calculator to narrow it down by room size first.`
        : `Right now every unit we track is showing as sold out online. Set a restock alert and we'll email you the moment any retailer gets stock back in.`,
    },
    {
      q: `What's the difference between an air con stock checker and a price comparison site?`,
      a: `A price comparison site shows prices whether or not an item is actually buyable. We check real-time stock status first — sold-out listings are marked clearly rather than hidden — so you're not clicking through to a dead product page.`,
    },
    {
      q: `Which brands of air con do you track?`,
      a: `We track ${brandListForCopy(products)} across portable and fixed air conditioning units. Each brand has its own stock-checker page with live availability.`,
    },
  ];
}

function brandListForCopy(products: Product[]): string {
  const brands = [...new Set(products.map((p) => p.brand))];
  if (!brands.length) return "Meaco, Pro Breeze, De'Longhi, Honeywell, electriQ and Geepas";
  return brands.join(", ");
}

export function brandStockCheckerAnswer(brandName: string, products: Product[], now: Date): string {
  const total = products.length;
  const inStock = products.filter(isAnyInStock);
  const checked = clock(now);
  if (!total) {
    return `We're not tracking any ${brandName} products yet.`;
  }
  const cheapest = inStock
    .map((p) => ({ p, o: bestOffer(p)! }))
    .sort((a, b) => a.o.price - b.o.price)[0];
  if (inStock.length && cheapest) {
    return `As of ${checked}, ${inStock.length} of ${total} ${brandName} products we track are in stock across UK retailers. The best-value ${brandName} available right now is the ${cheapest.p.name} at ${gbp(cheapest.o.price)} from ${cheapest.o.retailer.name}. We check prices and stock levels throughout the day.`;
  }
  return `As of ${checked}, all ${total} ${brandName} products we track are currently sold out across UK retailers. This is common when demand is high — set a restock alert and we'll email you the moment any ${brandName} unit comes back in stock.`;
}

export function brandStockCheckerFaqs(brandName: string, products: Product[], now: Date): Faq[] {
  const inStock = products.filter(isAnyInStock);
  const retailers = [...new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.name)))];
  const faqs: Faq[] = [
    {
      q: `Are ${brandName} products in stock in the UK?`,
      a: inStock.length
        ? `Right now, ${inStock.length} of ${products.length} ${brandName} products we track are in stock. See the table below for which models are available and where.`
        : `Right now, all ${products.length} ${brandName} products we track are sold out. Stock changes fast whenever demand spikes — check back regularly or set a restock alert.`,
    },
    {
      q: `Which ${brandName} products are available?`,
      a: products.length
        ? `We track ${products.length} ${brandName} product${products.length === 1 ? "" : "s"}: ${products.map((p) => p.name).join(", ")}. Each listing shows live price and stock across UK retailers.`
        : `We don't have any ${brandName} products in our tracker yet.`,
    },
  ];
  if (retailers.length) {
    faqs.push({
      q: `Where can I buy ${brandName} cooling products?`,
      a: `We track ${brandName} stock and prices across ${retailers.join(", ")}. Click any offer to go direct to the retailer.`,
    });
  }
  return faqs;
}
