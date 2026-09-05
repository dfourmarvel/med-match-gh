import { z } from "zod";
import { generateAIResponse } from "@/lib/ai/generateAIResponse";
import { buildExplanationPrompt } from "@/lib/ai/promptTemplates";
import { rateLimit } from "@/lib/rate-limit";
import { specialtiesById } from "@/lib/specialties";
import { serverSupabase } from "@/lib/supabase";
import { TraitKey } from "@/lib/types";
import { apiError, apiSuccess } from "@/lib/apiError";

export const maxDuration = 30;

const traitKeys = [
  "patientInteraction",
  "proceduralInterest",
  "diagnosticReasoning",
  "fastPacedPreference",
  "workLifePriority",
  "emotionalResilience",
  "teamCollaboration",
  "precisionOrientation",
  "longTermRelationships",
  "researchCuriosity",
  "leadershipPreference",
  "trainingTolerance",
  "emergencyComfort",
  "communicationEmpathy",
  "predictableSchedulePreference"
] as const satisfies readonly TraitKey[];

const traitScoresSchema = z.record(z.enum(traitKeys), z.number().min(0).max(100));

const topMatchSchema = z.object({
  specialtyId: z.string().refine((id) => Boolean(specialtiesById[id]), "Unknown specialty ID."),
  matchPercentage: z.number().int().min(1).max(99),
  strengths: z.array(z.string().trim().min(1).max(140)).max(6).optional(),
  challenges: z.array(z.string().trim().min(1).max(140)).max(6).optional()
});

const aiExplanationRequestSchema = z
  .object({
    audience: z.enum(["medical-student", "high-school", "dental-student"]),
    traitScores: traitScoresSchema,
    topMatches: z.array(topMatchSchema).min(1).max(5)
  })
  .passthrough();

type AiExplanationRequest = z.infer<typeof aiExplanationRequestSchema>;

function buildFallbackExplanation(payload: AiExplanationRequest) {
  const names = payload.topMatches.slice(0, 3).map((match) => specialtiesById[match.specialtyId].name);
  const list = names.join(", ");

  return (
    `Based on your assessment, your strongest specialty matches are ${list}. ` +
    `These reflect how your interests, work-style preferences, and lifestyle priorities ` +
    `align with each field. They are not a diagnosis or a final career decision — treat ` +
    `them as a starting point for shadowing, mentorship, and further exploration with ` +
    `training programs in Ghana. Our personalized AI narrative is temporarily unavailable, ` +
    `so please revisit shortly for a fuller explanation.`
  );
}

function limitWords(text: string, maxWords = 300) {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text.trim();
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "ai-explanation", limit: 10, windowMs: 60_000 });
    if (!limit.allowed) {
      return apiError("Too many AI guidance requests. Please try again shortly.", 429, undefined, {
        "Retry-After": String(limit.retryAfterSeconds)
      });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch (err: any) {
      console.error("Malformed JSON in /api/ai-explanation", { error: err.message });
      return apiError("Invalid JSON request body.", 400);
    }

    const parsed = aiExplanationRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      return apiError("Invalid request payload.", 400, validationErrors);
    }

    try {
      // Every specialtyId here already passed the schema's existence refine,
      // so the lookup below is guaranteed to resolve.
      const matches = parsed.data.topMatches.map((match) => ({
        specialty: specialtiesById[match.specialtyId],
        matchPercentage: match.matchPercentage,
        strengths: match.strengths,
        challenges: match.challenges
      }));

      const prompt = buildExplanationPrompt({
        audience: parsed.data.audience,
        traitScores: parsed.data.traitScores,
        matches
      });

      const explanation = await generateAIResponse(prompt);
      return apiSuccess({ explanation: limitWords(explanation) });
    } catch (error) {
      console.error("AI explanation failed, returning fallback message", {
        error,
        supabaseConfigured: Boolean(serverSupabase)
      });
      return apiSuccess({ explanation: buildFallbackExplanation(parsed.data) });
    }
  } catch (globalError: any) {
    console.error("Unhandled exception in POST /api/ai-explanation", {
      message: globalError?.message,
      stack: globalError?.stack
    });
    return apiError("Internal server error", 500);
  }
}
