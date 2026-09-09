import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// There is no browser Supabase client, deliberately. Every database read and
// write goes through a server route, so the anon key is never needed in the
// bundle and the browser has no direct table access at all. A browserSupabase
// export used to live here and was imported by nothing.

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
