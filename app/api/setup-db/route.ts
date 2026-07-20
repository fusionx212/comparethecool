// GET /api/setup-db — one-time database migration runner
// Hit this ONCE after deploy to create the installation lead tables.
// Protected by a simple setup key.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SETUP_KEY = process.env.SETUP_KEY || "ukact-setup-2026";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== SETUP_KEY) {
    return NextResponse.json({ error: "Invalid setup key." }, { status: 403 });
  }

  const supabase = supabaseAdmin();
  const results: string[] = [];

  // Each statement runs individually via rpc or raw query
  const statements = [
    // installers table
    `CREATE TABLE IF NOT EXISTS installers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company TEXT NOT NULL,
      contact TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      website TEXT,
      fgas_reg TEXT,
      postcode_areas TEXT[] NOT NULL DEFAULT '{}',
      regions TEXT[] NOT NULL DEFAULT '{}',
      active BOOLEAN NOT NULL DEFAULT true,
      credits INTEGER NOT NULL DEFAULT 0,
      trial_used BOOLEAN NOT NULL DEFAULT false,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    // leads table
    `CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      postcode TEXT NOT NULL,
      postcode_area TEXT NOT NULL,
      property_type TEXT,
      rooms TEXT,
      budget_range TEXT,
      timeline TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      installer_id UUID REFERENCES installers(id),
      claimed_at TIMESTAMPTZ,
      won_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    // lead_events table
    `CREATE TABLE IF NOT EXISTS lead_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  ];

  for (const sql of statements) {
    try {
      // Use supabase's built-in raw SQL execution via rpc
      const { error } = await supabase.rpc("exec_sql", { query: sql }).maybeSingle();
      if (error) {
        // If exec_sql doesn't exist, try direct REST API
        results.push(`rpc failed for: ${sql.substring(0, 50)}... — ${error.message}`);
      } else {
        results.push(`✓ ${sql.substring(0, 40)}...`);
      }
    } catch (err: any) {
      results.push(`✗ ${sql.substring(0, 50)}... — ${err?.message || "unknown error"}`);
    }
  }

  // Try creating indexes separately
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`,
    `CREATE INDEX IF NOT EXISTS idx_leads_postcode_area ON leads(postcode_area)`,
    `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_leads_installer_id ON leads(installer_id)`,
    `CREATE INDEX IF NOT EXISTS idx_installers_active ON installers(active)`,
    `CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id)`,
  ];

  for (const idx of indexes) {
    try {
      const { error } = await supabase.rpc("exec_sql", { query: idx }).maybeSingle();
      if (error) {
        results.push(`idx failed: ${error.message}`);
      } else {
        results.push(`✓ Index: ${idx.substring(0, 50)}...`);
      }
    } catch (err: any) {
      results.push(`✗ Index failed: ${err?.message || "unknown"}`);
    }
  }

  return NextResponse.json({
    message: "Setup attempted. If exec_sql is not available, run the SQL manually in Supabase Dashboard.",
    results,
    manual_sql_file: "supabase/migrations/20260708_installation_leads.sql",
  });
}
