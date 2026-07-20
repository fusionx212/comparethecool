import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getProductsByCategory, isAnyInStock, bestOffer } from "@/lib/data";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { TieredBoard } from "@/components/TieredBoard";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { HotDeals } from "@/components/HotDeals";
import { CoolingGlyph } from "@/components/CoolingGlyph";
import { FaqSection } from "@/components/FaqSection";
import { InstallationCTA } from "@/components/InstallationCTA";
import { SeasonalBanner } from "@/components/SeasonalBanner";
import { LochCrossSell } from "@/components/LochCrossSell";
import { homepageAnswerLead, homepageFaqs } from "@/lib/seo-copy";
import { AnswerLead } from "@/components/AnswerLead";
import { pickFeaturedCategory, getFeaturedCopy, getSeason } from "@/lib/season";

// ISR: refresh every 5 min so stock statuses don't lie about availability.
// Was 7200 (2h) — too slow for a live stock tracker where OOS units look buyable.
export const revalidate = 300;

// Season-aware <title>/description — the layout default leads with the brand
// name, which is exactly why the site ranks for "aircon tracker" (branded)
// but not the much higher-volume generic "air con" / "air con stock checker"
// queries. This overrides it per-season so the homepage — the site's highest
// authority page — actually targets the head term, mirroring the same
// cooling/heating pivot the page body already does (lib/season.ts).
export async function generateMetadata(): Promise<Metadata> {
  const isCooling = getSeason(new Date()) === "cooling";
  return isCooling
    ? {
        title: "Compare the Cool — Expert AC & Cooling Reviews | Best Prices Live",
        description:
          "Independent expert reviews of portable air conditioners, tower fans, dehumidifiers and air purifiers. Compare live prices across retailers. We test, rate, and track stock so you buy the right one.",
      }
    : {
        title: "Compare the Heat — Expert Heating Reviews | Best Prices Live",
        description:
          "Independent expert reviews of oil radiators, electric blankets, heated airers and dehumidifiers. Compare live prices across retailers. We test, rate, and track stock so you buy the right one.",
      };
}

