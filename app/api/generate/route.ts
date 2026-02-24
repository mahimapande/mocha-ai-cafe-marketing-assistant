import { generateText } from "ai"

export const maxDuration = 60

const TONE_MAP: Record<string, string> = {
  cozy: "warm, inviting, friendly",
  playful: "fun, light, slightly cheeky",
  professional: "clear, informative, straightforward",
}

export async function POST(req: Request) {
  const { specials, tone, includeEmojis, channel } = await req.json()
  const toneGuide = TONE_MAP[tone] || TONE_MAP.cozy

  const emojiCaption = includeEmojis
    ? "Weave 1-3 emojis naturally into each caption where pauses occur. Never clump emojis."
    : "No emojis."

  const emojiEmail = includeEmojis
    ? "Use only 1-2 emojis in the entire email."
    : "No emojis."

  const igPrompt = `Social-media copywriter for a neighborhood cafe.
Write 3 Instagram captions for: "${specials}"
Tone: ${toneGuide}. ${emojiCaption}
Rules: Under 150 chars each. Relaxed style. No periods, no em dashes. No flowery words. No invented items. 2-3 local hashtags each. Number them 1. 2. 3.`

  const emailPrompt = `Copywriter for a neighborhood cafe.
Write a promo email for: "${specials}"
Tone: ${toneGuide}. ${emojiEmail}
Rules: Start "Hi friends," then newline. 1-2 sentence summary. Bullet list of specials. Friendly CTA. Under 150 words. No subject line. No flowery words. No invented items. Plain American English.`

  const wantsIg = channel === "instagram" || channel === "both"
  const wantsEmail = channel === "email" || channel === "both"

  // Use streaming to avoid proxy timeout
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Run in parallel
        const [igResult, emailResult] = await Promise.all([
          wantsIg
            ? generateText({ model: "openai/gpt-5-mini", prompt: igPrompt, temperature: 0.8, maxOutputTokens: 400 })
            : null,
          wantsEmail
            ? generateText({ model: "openai/gpt-5-mini", prompt: emailPrompt, temperature: 0.7, maxOutputTokens: 400 })
            : null,
        ])

        const results: { captions?: string[]; email?: string } = {}

        if (igResult) {
          results.captions = igResult.text
            .split(/(?:\n\s*---\s*\n|\n\s*\d+\.\s+)/)
            .map((c: string) => c.replace(/^\d+\.\s*/, "").trim())
            .filter(Boolean)
        }

        if (emailResult) {
          results.email = emailResult.text.trim()
        }

        controller.enqueue(encoder.encode(JSON.stringify(results)))
        controller.close()
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to generate"
        controller.enqueue(encoder.encode(JSON.stringify({ error: msg })))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  })
}
