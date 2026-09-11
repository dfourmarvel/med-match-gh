import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client bound to the request's auth cookies. Like the browser
 * client, this exists to read the SESSION, not to read tables — data access
 * stays on the service-role client in lib/supabase.ts.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // middleware refreshes the session, so ignoring this is safe.
        }
      }
    }
  });
}

/**
 * The signed-in user, or null. Uses getUser() rather than getSession() because
 * getUser() revalidates the token against Supabase — a session read straight
 * from the cookie is attacker-supplied data and must not be trusted for an
 * authorization decision.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ?? null;
}
