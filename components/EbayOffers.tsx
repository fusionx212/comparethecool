"use client";

import { useEffect, useState } from "react";
import type { Offer } from "@/lib/types";
import { gbp, timeAgo, safeDeliveryNote } from "@/lib/format";
import { StatusLed } from "@/components/StatusLed";

/**
 * EbayOffers — fetches eBay listings for a product and renders them
 * as additional retailer rows. Loads client-side so ISR still works.
 *
 * referencePrice filters out irrelevant listings: only shows results
 * within 30%–200% of the expected price to exclude fans/accessories
 * that share keywords with the target product.
 */
export function EbayOffers({
  productName,
  referencePrice,
}: {
  productName: string;
  referencePrice?: number;
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchQuery = encodeURIComponent(productName);
    fetch(`/api/ebay/search?q=${searchQuery}&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        let results: Offer[] = data.offers || [];
        // Filter by price relevance when we have a reference price.
        // Tight window: 0.5x–1.5x keeps scalpers and accessories out.
        if (referencePrice && results.length > 0) {
          const low = referencePrice * 0.5;
          const high = referencePrice * 1.5;
          results = results.filter(
            (o: Offer) => o.price >= low && o.price <= high
          );
        }
        setOffers(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productName, referencePrice]);

  if (loading) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-3 text-xs text-foreground/40">
          Searching eBay listings…
        </td>
      </tr>
    );
  }

  if (offers.length === 0) return null;

  return (
    <>
      {offers.map((offer, i) => (
        <tr
          key={`ebay-${i}`}
          className="border-b border-line last:border-b-0 bg-amber-50/30"
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <StatusLed status={offer.status} live={false} />
              <span className="eyebrow" style={{ color: "var(--instock)" }}>
                {offer.status === "in_stock"
                  ? "Buy It Now"
                  : offer.status === "low_stock"
                    ? "Low Stock"
                    : "Out of Stock"}
              </span>
            </div>
            <span className="mt-0.5 block text-[10px] text-foreground/40">
              eBay
            </span>
          </td>
          <td className="px-4 py-3 text-right tnum font-semibold">
            {gbp(offer.price)}
          </td>
          <td className="px-4 py-3 text-right tnum text-foreground/45 text-xs">
            {safeDeliveryNote(offer.deliveryNote) || timeAgo(offer.lastChecked, new Date())}
          </td>
          <td className="px-4 py-3 text-right">
            <a
              href={offer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-block border border-amber-600 bg-amber-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-amber-700 hover:bg-amber-700"
            >
              View on eBay
            </a>
          </td>
        </tr>
      ))}
    </>
  );
}
