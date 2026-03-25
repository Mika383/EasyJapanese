"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

gsap.registerPlugin(useGSAP)

export function RouteLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const charRef = useRef<HTMLSpanElement | null>(null)
  const textRef = useRef<HTMLParagraphElement | null>(null)

  const routeKey = useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  // Initialize hidden
  useGSAP(() => {
    if (!overlayRef.current) return
    gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" })
  }, [])

  // Intercept nav clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) return
      const target = event.target as HTMLElement | null
      const link = target?.closest("a[href]") as HTMLAnchorElement | null
      if (!link) return
      if (link.target && link.target !== "_self") return
      if (link.hasAttribute("download")) return

      const href = link.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return

      const nextUrl = new URL(href, window.location.href)
      if (nextUrl.origin !== window.location.origin) return

      const currentUrl = new URL(window.location.href)
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash
      ) return

      setIsLoading(true)
    }

    const handlePopState = () => setIsLoading(true)
    document.addEventListener("click", handleClick, true)
    window.addEventListener("popstate", handlePopState)
    return () => {
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Animate in/out
  useEffect(() => {
    const overlay = overlayRef.current
    const char = charRef.current
    const text = textRef.current
    if (!overlay) return

    if (isLoading) {
      gsap.set(overlay, { pointerEvents: "auto" })
      gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: "power2.out" })
      if (char) {
        gsap.fromTo(char,
          { scale: 0.6, opacity: 0, rotation: -10 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
        )
        gsap.to(char, { rotation: 5, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.6 })
      }
      if (text) {
        gsap.fromTo(text,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2 }
        )
      }
    } else {
      gsap.killTweensOf([char, text])
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => { gsap.set(overlay, { pointerEvents: "none" }) },
      })
    }
  }, [isLoading])

  // Auto-dismiss when route changes
  useEffect(() => {
    if (!isLoading) return
    const timeout = window.setTimeout(() => setIsLoading(false), 250)
    return () => window.clearTimeout(timeout)
  }, [routeKey, isLoading])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {/* Large decorative kanji — same style as 404/Coming Soon pages */}
      <span
        ref={charRef}
        className="text-[8rem] md:text-[12rem] font-black text-primary leading-none select-none"
        style={{ fontFamily: "var(--font-jp)" }}
        aria-hidden="true"
      >
        読
      </span>

      {/* Label — all-caps tracked text consistent with the design system */}
      <p
        ref={textRef}
        className="mt-6 text-xs font-black uppercase tracking-[0.4em] text-muted-foreground"
      >
        Đang chuyển trang...
      </p>
    </div>
  )
}
