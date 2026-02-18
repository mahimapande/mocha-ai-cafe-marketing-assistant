"use client"

import { useState } from "react"
import { Check, Copy, Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PromoResultsProps {
  captions?: string[]
  email?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}

export function PromoResults({ captions, email }: PromoResultsProps) {
  const hasResults = (captions && captions.length > 0) || email

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <Mail className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
          {"Fill in your specials and events, pick your settings, and hit Generate to see your promo content here."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {captions && captions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="size-4 text-accent" />
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Instagram Captions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {captions.map((caption, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground leading-relaxed flex-1 whitespace-pre-wrap">
                    {caption}
                  </p>
                  <CopyButton text={caption} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {email && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-accent" />
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Email Draft
              </h2>
            </div>
            <CopyButton text={email} />
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {email}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
