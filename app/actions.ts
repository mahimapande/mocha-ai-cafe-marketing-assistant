"use server"

import { generateText } from "ai"

const TONE_MAP: Record<string, string> = {
  cozy: "warm, inviting, friendly",
  playful: "fun, light, slightly cheeky",
  professional: "clear, informative, straightforward",
}

export async function generatePromo(data: {
  specials: string
  tone: string
  includeEmojis: boolean
  channel: string
}): Promise<{ captions?: string[]; email?: string; error?: string }> {
  const { specials, tone, includeEmojis, channel } = data

  const toneGuide = TONE_MAP[tone] || TONE_MAP.cozy

  const emojiRuleCaption = includeEmojis
    ? "Weave emojis into the natural flow of the caption so they feel like part of the sentence, not interruptions. Place them where a pause or emphasis naturally occurs. Never clump multiple emojis together. Keep it to 1-3 emojis per caption."
    : "Do NOT include any emojis."

  const emojiRuleEmail = includeEmojis
    ? "Use emojis sparingly, only 1-2 in the entire email where they feel natural."
    : "Do NOT include any emojis."

  const instagramPrompt = `You are a social-media copywriter for a neighborhood cafe.

Write 3 short, catchy Instagram captions based ONLY on these specials/events:
"${specials}"

Tone: ${toneGuide}

Rules:
- ${emojiRuleCaption}
- Each caption must stay under 150-180 characters so it reads quickly.
- Write in clear, natural, grammatically correct American English, but use a relaxed Instagram style.
- Do NOT use em dashes. Use commas, colons, or line breaks instead for a relaxed feel.
- Do NOT use periods as punctuation. Use commas, colons, line breaks, or emojis to end phrases instead.
- You may use one or two short sentences or phrases, but avoid stiff or overly formal punctuation.
- You may use line breaks to make the caption feel more natural.
- Do NOT put a dash or other punctuation directly before the hashtags, just leave a space before hashtags.
- Do NOT use flowery or exaggerated adjectives like "flaky," "succulent," "decadent," "heavenly," or "irresistible." Use plain, natural language.
- Do NOT invent any specials, events, or menu items. Only reference what the user typed above.
- End each caption with 2-3 relevant hashtags that feel local and cozy (e.g. #neighborhoodcafe, #slowmorning, #coffeelover, #matchalatte).
- Number the captions 1., 2., and 3.
- Before returning, silently proofread and fix any grammar, spelling, or punctuation errors.`

  const emailPrompt = `You are a copywriter for a neighborhood cafe.

Write a short weekly promo email based ONLY on these specials/events:
"${specials}"

Tone: ${toneGuide}

Rules:
- ${emojiRuleEmail}
- Write in clear, natural, grammatically correct American English with proper punctuation and sentence structure.
- Do NOT use flowery or exaggerated adjectives like "flaky," "succulent," "decadent," "heavenly," or "irresistible." Use plain, natural language.
- Do NOT invent any specials, events, or menu items. Only reference what the user typed above.
- Start with a warm but simple greeting like "Hi friends," or "Hi everyone," followed by a comma (NOT a dash or em dash). Add a line break after the greeting, then begin the first sentence on the next line. Example:
  Hi friends,

  This Valentine's Day we're offering...
- Summarize the specials/events in 1-2 sentences.
- Include a bullet list of the specials (use bullet characters for bullets).
- End with a simple, friendly call-to-action inviting them to visit this week.
- Keep the entire email under 200 words.
- Do NOT include a subject line, just the body text.
- Before returning, silently proofread and fix any grammar, spelling, or punctuation errors.`

  try {
    const wantsInstagram = channel === "instagram" || channel === "both"
    const wantsEmail = channel === "email" || channel === "both"

    const [instagramResult, emailResult] = await Promise.all([
      wantsInstagram
        ? generateText({
            model: "openai/gpt-5-mini",
            prompt: instagramPrompt,
            temperature: 0.8,
            maxOutputTokens: 1024,
          })
        : Promise.resolve(null),
      wantsEmail
        ? generateText({
            model: "openai/gpt-5-mini",
            prompt: emailPrompt,
            temperature: 0.7,
            maxOutputTokens: 1024,
          })
        : Promise.resolve(null),
    ])

    const results: { captions?: string[]; email?: string } = {}

    if (instagramResult) {
      results.captions = instagramResult.text
        .split(/(?:\n\s*---\s*\n|\n\s*\d+\.\s+)/)
        .map((c) => c.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
    }

    if (emailResult) {
      results.email = emailResult.text.trim()
    }

    return results
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate content",
    }
  }
}
