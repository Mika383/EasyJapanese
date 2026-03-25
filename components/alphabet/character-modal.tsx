"use client"

import { X, Volume2 } from "lucide-react"
import { useEffect, useRef } from "react"
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

  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

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

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 bg-background/95 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl bg-background border-4 sm:border-8 border-foreground p-6 sm:p-10 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.1)] sm:shadow-[32px_32px_0px_0px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 max-h-[95vh] overflow-y-auto overflow-x-hidden"
      >
        {/* Adjusted Close Button - Inside for better stability */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-110 p-2 sm:p-3 bg-foreground text-background hover:bg-primary transition-all rotate-90 hover:rotate-0 border-2 border-background"
          aria-label="Đóng"
        >
          <X className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 items-center lg:items-start text-center lg:text-left font-sans mt-4 sm:mt-0">
          
          {/* Main Visual - Character Display */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center bg-secondary/20 relative group border-2 sm:border-4 border-dashed border-foreground/10 mb-6 sm:mb-8 overflow-hidden">
              <span className={cn(
                "font-jp font-bold leading-none select-none text-foreground transition-transform group-hover:scale-105 duration-500 drop-shadow-md whitespace-nowrap",
                char.length > 1 
                  ? "text-[6rem] sm:text-[8rem] md:text-[10rem]" // Fit for Youon (kyo, sha, etc.)
                  : "text-[10rem] sm:text-[14rem] md:text-[18rem]" // Adjusted for single chars
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
            <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-muted-foreground">Chi tiết ký tự</h2>
              <button 
                onClick={playAudio}
                className="w-full sm:w-auto group flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-black border-2 border-primary hover:bg-background hover:text-primary transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
              >
                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-120 transition-transform" />
                PHÁT ÂM
              </button>
            </header>

            {/* Content: Examples */}
            <div className="flex flex-col gap-6 sm:gap-8 overflow-hidden">
               <h3 className="text-[11px] sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                  <div className="w-6 sm:w-8 h-px bg-foreground" />
                  Từ vựng ví dụ
               </h3>

               {examples && examples.length > 0 ? (
                 <div className="grid gap-4 sm:gap-6 text-left">
                   {examples.map((ex, i) => (
                     <div key={i} className="flex flex-col md:flex-row md:items-end justify-between border-b sm:border-b-2 border-foreground/5 pb-3 sm:pb-4 group hover:border-primary/30 transition-colors gap-2 md:gap-4">
                        <div className="flex flex-col gap-0 sm:gap-1 shrink-0">
                          <span className="font-jp text-3xl sm:text-4xl font-bold group-hover:text-primary transition-colors whitespace-nowrap">{ex.word}</span>
                          <span className="text-[9px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">{ex.romaji}</span>
                        </div>
                        <span className="text-lg sm:text-xl font-serif italic text-foreground/80 md:text-right md:grow">
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
      </div>
    </div>
  )
}
