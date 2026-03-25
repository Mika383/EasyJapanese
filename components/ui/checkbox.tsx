"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <span className={cn("relative inline-flex h-5 w-5 items-center justify-center", className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none border-2 border-foreground bg-background transition-colors peer-checked:bg-foreground peer-checked:border-foreground"
          {...props}
        />
        <Check className="pointer-events-none z-20 h-4 w-4 text-background opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
