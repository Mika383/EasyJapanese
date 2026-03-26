import { Button } from "@/components/ui/button"

export type TranslateMode = "text" | "image"

interface TranslateTabsProps {
  mode: TranslateMode
  onChange: (mode: TranslateMode) => void
}

export function TranslateTabs({ mode, onChange }: TranslateTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={mode === "text" ? "default" : "outline"}
        className="min-w-[140px] font-semibold"
        onClick={() => onChange("text")}
      >
        Dịch văn bản
      </Button>
      <Button
        type="button"
        variant={mode === "image" ? "default" : "outline"}
        className="min-w-[140px] font-semibold"
        onClick={() => onChange("image")}
      >
        Dịch từ ảnh
      </Button>
    </div>
  )
}
