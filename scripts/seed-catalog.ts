/**
 * Upsert offline seed catalog into ctc_products.
 *   npx tsx --env-file=.env scripts/seed-catalog.ts
 * Never logs secret values.
 */

import { createClient } from "@supabase/supabase-js";
import { SEED_CATALOG } from "../lib/catalog/seed-data";

async function main() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const sb = createClient(url, key);
  const rows = SEED_CATALOG.map((r) => ({
    id: r.id,
    country_code: r.country_code,
    data: r.data,
    stock_status: r.stock_status,
    price: r.price,
    image: r.image,
    last_checked: r.last_checked,
  }));

  console.log(`Upserting ${rows.length} catalog rows…`);
  const chunk = 50;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await sb.from("ctc_products").upsert(slice, { onConflict: "id" });
    if (error) {
      console.error("Upsert error:", error.message);
      process.exit(1);
    }
    console.log(`  ${Math.min(i + chunk, rows.length)}/${rows.length}`);
  }
  console.log("Done.");
}

main();
