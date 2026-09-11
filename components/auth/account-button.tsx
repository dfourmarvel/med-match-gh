"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

/**
 * Sign in / sign out control. Renders nothing until the session is known, so a
 * signed-in visitor never sees "Sign in" flash in the header on every load.
 */
export function AccountButton() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setReady(true);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  if (!email) {
    return (
      <Link href={{ pathname: "/signin" }}>
        <Button variant="ghost" className="h-auto px-3 py-2 sm:px-4 sm:py-3">
          Sign in
        </Button>
      </Link>
    );
  }

  const signOut = async () => {
    await createClient().auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <span
        className="hidden max-w-[12rem] truncate text-xs text-foreground/60 lg:inline"
        title={email}
      >
        <UserRound className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
        {email}
      </span>
      <Button
        variant="ghost"
        className="h-auto px-3 py-2 sm:px-4 sm:py-3"
        onClick={signOut}
        aria-label={`Sign out of ${email}`}
      >
        <LogOut className="h-4 w-4 sm:mr-2" aria-hidden="true" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}
