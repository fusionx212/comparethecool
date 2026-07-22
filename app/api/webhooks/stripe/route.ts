import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { getDigitalProduct } from "@/lib/digital-products";
import { buildDigitalPdf } from "@/lib/digital/pdf";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const sb = getServiceSupabase();
  if (!sb) {
    console.error("SUPABASE_SERVICE_ROLE_KEY missing — cannot fulfil");
    return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  }

  // Idempotency via session row event_ids
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const isLive = session.livemode !== false;

    const { data: existing } = await sb
      .from("ctc_digital_orders")
      .select("event_ids, status")
      .eq("session_id", session.id)
      .maybeSingle();
    const prior = Array.isArray(existing?.event_ids) ? existing.event_ids : [];
    if (prior.includes(event.id)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    try {
      await fulfilCheckout(sb, session, event.id, isLive);
    } catch (err) {
      console.error("fulfilment failed", session.id, err);
      await sb
        .from("ctc_digital_orders")
        .update({ status: "failed", last_error: String(err) })
        .eq("session_id", session.id);
      return NextResponse.json({ ok: false, fulfilled: false });
    }
  }

  return NextResponse.json({ ok: true });
}

async function fulfilCheckout(
  sb: NonNullable<ReturnType<typeof getServiceSupabase>>,
  session: Stripe.Checkout.Session,
  eventId: string,
  isLive: boolean,
) {
  const sku = session.metadata?.sku || "";
  const product = getDigitalProduct(sku);
  const email = session.customer_details?.email || session.customer_email || null;

  const { data: existing } = await sb
    .from("ctc_digital_orders")
    .select("*")
    .eq("session_id", session.id)
    .maybeSingle();

  const eventIds: string[] = Array.isArray(existing?.event_ids)
    ? [...existing.event_ids]
    : [];
  if (!eventIds.includes(eventId)) eventIds.push(eventId);

  if (existing?.status === "fulfilled" || existing?.status === "paid") {
    await sb
      .from("ctc_digital_orders")
      .update({ event_ids: eventIds, email })
      .eq("session_id", session.id);
    return;
  }

  const token = existing?.capability_token as string | undefined;
  const country = session.metadata?.country || existing?.country_code || "uk";
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://comparethecool.com";

  await sb.from("ctc_digital_orders").upsert(
    {
      session_id: session.id,
      sku,
      email,
      country_code: country,
      product_slug: session.metadata?.product_slug || null,
      category: session.metadata?.category || null,
      status: "paid",
      livemode: isLive,
      event_ids: eventIds,
      amount_pence: session.amount_total,
      currency: session.currency,
      capability_token: token || existing?.capability_token,
      capability_token_hash:
        session.metadata?.capability_token_hash || existing?.capability_token_hash,
    },
    { onConflict: "session_id" },
  );

  // Test-mode: mark paid but skip Resend spend (still allow download via token)
  if (!isLive) {
    await sb
      .from("ctc_digital_orders")
      .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
      .eq("session_id", session.id);
    return;
  }

  if (!product || !token) {
    throw new Error("Missing product or capability token for fulfilment");
  }

  const downloadUrl = `${site}/api/digital/download?session_id=${encodeURIComponent(session.id)}&token=${encodeURIComponent(token)}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && email) {
    const resend = new Resend(resendKey);
    const pdf = buildDigitalPdf({
      product,
      country,
      orderId: session.id,
      email,
      category: session.metadata?.category,
      productSlug: session.metadata?.product_slug,
    });
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "Compare the Cool <orders@comparethecool.com>",
      to: email,
      subject: `Your ${product.name} is ready`,
      html: `<p>Thanks for your purchase.</p><p><a href="${downloadUrl}">Download your ${product.name} PDF</a></p><p>Keep this email — the link is tied to your order.</p>`,
      attachments: [
        {
          filename: `${product.id}.pdf`,
          content: pdf,
        },
      ],
    });
    if (error) throw new Error(error.message);
  }

  await sb
    .from("ctc_digital_orders")
    .update({
      status: "fulfilled",
      fulfilled_at: new Date().toISOString(),
      download_url: downloadUrl,
    })
    .eq("session_id", session.id);
}
