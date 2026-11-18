import React, { useEffect, useRef } from 'react'

export default function BlueParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let lastTime = 0
    const frameInterval = 1000 / 60
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Pre-downscale logo onto a 48x48 offscreen canvas once
    let offscreenLogo: HTMLCanvasElement | null = null
    const logoImg = new Image()
    logoImg.src = '/logo.png'
    const createOffscreenLogo = () => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) return
      const offscreen = document.createElement('canvas')
      offscreen.width = 48
      offscreen.height = 48
      const oCtx = offscreen.getContext('2d')
      if (!oCtx) return
      oCtx.drawImage(logoImg, 0, 0, 48, 48)
      offscreenLogo = offscreen
    }
    logoImg.onload = createOffscreenLogo
    if (logoImg.complete) createOffscreenLogo()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Logo particle pool (calm, minimal on mobile UI)
    const isMobile = width < 768
    const particleCount = isMobile ? 8 : 28
    const maxLinkDist = isMobile ? 75 : 120
    const maxLinkDistSq = maxLinkDist * maxLinkDist
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      rotation: number
      rotSpeed: number
      alpha: number
      pulseSpeed: number
      pulseDir: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isMobile ? (Math.random() * 6 + 12) : (Math.random() * 14 + 18),
        speedY: -(Math.random() * 0.45 + 0.12),
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.007,
        alpha: Math.random() * 0.35 + 0.12,
        pulseSpeed: Math.random() * 0.012 + 0.004,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      })
    }

    let scanY = 0
    const gridSpacing = 65

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render)
      if (time - lastTime < frameInterval - 1) return
      lastTime = time

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

      // Render logo particles using pre-scaled offscreen canvas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotSpeed

        if (p.y < -40) {
          p.y = height + 25
          p.x = Math.random() * width
        }
        if (p.x < -40) p.x = width + 25
        if (p.x > width + 40) p.x = -25

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.48 || p.alpha < 0.12) {
          p.pulseDir *= -1
        }

        // Fast blit from offscreen texture
        const texture = offscreenLogo || (logoImg.complete && logoImg.naturalWidth > 0 ? logoImg : null)
        if (texture) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = p.alpha
          ctx.drawImage(texture, -p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        }
      }

      // Optimized Pairwise Strands (O(N^2)/2 with early rejection)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          if (Math.abs(dx) > maxLinkDist || Math.abs(dy) > maxLinkDist) continue
          const distSq = dx * dx + dy * dy
          if (distSq < maxLinkDistSq) {
            const dist = Math.sqrt(distSq)
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.08 * (1 - dist / maxLinkDist)})` // Sky blue / cyan string
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    }

    lastTime = performance.now()
    animationFrameId = requestAnimationFrame(render)

    const handleVisibility = () => {
      if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      } else if (!document.hidden && !animationFrameId) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
