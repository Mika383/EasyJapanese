"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

interface PageRevealProps {
  children: React.ReactNode
  delayMs?: number
}

export function PageReveal({ children, delayMs = 220 }: PageRevealProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const routeKey = useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  useEffect(() => {
    if (!containerRef.current) return
    gsap.set(containerRef.current, { autoAlpha: 0, y: 6 })
    const tween = gsap.to(containerRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
      delay: delayMs / 1000,
    })

    return () => {
      tween.kill()
    }
  }, [routeKey, delayMs])

  return <div ref={containerRef}>{children}</div>
}
