/**
 * Upsert offline seed catalog into ctc_products.
 * Usage: node --env-file=.env scripts/seed-catalog.mjs
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (never commit secrets).
 */

import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";

// Seed is TypeScript — for Node we duplicate a minimal inline set OR use tsx.
// Prefer running via: npx tsx scripts/seed-catalog.ts
console.log(
  "Use: npx tsx scripts/seed-catalog.ts  (loads lib/catalog/seed-data.ts)",
);
console.log("Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.");

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const require = createRequire(import.meta.url);
// Dynamic path for compiled use — prefer seed-catalog.ts
void require;
void createClient;
