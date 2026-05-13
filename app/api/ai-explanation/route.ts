import { NextResponse } from "next/server";
import { specialtiesById } from "@/lib/specialties";
import { FullAssessmentResult } from "@/lib/types";

export async function POST(request: Request) {
  const result = (await request.json()) as FullAssessmentResult;
  const topMatches = result.topMatches.slice(0, 3).map((item) => specialtiesById[item.specialtyId].name);

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  if (!apiKey) {
    return NextResponse.json({
      explanation: `Your strongest current fit appears to be ${topMatches.join(", ")}. You show a profile with clear strengths in ${result.topMatches[0]?.strengths.join(", ").toLowerCase()}, which suggests you may thrive in specialties balancing those traits with Ghana's training realities. To deepen fit, shadow clinicians in your top 3 areas and compare how each specialty handles schedule control, emergency intensity, and patient continuity.`
    });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a warm, practical medical career advisor focused on Ghana. Keep advice educational, non-diagnostic, concise, and motivating."
        },
        {
          role: "user",
          content: `Create a concise explanation for this MedMatch Ghana user. Top matches: ${topMatches.join(", ")}. Personality summary: ${result.personalitySummary}. Trait scores: ${JSON.stringify(result.traitScores)}. Suggested next steps should be Ghana-aware and reference shadowing, mentorship, and training reality.`
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    return NextResponse.json({
      explanation: `Your strongest current fit appears to be ${topMatches.join(", ")}. Your profile suggests you combine analytical strengths with meaningful human-centered qualities, which can translate well into specialties that reward both clinical reasoning and communication. Use this result as a starting point for shadowing, mentorship, and real-world exposure in Ghana.`
    });
  }

  const data = await response.json();
  const explanation =
    data.choices?.[0]?.message?.content ??
    `Your strongest current fit appears to be ${topMatches.join(", ")}.`;

  return NextResponse.json({ explanation });
}
