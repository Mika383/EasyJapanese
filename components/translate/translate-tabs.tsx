import { Button } from "@/components/ui/button"
import { ArrowLeftRight } from "lucide-react"
import { directionLabels, type TranslationDirection, type TranslationWorkflow } from "@/lib/translate-types"

export type TranslateMode = "text" | "image"

interface TranslateTabsProps {
  mode: TranslateMode
  workflow: TranslationWorkflow
  direction: TranslationDirection
  onWorkflowChange: (workflow: TranslationWorkflow) => void
  onChange: (mode: TranslateMode) => void
  onToggleDirection: () => void
  canUseImage: boolean
  onLockedFeature: () => void
}

export function TranslateTabs({
  mode,
  workflow,
  direction,
  onWorkflowChange,
  onChange,
  onToggleDirection,
  canUseImage,
  onLockedFeature,
}: TranslateTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        className="min-w-[170px] font-semibold"
        onClick={onToggleDirection}
        aria-label="Đảo chiều dịch"
      >
        <ArrowLeftRight className="h-4 w-4" />
        {directionLabels[direction]}
      </Button>
      <Button
        type="button"
        variant={workflow === "single" ? "default" : "outline"}
        className="min-w-[140px] font-semibold"
        onClick={() => onWorkflowChange("single")}
      >
        Dịch đơn
      </Button>
      <Button
        type="button"
        variant={workflow === "conversation" ? "default" : "outline"}
        className="min-w-[150px] font-semibold"
        onClick={() => onWorkflowChange("conversation")}
      >
        Dịch hội thoại
      </Button>
      <Button
        type="button"
        variant={mode === "text" ? "default" : "outline"}
        disabled={workflow === "conversation"}
        aria-disabled={workflow === "conversation"}
        className="min-w-[140px] font-semibold"
        onClick={() => onChange("text")}
      >
        Dịch văn bản
      </Button>
      <Button
        type="button"
        variant={mode === "image" ? "default" : "outline"}
        className={`min-w-[140px] font-semibold ${
          !canUseImage || workflow === "conversation" ? "opacity-60 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (workflow === "conversation") {
            return
          }
          if (!canUseImage) {
            onLockedFeature()
            return
          }
          onChange("image")
        }}
        aria-disabled={!canUseImage}
      >
        Dịch từ ảnh
      </Button>
    </div>
  )
}
