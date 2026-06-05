"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LoadingIndicator } from "@/components/loading/loading-indicator"
import { TranslationAudioControls } from "@/components/translate/translation-audio-controls"
import { sourceLanguageLabels, targetLanguageLabels } from "@/lib/translate-types"
import type { TranslateResult } from "@/lib/gemini"

interface TranslateResultProps {
  result: TranslateResult | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  canSave: boolean
  onSave: () => void
  onLockedSave: () => void
  includeKana: boolean
  includeKanji: boolean
  includeGrammar: boolean
}

export function TranslateResult({
  result,
  isLoading,
  isSaving,
  error,
  canSave,
  onSave,
  onLockedSave,
  includeKana,
  includeKanji,
  includeGrammar,
}: TranslateResultProps) {
  const resultRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!result || !resultRef.current) return
    gsap.fromTo(
      resultRef.current,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }
    )
  }, [result])

  if (isLoading) {
    return (
      <div className="rounded-md border border-dashed border-muted-foreground/40 px-6 py-8">
        <LoadingIndicator label="Đang xử lý bản dịch..." size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-background px-6 py-6 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="rounded-md border border-dashed border-muted-foreground/40 px-6 py-8 text-sm text-muted-foreground">
        Chưa có bản dịch. Hãy nhập nội dung và bấm “Dịch ngay”.
      </div>
    )
  }

  const sourceLabel = sourceLanguageLabels[result.direction]
  const targetLabel = targetLanguageLabels[result.direction]

  return (
    <div ref={resultRef} className="rounded-md border bg-background p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Kết quả dịch</h3>
          <p className="text-sm text-muted-foreground">
            {sourceLabel} sang {targetLabel}
            {result.jlptLevel ? ` · ${result.jlptLevel}` : ""}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!canSave) {
              onLockedSave()
              return
            }
            onSave()
          }}
          aria-disabled={!canSave || isSaving}
          className={`min-w-[140px] font-semibold ${
            !canSave || isSaving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Đang lưu..." : "Lưu bản dịch"}
        </Button>
      </div>

      <Separator className="my-5" />

      <div className="space-y-4 text-sm">
        <div>
          <p className="font-semibold">Văn bản gốc ({sourceLabel})</p>
          <p className="mt-1 whitespace-pre-wrap">{result.sourceText}</p>
        </div>

        <div>
          <p className="font-semibold">Bản dịch ({targetLabel})</p>
          <p className="mt-1 whitespace-pre-wrap">{result.translationVi}</p>
        </div>

        {result.direction === "VI_TO_JP" ? (
          <TranslationAudioControls text={result.translationVi} />
        ) : null}

        {includeKana ? (
          <div>
            <p className="font-semibold">Hiragana</p>
            <p className="mt-1 whitespace-pre-wrap">
              {result.kanaReading || "Chưa có dữ liệu."}
            </p>
          </div>
        ) : null}

        {result.romaji ? (
          <div>
            <p className="font-semibold">Romaji</p>
            <p className="mt-1 whitespace-pre-wrap">{result.romaji}</p>
          </div>
        ) : null}

        {result.ocrText ? (
          <div>
            <p className="font-semibold">Văn bản OCR từ ảnh</p>
            <p className="mt-1 whitespace-pre-wrap">{result.ocrText}</p>
          </div>
        ) : null}

        {includeKanji ? (
          <div>
            <p className="font-semibold">Giải thích Hán tự</p>
            {result.kanjiExplanations.length === 0 ? (
              <p className="mt-1 text-muted-foreground">Không có Hán tự cần giải thích.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {result.kanjiExplanations.map((item, index) => (
                  <div key={`${item.kanji}-${index}`} className="rounded-md border px-4 py-3">
                    <p className="font-semibold">
                      {item.kanji} · {item.reading}
                    </p>
                    <p className="mt-1 text-muted-foreground">{item.meaning}</p>
                    <p className="mt-1 text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {includeGrammar ? (
          <div>
            <p className="font-semibold">Giải thích ngữ pháp</p>
            {result.grammarPoints.length === 0 ? (
              <p className="mt-1 text-muted-foreground">Không có phân tích ngữ pháp.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {result.grammarPoints.map((point, index) => (
                  <div key={`${point.title}-${index}`} className="rounded-md border px-4 py-3">
                    <p className="font-semibold">{point.title}</p>
                    <p className="mt-1 text-muted-foreground">{point.explanation}</p>
                    {point.examples.length > 0 ? (
                      <div className="mt-3 space-y-2 text-muted-foreground">
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
            )}
          </div>
        ) : null}

        {result.notes && result.notes.length > 0 ? (
          <div>
            <p className="font-semibold">Ghi chú thêm</p>
            <div className="mt-2 space-y-1 text-muted-foreground">
              {result.notes.map((note, index) => (
                <p key={`${note}-${index}`}>{note}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
