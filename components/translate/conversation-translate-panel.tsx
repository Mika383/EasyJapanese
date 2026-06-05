"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  JLPT_LEVELS,
  directionLabels,
  styleLabels,
  targetLanguageLabels,
  type ConversationLineInput,
  type ConversationParticipant,
  type ConversationTranslationResult,
  type JlptLevel,
  type TranslationDirection,
  type TranslationStyle,
} from "@/lib/translate-types"

const alphabetName = (index: number) => String.fromCharCode(65 + index)

type ConversationHistoryItem = {
  id: string
  title?: string | null
  direction: TranslationDirection
  jlptLevel?: JlptLevel | null
  translationStyle?: TranslationStyle | null
  createdAt: string
}

interface ConversationTranslatePanelProps {
  direction: TranslationDirection
  isAuthenticated: boolean
}

export function ConversationTranslatePanel({ direction, isAuthenticated }: ConversationTranslatePanelProps) {
  const [participantCount, setParticipantCount] = useState(2)
  const [maxParticipants, setMaxParticipants] = useState(5)
  const [participantNames, setParticipantNames] = useState<string[]>(["", ""])
  const [lines, setLines] = useState<ConversationLineInput[]>([
    { id: crypto.randomUUID(), speakerId: "p-0", text: "" },
  ])
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>("N5")
  const [translationStyle, setTranslationStyle] = useState<TranslationStyle>("STRUCTURED")
  const [includeGrammar, setIncludeGrammar] = useState(false)
  const [includeKana, setIncludeKana] = useState(true)
  const [includeKanji, setIncludeKanji] = useState(false)
  const [includeContext, setIncludeContext] = useState(true)
  const [result, setResult] = useState<ConversationTranslationResult | null>(null)
  const [history, setHistory] = useState<ConversationHistoryItem[]>([])
  const [isTranslating, startTranslateTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()

  const participants = useMemo<ConversationParticipant[]>(
    () =>
      Array.from({ length: participantCount }, (_, index) => ({
        id: `p-${index}`,
        name: participantNames[index]?.trim() || alphabetName(index),
      })),
    [participantCount, participantNames]
  )

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setHistory([])
      return
    }
    try {
      const response = await fetch("/api/translate/conversation/history")
      const data = await response.json()
      if (response.ok) {
        setHistory(data.data ?? [])
      }
    } catch {
      toast.error("Không thể tải lịch sử hội thoại.")
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/translate/conversation/config")
        const data = await response.json()
        if (response.ok) {
          const nextMax = Math.max(2, Number(data.data?.maxParticipants ?? 5))
          setMaxParticipants(nextMax)
          setParticipantCount((current) => Math.min(current, nextMax))
        }
      } catch {
        toast.error("Không thể tải cấu hình hội thoại.")
      }
    }

    fetchConfig()
  }, [])

  const updateParticipantCount = (count: number) => {
    const next = Math.min(Math.max(count, 2), maxParticipants)
    setParticipantCount(next)
    setParticipantNames((current) => Array.from({ length: next }, (_, index) => current[index] ?? ""))
    setLines((current) =>
      current.map((line) => (Number(line.speakerId.replace("p-", "")) < next ? line : { ...line, speakerId: "p-0" }))
    )
    setResult(null)
    toast.info(`Đã đặt ${next} nhân vật cho hội thoại.`)
  }

  const addLine = () => {
    setLines((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        speakerId: current.at(-1)?.speakerId ?? "p-0",
        text: "",
      },
    ])
  }

  const removeLine = (id: string) => {
    setLines((current) => (current.length === 1 ? current : current.filter((line) => line.id !== id)))
  }

  const handleTranslate = () => {
    if (participantCount < 2) {
      toast.error("Cần ít nhất 2 nhân vật để bắt đầu dịch hội thoại.")
      return
    }

    const validLines = lines.map((line) => ({ ...line, text: line.text.trim() })).filter((line) => line.text)
    if (validLines.length === 0) {
      toast.error("Vui lòng nhập ít nhất một câu thoại.")
      return
    }

    startTranslateTransition(async () => {
      const toastId = "conversation-translate"
      toast.loading("Đang dịch hội thoại...", { id: toastId })
      try {
        const response = await fetch("/api/translate/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            direction,
            participants,
            lines: validLines,
            jlptLevel,
            translationStyle,
            includeGrammar,
            includeKana,
            includeKanji,
            includeContext,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          toast.error(data?.error?.message || "Không thể dịch hội thoại.", { id: toastId })
          return
        }
        setResult(data.data)
        toast.success("Đã dịch hội thoại.", { id: toastId })
      } catch (error) {
        const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
        toast.error(message, { id: toastId })
      }
    })
  }

  const handleSave = () => {
    if (!result) {
      toast.info("Chưa có kết quả hội thoại để lưu.")
      return
    }
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để lưu hội thoại.")
      return
    }

    startSaveTransition(async () => {
      const toastId = "conversation-save"
      toast.loading("Đang lưu hội thoại...", { id: toastId })
      try {
        const response = await fetch("/api/translate/conversation/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: result.wholeSummary.slice(0, 80),
            direction,
            participants,
            lines,
            result,
            jlptLevel,
            translationStyle,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          toast.error(data?.error?.message || "Không thể lưu hội thoại.", { id: toastId })
          return
        }
        toast.success("Đã lưu hội thoại.", { id: toastId })
        fetchHistory()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
        toast.error(message, { id: toastId })
      }
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-6 rounded-md border bg-background p-6">
        <div className="grid gap-3">
          <Label htmlFor="participant-count">Số lượng nhân vật</Label>
          <Input
            id="participant-count"
            type="number"
            min={2}
            max={maxParticipants}
            value={participantCount}
            onChange={(event) => updateParticipantCount(Number(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">Tối đa hiện tại: {maxParticipants}. Bỏ trống tên sẽ tự gán A, B, C.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {participants.map((participant, index) => (
            <div key={participant.id} className="grid gap-2">
              <Label htmlFor={`participant-${participant.id}`}>Nhân vật {alphabetName(index)}</Label>
              <Input
                id={`participant-${participant.id}`}
                value={participantNames[index] ?? ""}
                placeholder={alphabetName(index)}
                onChange={(event) => {
                  const value = event.target.value
                  setParticipantNames((current) => {
                    const next = [...current]
                    next[index] = value
                    return next
                  })
                  setResult(null)
                }}
              />
            </div>
          ))}
        </div>

        {direction === "VI_TO_JP" ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Trình độ bản dịch</Label>
              <div className="grid grid-cols-5 gap-2">
                {JLPT_LEVELS.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    size="sm"
                    variant={jlptLevel === level ? "default" : "outline"}
                    onClick={() => setJlptLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["STRUCTURED", "SPOKEN"] as TranslationStyle[]).map((style) => (
                <Button
                  key={style}
                  type="button"
                  variant={translationStyle === style ? "default" : "outline"}
                  onClick={() => setTranslationStyle(style)}
                >
                  {styleLabels[style]}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-4">
          {[
            { label: "Ngữ pháp", checked: includeGrammar, setter: setIncludeGrammar },
            { label: "Hán tự", checked: includeKanji, setter: setIncludeKanji },
            { label: "Hiragana", checked: includeKana, setter: setIncludeKana },
            { label: "Ngữ cảnh", checked: includeContext, setter: setIncludeContext },
          ].map((option) => (
            <label key={option.label} className="flex items-center gap-3 text-sm font-medium">
              <Checkbox
                checked={option.checked}
                onCheckedChange={option.setter}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-4">
          {lines.map((line, index) => (
            <div key={line.id} className="grid gap-3 border border-foreground/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={`line-${line.id}`}>Câu {index + 1}</Label>
                <button
                  type="button"
                  className="text-destructive disabled:opacity-40"
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length === 1}
                  aria-label="Xoá câu thoại"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <select
                value={line.speakerId}
                onChange={(event) =>
                  setLines((current) =>
                    current.map((item) => (item.id === line.id ? { ...item, speakerId: event.target.value } : item))
                  )
                }
                className="h-11 border-2 border-input bg-background px-3 text-sm font-semibold"
              >
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
              <textarea
                id={`line-${line.id}`}
                value={line.text}
                onChange={(event) =>
                  setLines((current) =>
                    current.map((item) => (item.id === line.id ? { ...item, text: event.target.value } : item))
                  )
                }
                placeholder="Nhập câu thoại..."
                className="min-h-24 border-2 border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-3">
          <Button type="button" variant="outline" onClick={addLine}>
            <Plus className="h-4 w-4" />
            Thêm câu
          </Button>
          <Button type="button" onClick={handleTranslate} disabled={isTranslating}>
            {isTranslating ? "Đang dịch" : "Dịch hội thoại"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-md border bg-background p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Kết quả hội thoại</h2>
              <p className="text-sm text-muted-foreground">{directionLabels[direction]}</p>
            </div>
            <Button type="button" variant="outline" onClick={handleSave} disabled={!result || isSaving}>
              <Save className="h-4 w-4" />
              Lưu
            </Button>
          </div>

          {!result ? (
            <div className="border border-dashed border-muted-foreground/40 p-6 text-sm text-muted-foreground">
              Chưa có kết quả. Nhập hội thoại rồi bấm dịch.
            </div>
          ) : (
            <ConversationResultTable result={result} />
          )}
        </div>

        {isAuthenticated ? (
          <div className="rounded-md border bg-background p-6">
            <h2 className="mb-4 text-lg font-semibold">Hội thoại đã lưu</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có hội thoại nào được lưu.</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="border border-foreground/10 p-3 text-sm">
                    <p className="font-semibold">{item.title || "Hội thoại đã lưu"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {directionLabels[item.direction]} · {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ConversationResultTable({ result }: { result: ConversationTranslationResult }) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="px-3 py-2 text-left">Người nói</th>
              <th className="px-3 py-2 text-left">Câu gốc</th>
              <th className="px-3 py-2 text-left">Bản dịch ({targetLanguageLabels[result.direction]})</th>
              <th className="px-3 py-2 text-left">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.id} className="border-b border-foreground/10 align-top">
                <td className="px-3 py-3 font-semibold">{line.speakerName}</td>
                <td className="px-3 py-3 whitespace-pre-wrap">{line.text}</td>
                <td className="px-3 py-3 whitespace-pre-wrap">{line.translatedText}</td>
                <td className="px-3 py-3 text-muted-foreground">
                  {[...(line.grammarNotes ?? []), ...(line.contextNotes ?? [])].join(" ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-black uppercase tracking-widest">Tóm tắt toàn đoạn</h3>
        <p className="text-sm text-muted-foreground">{result.wholeSummary}</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest">Tóm tắt theo nhân vật</h3>
        {result.participantSummaries.map((summary) => (
          <div key={summary.participantId} className="border border-foreground/10 p-3">
            <p className="font-semibold">{summary.participantName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{summary.summary}</p>
          </div>
        ))}
      </section>

      {result.grammarAnalysis.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-widest">Phân tích ngữ pháp</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.grammarAnalysis.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.contextAnalysis.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-widest">Phân tích ngữ cảnh</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.contextAnalysis.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
