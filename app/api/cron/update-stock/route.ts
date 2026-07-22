import { NextRequest, NextResponse } from "next/server";
import { runStockUpdate } from "@/lib/catalog/update-stock";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Cron / Hermes entry — requires x-cron-secret === CRON_SECRET.
 * Optional body: { "countries": ["uk","de"] }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let countries: string[] | undefined;
  try {
    const body = (await req.json()) as { countries?: string[] };
    if (Array.isArray(body.countries)) countries = body.countries;
  } catch {
    /* empty body ok */
  }

  const summary = await runStockUpdate({ countries, resolveMissingAsins: true });
  return NextResponse.json(summary);
}
