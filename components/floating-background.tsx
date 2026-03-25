"use client"

import { useEffect, useRef } from "react"

const CHARACTERS = "あいうえおかきくけこサシスセソタチツテト漢字日本語学習学生先生学校辞書読書道心無風流".split("")

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  alpha: number;
  rotation: number;
  vRotation: number;
}

export function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Setup dimensions to match window viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Initialize particles
    const particleCount = Math.floor(window.innerWidth / 40) // Responsive amount Customizing amount
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5, // Slow random velocity
        vy: (Math.random() - 0.5) * 1.5, 
        char: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
        size: Math.random() * 20 + 20, // 20px - 40px
        alpha: Math.random() * 0.05 + 0.02, // Very faint (2% to 7% opacity)
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.02,
      })
    }

    let animationFrameId: number

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Get current theme color from the body text color if possible, or fallback to a solid color
      // Since it's fixed, we draw it faintly
      const isDark = document.documentElement.classList.contains("dark");
      
      particles.forEach(p => {
        // Move
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRotation

        // Bounce horizontally
        if (p.x <= 0) {
          p.x = 0
          p.vx *= -1
        } else if (p.x >= canvas.width) {
          p.x = canvas.width
          p.vx *= -1
        }

        // Bounce vertically
        if (p.y <= 0) {
          p.y = 0
          p.vy *= -1
        } else if (p.y >= canvas.height) {
          p.y = canvas.height
          p.vy *= -1
        }

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        
        ctx.font = `900 ${p.size}px 'Noto Sans JP', sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        // Base color based on theme
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.alpha})` : `rgba(0, 0, 0, ${p.alpha})`
        
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-50"
      style={{ display: "block" }}
    />
  )
}
