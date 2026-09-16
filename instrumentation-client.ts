import posthog from "posthog-js";

// Next.js runs this file once in the browser before the app hydrates.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "us" ? "us" : "eu";

if (key) {
  posthog.init(key, {
    // Events go to our own domain and next.config.ts forwards them to PostHog,
    // so ad blockers don't drop them and the CSP needs no third-party host.
    api_host: "/ingest",
    ui_host: `https://${region}.posthog.com`,
    // Turns on automatic pageviews for client-side navigation, page-leave and
    // other current PostHog defaults.
    defaults: "2025-05-24",
    person_profiles: "always",
    capture_exceptions: true,
    session_recording: {
      maskAllInputs: true
    }
  });
}
