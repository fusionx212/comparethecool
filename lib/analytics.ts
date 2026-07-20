// Shared analytics_events logger.
// Columns: site, event_type, occurred_at, utm_source, utm_medium, utm_campaign,
//          utm_term, utm_content, gclid, fbclid, referrer, landing_path, devide, email, meta
//
// Best-effort — never throws so it can't break the primary flow (signup / redirect).

import { randomUUID } from "node:crypto";

export type AttributionData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;       // HTTP Referer header (external referring site)
  landing_path?: string;   // Page path where the event happened
  email?: string;
  device?: string;
  meta?: Record<string, unknown>;
};

const SITE = "ukaircontracker.co.uk";

/**
 * Parse UTM and gclid/fbclid from a URLSearchParams or URL string.
 * Returns only the params that are present (never sets empty strings).
 */
export function parseAttributionFromUrl(url: string | URL): Partial<AttributionData> {
  const parsed = typeof url === "string" ? URL.canParse(url) ? new URL(url) : null : url;
  if (!parsed) return {};

  const out: Partial<AttributionData> = {};
  const p = parsed.searchParams;

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const) {
    const v = p.get(key);
    if (v) out[key] = v;
  }

  return out;
}

/**
 * Write an analytics_events row to Supabase.  Best-effort, never throws.
 */
export async function logAnalyticsEvent(eventType: string, attribution: AttributionData): Promise<void> {
  const hasSupabase =
    Boolean(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabase) return;

  try {
    const { supabaseAdmin } = await import("./supabase");
    const db = supabaseAdmin();

    const row: Record<string, unknown> = {
      id: randomUUID(),
      site: SITE,
      event_type: eventType,
      occurred_at: new Date().toISOString(),
    };

    // Only set fields that have a value — Supabase handles null by omitting it.
    for (const [k, v] of Object.entries(attribution)) {
      if (v !== undefined && v !== null && v !== "") {
        if (k === "meta" && typeof v === "object") {
          row.meta = v;
        } else {
          row[k] = v;
        }
      }
    }

    const { error } = await db.from("analytics_events").insert(row);
    if (error) {
      console.warn("[analytics] insert failed:", error.message);
    }
  } catch {
    // swallow — must never break the caller
  }
}

/**
 * Try to guess device type from User-Agent string.
 */
export function guessDevice(ua: string | null): string {
  if (!ua) return "unknown";
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}
