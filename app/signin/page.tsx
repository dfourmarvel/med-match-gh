import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to unlock your full MedMatch Ghana specialty report.",
  robots: { index: false, follow: false }
};

export default function SignInPage() {
  return (
    <div className="space-y-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary sm:text-sm">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl md:text-4xl">
          Unlock your full report
        </h1>
      </div>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
