import { NextResponse } from "next/server";
import { getProductBySlug, EARNING_RETAILERS } from "@/lib/data";
import { buildAffiliateUrl } from "@/lib/affiliate";
import { logClick } from "@/lib/clicks";
import { logAnalyticsEvent, parseAttributionFromUrl, guessDevice } from "@/lib/analytics";

export const runtime = "nodejs";

// Branded outbound redirect — only earning retailers (Amazon + eBay) go
// through. Non-earning retailers (Currys, AO, Hughes etc — no Awin approvals
// yet) redirect to the product page so the visitor sees buyable options.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string; retailer: string }> },
) {
  const { slug, retailer } = await params;

  // Block non-earning retailers at the redirect level
  if (!EARNING_RETAILERS.has(retailer)) {
    return NextResponse.redirect(new URL(`/p/${slug}`, req.url), 302);
  }

  const product = await getProductBySlug(slug);
  const offer = product?.offers.find((o) => o.retailer.id === retailer);

  // No matching product → redirect to home rather than a dead end.
  if (!product) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }

  // No matching offer for this retailer → redirect to the product page
  if (!offer) {
    return NextResponse.redirect(new URL(`/p/${slug}`, req.url), 302);
  }

  const referrerUrl = req.headers.get("referer") ?? "";
  const landingPath = referrerUrl ? new URL(referrerUrl).pathname : `/${slug}`;
  const attributionFromReferrer = referrerUrl ? parseAttributionFromUrl(referrerUrl) : {};

  await logClick(slug, retailer, referrerUrl || undefined);
  await logAnalyticsEvent("click_outbound", {
    ...attributionFromReferrer,
    landing_path: landingPath,
    referrer: referrerUrl || undefined,
    device: guessDevice(req.headers.get("user-agent")),
    meta: { product_slug: slug, retailer, price: offer.price },
  });

  return NextResponse.redirect(buildAffiliateUrl(offer), 302);
}
