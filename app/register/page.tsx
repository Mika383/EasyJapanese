"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { RegisterHeader } from "@/components/register/register-header"
import { RegisterBenefits } from "@/components/register/register-benefits"
import { RegisterPanel } from "@/components/register/register-panel"

export default function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(gsap.utils.toArray<HTMLElement>(".register-animate"), {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="min-h-screen">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="space-y-8">
            <RegisterHeader />
            <RegisterBenefits />
            <div className="register-animate border-2 border-border p-6 text-sm text-muted-foreground">
              <p className="font-bold uppercase tracking-widest text-foreground">
                Quyền riêng tư
              </p>
              <p className="mt-3">
                Chúng tôi chỉ lưu thông tin cần thiết để phục vụ quá trình học tập.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <RegisterPanel />
            <div className="register-animate border-2 border-primary/20 bg-secondary/20 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Thông báo</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Trang đăng ký đang ở chế độ UI demo. Mọi hành động chỉ hiển thị thông báo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
