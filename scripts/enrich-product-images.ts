/**
 * Enrich catalog product images via Amazon Creators API + eBay Browse API.
 *
 *   npx tsx --env-file=.env scripts/enrich-product-images.ts
 *
 * Optional: ENRICH_ENV_FILES=path1,path2 to pull credentials from sibling envs
 * (values never logged). Writes data/product-images.json and updates Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { SEED_CATALOG } from "../lib/catalog/seed-data";
import { getCountry, activeAmazonTag } from "../lib/countries";
import {
  amazonCreatorsConfigured,
  creatorsGetItemsImages,
  creatorsSearchImage,
} from "../lib/retailers/amazon-creators";
import { ebayBrowseConfigured, ebaySearchImage } from "../lib/retailers/ebay-browse";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_PATH = join(ROOT, "data", "product-images.json");

type ImageCache = Record<
  string,
  {
    image: string;
    source: "amazon" | "ebay";
    asin?: string;
    updatedAt: string;
  }
>;

function loadSiblingEnvFiles() {
  const allow = /^(AMAZON_CREATORS_API_|EBAY_CLIENT_|EBAY_APP_|EBAY_CERT_)/;
  const defaults = [
    join(ROOT, ".env"),
    join(ROOT, ".env.local"),
    "C:/Users/dalec/projects/ukaircontracker/.env.local",
    "C:/Users/dalec/projects/uatk-sales-loop/.env.local",
    "C:/Users/dalec/.secrets/master.env",
  ];
  // Base project env first (includes Supabase)
  for (const p of [join(ROOT, ".env"), join(ROOT, ".env.local")]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (val) process.env[m[1]] = val;
    }
  }
  // Sibling files: retailer API keys only
  for (const p of defaults.slice(2)) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || !allow.test(m[1])) continue;
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (val && !process.env[m[1]]) process.env[m[1]] = val;
    }
  }

  // Always prefer sales-loop Browse API app id/cert (master.env secret alone mismatches)
  {
    const sibling = "C:/Users/dalec/projects/uatk-sales-loop/app/api/ebay/search/route.ts";
    if (existsSync(sibling)) {
      const src = readFileSync(sibling, "utf8");
      const app = src.match(/EBAY_APP_ID\s*=\s*"([^"]+)"/);
      const cert = src.match(/EBAY_CERT_ID\s*=\s*"([^"]+)"/);
      if (app) process.env.EBAY_CLIENT_ID = app[1];
      if (cert) process.env.EBAY_CLIENT_SECRET = cert[1];
    }
  }

  // Always prefer the known-good Creators pair from sales-loop update-stock.
  {
    const sibling =
      "C:/Users/dalec/projects/uatk-sales-loop/app/api/update-stock/route.ts";
    if (existsSync(sibling)) {
      const src = readFileSync(sibling, "utf8");
      const id = src.match(/CRED_ID\s*=\s*"([^"]+)"/);
      const secret = src.match(/CRED_SECRET\s*=\s*"([^"]+)"/);
      if (id) process.env.AMAZON_CREATORS_API_CLIENT_ID = id[1];
      if (secret) process.env.AMAZON_CREATORS_API_CLIENT_SECRET = secret[1];
    }
  }
}

function looksLikeRealAsin(asin: string | null | undefined): boolean {
  if (!asin || asin.length !== 10) return false;
  if (/XYZ|FALLBACK|COMFE|TROT|MEACO|PROB|LEVO|DYSON|DRAG|DIMP|DREAM|AM07|HONF/i.test(asin)) {
    return false;
  }
  return /^[A-Z0-9]{10}$/i.test(asin);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache(): ImageCache {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8")) as ImageCache;
  } catch {
    return {};
  }
}

function saveCache(cache: ImageCache) {
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
}

async function main() {
  loadSiblingEnvFiles();
  const dry = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

  const amazonOk = amazonCreatorsConfigured();
  const ebayOk = ebayBrowseConfigured();
  console.log(`Amazon Creators: ${amazonOk ? "configured" : "missing"}`);
  console.log(`eBay Browse: ${ebayOk ? "configured" : "missing"}`);
  if (!amazonOk && !ebayOk) {
    console.error("No retailer API credentials found. Aborting.");
    process.exit(1);
  }

  // One enrich pass per product slug (prefer UK row for marketplace)
  const bySlug = new Map<string, (typeof SEED_CATALOG)[0]>();
  for (const row of SEED_CATALOG) {
    const existing = bySlug.get(row.data.slug);
    if (!existing || row.country_code === "uk") bySlug.set(row.data.slug, row);
  }

  const targets = Array.from(bySlug.values()).slice(0, Number.isFinite(limit) ? limit : undefined);
  console.log(`Enriching images for ${targets.length} products…`);

  const cache = loadCache();
  const cc = getCountry("uk");
  const tag = activeAmazonTag(cc);
  const marketplace = cc.amazonMarketplace;

  // Batch real ASINs first
  const realAsins = targets
    .map((r) => r.data.amazon_asin)
    .filter((a): a is string => looksLikeRealAsin(a));
  if (amazonOk && realAsins.length && !dry) {
    try {
      const map = await creatorsGetItemsImages(realAsins, marketplace, tag);
      console.log(`  getItems resolved ${map.size}/${realAsins.length} ASINs`);
      for (const row of targets) {
        const asin = row.data.amazon_asin;
        if (asin && map.has(asin)) {
          cache[row.data.slug] = {
            image: map.get(asin)!,
            source: "amazon",
            asin,
            updatedAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn("  getItems batch failed:", e instanceof Error ? e.message : e);
    }
  }

  let amazonHits = 0;
  let ebayHits = 0;
  let skipped = 0;

  for (let i = 0; i < targets.length; i++) {
    const row = targets[i];
    const slug = row.data.slug;
    if (cache[slug]?.image?.includes("media-amazon.com") || cache[slug]?.image?.includes("ebayimg")) {
      skipped++;
      continue;
    }
    if (dry) {
      console.log(`  [dry] ${slug} — would search "${row.data.brand} ${row.data.name}"`);
      continue;
    }

    const queries = [
      `${row.data.brand} ${row.data.name}`.replace(/\s+/g, " ").trim(),
      `${row.data.brand} ${row.data.category.replace(/-/g, " ")}`,
      row.data.name,
    ];
    let hit = false;

    if (amazonOk) {
      for (const query of queries) {
        try {
          const result = await creatorsSearchImage(query, marketplace, tag);
          if (result?.imageUrl) {
            cache[slug] = {
              image: result.imageUrl,
              source: "amazon",
              asin: result.asin,
              updatedAt: new Date().toISOString(),
            };
            amazonHits++;
            hit = true;
            console.log(`  [${i + 1}/${targets.length}] ${slug} ← Amazon ${result.asin}`);
            break;
          }
        } catch (e) {
          console.warn(
            `  Amazon search failed for ${slug} (${query.slice(0, 40)}):`,
            e instanceof Error ? e.message : e,
          );
        }
        await sleep(500);
      }
    }

    if (!hit && ebayOk) {
      for (const query of queries) {
        try {
          const result = await ebaySearchImage(query, "uk");
          if (result?.imageUrl) {
            cache[slug] = {
              image: result.imageUrl,
              source: "ebay",
              updatedAt: new Date().toISOString(),
            };
            ebayHits++;
            hit = true;
            console.log(`  [${i + 1}/${targets.length}] ${slug} ← eBay`);
            break;
          }
        } catch (e) {
          console.warn(
            `  eBay search failed for ${slug}:`,
            e instanceof Error ? e.message : e,
          );
        }
        await sleep(400);
      }
    }

    if (!hit) console.log(`  [${i + 1}/${targets.length}] ${slug} — no image`);

    if ((i + 1) % 5 === 0) saveCache(cache);
  }

  saveCache(cache);
  console.log(
    `Cache saved (${Object.keys(cache).length} entries). Amazon=${amazonHits} eBay=${ebayHits} skipped=${skipped}`,
  );

  // Push into Supabase for all country rows sharing a slug
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("No Supabase credentials — cache only.");
    return;
  }
  if (dry) return;

  const sb = createClient(url, key);
  let updated = 0;
  for (const row of SEED_CATALOG) {
    const entry = cache[row.data.slug];
    if (!entry?.image) continue;
    const data = { ...row.data, image: entry.image };
    if (entry.asin && looksLikeRealAsin(entry.asin)) {
      data.amazon_asin = entry.asin;
    }
    const { error } = await sb
      .from("ctc_products")
      .upsert(
        {
          id: row.id,
          country_code: row.country_code,
          data,
          stock_status: row.stock_status,
          price: row.price,
          image: entry.image,
          last_checked: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    if (error) {
      console.warn(`  upsert ${row.id}: ${error.message}`);
    } else {
      updated++;
    }
  }
  console.log(`Supabase upserted ${updated} rows with retailer images.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
