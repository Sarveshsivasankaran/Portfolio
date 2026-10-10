import { useRef, useEffect, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/pnf7pGj7N51D0PzY/scene.splinecode'

interface EventsBackgroundProps {
  containerRef: React.RefObject<HTMLElement>
}

export default function EventsBackground({ containerRef }: EventsBackgroundProps) {
  const splineApp = useRef<any>(null)
  const stripesCanvasRef = useRef<HTMLCanvasElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Cybernetic Diagonal Stripe Light Travelling Background Animation
  useEffect(() => {
    const canvas = stripesCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    const stripeSpacing = 90
    // Generate static lines covering the width + height
    const getStripeCoords = (index: number) => {
      const x1 = index * stripeSpacing - height
      const y1 = 0
      const x2 = x1 + height
      const y2 = height
      return { x1, y1, x2, y2 }
    }

    // Active light pulses (decreased count for subtler side background presence)
    const pulseCount = 6
    const pulses: Array<{
      stripeIndex: number
      progress: number
      speed: number
      alpha: number
      beamLength: number
      colorCore: string
      colorGlow: string
    }> = []

    const resetPulse = (p: typeof pulses[0]) => {
      const totalStripes = Math.ceil((width + height) / stripeSpacing) + 5
      p.stripeIndex = Math.floor(Math.random() * totalStripes) - 2
      p.progress = -0.15 - Math.random() * 0.2 // Start off-screen
      p.speed = 0.002 + Math.random() * 0.0035 // Slower speed
      p.alpha = 0.15 + Math.random() * 0.25 // Highly translucent/dimmer core
      p.beamLength = 100 + Math.random() * 120
      // Faint high-tech light colors (white and cyan/teal glow)
      p.colorCore = `rgba(255, 255, 255, ${p.alpha})`
      p.colorGlow = `rgba(6, 182, 212, ${p.alpha * 0.3})`
    }

    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        stripeIndex: 0,
        progress: 0,
        speed: 0,
        alpha: 0,
        beamLength: 0,
        colorCore: '',
        colorGlow: '',
      })
      resetPulse(pulses[i])
      // Randomize initial progress to space them out at the start
      pulses[i].progress = Math.random()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const totalStripes = Math.ceil((width + height) / stripeSpacing) + 5

      // 1. Draw static background diagonal stripes (subtler line opacity)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.006)'
      for (let i = -2; i < totalStripes; i++) {
        const { x1, y1, x2, y2 } = getStripeCoords(i)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // 2. Draw active light transmission pulses traveling down the stripes
      pulses.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1.2) {
          resetPulse(p)
        }

        const { x1, y1, x2, y2 } = getStripeCoords(p.stripeIndex)

        // Calculate visual progression coordinates
        const progressX = x1 + p.progress * height
        const progressY = p.progress * height

        // Convert beam length to progress ratios
        const halfLengthRatio = (p.beamLength / 2) / height
        const pStart = Math.max(0, p.progress - halfLengthRatio)
        const pEnd = Math.min(1, p.progress + halfLengthRatio)

        if (pEnd > pStart) {
          const sx = x1 + pStart * height
          const sy = pStart * height
          const ex = x1 + pEnd * height
          const ey = pEnd * height

          // Draw neon glowing trace
          const gradient = ctx.createLinearGradient(sx, sy, ex, ey)
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0)')
          gradient.addColorStop(0.3, p.colorGlow)
          gradient.addColorStop(0.5, p.colorCore) // Bright white laser-like traveling core
          gradient.addColorStop(0.7, p.colorGlow)
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)')

          ctx.lineWidth = 2.5
          ctx.strokeStyle = gradient
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(ex, ey)
          ctx.stroke()

          // Draw an S-rank bright focus particle in the center of the beam
          if (p.progress >= 0 && p.progress <= 1) {
            ctx.fillStyle = '#ffffff'
            ctx.shadowBlur = 12
            ctx.shadowColor = 'rgba(6, 182, 212, 0.8)'
            ctx.beginPath()
            ctx.arc(progressX, progressY, 1.8, 0, Math.PI * 2)
            ctx.fill()
            
            // Reset canvas shadow state to prevent performance degradation
            ctx.shadowBlur = 0
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!splineApp.current) return
    try {
      const camera = splineApp.current.findObjectByName('Camera')
      if (camera) {
        camera.rotation.y = -(latest * Math.PI * 0.4)
      } else {
        splineApp.current.setZoom(1.0 + latest * 0.1)
      }
    } catch (e) {}
  })

  function onSplineLoad(app: any) {
    splineApp.current = app
  }

  return (
    <>
      <canvas
        ref={stripesCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.85,
          maskImage: 'linear-gradient(to right, black 0%, transparent 18%, transparent 82%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 18%, transparent 82%, black 100%)',
        }}
      />
      <Suspense fallback={null}>
        <motion.div className="events-spline-wrapper" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.12,
          willChange: 'transform',
          rotate: useTransform(scrollYProgress, [0, 1], [0, -25]),
          scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.3]),
          y: useTransform(scrollYProgress, [0, 1], [-50, 80]),
        }}>
          <Spline scene={SPLINE_URL} onLoad={onSplineLoad} />
        </motion.div>
      </Suspense>
    </>
  )
}
