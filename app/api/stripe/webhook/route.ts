// POST /api/stripe/webhook — handle Stripe events (credit purchases)
// Every event is logged to webhook_logs for debugging
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { getPackById } from "@/lib/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_MGK_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!;

async function logWebhook(data: {
  event_id?: string;
  event_type: string;
  status: string;
  installer_id?: string;
  credits_added?: number;
  new_balance?: number;
  raw_body?: string;
  error_message?: string;
}) {
  try {
    const supabase = supabaseAdmin();
    await supabase.from("webhook_logs").insert(data);
  } catch (err) {
    console.error("Failed to write webhook log:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  // Log raw receipt immediately — before any processing
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    await logWebhook({
      event_id: event.id,
      event_type: event.type,
      status: "received",
      raw_body: body.substring(0, 800),
    });
  } catch (err: any) {
    await logWebhook({
      event_type: "unknown",
      status: "failed",
      error_message: `Signature verification failed: ${err.message}`,
      raw_body: body.substring(0, 800),
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed — credit purchase completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { installer_id, pack_id, credits } = session.metadata || {};

    if (!installer_id || !credits) {
      await logWebhook({
        event_id: event.id,
        event_type: event.type,
        status: "failed",
        error_message: `Missing metadata: installer_id=${installer_id}, credits=${credits}, session=${session.id}`,
      });
      return NextResponse.json({ error: "Missing metadata in checkout session" }, { status: 400 });
    }

    const creditAmount = parseInt(credits, 10);
    if (isNaN(creditAmount)) {
      await logWebhook({
        event_id: event.id,
        event_type: event.type,
        status: "failed",
        installer_id,
        error_message: `Invalid credit amount: ${credits}`,
      });
      return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 });
    }

    const pack = pack_id ? getPackById(pack_id) : null;
    const supabase = supabaseAdmin();

    // Get current installer credits
    const { data: installer, error: fetchError } = await supabase
      .from("installers")
      .select("id, credits, trial_used")
      .eq("id", installer_id)
      .single();

    if (fetchError || !installer) {
      await logWebhook({
        event_id: event.id,
        event_type: event.type,
        status: "failed",
        installer_id,
        error_message: `Installer not found: ${fetchError?.message || "no match"}`,
      });
      return NextResponse.json({ error: "Installer not found" }, { status: 404 });
    }

    // Add credits
    const newBalance = installer.credits + creditAmount;
    const { error: updateError } = await supabase
      .from("installers")
      .update({
        credits: newBalance,
        trial_used: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", installer_id);

    if (updateError) {
      await logWebhook({
        event_id: event.id,
        event_type: event.type,
        status: "failed",
        installer_id,
        credits_added: creditAmount,
        error_message: `Update failed: ${updateError.message}`,
      });
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
    }

    // Success — log it
    await logWebhook({
      event_id: event.id,
      event_type: event.type,
      status: "processed",
      installer_id,
      credits_added: creditAmount,
      new_balance: newBalance,
    });

    console.log(
      `✅ Credit purchase: ${installer_id} +${creditAmount} credits (${pack?.name || "custom"}) → balance: ${newBalance}`
    );

    return NextResponse.json({
      success: true,
      credits_added: creditAmount,
      new_balance: newBalance,
    });
  }

  // Log other event types we receive but don't process
  await logWebhook({
    event_id: event.id,
    event_type: event.type,
    status: "received",
  });

  return NextResponse.json({ received: true });
}
