"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, PenTool, Mic2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline()
    tl.from(".hero-title", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
    .from(".hero-desc", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.5")
    .from(".hero-btns", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.3")

    // Feature Sections Scroll Animations
    const sections = gsap.utils.toArray<HTMLElement>(".feature-section")
    sections.forEach((section) => {
      gsap.from(section.querySelectorAll(".animate-item"), {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      })
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 border-b border-primary/10">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-title text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-none">
            EASY <span className="text-primary italic">JAPANESE</span>
          </h1>
          <p className="hero-desc text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-serif italic">
            "Hành trình vạn dặm bắt đầu từ một bước chân."
          </p>
          <div className="hero-btns flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/alphabet"
              className="inline-flex h-14 items-center justify-center border-2 border-primary px-10 text-lg font-bold transition-all hover:bg-primary hover:text-primary-foreground"
            >
              BẮT ĐẦU NGAY
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <Link
              href="/notes"
              className="inline-flex h-14 items-center justify-center border-2 border-foreground px-10 text-lg font-bold transition-all hover:bg-foreground hover:text-background"
            >
              GHI CHÚ HỌC TẬP
            </Link>
          </div>
        </div>
      </section>

      {/* Feature 1: Alphabet */}
      <section className="feature-section py-32 border-b border-muted overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-item">
            <span className="text-primary font-bold tracking-widest uppercase mb-4 block">01 / NỀN TẢNG</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Bảng chữ cái Hiragana & Katakana</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Xây dựng nền tảng vững chắc với các bài học tương tác, âm thanh chuẩn người bản xứ và ví dụ thực tế. Quy trình học tập tinh giản giúp bạn ghi nhớ nhanh hơn.
            </p>
            <Link href="/alphabet" className="inline-flex items-center text-sm font-bold tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
              TÌM HIỂU THÊM
            </Link>
          </div>
          <div className="animate-item relative bg-muted/30 p-12 flex items-center justify-center">
             <BookOpen className="w-40 h-40 text-muted" />
             <span className="absolute top-4 right-4 text-8xl font-black text-foreground/5 pointer-events-none">あ</span>
          </div>
        </div>
      </section>

      {/* Feature 2: Writing */}
      <section className="feature-section py-32 border-b border-muted bg-secondary/20 overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse">
          <div className="animate-item relative bg-muted/30 p-12 flex items-center justify-center md:order-last">
             <PenTool className="w-40 h-40 text-muted" />
             <span className="absolute top-4 left-4 text-8xl font-black text-foreground/5 pointer-events-none">書</span>
          </div>
          <div className="animate-item">
            <span className="text-primary font-bold tracking-widest uppercase mb-4 block">02 / KỸ NĂNG</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Luyện viết chữ Kanji & Kana</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Học cách viết từng nét theo hướng dẫn cụ thể. Công nghệ nhận diện nét viết giúp bạn cải thiện độ chính xác và thẩm mỹ của chữ viết tay.
            </p>
            <Link href="/writing" className="inline-flex items-center text-sm font-bold tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
              BẮT ĐẦU LUYỆN TẬP
            </Link>
          </div>
        </div>
      </section>

      {/* Feature 3: Listening */}
      <section className="feature-section py-32 overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-item">
            <span className="text-primary font-bold tracking-widest uppercase mb-4 block">03 / PHẢN XẠ</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nghe chép chính tả thông minh</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Phương pháp Shadowing và Dictation kết hợp giúp bạn hiểu sâu cấu trúc ngữ pháp và tăng tốc độ xử lý âm thanh trong giao tiếp thực tế.
            </p>
            <Link href="/dictation" className="inline-flex items-center text-sm font-bold tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
              THỬ THÁCH NGAY
            </Link>
          </div>
          <div className="animate-item relative bg-muted/30 p-12 flex items-center justify-center">
             <Mic2 className="w-40 h-40 text-muted" />
             <span className="absolute bottom-4 left-4 text-8xl font-black text-foreground/5 pointer-events-none">聴</span>
          </div>
        </div>
      </section>
    </div>
  )
}
