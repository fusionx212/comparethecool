"use client";

/**
 * StockSignalBadge — shows live urgency signals on product rows.
 * ASA-compliant: only displays verifiable data (click counts, alert counts).
 * No fake scarcity, no countdowns, no "only X left" fiction.
 */

interface Signal {
  clicksToday: number;
  alertCount: number;
  urgency: "none" | "low" | "medium" | "high";
  trending: boolean;
  manyWaiting: boolean;
}

const COLORS = {
  high: { bg: "rgba(233,69,96,0.12)", text: "#e94560", border: "rgba(233,69,96,0.3)", label: "🔥 Hot" },
  medium: { bg: "rgba(255,180,0,0.12)", text: "#ffb400", border: "rgba(255,180,0,0.3)", label: "📈 Active" },
  low: { bg: "transparent", text: "var(--foreground-muted, #888)", border: "transparent", label: "" },
  none: { bg: "transparent", text: "transparent", border: "transparent", label: "" },
};

export function StockSignalBadge({ signal }: { signal: Signal | null }) {
  if (!signal || signal.urgency === "none") return null;

  const c = COLORS[signal.urgency];
  const parts: string[] = [];

  if (signal.trending) {
    parts.push(`${signal.clicksToday} clicked today`);
  }
  if (signal.manyWaiting) {
    parts.push(`${signal.alertCount} waiting for restock`);
  }

  // If trending but below threshold for message, still show the urgency label
  if (!parts.length && signal.urgency !== "low") {
    parts.push(c.label);
  }
  if (!parts.length) return null;

  return (
    <span
      className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: c.bg,
        color: c.text,
        border: c.border ? `1px solid ${c.border}` : "none",
      }}
    >
      {parts.join(" · ")}
    </span>
  );
}
