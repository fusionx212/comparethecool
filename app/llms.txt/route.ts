import { getAllProducts, getBrandName, BRAND_SLUGS } from "@/lib/data";
import { CATEGORIES } from "@/lib/categories";
import { gbp } from "@/lib/format";
import { bestOffer, isAnyInStock, lowestPrice } from "@/lib/data";

// llms.txt — a machine-readable site summary for LLM crawlers (llmstxt.org).
// Content is data-driven from the live product feed so it stays accurate.
//
// Was `dynamic = "force-static"`, which bakes the "live" counts in at BUILD
// time and never updates them again on this ~1-deploy/day site — directly
// contradicting the "stays accurate" claim above. Matches the rest of the
// site's revalidate=7200 (2h cron cadence) instead.
export const revalidate = 7200;

const SITE_NAME = "UK Air Con Tracker";
const HOME_URL = "https://ukaircontracker.co.uk";

export async function GET() {
  const products = await getAllProducts();
  const inStock = products.filter(isAnyInStock);

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    "> Free, independent air con stock checker for the UK — live stock and price tracking for portable air conditioners, air con units, fans, dehumidifiers, heaters and air purifiers.",
    "> We monitor stock across major UK retailers (Amazon and eBay) every 2 hours",
    "> and alert you the moment sold-out units come back.",
    "",
    "## Core info",
    "",
    `- Site: [${SITE_NAME}](${HOME_URL})`,
    `- Air con stock checker: [Live UK air con stock, all brands and categories](${HOME_URL}/stock-checker)`,
    `- About: [About us](${HOME_URL}/about)`,
    `- How we track: [Methodology](${HOME_URL}/how-we-track)`,
    `- Products tracked: ${products.length}`,
    `- Currently in stock: ${inStock.length}`,
    "",
    "## Categories",
    "",
  ];

  for (const cat of CATEGORIES) {
    const catProducts = products.filter((p) => p.category === cat.slug);
    const inStockCount = catProducts.filter(isAnyInStock).length;
    lines.push(`- [${cat.name}](${HOME_URL}/${cat.slug}) — ${inStockCount} of ${catProducts.length} in stock`);
  }

  lines.push("", "## Brand stock checkers", "");
  for (const slug of Object.keys(BRAND_SLUGS)) {
    lines.push(`- [${getBrandName(slug)} stock checker](${HOME_URL}/stock-checker/${slug})`);
  }

  lines.push("", "## Products", "");

  for (const p of products) {
    const low = lowestPrice(p);
    const best = bestOffer(p);
    const buyable = isAnyInStock(p);
    lines.push(
      `- [${p.name}](${HOME_URL}/p/${p.slug})` +
        (buyable && low ? ` — in stock from ${gbp(low)}` : " — currently sold out") +
        (best ? ` at ${best.retailer.name}` : ""),
    );
  }

  lines.push("", "## Optional", "");
  lines.push(`- [BTU calculator](${HOME_URL}/tools/btu-calculator)`);
  lines.push(`- [Running cost calculator](${HOME_URL}/tools/running-cost-calculator)`);
  lines.push(`- [Find a portable air conditioner in stock — guide](${HOME_URL}/guides/find-portable-air-conditioner-in-stock)`);
  lines.push(`- [Set a restock alert](${HOME_URL}/alerts)`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
