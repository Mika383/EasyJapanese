"use client"

import { useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    logo: "/google.svg",
    classes:
      "bg-[#F8FAFC] text-foreground hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] border-[#CBD5E1] text-[15px] font-semibold normal-case tracking-normal h-12",
  },
  {
    id: "icloud",
    label: "Continue with Apple",
    logo: "/apple.svg",
    classes:
      "bg-[#F8FAFC] text-foreground hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] border-[#CBD5E1] text-[15px] font-semibold normal-case tracking-normal h-12",
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    logo: "/facebook.svg",
    classes:
      "bg-[#F8FAFC] text-foreground hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] border-[#CBD5E1] text-[15px] font-semibold normal-case tracking-normal h-12",
  },
]

export function SocialAuth() {
  const handleSocial = useCallback((provider: string) => {
    toast.loading(`Đang chuyển hướng ${provider}...`, { id: `social-${provider}` })
    setTimeout(() => {
      toast.success(`Sẵn sàng kết nối ${provider}.`, { id: `social-${provider}` })
    }, 700)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Separator />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Hoặc
        </span>
        <Separator />
      </div>
      <div className="grid gap-3">
        {PROVIDERS.map((provider) => {
          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              className={`w-full justify-center gap-3 ${provider.classes}`}
              onClick={() => handleSocial(provider.id)}
            >
              <Image
                src={provider.logo}
                alt={provider.label}
                width={20}
                height={20}
                className="h-5 w-5"
              />
              {provider.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