export default async function Home() {
  const now = new Date();
  const products = await getAllProducts();
  const inStock = products.filter(isAnyInStock);

  // Seasonal filtering
  const WINTER_CATS = new Set(["oil-radiators", "electric-blankets", "heated-airers", "smart-thermostats"]);
  const isSummer = now.getUTCMonth() >= 3 && now.getUTCMonth() <= 8;

  // Only show products that are buyable on Amazon from known brands.
  // Scoring is in-code (not Supabase) so cron updates can't reset it.
  const KNOWN_BRANDS = ["aurahome","aoxun","meaco","delonghi","electriq","dyson","daewoo","honeywell","samsung","trotec","bosch","aeg","whirlpool","philips","hisense","devola","serenelif","pro breeze","vonhaus","dunelm","logik","igenix","geepas","hughes","airorig","air pro"];
  const JUNK_SIGNALS = ["evaporative","water tank","0.9l","900ml","1100ml","1500ml","12l","14l","7l tank","cooler fan","air cooler","personal ac","mini ac","swamp","ice box","portable air cooler","usb","desk","handheld","neck","tiny"];
  const MASH_BRANDS = ["jiaozuo","yucheng","lvliang","lexbd","sweetfull","kpouyyds","jjlvlu","aigostar","beldray","neco","hjyxxsr","chuboor","moegfy","warmco","euhomy","easyera","rabbitgoo","yotache","kinder fluff","tapo"];
  const EVAP_CATS = new Set(["evaporative-coolers","desk-usb-fans","portable-fans","cooling-gadgets","ac-accessories","cooling-bedding","car-sun-shades","window-film","paddling-pools","window-insulation","misting-systems","portable-power","garden-parasols","dog-cooling","blackout-curtains"]);
  const PREMIUM_CATS = new Set(["portable-air-conditioners","air-con-units","dehumidifiers","air-purifiers","tower-fans","pedestal-fans","ice-makers"]);

  function productScore(p) {
    const name = (p.name || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    const amz = p.offers.find((o) => o.retailer.id === "amazon");
    
    // Hard kills
    if (JUNK_SIGNALS.some((s) => name.includes(s))) return -9999;
    if (MASH_BRANDS.some((b) => brand.includes(b))) return -9999;
    if (EVAP_CATS.has(p.category)) return -9999;
    if (p.btu && p.btu < 7000 && p.btu > 0) return -9999;
    
    // Tiered scoring — premium items get higher placement but budget items
    // still appear further down. During cool weather, budget items often
    // convert better than premium ACs (window film, fans, ice makers).
    let score = 0;
    const price = amz?.price || 0;
    
    // Amazon stock = base signal
    if (amz && (amz.status === "in_stock" || amz.status === "low_stock")) score += 200;
    // Premium categories get a boost
    if (PREMIUM_CATS.has(p.category)) score += 100;
    // Real BTU bonus (real ACs rise to top)
    if (p.btu && p.btu >= 7000) score += p.btu / 50;
    // Known brands
    if (KNOWN_BRANDS.some((b) => brand.includes(b))) score += 200;
    // Sweet spot pricing £150-600 gets top placement
    if (price >= 150 && price <= 600) score += 150;
    // Budget items (£20-50) get base score — they convert in cool weather
    // Items under £20 still appear, just lower in the board
    if (price > 0 && price < 50) score += 50;  // budget boost instead of penalty
    
    return score;
  }

  const boardProducts = products
    .filter((p) => {
      if (isSummer && WINTER_CATS.has(p.category)) return false;
      const amz = p.offers.find((o) => o.retailer.id === "amazon");
      if (!amz || (amz.status !== "in_stock" && amz.status !== "low_stock")) return false;
      return productScore(p) > 0;
    })
    .sort((a, b) => productScore(b) - productScore(a));

  const retailers = new Set(products.flatMap((p) => p.offers.map((o) => o.retailer.id))).size;
  const moving = [...products].sort((a, b) => Number(isAnyInStock(b)) - Number(isAnyInStock(a)));

  const byCategory = await Promise.all(
    CATEGORIES.map(async (c) => {
      const items = await getProductsByCategory(c.slug);
      return { category: c, total: items.length, inStock: items.filter(isAnyInStock).length };
    }),
  );

  // Automated seasonal pivot — which category leads the homepage. Gated on
  // real inventory depth so it only switches once the seasonal category is
  // actually stocked (see lib/season.ts).
  const featuredSlug = pickFeaturedCategory(
    now,
    byCategory.map((b) => ({ slug: b.category.slug, total: b.total })),
  );
  const featuredCategory = getCategory(featuredSlug)!;
  const copy = getFeaturedCopy(featuredSlug, featuredCategory);
  const isSample = products.some((p) => p.sample);
  // Real stock scarcity for the featured category — replaces a hardcoded
  // "361 people waiting for the MeacoCool 9000" that never changed and named
  // a fixed product regardless of season/what's actually featured. Zero extra
  // queries: byCategory is already computed above for the category tiles.
  const featuredStats = byCategory.find((b) => b.category.slug === featuredSlug);

  return (
    <div>
      {/* Masthead hero */}
      <section className="border-b rule-strong">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[1.5fr_1fr]">
          <div className="px-5 py-10 md:py-20">
            <div className="eyebrow text-brand-deep">Expert reviews &amp; live price comparison</div>
            <h1 className="mt-4 max-w-xl text-3xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              {copy.h1}
            </h1>
            <p className="mt-4 max-w-md text-sm text-foreground/70 md:text-base">{copy.sub}</p>
            <div className="mt-5 max-w-md">
              <AnswerLead>{homepageAnswerLead(products, now, featuredCategory)}</AnswerLead>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${featuredSlug}`}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
              >
                {copy.ctaPrimaryLabel} →
              </Link>
              <Link
                href="/alerts"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider hover:border-brand hover:text-brand"
              >
                Get restock alerts
              </Link>
            </div>
            {featuredStats && featuredStats.total > 0 && (
              <p className="mt-5 flex items-center gap-2 text-sm text-foreground/50">
                <span
                  className="flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: featuredStats.inStock > 0 ? "var(--instock)" : "var(--sold)" }}
                  aria-hidden
                />
                {featuredStats.inStock} of {featuredStats.total} {featuredCategory.shortName.toLowerCase()} in stock right now —{" "}
                <Link href={`/${featuredSlug}`} className="font-semibold text-brand hover:underline">
                  see what&rsquo;s in stock
                </Link>
              </p>
            )}
          </div>

          {/* Status panel — honest counts from verified stock data */}
          <div className="ouac-grid border-t border-line bg-surface md:border-l md:border-t-0 md:rule-strong">
            <Stat label="In stock now" value={inStock.length} token="var(--instock)" />
            <Stat label="Units tracked" value={products.length} token="var(--brand)" border />
          </div>
        </div>
      </section>

      {/* Affiliate disclosure — above fold per UK advertising rules */}
      <div className="border-b border-line bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-2">
          <p className="text-xs text-foreground/55">
            <span className="font-semibold">Ad:</span> We may earn a commission when you buy through our links, at no extra cost to you.{" "}
            <Link href="/disclosure" className="underline hover:text-brand">Learn more</Link>
          </p>
        </div>
      </div>

      {isSample && (
        <div className="border-b border-line bg-surface-cool">
          <div className="mx-auto max-w-6xl px-5 py-2">
            <span className="eyebrow text-foreground/60">
              Prices and stock are indicative and refreshed regularly — always confirm on the retailer&rsquo;s site before buying
            </span>
          </div>
        </div>
      )}

      {/* Quick links — target the searches people actually make */}
      <div className="border-b border-line bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="font-semibold text-foreground/50">Popular:</span>
            <Link href="/best/portable-air-conditioners-uk" className="text-foreground/65 hover:text-brand">Best portable AC</Link>
            <span className="text-foreground/20">|</span>
            <Link href="/portable-air-conditioners" className="text-foreground/65 hover:text-brand">Air conditioners in stock</Link>
            <span className="text-foreground/20">|</span>
            <Link href="/dehumidifiers" className="text-foreground/65 hover:text-brand">Dehumidifier deals</Link>
            <span className="text-foreground/20">|</span>
            <Link href="/tower-fans" className="text-foreground/65 hover:text-brand">Tower fans</Link>
            <span className="text-foreground/20">|</span>
            <Link href="/tools/btu-calculator" className="text-foreground/65 hover:text-brand">BTU calculator</Link>
            <span className="text-foreground/20">|</span>
            <Link href="/guides/heatwave-survival-kit" className="text-foreground/65 hover:text-brand">Heatwave prep</Link>
          </div>
        </div>
      </div>

      {/* Hot deals — price drops, highest conversion rate. Above the fold on mobile. */}
      <HotDeals />

      {/* Featured picks — high-converting products with images */}
      <FeaturedProducts products={products} />

      {/* Seasonal pitch — context, but below the products people came for */}
      <SeasonalBanner />

      {/* Installation referral CTA */}
      <div className="mx-auto max-w-6xl px-5 mt-6">
        <InstallationCTA variant="banner" />
      </div>

      {/* The board — tiered by price for faster buying decisions */}
      <TieredBoard products={boardProducts} />

      {/* Category index */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="eyebrow text-brand-deep">Browse by type</div>
        <h2 className="mt-1 mb-6 text-2xl font-bold tracking-tight">Every cooling category, tracked</h2>
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {byCategory.map(({ category, total, inStock }, i) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group border-b border-r border-line bg-surface p-6 hover:bg-surface-cool"
            >
              <div className="flex items-center justify-between">
                <span className="tnum text-sm text-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="tnum text-xs text-foreground/60">
                  <span style={{ color: "var(--instock)" }}>{inStock}</span> / {total} in stock
                </span>
              </div>
              <CoolingGlyph category={category.slug} className="mt-5 h-10 w-10 text-brand" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-brand">{category.name}</h3>
              <p className="mt-2 text-sm text-foreground/60">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="eyebrow text-brand-deep">Buying guides</div>
        <h2 className="mt-1 mb-6 text-2xl font-bold tracking-tight">
          Portable AC, fans, dehumidifiers &amp; more — original reviews and comparisons
        </h2>
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          <GuideCell
            href="/best/portable-air-conditioners-uk"
            kicker="Buying Guide"
            title="Best Portable Air Conditioners UK — Live Stock Check"
            body="We track every portable AC across Amazon and eBay. See which units are actually in stock, compare real prices live, and find the best BTU for your room."
          />
          <GuideCell
            href="/guides/meacocool-mc-series-review"
            kicker="Brand Review"
            title="MeacoCool MC Series — Which Model?"
            body="Full range comparison: 9,000R to 16,000 CH. Prices, noise, room coverage, and which model fits your space."
          />
          <GuideCell
            href="/guides/portable-vs-fixed-installation"
            kicker="Decision Guide"
            title="Portable AC vs Fixed Installation"
            body="The real 5-year cost comparison. Upfront price, electricity, lifespan, property value — we did the maths."
          />
          <GuideCell
            href="/guides/geepas-vs-meaco-dehumidifiers"
            kicker="Comparison"
            title="Geepas vs Meaco Dehumidifiers"
            body="Budget (£90) vs Which? Best Buy (£140). Extraction rates, noise, running costs and cold-room performance."
          />
          <GuideCell
            href="/guides/heatwave-survival-kit"
            kicker="Checklist"
            title="UK Heatwave Survival Kit 2026"
            body="What to buy before it hits 35°C. Ranked by effectiveness — from portable AC down to ice-water bottles."
          />
          <GuideCell
            href="/guides/dyson-vs-meaco-fan"
            kicker="Premium vs Budget"
            title="Dyson Cool vs Meaco Fan — Worth £400?"
            body="Dyson TP07 (£479) vs Meaco 1056 (£80). We compare noise, airflow, HEPA filtration and real value."
          />
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2">
          <ToolCell
            href="/tools/btu-calculator"
            kicker="Tool"
            title="BTU calculator"
            body="Get the right size before you buy. An undersized portable AC will never cool the room on the hottest days."
          />
          <ToolCell
            href="/tools/running-cost-calculator"
            kicker="Tool"
            title="Running-cost estimator"
            body="See what a portable AC actually adds to your electricity bill per day, month, and summer — using real UK energy rates."
          />
        </div>
      </section>

      {/* Restock alert band */}
      <section className="border-y rule-strong bg-brand-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="eyebrow text-white/60">The smart move</div>
            <h2 className="mt-2 max-w-lg text-2xl font-bold tracking-tight">
              Sold out everywhere? Get the restock alert.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              We email you the instant a sold-out unit is buyable again — usually before it sells
              out a second time.
            </p>
          </div>
          <Link
            href="/alerts"
            className="self-start border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-ink hover:bg-transparent hover:text-white"
          >
            Set a restock alert
          </Link>
        </div>
      </section>

      <FaqSection
        faqs={homepageFaqs(products, now, featuredCategory)}
        heading={`${featuredCategory.name} in the UK — your questions`}
      />

      <LochCrossSell />
    </div>
  );
}

function Stat({
  label,
  value,
  token,
  border,
}: {
  label: string;
  value: number;
  token: string;
  border?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-6 py-6 ${border ? "border-t border-line" : ""}`}>
      <span className="block h-8 w-8 flex-none" style={{ backgroundColor: token }} aria-hidden />
      <div>
        <div className="tnum text-3xl font-bold leading-none">{value}</div>
        <div className="eyebrow mt-1 text-foreground/55">{label}</div>
      </div>
    </div>
  );
}

function ToolCell({
  href,
  kicker,
  title,
  body,
}: {
  href?: string;
  kicker: string;
  title: string;
  body: string;
}) {
  const inner = (
    <div className="h-full border-b border-r border-line bg-surface p-6 hover:bg-surface-cool">
      <div className="eyebrow text-brand-deep">{kicker}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-foreground/60">{body}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="group">
      {inner}
    </Link>
  ) : (
    <div className="opacity-70">{inner}</div>
  );
}

function GuideCell({
  href,
  kicker,
  title,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full border-b border-r border-line bg-surface p-6 hover:bg-surface-cool">
        <div className="eyebrow text-brand-deep">{kicker}</div>
        <h3 className="mt-2 text-lg font-semibold group-hover:text-brand">{title}</h3>
        <p className="mt-2 text-sm text-foreground/60">{body}</p>
        <span className="eyebrow mt-3 inline-block text-brand group-hover:underline">
          Read the guide →
        </span>
      </div>
    </Link>
  );
}
