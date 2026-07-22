import type { Config, Context } from "@netlify/edge-functions";

/**
 * Geo-route `/` → `/{market}` using Cloudflare CF-IPCountry (preferred)
 * or Netlify edge geo. Honours ctc_market cookie if the shopper already
 * picked a country. Uses 302 so search engines keep the hub flexible.
 */

const COOKIE = "ctc_market";

const ISO_TO_MARKET: Record<string, string> = {
  GB: "uk",
  IE: "uk",
  DE: "de",
  AT: "de",
  CH: "de",
  LU: "de",
  FR: "fr",
  IT: "it",
  ES: "es",
  NL: "nl",
  BE: "nl",
  US: "us",
  CA: "us",
  AU: "au",
  NZ: "au",
  PL: "eu",
  SE: "eu",
  DK: "eu",
  NO: "eu",
  FI: "eu",
  PT: "eu",
  GR: "eu",
  CZ: "eu",
};

const MARKETS = new Set(["uk", "de", "fr", "it", "es", "nl", "us", "au", "eu"]);

function marketFromIso(code: string | null | undefined): string {
  if (!code) return "uk";
  return ISO_TO_MARKET[code.toUpperCase()] || "uk";
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|linkedinbot|pinterest|redditbot|applebot|semrush|ahrefs|dotbot/i.test(
    ua,
  );
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  if (url.pathname !== "/") return;

  // Let crawlers see the hub page
  if (isBot(req.headers.get("user-agent") || "")) return;

  const cookieMarket = readCookie(req.headers.get("cookie"), COOKIE);
  if (cookieMarket && MARKETS.has(cookieMarket)) {
    return Response.redirect(new URL(`/${cookieMarket}`, url.origin), 302);
  }

  const iso =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country") ||
    context.geo?.country?.code ||
    null;

  // Cloudflare uses XX for unknown
  const market = iso && iso !== "XX" ? marketFromIso(iso) : "uk";
  return Response.redirect(new URL(`/${market}`, url.origin), 302);
};

export const config: Config = {
  path: "/",
};
