export async function generateAIResponse(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

  if (!apiKey || apiKey.startsWith("replace-with")) {
    throw new Error("AI provider is not configured.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 420
    })
  });

  if (!response.ok) {
    throw new Error("AI provider request failed.");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI provider returned an empty response.");
  }

  return content.trim();
}
