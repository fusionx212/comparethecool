/**
 * Multi-region stock refresh:
 *   npx tsx scripts/update-stock.ts
 *   npx tsx scripts/update-stock.ts --countries=uk,de,us
 */

import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { runStockUpdate } from "../lib/catalog/update-stock";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadRetailerCreds() {
  const allow =
    /^(AMAZON_CREATORS_API_|EBAY_CLIENT_|EBAY_APP_|EBAY_CERT_|SUPABASE_|NEXT_PUBLIC_SUPABASE_|CRON_SECRET)/;
  for (const p of [
    join(ROOT, ".env"),
    join(ROOT, ".env.local"),
    "C:/Users/dalec/projects/uatk-sales-loop/.env.local",
    "C:/Users/dalec/.secrets/master.env",
  ]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || !allow.test(m[1])) continue;
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (val && !process.env[m[1]]) process.env[m[1]] = val;
    }
  }
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

loadRetailerCreds();

async function main() {
  const countriesArg = process.argv.find((a) => a.startsWith("--countries="));
  const countries = countriesArg
    ? countriesArg
        .split("=")[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const summary = await runStockUpdate({ countries, resolveMissingAsins: true });
  console.log(JSON.stringify(summary, null, 2));
  if (summary.errors.length && summary.checked === 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
