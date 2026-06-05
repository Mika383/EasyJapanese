"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  JLPT_LEVELS,
  styleLabels,
  type JlptLevel,
  type TranslationDirection,
  type TranslationStyle,
} from "@/lib/translate-types"

interface TranslateFormProps {
  mode: "text" | "image"
  direction: TranslationDirection
  textValue: string
  onTextChange: (value: string) => void
  jlptLevel: JlptLevel
  onJlptLevelChange: (level: JlptLevel) => void
  translationStyle: TranslationStyle
  onTranslationStyleChange: (style: TranslationStyle) => void
  includeGrammar: boolean
  onIncludeGrammarChange: (value: boolean) => void
  includeKana: boolean
  onIncludeKanaChange: (value: boolean) => void
  includeKanji: boolean
  onIncludeKanjiChange: (value: boolean) => void
  canUseGrammar: boolean
  onLockedFeature: () => void
  imagePreview?: string | null
  onImageSelect: (file: File | null) => void
  onTranslate: () => void
  isLoading: boolean
}

export function TranslateForm({
  mode,
  direction,
  textValue,
  onTextChange,
  jlptLevel,
  onJlptLevelChange,
  translationStyle,
  onTranslationStyleChange,
  includeGrammar,
  onIncludeGrammarChange,
  includeKana,
  onIncludeKanaChange,
  includeKanji,
  onIncludeKanjiChange,
  canUseGrammar,
  onLockedFeature,
  imagePreview,
  onImageSelect,
  onTranslate,
  isLoading,
}: TranslateFormProps) {
  const isVietnameseToJapanese = direction === "VI_TO_JP"

  return (
    <div className="space-y-6">
      {mode === "text" ? (
        <div className="space-y-3">
          <Label htmlFor="translate-text" className="text-sm font-semibold">
            {isVietnameseToJapanese ? "Nhập văn bản tiếng Việt" : "Nhập văn bản tiếng Nhật"}
          </Label>
          <textarea
            id="translate-text"
            value={textValue}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder={
              isVietnameseToJapanese
                ? "Ví dụ: Hôm nay tôi muốn học tiếng Nhật ở thư viện."
                : "Ví dụ: 日本語の文章を入力してください"
            }
            className="min-h-[160px] w-full rounded-md border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <Label htmlFor="jp-image" className="text-sm font-semibold">
            Tải ảnh tiếng Nhật
          </Label>
          <input
            id="jp-image"
            type="file"
            accept="image/*"
            onChange={(event) => onImageSelect(event.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-4 file:py-2 file:text-sm file:font-semibold"
          />
          {imagePreview ? (
            <div className="overflow-hidden rounded-md border">
              <Image
                src={imagePreview}
                alt="Ảnh đã chọn"
                width={960}
                height={540}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-muted-foreground/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Chưa có ảnh được chọn.
            </div>
          )}
        </div>
      )}

      {isVietnameseToJapanese ? (
        <>
          <Separator />
          <div className="grid gap-5">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Trình độ bản dịch</Label>
              <div className="grid grid-cols-5 gap-2">
                {JLPT_LEVELS.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    size="sm"
                    variant={jlptLevel === level ? "default" : "outline"}
                    onClick={() => onJlptLevelChange(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Kiểu dịch</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["STRUCTURED", "SPOKEN"] as TranslationStyle[]).map((style) => (
                  <Button
                    key={style}
                    type="button"
                    variant={translationStyle === style ? "default" : "outline"}
                    onClick={() => onTranslationStyleChange(style)}
                    className="justify-center"
                  >
                    {styleLabels[style]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label
            className="flex items-center gap-3 text-sm font-medium"
            onClick={() => {
              if (!canUseGrammar) onLockedFeature()
            }}
          >
            <Checkbox
              checked={includeGrammar}
              onCheckedChange={(value) => onIncludeGrammarChange(Boolean(value))}
              disabled={!canUseGrammar}
            />
            <span className={!canUseGrammar ? "text-muted-foreground" : undefined}>
              Giải thích ngữ pháp
            </span>
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <Checkbox
              checked={includeKanji}
              onCheckedChange={(value) => onIncludeKanjiChange(Boolean(value))}
            />
            <span>Giải thích Hán tự</span>
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <Checkbox
              checked={includeKana}
              onCheckedChange={(value) => onIncludeKanaChange(Boolean(value))}
            />
            <span>
              {isVietnameseToJapanese ? "Hiragana cho bản dịch" : "Chú thích Hán tự (Hiragana)"}
            </span>
          </label>
        </div>

        <Button
          type="button"
          onClick={onTranslate}
          disabled={isLoading}
          className="min-w-[160px] font-semibold"
        >
          {isLoading ? "Đang dịch..." : "Dịch ngay"}
        </Button>
      </div>
    </div>
  )
}
