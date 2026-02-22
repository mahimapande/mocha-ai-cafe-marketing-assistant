import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { specials, tone, includeEmojis, channel } = await req.json()

    const results: { captions?: string[]; email?: string } = {}

    if (channel === "instagram" || channel === "both") {
      const { text: captionsRaw } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `You are a social-media copywriter for a cozy neighborhood cafe.

Generate exactly 3 Instagram caption options based on these specials/events:
"${specials}"

Rules:
- Tone: ${tone}
- ${includeEmojis ? "Include relevant emojis." : "Do NOT include any emojis."}
- Each caption must be 1-2 sentences max. Keep it conversational, not salesy.
- End each caption with exactly 3-4 hashtags. Avoid generic tags like #coffee or #cafe. Prefer specific, local-feeling tags (e.g. #MorningRitual, #TuesdayTreat, #NeighborhoodGem, #SlowMorning).
- Separate each caption with "---" on its own line.
- Do NOT number the captions or add any other formatting.`,
        temperature: 0.8,
        maxOutputTokens: 2048,
      })

      results.captions = captionsRaw
        .split("---")
        .map((c) => c.trim())
        .filter(Boolean)
    }

    if (channel === "email" || channel === "both") {
      const { text: email } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `You are a friendly copywriter for a cozy neighborhood café.

Write a short weekly promo email based on these specials/events:
"${specials}"

Rules:
- Tone: ${tone}
- ${includeEmojis ? "Include a few relevant emojis." : "Do NOT include any emojis."}
- Start with a warm greeting to regulars.
- Summarize the specials/events in 1-2 sentences.
- Include a bullet list of the specials (use bullet characters for bullets).
- End with a simple, friendly call-to-action inviting them to visit this week.
- Keep the entire email under 200 words.
- Do NOT include a subject line - just the body text.`,
        temperature: 0.7,
        maxOutputTokens: 2048,
      })

      results.email = email.trim()
    }

    return Response.json(results)
  } catch (error) {
    console.error("[v0] Generate API error:", error)
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate content",
      },
      { status: 500 }
    )
  }
}
