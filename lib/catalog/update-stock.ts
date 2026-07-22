/**
 * Multi-region stock update for ctc_products.
 * Amazon Creators API per marketplace — marks OOS / not_found and refreshes price.
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

  if (!amazonCreatorsConfigured()) {
    summary.errors.push("Amazon Creators API credentials missing");
    return summary;
  }

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

  for (const code of markets) {
    summary.countries += 1;
    const cc = getCountry(code === "eu" ? "de" : code);
    const tag = activeAmazonTag(getCountry(code));
    const marketplace = cc.amazonMarketplace;

    const { data: rows, error } = await sb
      .from("ctc_products")
      .select("id,country_code,data,stock_status,price,image,last_checked")
      .eq("country_code", code);

    if (error) {
      summary.errors.push(`${code}: ${error.message}`);
      continue;
    }
    if (!rows?.length) continue;

    if (opts?.resolveMissingAsins !== false) {
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
        const offers = Array.isArray(data.offers) ? [...(data.offers as Offer[])] : [];
        const status: StockStatus =
          hit.status === "in_stock" ? "in_stock" : "out_of_stock";

        let amazonOffer = offers.find((o) => o.retailer.id === "amazon");
        const amazonUrl = amazonProductUrl(cc.code, asin);
        if (amazonUrl) {
          if (amazonOffer) {
            amazonOffer = {
              ...amazonOffer,
              status,
              price: hit.price ?? amazonOffer.price,
              url: amazonUrl,
              lastChecked: now,
            };
            const idx = offers.findIndex((o) => o.retailer.id === "amazon");
            offers[idx] = amazonOffer;
          } else {
            offers.unshift({
              retailer: { id: "amazon", name: "Amazon" },
              price: hit.price ?? (row.price as number) ?? 0,
              url: amazonUrl,
              status,
              lastChecked: now,
            });
          }
        }

        data.offers = offers;
        data.amazon_asin = asin;
        if (hit.imageUrl) data.image = hit.imageUrl;

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

    await sleep(400);
  }

  return summary;
}
