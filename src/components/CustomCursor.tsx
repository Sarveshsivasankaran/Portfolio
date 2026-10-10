import React, { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLCanvasElement>(null)
  
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const canvas = particlesRef.current
    if (!cursor || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let mouseX = width / 2
    let mouseY = height / 2
    let cursorX = width / 2
    let cursorY = height / 2

    const particles: Array<{ x: number; y: number; size: number; alpha: number; vx: number; vy: number }> = []

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Add a particle on move
      if (Math.random() > 0.5) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 4 + 1,
          alpha: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        })
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('resize', onResize)

    let animationFrameId: number

    const render = () => {
      // Smooth follow for cursor
      cursorX += (mouseX - cursorX) * 0.2
      cursorY += (mouseY - cursorY) * 0.2
      
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      }

      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.02
        p.size *= 0.95

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})` // Purple particles
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={particlesRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hover' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: '50%',
          border: '2px solid rgba(168, 85, 247, 0.8)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s, height 0.2s, margin 0.2s, background-color 0.2s, border-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mixBlendMode: 'difference',
        }}
      >
        <div style={{
          width: isHovering ? 0 : 4,
          height: isHovering ? 0 : 4,
          backgroundColor: 'rgba(168, 85, 247, 1)',
          borderRadius: '50%',
          transition: 'width 0.2s, height 0.2s'
        }} />
      </div>
      <style>{`
        body {
          cursor: none;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: none;
        }
        .custom-cursor.hover {
          width: 56px !important;
          height: 56px !important;
          margin-left: -28px !important;
          margin-top: -28px !important;
          background-color: rgba(168, 85, 247, 0.1) !important;
          border-color: rgba(168, 85, 247, 1) !important;
        }
      `}</style>
    </>
  )
}
