import Link from "next/link";
import type { CrossSellTarget } from "@/lib/best-of-data";

/**
 * CrossSellWidget — placed on high-traffic pages to route visitors
 * to Dale-owned products. Non-intrusive, contextual, one-line pitch.
 *
 * Usage:
 *   <CrossSellWidget target={page.crossSellSlot} />
 *
 * The component handles its own visibility — if no target or the URL
 * is the current page, it renders nothing.
 */
export function CrossSellWidget({ target }: { target?: CrossSellTarget }) {
  if (!target) return null;

  return (
    <aside className="border-t border-line bg-surface-cool">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {/* Product icon placeholder */}
            <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-brand/30 bg-brand/5 text-sm font-bold text-brand">
              {target.siteName.slice(0, 2)}
            </div>
            <div>
              <div className="eyebrow text-foreground/50">While you&rsquo;re here</div>
              <p className="text-sm font-medium text-foreground">
                <strong>{target.productName}</strong> — {target.why}
              </p>
              <p className="mt-0.5 text-xs text-foreground/45">
                {target.siteName} · from {target.price} · Dale-owned, not an affiliate link
              </p>
            </div>
          </div>
          <a
            href={target.url}
            target="_blank"
            rel="noopener"
            className="self-start border border-brand bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:border-brand-deep hover:bg-brand-deep sm:self-center"
          >
            Check it out →
          </a>
        </div>
      </div>
    </aside>
  );
}

/**
 * CrossSellStrip — a slim banner for product pages.
 * Lower-friction than the full widget; fits between the hero and the table.
 */
export function CrossSellStrip({ target }: { target?: CrossSellTarget }) {
  if (!target) return null;

  return (
    <div className="border-b border-line bg-brand/5">
      <div className="mx-auto max-w-6xl px-5 py-3">
        <p className="text-center text-xs text-foreground/60">
          <span className="font-semibold text-foreground/80">Also from us:</span>{" "}
          <a
            href={target.url}
            target="_blank"
            rel="noopener"
            className="font-medium text-brand hover:underline"
          >
            {target.productName}
          </a>
          {" "}— {target.why} · from {target.price}
        </p>
      </div>
    </div>
  );
}
