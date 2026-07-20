"use client";

import { useEffect, useState } from "react";
import type { Offer } from "@/lib/types";
import { gbp, safeDeliveryNote } from "@/lib/format";

/**
 * EbayCategoryStrip — fetches top eBay Buy It Now deals for a category
 * and shows them as a strip of product cards. Loads client-side.
 */
export function EbayCategoryStrip({ categoryName }: { categoryName: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = encodeURIComponent(categoryName);
    fetch(`/api/ebay/search?q=${query}&limit=6`)
      .then((r) => r.json())
      .then((data) => {
        setOffers((data.offers || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName]);

  if (loading) return null;
  if (offers.length === 0) return null;

  return (
    <section className="border-t rule-strong bg-amber-50/30">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-amber-600">🛒</span> Also on eBay — Buy It Now
          <span className="text-xs font-normal text-foreground/40 ml-2">EPN tracked</span>
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {offers.map((offer, i) => (
            <a
              key={i}
              href={offer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="group flex flex-col border rule-strong bg-surface hover:border-amber-500 transition-colors"
            >
              <div className="p-3 flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">eBay</span>
                <span className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-amber-700 mt-1">
                  {offer.url.split("/itm/")[1]?.split("?")[0]?.slice(0, 50) || "View deal"}
                </span>
                <div className="mt-auto pt-2 flex items-baseline gap-1.5">
                  <span className="tnum text-sm font-bold text-foreground">{gbp(offer.price)}</span>
                  {safeDeliveryNote(offer.deliveryNote) && (
                    <span className="text-[10px] text-foreground/40">{safeDeliveryNote(offer.deliveryNote)}</span>
                  )}
                </div>
                <span className="mt-1.5 border border-amber-500 bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white text-center group-hover:bg-amber-600">
                  View on eBay
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
