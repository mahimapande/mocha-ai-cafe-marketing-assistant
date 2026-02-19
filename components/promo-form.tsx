"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface PromoFormProps {
  onGenerate: (data: {
    specials: string
    tone: string
    includeEmojis: boolean
    channel: string
  }) => void
  isLoading: boolean
}

export function PromoForm({ onGenerate, isLoading }: PromoFormProps) {
  const [specials, setSpecials] = useState("")
  const [tone, setTone] = useState("cozy")
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [channel, setChannel] = useState("both")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!specials.trim()) return
    onGenerate({ specials, tone, includeEmojis, channel })
  }

  return (
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
          <Label htmlFor="tone" className="text-sm font-medium text-foreground">
            Tone
          </Label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer appearance-none"
          >
            <option value="cozy">Cozy</option>
            <option value="playful">Playful</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="channel" className="text-sm font-medium text-foreground">
            Channel
          </Label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer appearance-none"
          >
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
        <Label htmlFor="emojis" className="text-sm text-foreground cursor-pointer">
          Include emojis
        </Label>
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
  )
}
