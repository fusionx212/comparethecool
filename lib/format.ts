import type { StockStatus } from "./types";

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

export const STATUS_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Sold out",
  preorder: "Pre-order",
};

// Maps status -> the meaning-bearing colour token (see globals.css).
export const STATUS_TOKEN: Record<StockStatus, string> = {
  in_stock: "instock",
  low_stock: "low",
  out_of_stock: "sold",
  preorder: "drop",
};

// Guards against a fabricated/zero stat leaking through as if it were real
// data — root cause was app/api/ebay/search/route.ts unconditionally
// appending "0 sold" (a field the eBay endpoint never actually returns), but
// deliveryNote is written freely by several ingestion paths (Hughes, Amazon
// update, hand-authored sample data) and rendered generically in 4+ places,
// so a render-site guard is the only choke point that covers all of them —
// including future writers this file doesn't know about.
const ZERO_STAT_PATTERN = /\b0\s+(sold|left|in stock|remaining|available)\b/i;

export function safeDeliveryNote(note?: string | null): string | undefined {
  if (!note) return undefined;
  const trimmed = note.trim();
  if (!trimmed || ZERO_STAT_PATTERN.test(trimmed)) return undefined;
  return trimmed;
}

// Deterministic "x ago" — no Date.now() in render paths that SSR.
// Never drops into a "Xd ago" style counter — once it's been over a day,
// show the actual checked date/time instead of a stale-looking day count.
export function timeAgo(iso: string | null | undefined, now: Date): string {
  // `new Date(null)` is epoch zero, not Invalid Date — a null/missing
  // lastChecked (offers seeded but never yet cron-checked) was silently
  // formatting as "1 Jan, 01:00", which reads as a real recent-ish check
  // rather than "never verified".
  const parsed = iso ? new Date(iso).getTime() : NaN;
  if (Number.isNaN(parsed)) return "not yet checked";
  const diff = Math.max(0, now.getTime() - parsed);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(parsed));
}
