import { cn } from "@/lib/utils"

type LoadingSize = "sm" | "md" | "lg"

const sizeMap: Record<LoadingSize, { spinner: string; text: string }> = {
  sm: { spinner: "h-4 w-4 border-2", text: "text-xs" },
  md: { spinner: "h-5 w-5 border-2", text: "text-sm" },
  lg: { spinner: "h-7 w-7 border-[3px]", text: "text-base" },
}

interface LoadingIndicatorProps {
  label?: string
  size?: LoadingSize
  className?: string
}

export function LoadingIndicator({
  label = "Đang tải...",
  size = "md",
  className,
}: LoadingIndicatorProps) {
  const styles = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-3 text-muted-foreground", className)}>
      <span
        aria-hidden
        className={cn(
          "rounded-full border-muted-foreground/40 border-t-primary animate-spin",
          styles.spinner
        )}
      />
      <span className={cn("font-semibold", styles.text)}>{label}</span>
    </div>
  )
}
