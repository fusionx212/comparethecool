// POST /api/stripe/checkout — create a Stripe Checkout session for credit purchase
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackById } from "@/lib/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { packId, installerId, installerEmail } = await req.json();

    if (!packId || !installerId || !installerEmail) {
      return NextResponse.json({ error: "Missing packId, installerId, or installerEmail" }, { status: 400 });
    }

    const pack = getPackById(packId);
    if (!pack) {
      return NextResponse.json({ error: "Invalid credit pack" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukaircontracker.co.uk";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: installerEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${pack.name} — AC Installation Leads`,
              description: `${pack.credits} pre-qualified leads for ukaircontracker.co.uk. Pay only for leads you claim.`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        installer_id: installerId,
        pack_id: packId,
        credits: String(pack.credits),
      },
      success_url: `${siteUrl}/installers/account?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${siteUrl}/installers/buy-credits?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Failed to create checkout session" }, { status: 500 });
  }
}
