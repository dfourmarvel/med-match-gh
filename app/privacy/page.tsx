import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What MedMatch Ghana collects, why, who it is shared with, and how to have your data deleted.",
  alternates: { canonical: "/privacy" }
};

const CONTACT_EMAIL = "danieldeladzikunu@gmail.com";
const LAST_UPDATED = "17 September 2026";

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Who runs MedMatch Ghana",
    body: (
      <p>
        MedMatch Ghana is run by Daniel Dela Dzikunu (dfour). For any question about your data, or to ask for a copy
        of it or for it to be deleted, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    )
  },
  {
    heading: "What we collect",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Your assessment.</strong> Which group you chose (medical, dental or high school), your answer to
          each question, and the results: trait scores and matched specialties.
        </li>
        <li>
          <strong>Your account, if you sign in.</strong> Your email address and an account ID. If you use Google, we
          receive your email from Google. We never see your Google password.
        </li>
        <li>
          <strong>How you use the site.</strong> Pages visited, buttons clicked, how long each question takes, where
          people stop the assessment, your device and browser type, and your approximate country.
        </li>
        <li>
          <strong>Session recordings.</strong> Recordings of clicks, scrolling and page changes, used to find
          confusing parts of the site. Anything typed into a form (including your email and password) is hidden
          from the recording. Recordings may be reviewed by automated AI tools from our analytics provider to spot
          problems at scale.
        </li>
        <li>
          <strong>Technical data.</strong> Your IP address is used briefly to stop abuse (rate limiting) and by our
          hosting provider for security.
        </li>
      </ul>
    )
  },
  {
    heading: "Why we collect it",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To score your assessment and show, save and share your results.</li>
        <li>To let you sign in and see your report on another device.</li>
        <li>To understand which parts of MedMatch help people and which need improving.</li>
        <li>To keep the site secure and working.</li>
      </ul>
    )
  },
  {
    heading: "Who we share it with",
    body: (
      <>
        <p>We do not sell your data or use it for advertising. It is handled by these services on our behalf:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase</strong> stores accounts and saved results.
          </li>
          <li>
            <strong>PostHog</strong> (EU servers) records usage events and session recordings, linked to your
            account ID if you sign in. It never receives your email address from us.
          </li>
          <li>
            <strong>Vercel</strong> hosts the site and measures page speed and visits.
          </li>
          <li>
            <strong>OpenRouter</strong> generates the AI explanation from your trait scores and matches. It is not
            sent your name, email or account.
          </li>
          <li>
            <strong>Upstash</strong> handles rate limiting using your IP address.
          </li>
          <li>
            <strong>Google</strong>, only if you choose &quot;Continue with Google&quot;.
          </li>
        </ul>
        <p className="mt-3">
          A result is only visible to other people if you press Save and share its link. Anyone with that link can
          view that result.
        </p>
      </>
    )
  },
  {
    heading: "Cookies and local storage",
    body: (
      <p>
        We use cookies and your browser&apos;s storage to keep you signed in, save assessment progress, remember
        your theme, and give PostHog an anonymous ID so visits can be counted. None are used for advertising.
      </p>
    )
  },
  {
    heading: "How long we keep it",
    body: (
      <p>
        Saved results and accounts are kept until you ask us to delete them. Analytics events and session recordings
        are kept for the period set by our PostHog plan and are then deleted automatically.
      </p>
    )
  },
  {
    heading: "Your rights",
    body: (
      <p>
        You can ask to see the data we hold about you, correct it, or have it deleted, including your account,
        saved results and analytics history. Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>{" "}
        from the address you signed up with and we will respond within 30 days. You can also block analytics with
        a browser ad or tracker blocker. The assessment still works.
      </p>
    )
  },
  {
    heading: "Under 18?",
    body: (
      <p>
        MedMatch is open to secondary school students. If you are under 18, please use it with a parent or
        guardian&apos;s knowledge. A parent or guardian can ask us to delete a young person&apos;s data using the
        email above.
      </p>
    )
  },
  {
    heading: "Changes",
    body: <p>If this policy changes, the date below will change too.</p>
  }
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-secondary">Privacy</p>
        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-sm leading-7 text-foreground/65">
          The short version: we collect your assessment answers, results and how you use the site so MedMatch can
          work and improve. We don&apos;t sell it, and you can have it deleted at any time.
        </p>
      </div>

      <Card className="space-y-8">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={`privacy-${slug(section.heading)}`}>
            <h2 id={`privacy-${slug(section.heading)}`} className="font-display text-xl font-semibold">
              {section.heading}
            </h2>
            <div className="mt-3 text-sm leading-7 text-foreground/75">{section.body}</div>
          </section>
        ))}
      </Card>

      <p className="text-xs text-foreground/55">
        Last updated {LAST_UPDATED}. <Link href="/" className="underline underline-offset-4">Back to home</Link>
      </p>
    </div>
  );
}
