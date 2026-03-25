"use client"

import { useState, useRef } from "react"
import { BASIC_CHARS, DAKUTEN_CHARS, YOUON_CHARS, AlphabetChar } from "@/lib/alphabet-data"
import { CharacterCard } from "@/components/alphabet/character-card"
import { CharacterModal } from "@/components/alphabet/character-modal"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export default function AlphabetPage() {
  const [type, setType] = useState<"hiragana" | "katakana">("hiragana")
  const [selectedChar, setSelectedChar] = useState<AlphabetChar | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll(".char-card")
    if (!cards) return

    gsap.killTweensOf(cards)
    gsap.set(cards, { opacity: 0, y: 20, scale: 0.95 })
    
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: {
        amount: 0.8,
        grid: "auto",
        from: "start",
      },
      ease: "back.out(1.5)",
    })
  }, { dependencies: [type], scope: containerRef })

  return (
    <div className="container mx-auto px-4 py-10 md:py-20 min-h-screen" ref={containerRef}>
      <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black mb-6 md:mb-8 uppercase text-primary font-jp leading-none">
          {type}
        </h1>
        <p className="text-base md:text-xl text-muted-foreground font-serif italic mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed tracking-normal">
          &quot;Ngôn ngữ không chỉ là phương tiện giao tiếp, mà là lăng kính để nhìn thế giới theo một cách khác.&quot;
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
          <button
            onClick={() => setType("hiragana")}
            className={`w-full sm:w-auto px-8 md:px-16 py-3 md:py-4 text-xs md:text-sm font-black border-2 md:border-4 transition-all tracking-[0.2em] md:tracking-[0.3em] ${
              type === "hiragana" 
                ? "bg-primary border-primary text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]" 
                : "border-foreground/10 hover:border-primary hover:text-primary"
            }`}
          >
            HIRAGANA
          </button>
          <button
            onClick={() => setType("katakana")}
            className={`w-full sm:w-auto px-8 md:px-16 py-3 md:py-4 text-xs md:text-sm font-black border-2 md:border-4 transition-all tracking-[0.2em] md:tracking-[0.3em] ${
              type === "katakana" 
                ? "bg-primary border-primary text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]" 
                : "border-foreground/10 hover:border-primary hover:text-primary"
            }`}
          >
            KATAKANA
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex flex-col xl:flex-row gap-12 md:gap-16 items-start mb-24 md:mb-32">
        
        {/* Left: Basic Characters */}
        <div className="w-full xl:w-3/5">
          <div className="flex justify-between items-end mb-6 md:mb-8 border-b-2 md:border-b-4 border-foreground pb-4">
             <h2 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-foreground">Ký tự cơ bản</h2>
             <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gojūon</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 border-t border-l border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
            {BASIC_CHARS.map((item, idx) => (
              <CharacterCard
                key={`basic-${idx}-${type}`}
                char={type === "hiragana" ? item.hiragana : item.katakana}
                romaji={item.romaji}
                className="char-card border-r border-b border-foreground"
                onClick={() => item.hiragana && setSelectedChar(item)}
              />
            ))}
          </div>
        </div>

        {/* Right: Dakuten & Youon */}
        <div className="w-full xl:w-2/5 flex flex-col gap-12 md:gap-16">
          {/* Dakuten */}
          <div>
            <div className="flex justify-between items-end mb-6 md:mb-8 border-b-2 md:border-b-4 border-foreground pb-4">
               <h2 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-foreground">Biến âm</h2>
               <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dakuten</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 border-t border-l border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
              {DAKUTEN_CHARS.map((item, idx) => (
                <CharacterCard
                  key={`dakuten-${idx}-${type}`}
                  char={type === "hiragana" ? item.hiragana : item.katakana}
                  romaji={item.romaji}
                  className="char-card border-r border-b border-foreground"
                  onClick={() => item.hiragana && setSelectedChar(item)}
                />
              ))}
            </div>
          </div>

          {/* Youon */}
          <div>
            <div className="flex justify-between items-end mb-6 md:mb-8 border-b-2 md:border-b-4 border-foreground pb-4">
               <h2 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-foreground">Âm ghép</h2>
               <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Yōon</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
              {YOUON_CHARS.map((item, idx) => (
                <CharacterCard
                  key={`youon-${idx}-${type}`}
                  char={type === "hiragana" ? item.hiragana : item.katakana}
                  romaji={item.romaji}
                  className="char-card border-r border-b border-foreground"
                  onClick={() => item.hiragana && setSelectedChar(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="p-10 md:p-20 border-2 md:border-4 border-primary/20 bg-primary/3 text-center max-w-5xl mx-auto mb-24 md:mb-32">
        <h2 className="text-[10px] md:text-xs font-black mb-6 md:mb-8 uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary">Zen Philosophy</h2>
        <p className="text-foreground leading-relaxed font-serif text-xl md:text-3xl italic max-w-3xl mx-auto">
          &quot;Học là một quá trình làm đầy tâm hồn, không phải là đổ đầy một cái thùng rỗng.&quot;
        </p>
      </section>

      {/* Detail Modal */}
      {selectedChar && (
        <CharacterModal
          isOpen={!!selectedChar}
          onClose={() => setSelectedChar(null)}
          char={type === "hiragana" ? selectedChar.hiragana : selectedChar.katakana}
          romaji={selectedChar.romaji}
          type={selectedChar.type}
          examples={selectedChar.examples}
        />
      )}
    </div>
  )
}
