import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/countries";
import { CATEGORY_SLUGS } from "@/lib/catalog/contract";
import { SEED_ARTICLES } from "@/lib/catalog/articles";
import { SEED_CATALOG } from "@/lib/catalog/seed-data";

const BASE = "https://comparethecool.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
  ];

  for (const code of Object.keys(COUNTRIES)) {
    entries.push({
      url: `${BASE}/${code}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    entries.push({
      url: `${BASE}/${code}/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
    entries.push({
      url: `${BASE}/${code}/tools`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    entries.push({
      url: `${BASE}/${code}/tools/btu-calculator`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    entries.push({
      url: `${BASE}/${code}/tools/running-cost`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    for (const slug of CATEGORY_SLUGS) {
      entries.push({
        url: `${BASE}/${code}/best/${slug}`,
        changeFrequency: "daily",
        priority: 0.85,
      });
    }

    for (const a of SEED_ARTICLES) {
      entries.push({
        url: `${BASE}/${code}/blog/${a.slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  for (const p of SEED_CATALOG) {
    entries.push({
      url: `${BASE}/${p.country_code}/p/${p.data.slug}`,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  return entries;
}
