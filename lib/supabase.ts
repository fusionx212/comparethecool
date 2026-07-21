import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — avoids crashing at build time when env vars aren't set
// (server components that use supabase at module level during generateStaticParams).
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    _client = createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key",
    );
  }
  return _client;
}

// Export the same interface as createClient, but lazy
export const supabase = new Proxy<SupabaseClient>({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    // Wrap functions to preserve `this` binding
    if (typeof value === "function") {
      return (...args: unknown[]) => (value as (...a: unknown[]) => unknown).apply(client, args);
    }
    return value;
  },
});
