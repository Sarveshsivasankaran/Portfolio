import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiExternalLink, FiBookOpen } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const BOOK_THEMES = [
  'Innocence',
  'Friendship',
  'Betrayal',
  'Hardship',
  'Growth',
  'Ambition',
  'Ego',
  'Manipulation',
  'Loyalty',
  'Isolation',
  'Success'
]

export default function Publications() {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [sheenX, setSheenX] = useState(50)
  const [sheenY, setSheenY] = useState(50)
  const [hovered, setHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cybernetic Purple/Monarch grid and particle background
  useEffect(() => {
    const canvas = canvasRef.current
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

    // Particle pool
    const particleCount = 40
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      alpha: number
      pulseSpeed: number
      pulseDir: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.25 + 0.08),
        alpha: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      })
    }

    let scanY = 0
    const gridSpacing = 64

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grids (Monarch/Purple grid lines)
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.02)'
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

      // Corner radars (Teal & Purple)
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.03)'
      ctx.beginPath()
      ctx.arc(width * 0.15, height * 0.8, 120, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.025)'
      ctx.beginPath()
      ctx.arc(width * 0.85, height * 0.2, 180, 0, Math.PI * 2)
      ctx.stroke()

      // Horizontal sweep scanline (Monarch)
      scanY += 0.6
      if (scanY > height) scanY = 0
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.035)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()

      // Render flowing particles & network linkages
      particles.forEach((p) => {
        p.y += p.speedY
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.75 || p.alpha < 0.1) {
          p.pulseDir *= -1
        }

        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha * 0.4})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 110)})`
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

  // GSAP scroll trigger for section entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('#publications .section-label, #publications .section-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#publications',
            start: 'top 85%',
            once: true,
          }
        }
      )
      
      gsap.fromTo('.publications-content-wrapper',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#publications',
            start: 'top 75%',
            once: true,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Tilt angle limited to max 12 degrees
    setRotateX(-(y / (rect.height / 2)) * 12)
    setRotateY((x / (rect.width / 2)) * 12)
    
    // Sheen center coordinates in percentages
    setSheenX(((e.clientX - rect.left) / rect.width) * 100)
    setSheenY(((e.clientY - rect.top) / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <section id="publications" style={{
      padding: '96px 64px 80px',
      background: 'var(--void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* HTML5 Cybernetic Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />

      {/* Cyber ambient glow fields */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <p className="section-label">// SYSTEM.QUEST.ARCHIVE</p>
        <h2 className="section-heading" style={{ marginBottom: 48 }}>Book Publications</h2>

        {/* Content Wrapper */}
        <div className="publications-content-wrapper" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1.1fr) minmax(320px, 1.9fr)',
          gap: '56px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.55) 0%, rgba(10, 10, 18, 0.75) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          borderRadius: '16px',
          padding: '48px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(124, 58, 237, 0.04)',
        }}>
          
          {/* Left Column: 3D Book Cover Mockup */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            perspective: '1200px',
          }}>
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: hovered ? rotateX : 0,
                rotateY: hovered ? rotateY : 0,
                scale: hovered ? 1.03 : 1,
              }}
              transition={{ type: 'spring', stiffness: 140, damping: 22 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '300px',
                aspectRatio: '0.67',
                borderRadius: '8px 12px 12px 8px',
                background: '#0a0a10',
                boxShadow: hovered
                  ? '25px 25px 50px rgba(0,0,0,0.7), -5px 10px 20px rgba(124, 58, 237, 0.15), 0 0 30px rgba(124, 58, 237, 0.1)'
                  : '15px 15px 35px rgba(0,0,0,0.55), -2px 5px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                border: '1.2px solid rgba(124, 58, 237, 0.25)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onClick={() => window.open('https://the-faces-behind-faces-book.vercel.app/', '_blank')}
            >
              {/* Spine edge effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '10px',
                height: '100%',
                background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.4) 90%)',
                zIndex: 8,
                borderRadius: '8px 0 0 8px',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              }} />

              {/* Book Cover Image */}
              <img
                src="/faces_behind_faces_cover.jpg"
                alt="The Faces Behind Faces Book Cover"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 2,
                  filter: hovered ? 'contrast(1.04) brightness(1.02)' : 'contrast(0.98) brightness(0.85)',
                  transition: 'filter 0.3s',
                  transform: 'translateZ(20px)', // Elevates the cover image in 3D space
                }}
              />

              {/* Sheen Highlight Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`,
                pointerEvents: 'none',
                zIndex: 6,
              }} />

              {/* Hover S-Rank Scan line Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.12))',
                opacity: hovered ? 1 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.3s',
                zIndex: 10,
              }}>
                <div style={{
                  background: 'rgba(10, 10, 18, 0.9)',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1.2px solid var(--monarch)',
                  color: 'var(--ghost)',
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.45)',
                  transform: 'translateZ(30px)',
                }}>
                  <FiBookOpen size={13} color="var(--teal)" />
                  <span>READ BOOK LOG</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Book Metadata & Information */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '10px',
                color: 'var(--monarch)',
                background: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid var(--monarch)',
                borderRadius: '4px',
                padding: '4px 10px',
                letterSpacing: '0.08em',
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(124, 58, 237, 0.12)',
              }}>
                ⭐ S-RANK LEGENDARY PUBLICATION
              </span>
            </div>

            <h3 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: 'var(--ghost)',
              lineHeight: 1.1,
              margin: 0,
            }}>
              The Faces Behind Faces
            </h3>

            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--teal)',
              lineHeight: 1.4,
              margin: '0 0 4px 0',
              borderLeft: '3px solid var(--teal)',
              paddingLeft: '14px',
            }}>
              "Every person wears many masks. Every mask has a story."
            </p>

            <p style={{
              color: 'var(--stone)',
              fontSize: '15px',
              lineHeight: 1.6,
              margin: 0,
            }}>
              A deep psychological and narrative dive into identity, human behavior, and the internal shadows we choose to reveal or lock away. <em>The Faces Behind Faces</em> uncovers the system of layers that humanity builds to adapt, survive, and pursue growth, while balancing ambition with isolation. Written by <strong>Sarvesh Sivasankaran (Solo-P-Leveller)</strong>, it translates emotional states into legendary chronicles of self-exploration.
            </p>

            {/* Book Theme Pill Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                Detected Identity Elements:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {BOOK_THEMES.map((theme) => (
                  <span
                    key={theme}
                    className="pill"
                    style={{
                      background: 'rgba(17, 24, 39, 0.8)',
                      color: 'var(--silver)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '4px 10px',
                      fontSize: '11px',
                      transition: 'all 0.25s ease-out',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--monarch)'
                      e.currentTarget.style.color = 'var(--ghost)'
                      e.currentTarget.style.boxShadow = '0 0 8px rgba(124, 58, 237, 0.25)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.color = 'var(--silver)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured College Website Blog Release Card */}
            <div style={{
              marginTop: '8px',
              padding: '18px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.07) 0%, rgba(124, 58, 237, 0.05) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(6, 182, 212, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--teal)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                }}>
                  🎓 COLLEGE WEBSITE FEATURED BLOG
                </span>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.45)',
                }}>
                  Rajalakshmi Engineering College
                </span>
              </div>

              <h4 style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--ghost)',
                margin: 0,
                lineHeight: 1.3,
              }}>
                Beyond Grades: Lessons That Shaped My Engineering Journey
              </h4>

              <p style={{
                color: 'var(--silver)',
                fontSize: '13.5px',
                lineHeight: 1.5,
                margin: 0,
              }}>
                An officially featured adaptation released on the college portal — a curated, high-impact version of <em>"The Faces Behind Faces"</em> sharing core engineering principles, resilience, and personal growth.
              </p>
            </div>

            {/* Read / Explore Action Buttons */}
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <a
                href="https://the-faces-behind-faces-book.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--monarch), #5b21b6)',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.25)',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'brightness(1.15)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.5)'
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'none'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.25)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <FiExternalLink size={14} />
                <span>READ FULL BOOK</span>
              </a>

              <a
                href="https://www.rajalakshmi.org/blogs/beyond-grades-lessons-that-shaped-my-engineering-journey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
                  color: 'var(--teal)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderColor = 'var(--teal)'
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.4)'
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'
                  e.currentTarget.style.color = 'var(--teal)'
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.15)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <FiExternalLink size={14} />
                <span>READ COLLEGE BLOG RELEASE</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .publications-content-wrapper {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 32px !important;
          }
        }
        @media (max-width: 768px) {
          #publications { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
