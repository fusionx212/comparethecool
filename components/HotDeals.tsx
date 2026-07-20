import { getAllProducts, isAnyInStock } from "@/lib/data";
import { ProductCard } from "./ProductCard";

// Winter categories to exclude from the hot-deals strip during cooling season
// (Apr–Sep). These rotate back in automatically when season.ts pivots.
const WINTER_CATEGORIES = new Set([
  "oil-radiators",
  "electric-blankets",
  "heated-airers",
  "smart-thermostats",
]);

// Products with genuine price drops — filtered to Amazon/eBay only.
// Seasonal: excludes heating during summer. Drops must be > 0%.
async function getPriceDrops() {
  const month = new Date().getUTCMonth(); // 0=Jan
  const isSummer = month >= 3 && month <= 8; // Apr–Sep
  const products = await getAllProducts(); // already stripped to Amazon/eBay

  return products
    .filter((p) => {
      if (!isAnyInStock(p)) return false;
      if (!p.priceHistory || p.priceHistory.length < 2) return false;
      if (isSummer && WINTER_CATEGORIES.has(p.category)) return false;
      const latest = p.priceHistory[p.priceHistory.length - 1];
      const previous = p.priceHistory[p.priceHistory.length - 2];
      // Only genuine drops: latest tracked price is lower than previous
      return latest.price < previous.price;
    })
    .map((p) => {
      const latest = p.priceHistory![p.priceHistory!.length - 1];
      const previous = p.priceHistory![p.priceHistory!.length - 2];
      const dropPct = Math.round(
        ((previous.price - latest.price) / previous.price) * 100
      );
      return { product: p, dropPct, previousPrice: previous.price };
    })
    .filter((d) => d.dropPct > 0) // no 0% drops
    .sort((a, b) => b.dropPct - a.dropPct) // biggest drops first
    .slice(0, 6);
}

export async function HotDeals() {
  const deals = await getPriceDrops();
  if (deals.length < 2) return null;

  return (
    <section className="border-b rule-strong bg-surface-cool">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="block h-3 w-3 bg-heat" aria-hidden />
          <div className="eyebrow text-heat">Price drops</div>
          <span className="eyebrow text-foreground/35">
            — recently reduced, still in stock
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {deals.map(({ product: p, dropPct, previousPrice }) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="compact"
              priceDropBadge={{ previousPrice, dropPct }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
