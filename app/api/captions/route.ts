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
      ? "Weave emojis into the natural flow of the caption so they feel like part of the sentence, not interruptions. Place them where a pause or emphasis naturally occurs. Never clump multiple emojis together. Keep it to 1-3 emojis per caption."
      : "Do NOT include any emojis."

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a social-media copywriter for a neighborhood cafe.

Write 3 short, catchy Instagram captions based ONLY on these specials/events:
"${specials}"

Tone: ${toneGuide}

Rules:
- ${emojiRule}
- Stay under 150-180 characters so it reads quickly.
- Write in clear, natural, grammatically correct American English, but use a relaxed Instagram style.
- Do NOT use em dashes. Use commas, colons, or line breaks instead.
- Do NOT use periods as punctuation. Use commas, colons, line breaks, or emojis instead.
- You may use short sentences or phrases, but avoid stiff or formal punctuation.
- You may use line breaks to make the caption feel more natural.
- Do NOT put punctuation directly before hashtags, just a space.
- Do NOT use flowery adjectives like "flaky," "succulent," "decadent," "heavenly," or "irresistible." Use plain language.
- Do NOT invent any specials, events, or menu items. Only use what is provided above.
- End each caption with 2-3 relevant local/cozy hashtags.
- Number them 1., 2., 3.
- Proofread before returning.`,
      temperature: 0.8,
      maxOutputTokens: 512,
    })

    const captions = text
      .split(/(?:\n\s*---\s*\n|\n\s*\d+\.\s+)/)
      .map((c) => c.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)

    return Response.json({ captions })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate captions" },
      { status: 500 }
    )
  }
}
