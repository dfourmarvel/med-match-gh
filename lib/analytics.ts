import posthog from "posthog-js";
import type { FullAssessmentResult } from "@/lib/types";

/**
 * Sends an event to PostHog. Silently does nothing when PostHog was never
 * initialised (no key set, local dev, tests), so call sites need no guards.
 */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

export const GOOGLE_PENDING_KEY = "medmatch-google-signin-pending";

export function identifyUser(userId: string) {
  try {
    if (sessionStorage.getItem(GOOGLE_PENDING_KEY)) {
      sessionStorage.removeItem(GOOGLE_PENDING_KEY);
      identifyOnly(userId);
      capture("signin_completed", { method: "google" });
      return;
    }
  } catch {
    /* storage unavailable */
  }
  identifyOnly(userId);
}

function identifyOnly(userId: string) {
  if (!posthog.__loaded) return;
  // Supabase user id only — never the email, so PostHog holds no contact details.
  if (posthog.get_distinct_id() !== userId) posthog.identify(userId);
}

export function resetUser() {
  if (!posthog.__loaded) return;
  posthog.reset();
}

/**
 * Flattens a result into one-level properties. PostHog can only break charts
 * down by top-level properties, so `match_1_specialty` is usable where an
 * array of matches is not.
 */
export function buildCompletionProperties(
  result: FullAssessmentResult,
  answers: Record<number, number>,
  durationMs: number | null
): Record<string, unknown> {
  const properties: Record<string, unknown> = {
    audience: result.audience,
    confidence: result.confidenceLevel,
    locked: Boolean(result.locked),
    answered_count: Object.keys(answers).length,
    duration_seconds: durationMs === null ? null : Math.round(durationMs / 1000),
    top_specialty: result.topMatches[0]?.specialtyId ?? "unknown",
    top_match_pct: result.topMatches[0]?.matchPercentage ?? null,
    top_score_gap: result.topMatches[0]?.explanationFactors.scoreGapFromNext ?? null
  };

  result.topMatches.forEach((match, index) => {
    properties[`match_${index + 1}_specialty`] = match.specialtyId;
    properties[`match_${index + 1}_pct`] = match.matchPercentage;
  });

  for (const [questionId, value] of Object.entries(answers)) {
    properties[`q${questionId}`] = value;
  }

  // A locked (signed-out) payload carries placeholder traits, which would
  // pollute every trait chart with fake values.
  if (!result.locked) {
    for (const [trait, score] of Object.entries(result.traitScores)) {
      properties[`trait_${trait}`] = score;
    }
  }

  return properties;
}
