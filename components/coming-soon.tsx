"use client"

import Link from "next/link"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowLeft, Construction } from "lucide-react"

interface ComingSoonProps {
  title: string;
  description?: string;
  jpTitle?: string;
}

export function ComingSoon({ 
  title, 
  description = "Tính năng này đang được rèn giũa và sẽ sớm ra mắt.",
  jpTitle = "準備中"
}: ComingSoonProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.from(".cs-icon", {
      scale: 0,
      rotation: -45,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from(".cs-title", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4")
    .from(".cs-desc", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2")
    .from(".cs-btn", {
      opacity: 0,
      y: 10,
      duration: 0.4
    })

    // Continuous gear animation
    gsap.to(".cs-icon svg", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear"
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full mx-auto space-y-8 relative">
        <div className="cs-icon mx-auto w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 rotate-3">
          <Construction className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="cs-title">
            <span className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-2 block">
              {jpTitle} (Junbichū)
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-foreground">
              {title}
            </h1>
          </div>
          
          <p className="cs-desc text-muted-foreground text-lg">
            {description}
          </p>
        </div>

        <div className="cs-btn pt-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group px-6 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors font-bold uppercase tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Abstract background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full -z-10 rounded-blob pointer-events-none" />
      </div>
    </div>
  )
}
