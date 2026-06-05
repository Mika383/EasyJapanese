"use client"

import { useEffect, useRef, useState } from "react"
import { Square, Volume2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface TranslationAudioControlsProps {
  text: string
}

export function TranslationAudioControls({ text }: TranslationAudioControlsProps) {
  const [rate, setRate] = useState(0.9)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleSpeak = () => {
    if (!text.trim()) {
      toast.warning("Chưa có bản dịch tiếng Nhật để đọc.")
      return
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Trình duyệt hiện không hỗ trợ đọc văn bản.")
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP"
    utterance.rate = rate
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => {
      setIsSpeaking(false)
      toast.error("Không thể đọc bản dịch.")
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
    toast.success("Đang đọc bản dịch tiếng Nhật.")
  }

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsSpeaking(false)
    toast.info("Đã dừng đọc bản dịch.")
  }

  return (
    <div className="rounded-md border border-foreground/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Đọc bản dịch tiếng Nhật</p>
          <p className="text-xs text-muted-foreground">Điều chỉnh tốc độ trước khi bấm đọc.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" onClick={handleSpeak} disabled={isSpeaking}>
            <Volume2 className="h-4 w-4" />
            Đọc
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleStop} disabled={!isSpeaking}>
            <Square className="h-4 w-4" />
            Dừng
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="translation-audio-rate" className="text-xs">
            Tốc độ
          </Label>
          <span className="text-xs font-bold text-muted-foreground">{rate.toFixed(1)}x</span>
        </div>
        <input
          id="translation-audio-rate"
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          className="w-full accent-primary"
          aria-label="Tốc độ đọc bản dịch"
        />
      </div>
    </div>
  )
}
