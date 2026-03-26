"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { TranslateTabs, type TranslateMode } from "@/components/translate/translate-tabs"
import { TranslateForm } from "@/components/translate/translate-form"
import { TranslateResult } from "@/components/translate/translate-result"
import type { TranslateResult as TranslateResultType } from "@/lib/gemini"

const MAX_IMAGE_SIZE_MB = 5

export function TranslatePage() {
  const { data: session } = useSession()
  const [mode, setMode] = useState<TranslateMode>("text")
  const [textValue, setTextValue] = useState("")
  const [includeGrammar, setIncludeGrammar] = useState(false)
  const [includeKana, setIncludeKana] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagePayload, setImagePayload] = useState<{ data: string; mimeType: string } | null>(null)
  const [result, setResult] = useState<TranslateResultType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const canSave = useMemo(() => Boolean(session?.user?.id && result), [session?.user?.id, result])

  const resetResultState = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  const handleModeChange = useCallback(
    (nextMode: TranslateMode) => {
      setMode(nextMode)
      resetResultState()
      if (nextMode === "text") {
        setImagePreview(null)
        setImagePayload(null)
      }
    },
    [resetResultState]
  )

  const handleImageSelect = useCallback((file: File | null) => {
    resetResultState()
    setImagePayload(null)
    if (!file) {
      setImagePreview(null)
      return
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error("Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const resultUrl = reader.result as string
      const [meta, base64] = resultUrl.split(",")
      const mimeType = meta?.match(/data:(.*);base64/)?.[1] ?? file.type
      setImagePreview(resultUrl)
      setImagePayload({ data: base64, mimeType })
    }
    reader.readAsDataURL(file)
  }, [resetResultState])

  const handleTranslate = useCallback(async () => {
    resetResultState()
    setIsLoading(true)
    const toastId = "translate-loading"
    toast.loading("Đang dịch nội dung...", { id: toastId })

    try {
      const payload =
        mode === "text"
          ? { text: textValue, includeGrammar, includeKana }
          : { image: imagePayload, includeGrammar, includeKana }

      if (mode === "text" && !textValue.trim()) {
        toast.error("Vui lòng nhập văn bản cần dịch.", { id: toastId })
        setIsLoading(false)
        return
      }

      if (mode === "image" && !imagePayload) {
        toast.error("Vui lòng tải ảnh cần dịch.", { id: toastId })
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || "Không thể dịch nội dung."
        setError(message)
        toast.error(message, { id: toastId })
        return
      }

      setResult(data.data)
      toast.success("Dịch thành công.", { id: toastId })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      setError(message)
      toast.error(message, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }, [includeGrammar, includeKana, imagePayload, mode, resetResultState, textValue])

  const handleIncludeGrammarChange = useCallback((value: boolean) => {
    setIncludeGrammar(value)
    toast(value ? "Đã bật giải thích ngữ pháp." : "Đã tắt giải thích ngữ pháp.")
  }, [])

  const handleIncludeKanaChange = useCallback((value: boolean) => {
    setIncludeKana(value)
    toast(value ? "Đã bật chú thích Hán tự." : "Đã tắt chú thích Hán tự.")
  }, [])

  const handleSave = useCallback(async () => {
    if (!result) return
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để lưu bản dịch.")
      return
    }

    setIsSaving(true)
    const toastId = "translate-save"
    toast.loading("Đang lưu bản dịch...", { id: toastId })

    try {
      const response = await fetch("/api/translate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: result.sourceText,
          kanaReading: result.kanaReading,
          romaji: result.romaji,
          translationVi: result.translationVi,
          grammarPoints: result.grammarPoints,
          ocrText: result.ocrText,
          notes: result.notes,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || "Không thể lưu bản dịch."
        toast.error(message, { id: toastId })
        return
      }

      toast.success("Đã lưu bản dịch.", { id: toastId })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      toast.error(message, { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }, [result, session?.user?.id])

  return (
    <div className="container mx-auto space-y-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Dịch tiếng Nhật
        </p>
        <h1 className="text-3xl font-bold">Dịch văn bản & hình ảnh</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Dịch nhanh tiếng Nhật, có thể kèm giải thích ngữ pháp khi bạn bật tuỳ chọn.
        </p>
      </header>

      <TranslateTabs mode={mode} onChange={handleModeChange} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-md border bg-background p-6">
          <TranslateForm
            mode={mode}
            textValue={textValue}
            onTextChange={setTextValue}
            includeGrammar={includeGrammar}
            onIncludeGrammarChange={handleIncludeGrammarChange}
            includeKana={includeKana}
            onIncludeKanaChange={handleIncludeKanaChange}
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onTranslate={handleTranslate}
            isLoading={isLoading}
          />
        </div>

        <TranslateResult
          result={result}
          isLoading={isLoading}
          error={error}
          onSave={handleSave}
          isSaving={isSaving}
          canSave={canSave}
          includeKana={includeKana}
          includeGrammar={includeGrammar}
        />
      </div>
    </div>
  )
}
