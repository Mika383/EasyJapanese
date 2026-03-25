"use client"

import Link from "next/link"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Home } from "lucide-react"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.from(".glitch-text", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.5)",
    })
    .from(".subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4")
    .from(".action-btn", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    }, "-=0.2")

    // Subtle floating element animation
    gsap.to(".floating-bg", {
      y: -20,
      rotation: 5,
      duration: 3,
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
      {/* Decorative background elements */}
      <div className="floating-bg absolute top-1/4 left-1/4 text-9xl text-primary/5 font-black select-none pointer-events-none -z-10 blur-sm">
        迷
      </div>
      <div className="floating-bg absolute bottom-1/4 right-1/4 text-9xl text-primary/5 font-black select-none pointer-events-none -z-10 blur-sm" style={{ animationDelay: "1s" }}>
        路
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-8 z-10">
        <h1 className="glitch-text text-8xl md:text-[12rem] font-black text-primary leading-none tracking-tighter">
          4<span className="text-muted-foreground/30">0</span>4
        </h1>
        
        <div className="subtitle space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold font-jp">
            迷路 (Meiro) - Lạc đường
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Gió đã thổi bay trang giấy này đi mất rồi. Dường như bạn đã đi lạc khỏi con đường học tập.
          </p>
        </div>

        <div className="action-btn pt-8 relative z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-primary"
          >
            <Home className="w-5 h-5" />
            <span>Trở về chánh đạo</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
