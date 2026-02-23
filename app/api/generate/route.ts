import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { specials, tone, includeEmojis, channel } = await req.json()

    const results: { captions?: string[]; email?: string } = {}

    if (channel === "instagram" || channel === "both") {
      const { text: captionsRaw } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `You are a social-media copywriter for a neighborhood cafe.

Write 3 short, catchy Instagram captions based ONLY on these specials/events:
"${specials}"

Tone guide (use "${tone}"):
- cozy = warm, inviting, friendly
- playful = fun, light, slightly cheeky
- professional = clear, informative, straightforward

Rules:
- ${includeEmojis ? "Include relevant emojis." : "Do NOT include any emojis."}
- Each caption must stay under 150 characters so it reads quickly.
- Write in clear, natural, grammatically correct American English with proper punctuation.
- Do NOT use flowery or exaggerated adjectives like "flaky," "succulent," "decadent," "heavenly," "irresistible," or similar over-the-top terms. Use plain, natural language.
- Do NOT invent any specials, events, or menu items. Only reference what the user typed above.
- End each caption with 2-3 relevant hashtags that feel local and cozy (e.g. #neighborhoodcafe, #slowmorning, #coffeelover, #matchalatte).
- Number the captions 1., 2., and 3.
- Before returning, silently proofread and fix any grammar, spelling, or punctuation errors.`,
        temperature: 0.8,
        maxOutputTokens: 2048,
      })

      results.captions = captionsRaw
        .split(/\n\s*\d+\.\s+/)
        .map((c) => c.trim())
        .filter(Boolean)
    }

    if (channel === "email" || channel === "both") {
      const { text: email } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `You are a copywriter for a neighborhood cafe.

Write a short weekly promo email based ONLY on these specials/events:
"${specials}"

Tone guide (use "${tone}"):
- cozy = warm, inviting, friendly
- playful = fun, light, slightly cheeky
- professional = clear, informative, straightforward

Rules:
- ${includeEmojis ? "Use emojis sparingly -- only 1-2 in the entire email where they feel natural." : "Do NOT include any emojis."}
- Write in clear, natural, grammatically correct American English with proper punctuation and sentence structure.
- Do NOT use flowery or exaggerated adjectives like "flaky," "succulent," "decadent," "heavenly," "irresistible," or similar over-the-top terms. Use plain, natural language.
- Do NOT invent any specials, events, or menu items. Only reference what the user typed above.
- Start with a warm greeting to regulars.
- Summarize the specials/events in 1-2 sentences.
- Include a bullet list of the specials (use bullet characters for bullets).
- End with a simple, friendly call-to-action inviting them to visit this week.
- Keep the entire email under 200 words.
- Do NOT include a subject line -- just the body text.
- Before returning, silently proofread and fix any grammar, spelling, or punctuation errors.`,
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
