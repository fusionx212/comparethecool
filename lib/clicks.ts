"use client";

import { supabase } from "@/lib/supabase";

/** Fire-and-forget click log to ctc_clicks (anon insert if RLS allows; else no-op). */
export async function logAffiliateClick(opts: {
  country_code: string;
  product_slug: string;
  retailer_id: string;
}): Promise<void> {
  try {
    await supabase.from("ctc_clicks").insert({
      country_code: opts.country_code,
      product_slug: opts.product_slug,
      retailer_id: opts.retailer_id,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  } catch {
    /* ignore — never block navigation */
  }
}
