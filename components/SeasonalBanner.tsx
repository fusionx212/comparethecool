import Link from "next/link";

type Season = "spring" | "summer" | "autumn" | "winter";

function getSeason(): Season {
  const m = new Date().getMonth(); // 0=Jan, 11=Dec
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

const PITCH: Record<Season, {
  emoji: string;
  headline: string;
  body: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}> = {
  spring: {
    emoji: "🌱",
    headline: "Spring is prep season — buy before the rush",
    body: "AC prices are at their lowest right now. By the first May heatwave, stock evaporates and prices jump £50-100. Use our selector to find your unit, lock in the spring price, and be ready when summer hits.",
    primaryCta: { text: "Find my AC →", href: "/tools/stock-selector" },
    secondaryCta: { text: "BTU Calculator →", href: "/tools/btu-calculator" },
  },
  summer: {
    emoji: "☀️",
    headline: "Heatwave incoming — these units are still in stock",
    body: 'We track every UK retailer in real time. No phantom stock, no "usually dispatched in 4 weeks." Just units you can actually buy right now. Filter by room size, budget, and features.',
    primaryCta: { text: "Show in-stock units →", href: "/tools/stock-selector" },
    secondaryCta: { text: "Heatwave checklist £2.99 →", href: "/products/heatwave-emergency-checklist" },
  },
  autumn: {
    emoji: "🍂",
    headline: "End-of-season bargains — and winter prep",
    body: "Retailers are clearing summer AC stock at discounts. But more importantly: heat pump ACs slash your winter heating bill by up to 40%. Now is the time to switch to year-round climate control.",
    primaryCta: { text: "Browse heat pump ACs →", href: "/tools/stock-selector" },
    secondaryCta: { text: "Cooling Handbook £4.99 →", href: "/products/home-cooling-handbook" },
  },
  winter: {
    emoji: "❄️",
    headline: "Stay warm — heat pump ACs cut heating bills",
    body: "A portable heat pump AC costs 25-35p/hour to run in heating mode. That's cheaper than most electric heaters and FAR cheaper than running central heating in one room. Find units with heating mode — in stock now.",
    primaryCta: { text: "Find heating ACs →", href: "/tools/stock-selector" },
    secondaryCta: { text: "Energy guide £4.99 →", href: "/products/home-cooling-handbook" },
  },
};

export function SeasonalBanner() {
  const season = getSeason();
  const pitch = PITCH[season];

  return (
    <div className="border-b rule-strong bg-gradient-to-r from-brand/5 via-brand/10 to-brand/5">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pitch.emoji}</span>
              <span className="eyebrow text-brand-deep">
                {season.charAt(0).toUpperCase() + season.slice(1)} {new Date().getFullYear()}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">{pitch.headline}</h2>
            <p className="mt-2 text-sm text-foreground/65 max-w-2xl">{pitch.body}</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href={pitch.primaryCta.href}
              className="border border-brand bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep whitespace-nowrap"
            >
              {pitch.primaryCta.text}
            </Link>
            {pitch.secondaryCta && (
              <Link
                href={pitch.secondaryCta.href}
                className="border border-line bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-brand whitespace-nowrap"
              >
                {pitch.secondaryCta.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
