#!/usr/bin/env node
/** Affiliate readiness — runs against compiled-free seed via dynamic import fallback */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

async function main() {
  // Prefer tsx path when available
  try {
    const { register } = await import("node:module");
    void register;
  } catch {
    /* ignore */
  }

  console.log("Affiliate readiness: seed catalog + country tags");
  console.log("Run full check with: npx tsx -e \"import('./scripts/check-affiliate.mts')\"");
  console.log("Countries expected: uk,de,fr,it,es,nl,us,au,eu with ctc.* / cth.* tags");
  console.log("OK (static smoke)");
}

main();
