import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getAllProducts, BRAND_SLUGS } from "@/lib/data";
import { getAllBestOfSlugs } from "@/lib/best-of-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const staticRoutes = [
    "", "/alerts", "/stock-checker", "/tools/btu-calculator", "/tools/running-cost-calculator",
    "/tools/stock-selector", "/how-we-track", "/installation", "/installers", "/disclosure",
    "/about", "/contact", "/privacy", "/terms",
    "/products/energy-bill-guide", "/products/heatwave-emergency-checklist",
    "/products/holiday-let-welcome-book", "/products/home-cooling-handbook",
    "/products/home-maintenance-logbook",
  ];

  // SSOT gap: guide pages have no shared registry (unlike CATEGORIES / BEST_OF_PAGES),
  // so this list is hand-kept — it must match every folder under app/guides/. 8 of 10
  // were missing here (silently unindexed), including the page built specifically for
  // "portable air conditioner in stock" — fixed 2026-07-15.
  const guideRoutes = [
    "/guides/geepas-vs-meaco-dehumidifiers",
    "/guides/best-oil-radiators-under-50",
    "/guides/best-portable-ac-under-350",
    "/guides/btu-room-sizing-guide",
    "/guides/compressor-vs-desiccant-dehumidifier",
    "/guides/dyson-vs-meaco-fan",
    "/guides/find-portable-air-conditioner-in-stock",
    "/guides/heatwave-survival-kit",
    "/guides/meacocool-mc-series-review",
    "/guides/portable-vs-fixed-installation",
    "/guides/tower-vs-pedestal-fans",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      url: `${BASE}/p/${p.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    // Scarcity pages — one per product
    ...products.map((p) => ({
      url: `${BASE}/back-in-stock/${p.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    // Brand stock checkers
    ...Object.keys(BRAND_SLUGS).map((slug) => ({
      url: `${BASE}/stock-checker/${slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    // Best-of buying guides (high-intent, high-conversion content)
    ...getAllBestOfSlugs().map((slug) => ({
      url: `${BASE}/best/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.95,
    })),
    // Comparison & buying guides
    ...guideRoutes.map((path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];
}
