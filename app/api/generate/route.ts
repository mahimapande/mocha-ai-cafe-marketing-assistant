import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[v0] API /generate received body:", JSON.stringify(body))
    const { specials, tone, includeEmojis, channel } = body

    const results: { captions?: string[]; email?: string } = {}

    console.log("[v0] Generating for channel:", channel)

    if (channel === "instagram" || channel === "both") {
      console.log("[v0] Starting Instagram generation...")
      const { text: captionsRaw } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `You are a social-media copywriter for a cozy neighborhood café.

Generate exactly 3 short Instagram caption options based on these specials/events:
"${specials}"

Rules:
- Tone: ${tone}
- ${includeEmojis ? "Include relevant emojis throughout." : "Do NOT include any emojis."}
- Each caption MUST be under 220 characters (including hashtags).
- End each caption with 3-5 relevant hashtags.
- Separate each caption with "---" on its own line.
- Do NOT number the captions or add any other formatting.`,
        temperature: 0.8,
        maxOutputTokens: 600,
      })

      console.log("[v0] Instagram raw response:", captionsRaw)
      results.captions = captionsRaw
        .split("---")
        .map((c) => c.trim())
        .filter(Boolean)
      console.log("[v0] Parsed captions:", results.captions)
    }

    if (channel === "email" || channel === "both") {
      console.log("[v0] Starting email generation...")
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
        maxOutputTokens: 500,
      })

      results.email = email.trim()
    }

    console.log("[v0] Returning results:", JSON.stringify(results))
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
