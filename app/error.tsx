"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from(".err-icon", {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
    .from(".err-title", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.4")
    .from(".err-desc", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.2")
    .from(".err-btn", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "elastic.out(1, 0.5)",
    }, "-=0.2")

    // Floating kanji
    gsap.to(".floating-kanji", {
      y: -15,
      rotation: 8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden px-4"
    >
      {/* Decorative background kanji */}
      <div className="floating-kanji absolute top-1/4 left-1/4 text-9xl text-primary/5 font-black select-none pointer-events-none -z-10 blur-sm font-jp">
        故
      </div>
      <div className="floating-kanji absolute bottom-1/4 right-1/4 text-9xl text-primary/5 font-black select-none pointer-events-none -z-10 blur-sm font-jp" style={{ animationDelay: "1.5s" }}>
        障
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-8 z-10">
        {/* Error icon */}
        <div className="err-icon mx-auto w-24 h-24 bg-destructive/10 flex items-center justify-center border-4 border-destructive/20 rotate-3">
          <span className="text-5xl font-black text-destructive select-none">!</span>
        </div>

        {/* Title */}
        <div className="err-title space-y-3">
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-xs font-black tracking-[0.2em] text-destructive bg-destructive/10 px-3 py-1 uppercase">
              故障 (こしょう)
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
            Đã xảy ra lỗi
          </h1>
        </div>

        {/* Description */}
        <div className="err-desc space-y-3">
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Có gì đó không ổn trong hành trình học tập. Đừng lo, hãy thử lại hoặc quay về trang chủ.
          </p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground/50 font-mono tracking-wider">
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={reset}
            className="err-btn inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-primary"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/"
            className="err-btn inline-flex items-center gap-2 group px-6 py-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors font-bold uppercase tracking-wider text-sm"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
