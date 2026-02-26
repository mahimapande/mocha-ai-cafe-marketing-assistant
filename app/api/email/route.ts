import { generateText } from "ai"

export const maxDuration = 60

const TONE_MAP: Record<string, string> = {
  cozy: "warm, inviting, friendly",
  playful: "fun, light, slightly cheeky",
  professional: "clear, informative, straightforward",
}

export async function POST(req: Request) {
  try {
    const { specials, tone, includeEmojis } = await req.json()
    const toneGuide = TONE_MAP[tone] || TONE_MAP.cozy

    const emojiRule = includeEmojis
      ? "Use emojis sparingly, only 1-2 in the entire email where they feel natural."
      : "Do NOT include any emojis."

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a copywriter for a neighborhood cafe.

Write a short weekly promo email based ONLY on these specials/events:
"${specials}"

Tone: ${toneGuide}

Rules:
- ${emojiRule}
- Write in clear, natural, grammatically correct American English.
- Do NOT use flowery adjectives like "flaky," "succulent," "decadent," "heavenly," or "irresistible." Use plain language.
- Do NOT invent any specials, events, or menu items. Only use what is provided above.
- Start with a simple greeting like "Hi friends," followed by a comma. Add a line break, then the first sentence on a new line. Example:
  Hi friends,

  This week we're offering...
- Summarize specials in 1-2 sentences.
- Bullet list of specials.
- End with a friendly call-to-action.
- Under 200 words. No subject line.
- Proofread before returning.`,
      temperature: 0.7,
      maxOutputTokens: 512,
    })

    return Response.json({ email: text.trim() })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate email" },
      { status: 500 }
    )
  }
}
