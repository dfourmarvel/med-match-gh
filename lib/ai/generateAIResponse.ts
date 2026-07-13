export async function generateAIResponse(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct";

  if (!apiKey || apiKey.startsWith("replace-with")) {
    throw new Error("AI provider is not configured.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Optional OpenRouter attribution headers (shown on your OpenRouter dashboard).
      ...(process.env.NEXT_PUBLIC_SITE_URL
        ? { "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL, "X-Title": "MedMatch Ghana" }
        : {})
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
