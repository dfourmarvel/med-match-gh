import { createHash } from "crypto";
import { redis } from "@/lib/redis";

/**
 * Caches the generated explanation for a given assessment outcome.
 *
 * Without this, /results and /share/[id] each fired a fresh 70B call on EVERY
 * render — so re-reading your own results, or a share link doing the rounds in
 * a class WhatsApp group, billed once per view. The explanation is a pure
 * function of its inputs, so there was never a reason to regenerate it.
 *
 * Keyed on a hash of the inputs rather than a result id, which means two people
 * who answer identically share one generation, and a share link costs exactly
 * one call no matter how many times it is opened.
 *
 * Nothing identifying goes into the key or the value: the inputs are trait
 * numbers, specialty ids and match percentages, and the key is a one-way hash
 * of them. There is no id, email or free text anywhere in here.
 */

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const KEY_PREFIX = "medmatch:ai-explanation:v1";

/**
 * Stable stringify: JSON.stringify does not guarantee key order across objects
 * built by different code paths, and an unstable key silently disables the
 * cache rather than failing loudly.
 */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
  return `{${entries.join(",")}}`;
}

export function explanationCacheKey(input: unknown): string {
  const digest = createHash("sha256").update(stableStringify(input)).digest("hex").slice(0, 32);
  return `${KEY_PREFIX}:${digest}`;
}

/** Returns the cached explanation, or null on a miss, a failure, or no Redis. */
export async function getCachedExplanation(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    const hit = await redis.get<string>(key);
    return typeof hit === "string" && hit.length > 0 ? hit : null;
  } catch (error) {
    // A cache that throws must never take the request with it — the caller
    // simply generates as it did before.
    console.warn("AI explanation cache read failed; generating instead", { error });
    return null;
  }
}

export async function setCachedExplanation(key: string, explanation: string): Promise<void> {
  if (!redis || !explanation) return;
  try {
    await redis.set(key, explanation, { ex: TTL_SECONDS });
  } catch (error) {
    console.warn("AI explanation cache write failed; continuing", { error });
  }
}
