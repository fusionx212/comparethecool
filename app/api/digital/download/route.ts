import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { getDigitalProduct } from "@/lib/digital-products";
import { buildDigitalPdf, hashToken } from "@/lib/digital/pdf";

export const dynamic = "force-dynamic";

/**
 * Server-gated PDF download. Requires session_id + capability token.
 * Never trusts client "paid" flags alone.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const token = req.nextUrl.searchParams.get("token");
  if (!sessionId || !token) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: order, error } = await sb
    .from("ctc_digital_orders")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const status = order.status as string;
  if (status !== "paid" && status !== "fulfilled") {
    return NextResponse.json(
      { error: "Payment not confirmed", sample: true },
      { status: 402 },
    );
  }

  const tokenHash = hashToken(token);
  if (
    order.capability_token !== token &&
    order.capability_token_hash !== tokenHash
  ) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const product = getDigitalProduct(order.sku);
  if (!product) {
    return NextResponse.json({ error: "Unknown SKU" }, { status: 500 });
  }

  const pdf = buildDigitalPdf({
    product,
    country: order.country_code || "uk",
    orderId: sessionId,
    email: order.email,
    category: order.category,
    productSlug: order.product_slug,
  });

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
