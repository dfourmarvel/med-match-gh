import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const browserSupabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabase = browserSupabase;
export const hasSupabaseServiceRole = Boolean(supabaseServiceRoleKey);

// SEC-1: the server client uses the service-role key ONLY. We deliberately do
// not fall back to the anon key — doing so would silently run privileged server
// routes without the service role, so RLS-dependent behavior would misbehave in
// an invisible way. When the service-role key is absent, serverSupabase is null
// and routes degrade gracefully (guest / local-storage mode).
if (supabaseUrl && !supabaseServiceRoleKey) {
  console.warn(
    "[supabase] SUPABASE_SERVICE_ROLE_KEY is not set; the server Supabase client is " +
      "disabled. Server routes will run in degraded (no-persistence) mode."
  );
}

export const serverSupabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false }
      })
    : null;
