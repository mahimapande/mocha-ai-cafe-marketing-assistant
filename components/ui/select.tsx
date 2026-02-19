"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Native <select> replacement for the Radix-based select component  */
/*  (Radix peer-dep issue workaround)                                 */
/* ------------------------------------------------------------------ */

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        data-slot="select"
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full appearance-none items-center rounded-md border bg-transparent px-3 py-2 pr-8 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 opacity-50" />
    </div>
  )
})
Select.displayName = "Select"

function SelectItem({
  className,
  ...props
}: React.OptionHTMLAttributes<HTMLOptionElement> & { className?: string }) {
  return <option className={cn(className)} {...props} />
}

export {
  Select,
  SelectItem,
}
