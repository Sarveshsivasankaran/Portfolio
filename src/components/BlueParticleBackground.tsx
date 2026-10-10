import React, { useEffect, useRef } from 'react'

export default function BlueParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool
    const particleCount = 80
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      alpha: number
      pulseSpeed: number
      pulseDir: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.5 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.45 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      })
    }

    let scanY = 0
    const gridSpacing = 65

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw blue grid lines
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.025)' // Sky blue
      ctx.lineWidth = 0.5
      
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Horizontal sweeping tracking lines (Indigo scanline)
      scanY += 0.75
      if (scanY > height) scanY = 0
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()

      // Render coordinates particles and blue connecting strings
      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.8 || p.alpha < 0.1) {
          p.pulseDir *= -1
        }

        ctx.fillStyle = `rgba(14, 165, 233, ${p.alpha})` // Sky blue particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.08 * (1 - dist / 110)})` // Indigo / Royal blue string
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
