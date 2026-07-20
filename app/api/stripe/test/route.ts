// GET /api/stripe/test — simulate a Stripe webhook for testing
// Hit this to verify the credit-adding pipeline works end-to-end
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== "ukact-setup-2026") {
    return NextResponse.json({ error: "Invalid key" }, { status: 403 });
  }

  // Pick the first installer to test with
  const supabase = supabaseAdmin();
  const { data: installers, error: fetchError } = await supabase
    .from("installers")
    .select("*")
    .eq("active", true)
    .limit(1);

  if (fetchError || !installers?.length) {
    return NextResponse.json({ error: "No installers found. Register one first at /installers" }, { status: 400 });
  }

  const installer = installers[0];
  const creditsToAdd = 5;
  const newBalance = installer.credits + creditsToAdd;

  // Simulate what the webhook does
  const { error: updateError } = await supabase
    .from("installers")
    .update({
      credits: newBalance,
      trial_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", installer.id);

  if (updateError) {
    return NextResponse.json({ error: "Update failed: " + updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    test: true,
    installer: installer.company,
    email: installer.email,
    credits_before: installer.credits,
    credits_added: creditsToAdd,
    credits_after: newBalance,
  });
}
