"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { LoginHeader } from "@/components/login/login-header"
import { LoginBenefits } from "@/components/login/login-benefits"
import { LoginPanel } from "@/components/login/login-panel"

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(gsap.utils.toArray<HTMLElement>(".login-animate"), {
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
            <LoginHeader />
            <LoginBenefits />
            <div className="login-animate border-2 border-border p-6 text-sm text-muted-foreground">
              <p className="font-bold uppercase tracking-widest text-foreground">
                Lưu ý bảo mật
              </p>
              <p className="mt-3">
                Không chia sẻ mật khẩu với bất kỳ ai. Hãy bật ghi nhớ đăng nhập nếu bạn đang sử dụng thiết bị cá nhân.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <LoginPanel />
            <div className="login-animate border-2 border-primary/20 bg-secondary/20 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Thông báo</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Trang đăng nhập này đang ở chế độ UI demo. Mọi hành động chỉ hiển thị thông báo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
