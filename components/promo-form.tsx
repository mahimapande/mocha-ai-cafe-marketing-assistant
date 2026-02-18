"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cozy">Cozy</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="channel" className="text-sm font-medium text-foreground">
            Channel
          </Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="channel" className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="emojis"
          checked={includeEmojis}
          onCheckedChange={(checked) => setIncludeEmojis(checked === true)}
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
