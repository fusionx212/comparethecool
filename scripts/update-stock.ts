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

function loadEnvFile(path: string, allow: RegExp, overwrite = false) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m || !allow.test(m[1])) continue;
    const val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!val) continue;
    if (overwrite || !process.env[m[1]]) process.env[m[1]] = val;
  }
}

function loadRetailerCreds() {
  // Project Supabase keys only from this repo — never from UKAIR/master (wrong project).
  const project = /^(SUPABASE_|NEXT_PUBLIC_SUPABASE_)/;
  const retailers =
    /^(AMAZON_CREATORS_API_|EBAY_CLIENT_|EBAY_APP_|EBAY_CERT_|CRON_SECRET)/;

  // Overwrite so a stale shell/master key cannot win over .env
  loadEnvFile(join(ROOT, ".env"), project, true);
  loadEnvFile(join(ROOT, ".env.local"), project, true);
  loadEnvFile(join(ROOT, ".env"), retailers);
  loadEnvFile(join(ROOT, ".env.local"), retailers);
  loadEnvFile("C:/Users/dalec/projects/uatk-sales-loop/.env.local", retailers);
  loadEnvFile("C:/Users/dalec/.secrets/master.env", retailers);

  const siblingPaths = [
    "C:/Users/dalec/projects/uatk-sales-loop/app/api/update-stock/route.ts",
    "C:/Users/dalec/repos/ukaircontracker/app/api/update-stock/route.ts",
  ];
  for (const sibling of siblingPaths) {
    if (!existsSync(sibling)) continue;
    const src = readFileSync(sibling, "utf8");
    const id = src.match(/CRED_ID\s*=\s*"([^"]+)"/);
    const secret = src.match(/CRED_SECRET\s*=\s*"([^"]+)"/);
    // Prefer live route credentials — sibling .env.local can be stale (401).
    if (id) process.env.AMAZON_CREATORS_API_CLIENT_ID = id[1];
    if (secret) process.env.AMAZON_CREATORS_API_CLIENT_SECRET = secret[1];
    break;
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
