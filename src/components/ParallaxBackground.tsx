import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerSlowRef = useRef<HTMLDivElement>(null)
  const layerMidRef = useRef<HTMLDivElement>(null)
  const layerFastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // 1. Slow background parallax layer (Atmospheric grid & ambient glowing orbs)
      if (layerSlowRef.current) {
        gsap.to(layerSlowRef.current, {
          y: '-18%',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        })
      }

      // 2. Medium background parallax layer (Cybernetic contour curves & floating mana nodes)
      if (layerMidRef.current) {
        gsap.to(layerMidRef.current, {
          y: '-32%',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        })
      }

      // 3. Fast foreground parallax layer (High-speed particle dust & glowing crosshairs)
      if (layerFastRef.current) {
        gsap.to(layerFastRef.current, {
          y: '-48%',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Layer 1: Slow Parallax — Ambient Glow & Hex Grid */}
      <div
        ref={layerSlowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '160vh',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(124, 58, 237, 0.02) 60%, transparent 80%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          top: '55%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.02) 60%, transparent 80%)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute',
          top: '85%',
          left: '20%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }} />
      </div>

      {/* Layer 2: Medium Parallax — Floating Mana Lines & Geometric Nodes */}
      <div
        ref={layerMidRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180vh',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {/* Curved contour lines */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.04 }}>
          <path d="M-100,300 Q600,100 1300,500 T2400,200" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
          <path d="M-100,900 Q800,1200 1600,700 T2400,1100" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
          <path d="M-100,1500 Q500,1700 1200,1400 T2400,1600" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        </svg>

        {/* Floating crosshairs */}
        {[
          { top: '22%', left: '88%' },
          { top: '48%', left: '6%' },
          { top: '72%', left: '92%' },
          { top: '110%', left: '12%' },
          { top: '145%', left: '85%' },
        ].map((pos, idx) => (
          <div key={idx} style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '16px',
            height: '16px',
            opacity: 0.25,
            color: idx % 2 === 0 ? '#00d4ff' : '#7C3AED',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          </div>
        ))}
      </div>

      {/* Layer 3: Fast Parallax — High-Speed Floating Ember Dust */}
      <div
        ref={layerFastRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200vh',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${(i * 14) % 180}%`,
              left: `${(i * 19 + 7) % 94}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#00d4ff' : '#7C3AED',
              boxShadow: i % 2 === 0 ? '0 0 8px #00d4ff' : '0 0 8px #7C3AED',
              opacity: 0.35 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
