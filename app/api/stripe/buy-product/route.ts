// POST /api/stripe/buy-product — create checkout session for digital products
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRODUCTS: Record<string, {
  name: string;
  price: number; // in pence
  description: string;
  pdfPath: string;
}> = {
  "cooling-handbook": {
    name: "UK Home Cooling Handbook",
    price: 499,
    description: "28-page PDF guide — choose, install & save on home air conditioning",
    pdfPath: "/pdfs/home-cooling-handbook.html",
  },
  "heatwave-checklist": {
    name: "Heatwave Emergency Checklist",
    price: 299,
    description: "One-page PDF checklist — survive when every AC is sold out",
    pdfPath: "/pdfs/heatwave-emergency-checklist.html",
  },
  "energy-guide": {
    name: "Energy Bill Crash Course",
    price: 499,
    description: "8-page PDF guide — run your AC without doubling your energy bills",
    pdfPath: "/pdfs/energy-bill-guide.html",
  },
  "maintenance-logbook": {
    name: "Home Maintenance Logbook",
    price: 799,
    description: "Editable spreadsheet + printable PDF — track every appliance and service",
    pdfPath: "/pdfs/home-maintenance-logbook.html",
  },
  "welcome-book": {
    name: "Holiday Let Welcome Book Template",
    price: 1499,
    description: "12-page editable PDF template — professional welcome book for holiday lets",
    pdfPath: "/pdfs/holiday-let-welcome-book.html",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${productId}` }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukaircontracker.co.uk";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_id: productId,
        product_name: product.name,
      },
      success_url: `${siteUrl}${product.pdfPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/products/${productId}?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe buy-product error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
