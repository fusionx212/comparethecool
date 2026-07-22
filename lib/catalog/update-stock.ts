/**
 * Multi-region stock update for ctc_products.
 * - UK: Amazon Creators API (live availability + price). Credential is UK Associates only.
 * - Other markets: Amazon PDP probe so we never keep Buy links to dead ASINs.
 * Credentials must already be in process.env (Netlify env or script loader).
 */

import { createClient } from "@supabase/supabase-js";
import { COUNTRIES, activeAmazonTag, getCountry } from "@/lib/countries";
import { looksLikeRealAsin } from "@/lib/asin";
import {
  amazonCreatorsConfigured,
  creatorsGetItemsStock,
  creatorsSearchImage,
} from "@/lib/retailers/amazon-creators";
import { probeAmazonPdp } from "@/lib/retailers/amazon-pdp";
import { amazonProductUrl } from "@/lib/affiliate";
import type { Offer, StockStatus } from "@/lib/types";

export type StockUpdateSummary = {
  countries: number;
  checked: number;
  inStock: number;
  outStock: number;
  notFound: number;
  resolvedAsin: number;
  errors: string[];
};

/** Creators partner tags are only linked for these marketplaces today. */
const CREATORS_COUNTRIES = new Set(["uk"]);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function applyAmazonOffer(
  data: Record<string, unknown>,
  opts: {
    asin: string;
    status: StockStatus;
    price: number | null;
    imageUrl: string | null;
    countryCode: string;
    now: string;
    fallbackPrice?: number | null;
  },
) {
  const offers = Array.isArray(data.offers) ? [...(data.offers as Offer[])] : [];
  const amazonUrl = amazonProductUrl(opts.countryCode, opts.asin);
  if (!amazonUrl) return offers;

  let amazonOffer = offers.find((o) => o.retailer.id === "amazon");
  const next: Offer = {
    retailer: { id: "amazon", name: "Amazon" },
    price: opts.price ?? amazonOffer?.price ?? opts.fallbackPrice ?? 0,
    url: amazonUrl,
    status: opts.status,
    lastChecked: opts.now,
  };
  if (amazonOffer) {
    const idx = offers.findIndex((o) => o.retailer.id === "amazon");
    offers[idx] = { ...amazonOffer, ...next };
  } else {
    offers.unshift(next);
  }
  data.offers = offers;
  data.amazon_asin = opts.asin;
  if (opts.imageUrl) data.image = opts.imageUrl;
  return offers;
}

