import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAIResponse } from "@/lib/ai/generateAIResponse";
import { AI_SYSTEM_PROMPT } from "@/lib/ai/promptTemplates";
import { rateLimit } from "@/lib/rate-limit";
import { serverSupabase } from "@/lib/supabase";

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

function validationErrorResponse(error: z.ZodError) {
  return {
    error: "Invalid request payload.",
    issues: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  };
}

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

  return `${AI_SYSTEM_PROMPT}

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

function fallbackExplanation(payload: AiExplanationRequest) {
  const topTraits = Object.entries(payload.traitScores)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 3)
    .map(([trait]) => trait);
  const topSpecialties = payload.topSpecialties.slice(0, 3).map(specialtyName);

  return `Your results suggest strengths in ${topTraits.join(", ") || "several professional traits"}. These traits can be useful in clinical training because they point to how you may prefer to think, communicate, handle pressure, and work with patients or teams.

Your top specialty matches are ${topSpecialties.join(", ")}. These recommendations should be read as exploratory career guidance: they suggest areas where your current preferences may align with the daily work, learning style, and professional demands of those fields. They are not a diagnosis, a guarantee of future performance, or a final career decision.

Use this result as a starting point. Shadow clinicians in your top specialties, ask mentors what the work is really like, and compare your interest with training requirements, lifestyle, patient contact, and long-term growth. Real clinical exposure and thoughtful mentorship should guide your next step.`;
}

function limitWords(text: string, maxWords = 300) {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text.trim();
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

export async function POST(request: Request) {
  const limit = rateLimit(request, { namespace: "ai-explanation", limit: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many AI guidance requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = aiExplanationRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 400 });
  }

  const supabaseReadyContext = {
    userId: parsed.data.userId,
    table: "ai_explanations",
    enabled: Boolean(serverSupabase)
  };

  try {
    const explanation = await generateAIResponse(buildPrompt(parsed.data));
    return NextResponse.json({ explanation: limitWords(explanation) });
  } catch (error) {
    console.error("AI explanation failed", { error, supabaseReadyContext });
    return NextResponse.json({ explanation: limitWords(fallbackExplanation(parsed.data)) });
  }
}
