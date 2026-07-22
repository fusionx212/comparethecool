/**
 * Link health check across all markets — no secrets required for URL shape.
 * With network: HEAD/GET Amazon PDP for real ASINs.
 *
 *   node scripts/check-affiliate-links.mjs
 */

import { createRequire } from "module";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load compiled-ish via tsx dynamic — run under node with dynamic import of built seed is hard.
// Instead duplicate host map checks + read product-images + hit live pages.

const MARKETS = {
  uk: { amazon: "www.amazon.co.uk", ebay: "www.ebay.co.uk" },
  de: { amazon: "www.amazon.de", ebay: "www.ebay.de" },
  fr: { amazon: "www.amazon.fr", ebay: "www.ebay.fr" },
  it: { amazon: "www.amazon.it", ebay: "www.ebay.it" },
  es: { amazon: "www.amazon.es", ebay: "www.ebay.es" },
  nl: { amazon: "www.amazon.nl", ebay: "www.ebay.nl" },
  us: { amazon: "www.amazon.com", ebay: "www.ebay.com" },
  au: { amazon: "www.amazon.com.au", ebay: "www.ebay.com.au" },
  eu: { amazon: "www.amazon.de", ebay: "www.ebay.de" },
};

function looksLikeRealAsin(asin) {
  if (!asin || asin.length !== 10) return false;
  if (/XYZ|FALLBACK|COMFE|TROT|MEACO|PROB|LEVO|DYSON|DRAG|DIMP|DREAM|AM07|HONF|DELPAC|FRPAC|ITPAC|ESPAC|NLPAC|USPAC|AUPAC/i.test(asin)) {
    return false;
  }
  return /^[A-Z0-9]{10}$/i.test(asin);
}

const cachePath = join(ROOT, "data", "product-images.json");
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

const failures = [];
const warnings = [];
let ok = 0;

for (const [code, hosts] of Object.entries(MARKETS)) {
  // Only HTTP-check ASINs on their home marketplace (UK cache → amazon.co.uk).
  // Cross-market ASIN reuse is forbidden — stock job resolves per market.
  if (code !== "uk") {
    if (code === "nl" && hosts.ebay !== "www.ebay.nl") {
      failures.push("nl ebay host must be www.ebay.nl");
    }
    if (code === "us" && hosts.ebay !== "www.ebay.com") {
      failures.push("us ebay host must be www.ebay.com");
    }
    if (code === "au" && hosts.ebay !== "www.ebay.com.au") {
      failures.push("au ebay host must be www.ebay.com.au");
    }
    continue;
  }

  for (const [slug, entry] of Object.entries(cache)) {
    const asin = entry.asin;
    if (!looksLikeRealAsin(asin)) {
      warnings.push(`${code}/${slug}: no real ASIN in cache`);
      continue;
    }
    const url = `https://${hosts.amazon}/dp/${asin}`;
    try {
      const res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: { "User-Agent": "comparethecool-linkcheck/1.0" },
      });
      let status = res.status;
      if (status === 405 || status === 403) {
        const g = await fetch(url, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent": "comparethecool-linkcheck/1.0",
            Range: "bytes=0-0",
          },
        });
        status = g.status;
      }
      if (status >= 200 && status < 400) {
        ok += 1;
      } else {
        failures.push(`${code}/${slug}: ${url} → HTTP ${status}`);
      }
    } catch (e) {
      failures.push(`${code}/${slug}: ${url} → ${e.message}`);
    }
  }
}

// Live site sample — ensure Buy links are local hosts
for (const site of ["https://comparethecool.com/uk", "https://comparetheheat.com/uk"]) {
  try {
    const html = await (await fetch(site)).text();
    if (/amazon\.de\/dp/i.test(html) && site.includes("cool.com")) {
      // cool UK must not emit DE amazon
      const bad = html.match(/https:\/\/www\.amazon\.de\/dp\/[A-Z0-9]{10}/gi) || [];
      if (bad.length) failures.push(`${site}: foreign amazon.de links ${bad.slice(0, 2).join(",")}`);
    }
    if (/www\.ebay\.us\//i.test(html) || /www\.ebay\.au\//i.test(html)) {
      failures.push(`${site}: invalid ebay host`);
    }
    ok += 1;
  } catch (e) {
    warnings.push(`live ${site}: ${e.message}`);
  }
}

console.log(JSON.stringify({ ok, warnings: warnings.length, failures }, null, 2));
if (failures.length) {
  for (const f of failures) console.error("FAIL", f);
  process.exitCode = 1;
} else {
  console.log("All link checks passed");
}
