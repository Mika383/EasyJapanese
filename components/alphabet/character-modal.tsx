"use client"

import { X, Volume2 } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface Example {
  word: string;
  romaji: string;
  meaning: string;
}

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  char: string;
  romaji: string;
  type: string;
  examples?: Example[];
}

export function CharacterModal({ isOpen, onClose, char, romaji, type, examples }: CharacterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isCompact, setIsCompact] = useState(false)
  const [mounted] = useState(() => typeof window !== "undefined")

  useLayoutEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const updateScale = () => {
      if (!modalRef.current) return
      const padding = 32
      const viewportWidth = window.innerWidth - padding
      const viewportHeight = window.innerHeight - padding
      const baseWidth = modalRef.current.offsetWidth
      const baseHeight = modalRef.current.offsetHeight
      if (baseWidth === 0 || baseHeight === 0) return
      const compactByViewport = window.innerWidth < 820 || window.innerHeight < 700
      const nextScale = Math.min(viewportWidth / baseWidth, viewportHeight / baseHeight, 1)
      setIsCompact(compactByViewport)
      setScale(compactByViewport ? 1 : Number.isFinite(nextScale) ? nextScale : 1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleEsc)
    window.addEventListener("resize", updateScale)
    window.visualViewport?.addEventListener("resize", updateScale)
    const rafId = window.requestAnimationFrame(() => {
      updateScale()
      window.requestAnimationFrame(updateScale)
    })

    return () => {
      window.removeEventListener("keydown", handleEsc)
      window.removeEventListener("resize", updateScale)
      window.visualViewport?.removeEventListener("resize", updateScale)
      window.cancelAnimationFrame(rafId)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(char)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-background/95 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={handleBackdropClick}
    >
      {/* 
        On mobile: use CSS scale to shrink the entire modal proportionally 
        to fit the screen width, keeping the exact same layout as desktop.
      */}
      <div 
        ref={modalRef}
        style={{ transform: `scale(${scale})` }}
        className="relative w-full max-w-3xl bg-background border-2 sm:border-8 border-foreground p-4 sm:p-10 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] sm:shadow-[32px_32px_0px_0px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 max-h-[95vh] overflow-y-auto overflow-x-hidden origin-center"
      >
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-110 flex flex-col gap-2">
          <button 
            onClick={onClose}
            className="p-2 sm:p-3 bg-foreground text-background hover:bg-primary transition-all rotate-90 hover:rotate-0 border-2 border-background"
            aria-label="Đóng"
          >
            <X className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={playAudio}
            className="flex items-center justify-center p-2 sm:p-3 bg-primary text-primary-foreground hover:bg-background hover:text-primary transition-all border-2 border-primary"
            aria-label="Phát âm"
          >
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {isCompact ? (
          <div className="flex flex-col items-center gap-5 text-center font-sans mt-2">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center bg-secondary/20 relative group border-2 sm:border-4 border-dashed border-foreground/10 mb-5 sm:mb-8 overflow-hidden">
                <span className={cn(
                  "font-jp font-bold leading-none select-none text-foreground transition-transform group-hover:scale-105 duration-500 drop-shadow-md whitespace-nowrap",
                  char.length > 1 
                    ? "text-[5rem] sm:text-[8rem] md:text-[10rem]"
                    : "text-[8rem] sm:text-[14rem] md:text-[18rem]"
                )}>
                  {char}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-primary">{romaji}</span>
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-foreground text-background text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em]">{type}</span>
              </div>
            </div>

            <div className="w-full text-left">
              <h3 className="text-[11px] sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                <div className="w-6 sm:w-8 h-px bg-foreground" />
                Từ vựng ví dụ
              </h3>

              {examples && examples.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:gap-6">
                  {examples.map((ex, i) => (
                    <div key={i} className="flex min-w-0 items-end justify-between border-b sm:border-b-2 border-foreground/5 pb-3 sm:pb-4 gap-3">
                      <div className="flex flex-col gap-0 sm:gap-1">
                        <span className="font-jp text-3xl sm:text-4xl font-bold">{ex.word}</span>
                        <span className="text-[9px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">{ex.romaji}</span>
                      </div>
                      <span className="text-lg sm:text-xl font-serif italic text-foreground/80 wrap-break-word text-right">
                        {ex.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted-foreground font-serif italic text-sm">
                  Đang cập nhật thêm từ vựng cho ký tự này...
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-8 sm:gap-12 md:gap-16 items-start text-left font-sans mt-2 sm:mt-0">
            {/* Main Visual - Character Display */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center bg-secondary/20 relative group border-2 sm:border-4 border-dashed border-foreground/10 mb-6 sm:mb-8 overflow-hidden">
                <span className={cn(
                  "font-jp font-bold leading-none select-none text-foreground transition-transform group-hover:scale-105 duration-500 drop-shadow-md whitespace-nowrap",
                  char.length > 1 
                    ? "text-[6rem] sm:text-[8rem] md:text-[10rem]"
                    : "text-[10rem] sm:text-[14rem] md:text-[18rem]"
                )}>
                  {char}
                </span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-primary">{romaji}</span>
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-foreground text-background text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em]">{type}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full self-stretch min-w-0">
              <header className="mb-6 sm:mb-8 flex flex-row justify-between items-center gap-4 sm:gap-6">
                <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-muted-foreground">
                  Chi tiết ký tự
                </h2>
                <span />
              </header>

              {/* Content: Examples */}
              <div className="flex flex-col gap-6 sm:gap-8">
                 <h3 className="text-[11px] sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                    <div className="w-6 sm:w-8 h-px bg-foreground" />
                    Từ vựng ví dụ
                 </h3>

                 {examples && examples.length > 0 ? (
                   <div className="grid gap-4 sm:gap-6 text-left">
                   {examples.map((ex, i) => (
                     <div key={i} className="flex min-w-0 items-end justify-between border-b sm:border-b-2 border-foreground/5 pb-3 sm:pb-4 group hover:border-primary/30 transition-colors gap-3">
                        <div className="flex flex-col gap-0 sm:gap-1 shrink-0">
                          <span className="font-jp text-3xl sm:text-4xl font-bold group-hover:text-primary transition-colors whitespace-nowrap">{ex.word}</span>
                          <span className="text-[9px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">{ex.romaji}</span>
                        </div>
                        <span className="text-lg sm:text-xl font-serif italic text-foreground/80 text-right md:grow wrap-break-word">
                          {ex.meaning}
                        </span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-muted-foreground font-serif italic text-sm">Đang cập nhật thêm từ vựng cho ký tự này...</p>
               )}
            </div>

              <div className="mt-8 sm:mt-auto pt-6 sm:pt-10 border-t sm:border-t-2 border-foreground/5 text-[10px] sm:text-xs text-muted-foreground italic font-serif leading-relaxed">
                &quot;Mỗi ký tự là một cánh cửa mở ra khám phá mới. Hãy kiên trì luyện tập mỗi ngày.&quot;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
