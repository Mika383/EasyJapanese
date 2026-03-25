"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement>

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-px w-full bg-border", className)}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