export async function runStockUpdate(opts?: {
  countries?: string[];
  resolveMissingAsins?: boolean;
}): Promise<StockUpdateSummary> {
  const summary: StockUpdateSummary = {
    countries: 0,
    checked: 0,
    inStock: 0,
    outStock: 0,
    notFound: 0,
    resolvedAsin: 0,
    errors: [],
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    summary.errors.push("Supabase service role missing");
    return summary;
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const markets = (opts?.countries || Object.keys(COUNTRIES)).filter((c) => COUNTRIES[c]);
  const now = new Date().toISOString();
  const creatorsReady = amazonCreatorsConfigured();

  for (const code of markets) {
    summary.countries += 1;
    const cc = getCountry(code === "eu" ? "de" : code);
    const tag = activeAmazonTag(getCountry(code));
    const marketplace = cc.amazonMarketplace;
    const useCreators = CREATORS_COUNTRIES.has(code) && creatorsReady;

    if (CREATORS_COUNTRIES.has(code) && !creatorsReady) {
      summary.errors.push(`${code}: Amazon Creators API credentials missing`);
      continue;
    }

    const { data: rows, error } = await sb
      .from("ctc_products")
      .select("id,country_code,data,stock_status,price,image,last_checked")
      .eq("country_code", code);

    if (error) {
      summary.errors.push(`${code}: ${error.message}`);
      continue;
    }
    if (!rows?.length) continue;

    if (useCreators && opts?.resolveMissingAsins !== false) {
      for (const row of rows) {
        const data = row.data as Record<string, unknown>;
        const asin = data.amazon_asin as string | null;
        if (looksLikeRealAsin(asin)) continue;
        const name = String(data.name || data.slug || "");
        const brand = String(data.brand || "");
        if (!name) continue;
        try {
          const hit = await creatorsSearchImage(`${brand} ${name}`.trim(), marketplace, tag);
          await sleep(250);
          if (hit?.asin && looksLikeRealAsin(hit.asin)) {
            data.amazon_asin = hit.asin;
            if (hit.imageUrl) {
              data.image = hit.imageUrl;
              row.image = hit.imageUrl;
            }
            summary.resolvedAsin += 1;
          }
        } catch (e) {
          summary.errors.push(
            `${code}/${String(data.slug)}: resolve ${e instanceof Error ? e.message : e}`,
          );
        }
      }
    }

    if (useCreators) {
      const asinToRows = new Map<string, typeof rows>();
      for (const row of rows) {
        const asin = (row.data as { amazon_asin?: string }).amazon_asin;
        if (!looksLikeRealAsin(asin)) continue;
        const list = asinToRows.get(asin!) || [];
        list.push(row);
        asinToRows.set(asin!, list);
      }

      const asins = [...asinToRows.keys()];
      if (!asins.length) continue;

      let stockMap;
      try {
        stockMap = await creatorsGetItemsStock(asins, marketplace, tag);
      } catch (e) {
        summary.errors.push(`${code}: stock fetch ${e instanceof Error ? e.message : e}`);
        continue;
      }

      for (const [asin, hit] of stockMap) {
        summary.checked += 1;
        if (hit.status === "in_stock") summary.inStock += 1;
        else if (hit.status === "not_found") summary.notFound += 1;
        else summary.outStock += 1;

        const touched = asinToRows.get(asin) || [];
        for (const row of touched) {
          const data = { ...(row.data as Record<string, unknown>) };
          const status: StockStatus =
            hit.status === "in_stock" ? "in_stock" : "out_of_stock";
          const offers = applyAmazonOffer(data, {
            asin,
            status,
            price: hit.price,
            imageUrl: hit.imageUrl,
            countryCode: code === "eu" ? "de" : code,
            now,
            fallbackPrice: row.price as number | null,
          });

          const buyable = offers.some((o) => o.status === "in_stock");
          const rootStatus: StockStatus = buyable ? "in_stock" : "out_of_stock";
          const price =
            hit.price ??
            offers.find((o) => o.status === "in_stock")?.price ??
            row.price;

          const { error: upErr } = await sb.from("ctc_products").upsert({
            id: row.id,
            country_code: code,
            data,
            stock_status: rootStatus,
            price,
            image: (data.image as string) || row.image,
            last_checked: now,
          });
          if (upErr) summary.errors.push(`${row.id}: ${upErr.message}`);
        }
      }
    } else {
      // Non-UK: keep eBay offers; only validate Amazon PDPs so Buy never 404s.
      for (const row of rows) {
        const data = { ...(row.data as Record<string, unknown>) };
        const asin = data.amazon_asin as string | null;
        if (!looksLikeRealAsin(asin)) {
          // Strip Amazon offer if ASIN is fake — leave eBay.
          const offers = Array.isArray(data.offers)
            ? (data.offers as Offer[]).filter((o) => o.retailer.id !== "amazon")
            : [];
          data.offers = offers;
          data.amazon_asin = null;
          const buyable = offers.some((o) => o.status === "in_stock");
          await sb.from("ctc_products").upsert({
            id: row.id,
            country_code: code,
            data,
            stock_status: buyable ? "in_stock" : "out_of_stock",
            price: row.price,
            image: row.image,
            last_checked: now,
          });
          continue;
        }

        const probe = await probeAmazonPdp(marketplace, asin!);
        await sleep(200);
        summary.checked += 1;

        let status: StockStatus = "in_stock";
        if (probe === "missing") {
          status = "out_of_stock";
          summary.notFound += 1;
        } else {
          // ok OR unknown (bot/captcha) — keep Buy live; only hide on proven dead PDP.
          status = "in_stock";
          summary.inStock += 1;
        }

        const offers = applyAmazonOffer(data, {
          asin: asin!,
          status,
          price: null,
          imageUrl: null,
          countryCode: code === "eu" ? "de" : code,
          now,
          fallbackPrice: row.price as number | null,
        });
        const buyable = offers.some((o) => o.status === "in_stock");
        const { error: upErr } = await sb.from("ctc_products").upsert({
          id: row.id,
          country_code: code,
          data,
          stock_status: buyable ? "in_stock" : "out_of_stock",
          price: row.price,
          image: (data.image as string) || row.image,
          last_checked: now,
        });
        if (upErr) summary.errors.push(`${row.id}: ${upErr.message}`);
      }
    }

    await sleep(400);
  }

  return summary;
}
