"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Trash2 } from "lucide-react"
import { TranslateTabs, type TranslateMode } from "@/components/translate/translate-tabs"
import { TranslateForm } from "@/components/translate/translate-form"
import { TranslateResult } from "@/components/translate/translate-result"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import type { TranslateResult as TranslateResultType } from "@/lib/gemini"

const MAX_IMAGE_SIZE_MB = 5

type TranslationHistoryItem = {
  id: string
  sourceText: string
  translationText: string
  targetLang: "JA" | "VI"
  createdAt: string
}

type TranslationDetail = TranslateResultType & {
  id: string
  createdAt: string
  grammarPoints?: TranslateResultType["grammarPoints"]
  notes?: string[]
}

type UsageInfo = {
  saved: {
    count: number
    limit: number
  }
  grammar: {
    used: number
    limit: number | null
    remaining: number | null
    periodStart?: string
    periodEnd?: string
  }
}

export function TranslatePage() {
  const { data: session } = useSession()
  const isAuthenticated = Boolean(session?.user?.id)
  const [mode, setMode] = useState<TranslateMode>("text")
  const [direction, setDirection] = useState<"JA_VI" | "VI_JA">("JA_VI")
  const [textValue, setTextValue] = useState("")
  const [includeGrammar, setIncludeGrammar] = useState(false)
  const [includeKana, setIncludeKana] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagePayload, setImagePayload] = useState<{ data: string; mimeType: string } | null>(null)
  const [result, setResult] = useState<TranslateResultType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [selectedHistory, setSelectedHistory] = useState<TranslationDetail | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)

  const sourceLang = direction === "JA_VI" ? "JA" : "VI"
  const targetLang = direction === "JA_VI" ? "VI" : "JA"

  const canSave = useMemo(() => Boolean(session?.user?.id && result), [session?.user?.id, result])
  const canUseGrammar = useMemo(() => {
    if (!isAuthenticated) return false
    if (!usage || usage.grammar.limit == null) return true
    return (usage.grammar.remaining ?? 0) > 0
  }, [isAuthenticated, usage])

  const resetResultState = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated && mode === "image") {
      setMode("text")
      toast.info("Dịch ảnh chỉ dành cho thành viên đã đăng nhập.")
    }
    if (sourceLang === "VI" && mode === "image") {
      setMode("text")
      toast.info("Dịch ảnh chỉ hỗ trợ tiếng Nhật.")
    }
  }, [isAuthenticated, mode, sourceLang])

  useEffect(() => {
    resetResultState()
    setMode("text")
    setImagePreview(null)
    setImagePayload(null)
  }, [direction, resetResultState])

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setHistory([])
      return
    }
    setIsHistoryLoading(true)
    setHistoryError(null)
    try {
      const response = await fetch("/api/translate/history")
      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || "Không thể tải lịch sử dịch."
        setHistoryError(message)
        return
      }
      setHistory(data.data ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      setHistoryError(message)
    } finally {
      setIsHistoryLoading(false)
    }
  }, [isAuthenticated])

  const fetchUsage = useCallback(async () => {
    if (!isAuthenticated) {
      setUsage(null)
      return
    }
    setUsageLoading(true)
    try {
      const response = await fetch("/api/translate/usage")
      const data = await response.json()
      if (response.ok) {
        setUsage(data.data ?? null)
      }
    } finally {
      setUsageLoading(false)
    }
  }, [isAuthenticated])

  const handleDeleteHistory = useCallback(
    async (id: string) => {
      const toastId = `history-delete-${id}`
      toast.loading("Đang xoá bản dịch...", { id: toastId })
      try {
        const response = await fetch(`/api/translate/history/${id}`, {
          method: "DELETE",
        })
        const data = await response.json()
        if (!response.ok) {
          const message = data?.error?.message || "Không thể xoá bản dịch."
          toast.error(message, { id: toastId })
          return
        }
        toast.success("Đã xoá bản dịch.", { id: toastId })
        fetchHistory()
        fetchUsage()
        if (selectedHistory && (selectedHistory as { id?: string }).id === id) {
          setSelectedHistory(null)
          setIsDetailOpen(false)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
        toast.error(message, { id: toastId })
      }
    },
    [fetchHistory, fetchUsage, selectedHistory]
  )

  const handleViewDetail = useCallback(async (id: string) => {
    setDetailLoading(true)
    setIsDetailOpen(true)
    try {
      const response = await fetch(`/api/translate/history/${id}`)
      const data = await response.json()
      if (!response.ok) {
        const message = data?.error?.message || "Không thể tải chi tiết."
        toast.error(message)
        return
      }
      setSelectedHistory(data.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      toast.error(message)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
    fetchUsage()
  }, [fetchHistory, fetchUsage])

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
      if (!isAuthenticated && (mode === "image" || includeGrammar)) {
        const message = "Tính năng dịch ảnh và giải thích ngữ pháp chỉ dành cho thành viên."
        setError(message)
        toast.error(message, { id: toastId })
        setIsLoading(false)
        return
      }
      if (includeGrammar && !canUseGrammar) {
        const message = "Bạn đã dùng hết lượt giải thích ngữ pháp hôm nay."
        setError(message)
        toast.error(message, { id: toastId })
        setIsLoading(false)
        return
      }
      const payload =
        mode === "text"
          ? { text: textValue, includeGrammar, includeKana, sourceLang, targetLang }
          : { image: imagePayload, includeGrammar, includeKana, sourceLang, targetLang }

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
      if (includeGrammar && isAuthenticated) {
        fetchUsage()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      setError(message)
      toast.error(message, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }, [
    canUseGrammar,
    fetchUsage,
    includeGrammar,
    includeKana,
    imagePayload,
    isAuthenticated,
    mode,
    resetResultState,
    sourceLang,
    targetLang,
    textValue,
  ])

  const handleLockedFeature = useCallback(() => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để sử dụng chức năng này.")
      return
    }
    if (sourceLang === "VI") {
      toast.info("Dịch ảnh hiện chỉ hỗ trợ tiếng Nhật.")
      return
    }
    toast.info("Chức năng hiện chưa khả dụng.")
  }, [isAuthenticated, sourceLang])

  const handleLockedSave = useCallback(() => {
    toast.info("Vui lòng đăng nhập để lưu bản dịch.")
  }, [])

  const handleIncludeGrammarChange = useCallback((value: boolean) => {
    if (value && !canUseGrammar) {
      toast.info("Bạn đã dùng hết lượt giải thích ngữ pháp hôm nay.")
      return
    }
    setIncludeGrammar(value)
    toast(value ? "Đã bật giải thích ngữ pháp." : "Đã tắt giải thích ngữ pháp.")
  }, [canUseGrammar])

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
          translationText: result.translationText,
          sourceLang: result.sourceLang,
          targetLang: result.targetLang,
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
      fetchUsage()
      fetchHistory()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
      toast.error(message, { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }, [fetchHistory, fetchUsage, result, session?.user?.id])

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

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={direction === "JA_VI" ? "default" : "outline"}
          className="min-w-[160px] font-semibold"
          onClick={() => setDirection("JA_VI")}
        >
          Nhật → Việt
        </Button>
        <Button
          type="button"
          variant={direction === "VI_JA" ? "default" : "outline"}
          className="min-w-[160px] font-semibold"
          onClick={() => setDirection("VI_JA")}
        >
          Việt → Nhật
        </Button>
      </div>

      <TranslateTabs
        mode={mode}
        onChange={handleModeChange}
        canUseImage={isAuthenticated && sourceLang === "JA"}
        onLockedFeature={handleLockedFeature}
      />
      {!isAuthenticated ? (
        <p className="text-xs text-muted-foreground">
          Dịch ảnh và giải thích ngữ pháp chỉ dành cho thành viên đã đăng nhập.
        </p>
      ) : null}
      {isAuthenticated ? (
        <div className="rounded-md border bg-background px-4 py-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-foreground">
              Bản dịch đã lưu:{" "}
              {usageLoading || !usage ? "..." : `${usage.saved.count}/${usage.saved.limit}`}
            </span>
            <span className="text-muted-foreground">•</span>
            {usageLoading || !usage ? (
              <span>Đang cập nhật lượt ngữ pháp...</span>
            ) : usage.grammar.limit == null ? (
              <span>Lượt ngữ pháp: Không giới hạn</span>
            ) : (
              <span>
                Lượt ngữ pháp còn lại: {usage.grammar.remaining}/{usage.grammar.limit} (reset 12:00 VN)
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-md border bg-background p-6">
          <TranslateForm
            mode={mode}
            sourceLang={sourceLang}
            textValue={textValue}
            onTextChange={setTextValue}
            includeGrammar={includeGrammar}
            onIncludeGrammarChange={handleIncludeGrammarChange}
            includeKana={includeKana}
            onIncludeKanaChange={handleIncludeKanaChange}
            canUseGrammar={canUseGrammar}
            onLockedFeature={handleLockedFeature}
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
          onLockedSave={handleLockedSave}
          includeKana={includeKana}
          includeGrammar={includeGrammar}
        />
      </div>

      {isAuthenticated ? (
        <div className="rounded-md border bg-background p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Bản dịch đã lưu</h2>
            <button
              type="button"
              onClick={fetchHistory}
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Làm mới
            </button>
          </div>

          {isHistoryLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải danh sách...</p>
          ) : historyError ? (
            <p className="text-sm text-destructive">{historyError}</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có bản dịch nào được lưu.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-foreground/10 p-4 space-y-3"
                  >
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </p>
                    <div>
                      <p className="text-sm font-semibold">
                        {item.targetLang === "JA" ? "Việt" : "Nhật"}: {item.sourceText}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.targetLang === "JA" ? "Nhật" : "Việt"}: {item.translationText}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(item.id)}
                        className="rounded-md border border-primary bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary hover:bg-primary/20"
                      >
                        Xem chi tiết
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            className="ml-auto inline-flex items-center justify-center text-destructive hover:text-destructive/80"
                            aria-label="Xoá bản dịch"
                            title="Xoá bản dịch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xoá bản dịch?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xoá bản dịch này không? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteHistory(item.id)}>
                              Xoá
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-foreground/10 p-4">
                <h3 className="text-sm font-semibold">Chi tiết bản dịch</h3>
                {detailLoading ? (
                  <p className="mt-3 text-sm text-muted-foreground">Đang tải chi tiết...</p>
                ) : !isDetailOpen || !selectedHistory ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chọn một bản dịch để xem chi tiết.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4 text-sm">
                    <div>
                      <p className="font-semibold">Văn bản gốc</p>
                      <p className="mt-1 whitespace-pre-wrap">{selectedHistory.sourceText}</p>
                    </div>
                    {selectedHistory.kanaReading ? (
                      <div>
                        <p className="font-semibold">Hiragana cho Hán tự</p>
                        <p className="mt-1 whitespace-pre-wrap">{selectedHistory.kanaReading}</p>
                      </div>
                    ) : null}
                    {selectedHistory.romaji ? (
                      <div>
                        <p className="font-semibold">Romaji</p>
                        <p className="mt-1 whitespace-pre-wrap">{selectedHistory.romaji}</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="font-semibold">
                        {selectedHistory.targetLang === "JA" ? "Bản dịch tiếng Nhật" : "Bản dịch tiếng Việt"}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{selectedHistory.translationText}</p>
                    </div>
                    {selectedHistory.ocrText ? (
                      <div>
                        <p className="font-semibold">Văn bản OCR từ ảnh</p>
                        <p className="mt-1 whitespace-pre-wrap">{selectedHistory.ocrText}</p>
                      </div>
                    ) : null}
                    {selectedHistory.grammarPoints && selectedHistory.grammarPoints.length > 0 ? (
                      <div>
                        <p className="font-semibold">Giải thích ngữ pháp</p>
                        <div className="mt-3 space-y-4">
                          {selectedHistory.grammarPoints.map((point, index) => (
                            <div key={`${point.title}-${index}`} className="rounded-md border px-3 py-2">
                              <p className="font-semibold">{point.title}</p>
                              <p className="mt-1 text-muted-foreground">{point.explanation}</p>
                              {point.examples.length > 0 ? (
                                <div className="mt-2 space-y-2 text-muted-foreground">
                                  {point.examples.map((example, exampleIndex) => (
                                    <div key={`${point.title}-${exampleIndex}`}>
                                      <p>{example.jp}</p>
                                      <p>{example.vi}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {selectedHistory.notes && selectedHistory.notes.length > 0 ? (
                      <div>
                        <p className="font-semibold">Ghi chú thêm</p>
                        <div className="mt-2 space-y-1 text-muted-foreground">
                          {selectedHistory.notes.map((note, index) => (
                            <p key={`${note}-${index}`}>{note}</p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
