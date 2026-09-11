"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Mode = "signin" | "signup";

function GoogleMark() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18Z"
      />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.92a9 9 0 0 0 0 8.1l3.05-2.33Z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .92 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const next = nextParam?.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/results";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(searchParams.get("error") ?? "");
  const [isError, setIsError] = useState(Boolean(searchParams.get("error")));

  const fail = (text: string) => {
    setIsError(true);
    setMessage(text);
  };

  const withGoogle = async () => {
    setPending(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` }
      });
      if (error) {
        fail(error.message);
        setPending(false);
      }
      // On success the browser navigates to Google, so nothing else runs here.
    } catch {
      fail("Sign-in is not configured yet. Check back shortly.");
      setPending(false);
    }
  };

  const withPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setIsError(false);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` }
        });
        if (error) {
          fail(error.message);
          return;
        }
        // With email confirmation on, Supabase returns a user with no session.
        if (!data.session) {
          setIsError(false);
          setMessage(`Check ${email} for a confirmation link, then come back and sign in.`);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          fail(error.message);
          return;
        }
      }

      router.push(next as Route);
      router.refresh();
    } catch {
      fail("Sign-in is not configured yet. Check back shortly.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <h2 className="font-display text-2xl font-semibold">
        {mode === "signin" ? "Sign in to MedMatch" : "Create your MedMatch account"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-foreground/65">
        Your full report — all five matches, both charts and the PDF — unlocks once you have an account.
        It also means your results are still here on your next device.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 w-full justify-center"
        onClick={withGoogle}
        disabled={pending}
      >
        <GoogleMark />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-[0.18em] text-foreground/45">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={withPassword} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          {mode === "signup" ? (
            <p className="mt-2 text-xs text-foreground/55">At least 8 characters.</p>
          ) : null}
        </div>

        <Button type="submit" variant="gold" className="w-full justify-center" disabled={pending}>
          {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-xl p-3 text-sm ${
            isError
              ? "bg-clay/10 text-clay dark:text-clay/90"
              : "bg-primary/10 text-foreground/80"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="button"
        className="mt-6 text-sm text-accent underline underline-offset-4"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage("");
          setIsError(false);
        }}
      >
        {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </Card>
  );
}
