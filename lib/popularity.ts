// Auto-update product popularity based on real click data + search demand signals.
// This runs as a step in the 2h stock cron so the ranking engine always has
// fresh demand signals without a manual rebuild.

import { getAcBoost } from "./heatwave";
import { fetchGscDemand } from "./gsc";

type SupabaseClient = any;

/**
 * Aggregate clicks per product over a rolling window and update the `popularity`
 * field in each product's JSON. Popularity = recent clicks + a baseline so
 * unchecked products don't sort to zero.
 *
 * Window: last 30 days for long-tail demand (seasonal patterns), with a 3x boost
 * for clicks in the last 7 days (what's hot THIS WEEK).
 */
export async function updatePopularity(supabase: SupabaseClient): Promise<{
  updated: number;
  error?: string;
}> {
  try {
    const now = new Date();
    const week7d = new Date(now.getTime() - 7 * 24 * 3600_000);
    const month30d = new Date(now.getTime() - 30 * 24 * 3600_000);

    // Aggregate clicks per product, with a 3x boost for recent (< 7 days)
    const { data: clicks, error: clickErr } = await supabase
      .from("aircon_clicks")
      .select("product_slug, at")
      .gte("at", month30d.toISOString());

    if (clickErr) {
      return { updated: 0, error: `clicks read failed: ${clickErr.message}` };
    }

    const clicksPerProduct = new Map<string, number>();
    for (const row of clicks ?? []) {
      if (!row.product_slug) continue;
      const recentBoost = row.at && new Date(row.at).getTime() > week7d.getTime() ? 3 : 1;
      clicksPerProduct.set(
        row.product_slug,
        (clicksPerProduct.get(row.product_slug) ?? 0) + recentBoost,
      );
    }

    // Read all products, update popularity in the JSON
    const { data: products, error: readErr } = await supabase
      .from("uatk_products")
      .select("id, data");

    if (readErr) {
      return { updated: 0, error: `products read failed: ${readErr.message}` };
    }

    // Fetch heatwave boost once per run (feature flag: ENABLE_HEATWAVE_BOOST=true by default)
    const heatwaveEnabled = process.env.ENABLE_HEATWAVE_BOOST !== "false";
    const heatwaveBoost = heatwaveEnabled ? await getAcBoost() : 1.0;

    // Fetch GSC demand signal (feature flag: ENABLE_GSC_DEMAND=true by default)
    const gscEnabled = process.env.ENABLE_GSC_DEMAND !== "false";
    const gscDemandMap = gscEnabled
      ? await fetchGscDemand(
          (products ?? []).map((row: any) => ({
            id: row.id,
            name: row.data?.name || "",
            brand: row.data?.brand || "",
            highlights: row.data?.highlights || [],
          }))
        )
      : new Map();

    const upserts: any[] = [];
    for (const row of products ?? []) {
      const clicks = clicksPerProduct.get(row.id) ?? 0;
      const gscDemand = gscDemandMap.get(row.id) ?? 0;

      // Baseline keeps a never-clicked curated hero visible. It is a FLOOR the
      // demand signal adds to, NOT an alternative value. It used to be the third
      // arm of `clicks || gscDemand || 30`, which inverted the signal it exists
      // to carry: a product clicked twice scored 2, one nobody had ever touched
      // scored 30 — so every product with proven interest ranked BELOW every
      // product with none until it passed 30 clicks, and at ~91 outbound clicks
      // across 139 products nothing ever did. demand is weighted 1.0 in
      // ranking.ts, so that gap outweighed brand (20) and rivalled hero (40):
      // it demoted the best sellers on the default sort sitewide.
      const BASELINE = 30;

      // Blend unchanged from the original intent: clicks are proven, GSC is
      // anticipated (searches spike before clicks), so GSC is discounted.
      const signal =
        clicks > 0 && gscDemand > 0
          ? (clicks + gscDemand * 0.5) / 1.5 // both signals: average them
          : Math.max(clicks, gscDemand * 0.8); // one signal: use it, GSC discounted

      let popularity = BASELINE + Math.round(signal);

      // Apply heatwave boost to AC products only
      if (row.data?.category === "portable-air-conditioners" && heatwaveBoost > 1.0) {
        popularity = Math.round(popularity * heatwaveBoost);
      }

      // Update the data JSON in place
      const updated = { ...row.data, popularity };
      upserts.push({ id: row.id, data: updated });
    }

    // Batch upsert
    if (upserts.length > 0) {
      const { error: upsertErr } = await supabase.from("uatk_products").upsert(upserts);
      if (upsertErr) {
        return { updated: 0, error: `upsert failed: ${upsertErr.message}` };
      }
    }

    return { updated: upserts.length };
  } catch (e: any) {
    return { updated: 0, error: e.message };
  }
}
