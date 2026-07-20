// GET /api/installers/lookup — find installer by email + their leads
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: installer, error } = await supabase
    .from("installers")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .single();

  if (error || !installer) {
    return NextResponse.json({ error: "Installer not found" }, { status: 404 });
  }

  // Get their recent leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("installer_id", installer.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ installer, leads: leads || [] });
}
