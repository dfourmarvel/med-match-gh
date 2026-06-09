import { z } from "zod";
import { generateAIResponse } from "@/lib/ai/generateAIResponse";
import { AI_SYSTEM_PROMPT } from "@/lib/ai/promptTemplates";
import { rateLimit } from "@/lib/rate-limit";
import { serverSupabase } from "@/lib/supabase";
import { apiError, apiSuccess } from "@/lib/apiError";

const answerPairSchema = z
  .object({
    questionId: z.union([z.string(), z.number()]).optional(),
    question: z.string().trim().min(1).max(500).optional(),
    answer: z.union([z.string().trim().min(1).max(500), z.number(), z.boolean()])
  })
  .passthrough()
  .superRefine((value, context) => {
    if (value.questionId === undefined && value.question === undefined) {
      context.addIssue({
        code: "custom",
        path: ["question"],
        message: "Each answer must include a question or questionId."
      });
    }
  });

const specialtySchema = z.union([
  z.string().trim().min(1).max(120),
  z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      specialtyName: z.string().trim().min(1).max(120).optional(),
      title: z.string().trim().min(1).max(120).optional(),
      matchPercentage: z.number().min(0).max(100).optional(),
      score: z.number().min(0).max(100).optional(),
      strengths: z.array(z.string().trim().min(1).max(140)).max(8).optional(),
      challenges: z.array(z.string().trim().min(1).max(140)).max(8).optional()
    })
    .passthrough()
    .refine((value) => value.name || value.specialtyName || value.title, {
      message: "Each specialty object must include name, specialtyName, or title."
    })
]);

const aiExplanationRequestSchema = z.object({
  userId: z.string().trim().min(1).max(120),
  answers: z.array(answerPairSchema).min(1).max(50),
  traitScores: z.record(z.string().trim().min(1).max(80), z.number().finite()).refine(
    (scores) => Object.keys(scores).length > 0,
    "At least one trait score is required."
  ),
  topSpecialties: z.array(specialtySchema).min(1).max(5)
});

type AiExplanationRequest = z.infer<typeof aiExplanationRequestSchema>;

function specialtyName(specialty: AiExplanationRequest["topSpecialties"][number]) {
  if (typeof specialty === "string") {
    return specialty;
  }

  return specialty.name ?? specialty.specialtyName ?? specialty.title ?? "Recommended specialty";
}

function buildPrompt(payload: AiExplanationRequest) {
  const topTraits = Object.entries(payload.traitScores)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 6)
    .map(([trait, score]) => `${trait}: ${score}`)
    .join("\n");

  const topSpecialties = payload.topSpecialties
    .slice(0, 3)
    .map((specialty, index) => `${index + 1}. ${specialtyName(specialty)}`)
    .join("\n");

  const answers = payload.answers
    .slice(0, 12)
    .map((item, index) => {
      const question = item.question ?? `Question ${item.questionId ?? index + 1}`;
      return `${question}: ${String(item.answer)}`;
    })
    .join("\n");

  return `${AI_SYSTEM_PROMPT}Locally tailored clinical compatibility insight.

Generate one personalized MedMatch explanation for user ${payload.userId}.

Assessment answers:
${answers}

Highest trait scores:
${topTraits}

Top recommended specialties:
${topSpecialties}

Requirements:
- Interpret the user's traits in supportive, non-deterministic language.
- Explain why the top specialties may match those traits.
- Keep the tone clear, supportive, medically neutral, and educational.
- Do not diagnose, recommend treatment, or give patient-specific medical advice.
- Do not imply the result is a final career decision.
- Keep the response concise, around 200-300 words.
- Return plain text only.`;
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
    const limit = rateLimit(request, { namespace: "ai-explanation", limit: 10, windowMs: 60_000 });
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

    const supabaseReadyContext = {
      userId: parsed.data.userId,
      table: "ai_explanations",
      enabled: Boolean(serverSupabase)
    };

    try {
      const explanation = await generateAIResponse(buildPrompt(parsed.data));
      return apiSuccess({ explanation: limitWords(explanation) });
    } catch (error) {
      console.error("AI explanation failed, returning fallback message", { error, supabaseReadyContext });
      return apiSuccess({ explanation: "Unable to generate explanation at this time" });
    }
  } catch (globalError: any) {
    console.error("Unhandled exception in POST /api/ai-explanation", {
      message: globalError?.message,
      stack: globalError?.stack
    });
    return apiError("Internal server error", 500);
  }
}
