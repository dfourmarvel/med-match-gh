"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client, used for AUTHENTICATION ONLY.
 *
 * lib/supabase.ts deliberately exposes no browser client because every read and
 * write goes through a server route on the service role, and that stays true:
 * this client signs people in and out and nothing else. It never queries a
 * table, so the browser still has no direct database access.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set for sign-in to work."
    );
  }

  return createBrowserClient(url, key);
}
