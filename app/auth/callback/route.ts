import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth and magic-link landing route. Google sends the browser to Supabase,
 * Supabase sends it here with a one-time code, and this exchanges that code for
 * a session cookie before handing the visitor back to wherever they started.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  // SEC: `next` is attacker-controllable via the callback URL. Only same-site
  // paths are honoured, so it cannot be turned into an open redirect.
  const requested = url.searchParams.get("next") ?? "/results";
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/results";

  if (error) {
    return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(error)}`, url.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/signin?error=Missing%20sign-in%20code", url.origin));
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/signin?error=Sign-in%20is%20not%20configured", url.origin));
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error("OAuth code exchange failed", { message: exchangeError.message });
    return NextResponse.redirect(
      new URL("/signin?error=Could%20not%20complete%20sign-in", url.origin)
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
