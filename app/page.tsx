"use client"

import { useState } from "react"
import { PromoForm } from "@/components/promo-form"
import { PromoResults } from "@/components/promo-results"
import { Coffee } from "lucide-react"

interface GenerateResult {
  captions?: string[]
  email?: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(data: {
    specials: string
    tone: string
    includeEmojis: boolean
    channel: string
  }) {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to generate content. Please try again.")
      }

      const json = await res.json()
      setResults(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
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
          {/* Form Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-1">
                {"What's happening this week?"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Tell us about your specials, events, or anything you want to promote.
              </p>
              <PromoForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card/50 p-6 min-h-[400px]">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 mb-6">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <PromoResults
                captions={results?.captions}
                email={results?.email}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
