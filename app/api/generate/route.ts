import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { specials, tone, includeEmojis, channel } = await req.json()

    const results: { captions?: string[]; email?: string } = {}

    // ─── Instagram Captions ────────────────────────────────────────────
    if (channel === "instagram" || channel === "both") {
      const { text: captionsRaw } = await generateText({
        model: "openai/gpt-5-mini",
      // Customize the Instagram prompt below
      prompt: `You are a social-media copywriter for a cozy neighborhood café.

Generate exactly 3 short Instagram caption options based on these specials/events:
"${specials}"

Rules:
- Tone: ${tone}
- ${includeEmojis ? "Include relevant emojis throughout." : "Do NOT include any emojis."}
- Each caption MUST be under 220 characters (including hashtags).
- End each caption with 3–5 relevant hashtags.
- Separate each caption with "---" on its own line.
- Do NOT number the captions or add any other formatting.`,
      temperature: 0.8,
      maxOutputTokens: 600,
    })

    results.captions = captionsRaw
      .split("---")
      .map((c) => c.trim())
      .filter(Boolean)
  }

  // ─── Email Draft ───────────────────────────────────────────────────
  if (channel === "email" || channel === "both") {
    const { text: email } = await generateText({
      model: "openai/gpt-5-mini",
      // Customize the Email prompt below
      prompt: `You are a friendly copywriter for a cozy neighborhood café.

Write a short weekly promo email based on these specials/events:
"${specials}"

Rules:
- Tone: ${tone}
- ${includeEmojis ? "Include a few relevant emojis." : "Do NOT include any emojis."}
- Start with a warm greeting to regulars.
- Summarize the specials/events in 1–2 sentences.
- Include a bullet list of the specials (use "•" for bullets).
- End with a simple, friendly call-to-action inviting them to visit this week.
- Keep the entire email under 200 words.
- Do NOT include a subject line — just the body text.`,
      temperature: 0.7,
      maxOutputTokens: 500,
    })

    results.email = email.trim()
  }

    return Response.json(results)
  } catch (error) {
    console.error("[v0] Generate API error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    )
  }
}
