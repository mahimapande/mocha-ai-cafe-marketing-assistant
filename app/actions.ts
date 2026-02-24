"use server"

import { generateText } from "ai"

const TONE_MAP: Record<string, string> = {
  cozy: "warm, inviting, friendly",
  playful: "fun, light, slightly cheeky",
  professional: "clear, informative, straightforward",
}

export async function generateCaptions(specials: string, tone: string, includeEmojis: boolean) {
  const toneGuide = TONE_MAP[tone] || TONE_MAP.cozy
  const emojiRule = includeEmojis
    ? "Weave 1-3 emojis naturally into each caption where pauses occur. Never clump emojis."
    : "No emojis."

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Social-media copywriter for a neighborhood cafe.
Write 3 Instagram captions for: "${specials}"
Tone: ${toneGuide}. ${emojiRule}
Rules: Under 180 chars each. Relaxed Instagram style. No periods, no em dashes. No flowery words. No invented items. 2-3 local hashtags. Number them 1. 2. 3. Just space before hashtags.`,
    temperature: 0.8,
    maxOutputTokens: 400,
  })

  return text
    .split(/(?:\n\s*---\s*\n|\n\s*\d+\.\s+)/)
    .map((c: string) => c.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
}

export async function generateEmail(specials: string, tone: string, includeEmojis: boolean) {
  const toneGuide = TONE_MAP[tone] || TONE_MAP.cozy
  const emojiRule = includeEmojis
    ? "Use only 1-2 emojis in the entire email."
    : "No emojis."

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Copywriter for a neighborhood cafe.
Write a promo email for: "${specials}"
Tone: ${toneGuide}. ${emojiRule}
Rules: Start "Hi friends," with comma then newline. 1-2 sentence summary. Bullet list. Friendly CTA. Under 150 words. No subject line. No flowery words. No invented items. Plain American English. Proofread.`,
    temperature: 0.7,
    maxOutputTokens: 400,
  })

  return text.trim()
}
