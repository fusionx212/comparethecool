// Best-effort outbound-click logging. Never throws into the redirect path —
// owning this click data is the asset that matters as AI search trims clicks.
export async function logClick(productSlug: string, retailerId: string, ref?: string) {
  const hasSupabase =
    Boolean(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabase) return;
  try {
    const { supabaseAdmin } = await import("./supabase");
    await supabaseAdmin()
      .from("aircon_clicks")
      .insert({ product_slug: productSlug, retailer_id: retailerId, referrer: ref ?? null });
  } catch {
    // swallow — a redirect must never fail because logging did
  }
}
