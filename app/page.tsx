"use client"

import { useState } from "react"
import { Coffee, Check, Copy, Instagram, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

/* ── Types ──────────────────────────────────────────── */

interface PromoData {
  specials: string
  tone: string
  includeEmojis: boolean
  channel: string
}

interface PromoResult {
  captions?: string[]
  email?: string
}

/* ── Copy Button ────────────────────────────────────── */

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      className="h-8 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}

/* ── Main Page ──────────────────────────────────────── */

export default function CafePromoPage() {
  const [specials, setSpecials] = useState("")
  const [tone, setTone] = useState("cozy")
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [channel, setChannel] = useState("both")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PromoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!specials.trim()) return

    setIsLoading(true)
    setError(null)
    setResults(null)

    const data: PromoData = { specials, tone, includeEmojis, channel }
    const wantsIg = channel === "instagram" || channel === "both"
    const wantsEmail = channel === "email" || channel === "both"
    const body = JSON.stringify(data)
    const headers = { "Content-Type": "application/json" }

    try {
      const [igRes, emailRes] = await Promise.all([
        wantsIg ? fetch("/api/captions", { method: "POST", headers, body }) : null,
        wantsEmail ? fetch("/api/email", { method: "POST", headers, body }) : null,
      ])

      const combined: PromoResult = {}

      if (igRes) {
        const igJson = await igRes.json()
        if (!igRes.ok) throw new Error(igJson.error || "Failed to generate captions.")
        combined.captions = igJson.captions
      }

      if (emailRes) {
        const emailJson = await emailRes.json()
        if (!emailRes.ok) throw new Error(emailJson.error || "Failed to generate email.")
        combined.email = emailJson.email
      }

      setResults(combined)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectClasses =
    "w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"

  const hasResults = (results?.captions && results.captions.length > 0) || results?.email

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <div className="flex items-center justify-center rounded-full bg-primary p-2">
            <Coffee className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground tracking-tight">
              Cafe Promo Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Generate Instagram captions & promo emails in seconds
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-1">
                {"What's happening this week?"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Tell us about your specials, events, or anything you want to promote.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="specials" className="text-sm font-medium text-foreground">
                    {"This week's specials & events"}
                  </Label>
                  <textarea
                    id="specials"
                    required
                    rows={5}
                    placeholder="e.g. New lavender latte, live jazz on Friday night, 2-for-1 pastries before 10am..."
                    value={specials}
                    onChange={(e) => setSpecials(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tone" className="text-sm font-medium text-foreground">Tone</Label>
                    <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className={selectClasses}>
                      <option value="cozy">Cozy</option>
                      <option value="playful">Playful</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="channel" className="text-sm font-medium text-foreground">Channel</Label>
                    <select id="channel" value={channel} onChange={(e) => setChannel(e.target.value)} className={selectClasses}>
                      <option value="instagram">Instagram</option>
                      <option value="email">Email</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="emojis"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="size-4 rounded border border-input accent-primary cursor-pointer"
                  />
                  <Label htmlFor="emojis" className="text-sm text-foreground cursor-pointer">Include emojis</Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !specials.trim()}
                  className="w-full h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card/50 p-6 min-h-[400px]">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 mb-6">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {!hasResults && !error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6">
                  <div className="rounded-full bg-secondary p-4 mb-4">
                    <Mail className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    {"Fill in your specials and events, pick your settings, and hit Generate to see your promo content here."}
                  </p>
                </div>
              )}

              {hasResults && (
                <div className="flex flex-col gap-8">
                  {results?.captions && results.captions.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Instagram className="size-4 text-accent" />
                        <h2 className="font-serif text-lg font-semibold text-foreground">Instagram Captions</h2>
                      </div>
                      <div className="flex flex-col gap-3">
                        {results.captions.map((caption, i) => (
                          <div key={i} className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="flex-none size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                  {i + 1}
                                </span>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{caption}</p>
                              </div>
                              <CopyBtn text={caption} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {results?.email && (
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-accent" />
                          <h2 className="font-serif text-lg font-semibold text-foreground">Email Draft</h2>
                        </div>
                        <CopyBtn text={results.email} />
                      </div>
                      <div className="rounded-lg border border-border bg-card p-5">
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{results.email}</p>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
