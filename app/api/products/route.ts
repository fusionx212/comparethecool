// GET /api/products — Runtime product data from Supabase.
// Returns Product[] with live stock/prices updated every 2h by cron.
// Falls back to SAMPLE_PRODUCTS if Supabase is unreachable.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { stripNonEarningRetailers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(stripNonEarningRetailers(SAMPLE_PRODUCTS), {
      headers: {
        "x-data-source": "static-no-env",
        "Cache-Control": "public, s-maxage=600",
      },
    });
  }

  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await sb.from("uatk_products").select("data");

    if (error || !data?.length) {
      return NextResponse.json(stripNonEarningRetailers(SAMPLE_PRODUCTS), {
        headers: {
          "x-data-source": `static-${error ? "db-error" : "empty"}`,
          "Cache-Control": "public, s-maxage=600",
        },
      });
    }

    // Same earning-retailer rule as the pages (lib/data.ts EARNING_RETAILERS)
    // — this feed is client-consumed (stock-selector) and must never surface
    // a non-earning retailer's offer.
    const products = stripNonEarningRetailers(data.map((row: any) => row.data));
    return NextResponse.json(products, {
      headers: {
        "x-data-source": "supabase",
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (e: any) {
    return NextResponse.json(stripNonEarningRetailers(SAMPLE_PRODUCTS), {
      headers: {
        "x-data-source": `static-catch-${(e?.message || "unknown").slice(0, 40)}`,
        "Cache-Control": "public, s-maxage=600",
      },
    });
  }
}
