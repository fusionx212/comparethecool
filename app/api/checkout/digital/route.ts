import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getDigitalProduct,
  stripePriceIdFor,
  type DigitalSkuId,
} from "@/lib/digital-products";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { hashToken, newCapabilityToken } from "@/lib/digital/pdf";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Payments not configured yet — set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  let body: {
    sku?: string;
    country?: string;
    productSlug?: string;
    category?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const product = getDigitalProduct(body.sku || "");
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  const country = (body.country || "uk").toLowerCase();
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://comparethecool.com";

  const stripe = new Stripe(secret);
  const priceId = stripePriceIdFor(product.id as DigitalSkuId);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: product.unitAmount,
            product_data: {
              name: product.name,
              description: product.tagline,
            },
          },
        },
      ];

  const token = newCapabilityToken();
  const tokenHash = hashToken(token);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${site}/${country}/tools/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/${country}?digital=cancelled`,
    metadata: {
      sku: product.id,
      country,
      product_slug: body.productSlug || "",
      category: body.category || "",
      capability_token_hash: tokenHash,
    },
  });

  const sb = getServiceSupabase();
  if (sb && session.id) {
    const { error } = await sb.from("ctc_digital_orders").upsert(
      {
        session_id: session.id,
        sku: product.id,
        country_code: country,
        product_slug: body.productSlug || null,
        category: body.category || null,
        status: "pending",
        capability_token_hash: tokenHash,
        capability_token: token,
        amount_pence: product.unitAmount,
        currency: "gbp",
        event_ids: [],
      },
      { onConflict: "session_id" },
    );
    if (error) {
      console.error("ctc_digital_orders upsert", error.message);
    }
  }

  return NextResponse.json({ url: session.url });
}
