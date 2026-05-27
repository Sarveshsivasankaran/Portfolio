import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type LinkedInPost } from '../data/linkedinPosts'
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiLinkedin, 
  FiExternalLink,
  FiX,
  FiMaximize2,
  FiShield,
  FiActivity
} from 'react-icons/fi'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/kZiQZ1hp09EE5chm/scene.splinecode'

gsap.registerPlugin(ScrollTrigger)


const TYPE_COLORS: Record<LinkedInPost['type'], string> = {
  post:        '#06b6d4', // Cyan
  article:     '#a78bfa', // Purple
  certificate: '#fbbf24', // Gold
  project:     '#10b981', // Emerald
}

const TYPE_LABELS: Record<LinkedInPost['type'], string> = {
  post:        'INTEL POST',
  article:     'DEV LOG',
  certificate: 'CREDENTIAL',
  project:     'TACTICAL PROJECT',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function Wins() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(1200)
  const splineApp = useRef<any>(null)
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)

  const [wrRotateX, setWrRotateX] = useState(0)
  const [wrRotateY, setWrRotateY] = useState(0)
  const [wrSheenX, setWrSheenX] = useState(50)
  const [wrSheenY, setWrSheenY] = useState(50)
  const [wrHovered, setWrHovered] = useState(false)
  const [wrLightbox, setWrLightbox] = useState(false)

  // World Record Gallery Media List
  const wrMediaList = [
    { url: '/tifa_micro_forest_certificate.jpg', title: 'World Record Certificate', type: 'certificate' },
    { url: '/micro_forest_event_1.jpg', title: 'Robotics Team World Record Group', type: 'photo' },
    { url: '/micro_forest_event_2.jpg', title: 'Student Team Lead holding record card', type: 'photo' },
    { url: '/micro_forest_event_3.jpg', title: 'World Record presentation ceremony', type: 'photo' },
    { url: '/micro_forest_event_4.jpg', title: 'Participants with the planting robots', type: 'photo' },
    { url: '/micro_forest_event_5.jpg', title: 'Student Operator with autonomous robot', type: 'photo' },
  ]
  const [featuredMediaIndex, setFeaturedMediaIndex] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // High-Performance HTML5 Canvas Grid & Particle Background Animation
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
    const particleCount = 45
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
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.35 + 0.1),
        alpha: Math.random() * 0.45 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      })
    }

    let scanY = 0
    const gridSpacing = 60

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grids
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.025)' // Gold grid lines
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

      // Tech radars in corner
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.04)' // Purple radar
      ctx.beginPath()
      ctx.arc(40, 40, 100, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width - 40, height - 40, 150, 0, Math.PI * 2)
      ctx.stroke()

      // Horizontal sweeping tracking lines
      scanY += 0.8
      if (scanY > height) scanY = 0
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)' // Teal scanline
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()

      // Render coordinates particles and neon networking strings
      particles.forEach((p) => {
        p.y += p.speedY
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.8 || p.alpha < 0.1) {
          p.pulseDir *= -1
        }

        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 100)})`
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

  // Fetch real-time LinkedIn posts via our secure Vercel backend proxy route
  useEffect(() => {
    let active = true
    fetch('/api/linkedin')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (active) {
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data)
            setLoading(false)
          } else {
            throw new Error('API returned empty or non-array posts list')
          }
        }
      })
      .catch(err => {
        console.error('[Telemetry Failure] Failed to retrieve secure LinkedIn feed, loading local cache:', err.message)
        if (active) {
          // Fallback to static mock posts on fetch or parse errors (e.g. local 404)
          import('../data/linkedinPosts').then(mod => {
            if (active) {
              setPosts(mod.LINKEDIN_POSTS)
              setLoading(false)
            }
          }).catch(importErr => {
            console.error('Failed to import local fallback posts:', importErr)
            if (active) {
              setLoading(false)
            }
          })
        }
      })
    return () => { active = false }
  }, [])

  // Track screen size for responsive card calculations
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.wins-spline-wrapper',
        { rotation: 0, scale: 1.1, y: -50 },
        {
          rotation: -45, // Rotate opposite direction to hero
          scale: 1.3,
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: '#wins',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Scroll-triggered entrance animations for wins content
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('#wins .section-label, #wins .section-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '#wins', start: 'top 85%', once: true }
        }
      )
      gsap.fromTo('.wins-card-deck',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '#wins', start: 'top 75%', once: true }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  function onSplineLoad(app: any) {
    splineApp.current = app
    
    gsap.to({}, {
      scrollTrigger: {
        trigger: '#wins',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          if (!splineApp.current) return
          try {
            const camera = splineApp.current.findObjectByName('Camera')
            if (camera) {
              camera.rotation.y = self.progress * Math.PI * 0.4
            } else {
              splineApp.current.setZoom(1.0 - self.progress * 0.1)
            }
          } catch (e) {
            try {
              splineApp.current.setZoom(1.0 - self.progress * 0.1)
            } catch (err) {}
          }
        }
      }
    })
  }

  const deckRef = useRef<HTMLDivElement>(null)

  // Card dimensions
  const isMobile = viewportWidth < 768
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024
  const isTabletOrMobile = viewportWidth < 1024
  const cardWidth = isMobile ? 290 : (isTablet ? 320 : 360)
  const gap = 20

  // Calculate slide limit based on viewport constraints
  const visibleCount = isMobile ? 1 : (isTablet ? 2 : 3)
  const maxSlideIndex = Math.max(0, posts.length - visibleCount)

  // Bounds clamp index
  const safeActiveIndex = Math.min(activeIndex, maxSlideIndex)

  const handlePrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : maxSlideIndex
    setActiveIndex(newIndex)
    if (isMobile && deckRef.current) {
      deckRef.current.scrollTo({
        left: newIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    const newIndex = activeIndex < maxSlideIndex ? activeIndex + 1 : 0
    setActiveIndex(newIndex)
    if (isMobile && deckRef.current) {
      deckRef.current.scrollTo({
        left: newIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    if (isMobile && deckRef.current) {
      deckRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (!isMobile || !deckRef.current) return
    const scrollLeft = deckRef.current.scrollLeft
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex <= maxSlideIndex) {
      setActiveIndex(newIndex)
    }
  }

  const pageFlipVariants = {
    initial: {
      rotateY: 25,
      x: 30,
      opacity: 0,
      scale: 0.98,
      transformOrigin: 'left center',
    },
    animate: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'center center',
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      rotateY: -25,
      x: -30,
      opacity: 0,
      scale: 0.98,
      transformOrigin: 'right center',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  // Slide translation X
  const slideX = -safeActiveIndex * (cardWidth + gap)

  return (
    <section id="wins" style={{
      padding: isTabletOrMobile ? '80px 20px 60px' : '96px 64px 80px',
      background: 'var(--void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* HTML5 Cybernetic Grid Canvas */}
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

      {/* 3D Interactive Spline Background Canvas */}
      <Suspense fallback={null}>
        <div className="wins-spline-wrapper" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.12, // Cohesive premium subtle depth
          willChange: 'transform',
        }}>
          <Spline scene={SPLINE_URL} onLoad={onSplineLoad} />
        </div>
      </Suspense>

      {/* Ambient glowing fields */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <p className="section-label">// CORE.ACHIEVEMENTS</p>
        <h2 className="section-heading" style={{ marginBottom: 48 }}>Wins &amp; Activity</h2>

        {/* --- A. NEW INTEGRATED FEATURED WORLD RECORD CERTIFICATE --- */}
        <div className="featured-record-card" style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.65) 0%, rgba(10, 10, 18, 0.8) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          padding: isTabletOrMobile ? '24px 16px' : '32px',
          marginBottom: isTabletOrMobile ? '36px' : '56px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: isTabletOrMobile ? '1fr' : 'minmax(280px, 1fr) minmax(320px, 1.25fr)',
          gap: isTabletOrMobile ? '24px' : '40px',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
          {/* Bezel strip highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            width: '120px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }} />

          {/* Column 1: A4 3D tilt frame & Thumbnail Gallery */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
          }}>
            <div style={{
              perspective: 1000,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}>
              <motion.div
                onMouseMove={(e) => {
                  const card = e.currentTarget
                  const rect = card.getBoundingClientRect()
                  const x = e.clientX - rect.left - rect.width / 2
                  const y = e.clientY - rect.top - rect.height / 2
                  setWrRotateX(-(y / (rect.height / 2)) * 8)
                  setWrRotateY((x / (rect.width / 2)) * 8)
                  setWrSheenX(((e.clientX - rect.left) / rect.width) * 100)
                  setWrSheenY(((e.clientY - rect.top) / rect.height) * 100)
                }}
                onMouseEnter={() => setWrHovered(true)}
                onMouseLeave={() => {
                  setWrHovered(false)
                  setWrRotateX(0)
                  setWrRotateY(0)
                }}
                animate={{
                  rotateX: wrHovered ? wrRotateX : 0,
                  rotateY: wrHovered ? wrRotateY : 0,
                  scale: wrHovered ? 1.02 : 1,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: isTabletOrMobile ? '100%' : (wrMediaList[featuredMediaIndex].type === 'certificate' ? '290px' : '420px'),
                  aspectRatio: wrMediaList[featuredMediaIndex].type === 'certificate' ? '0.707' : '1.333',
                  borderRadius: '12px',
                  background: 'rgba(5, 5, 12, 0.95)',
                  border: wrHovered ? '2px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: wrHovered
                    ? '0 25px 50px rgba(0,0,0,0.65), 0 0 30px rgba(245,158,11,0.12)'
                    : '0 15px 30px rgba(0,0,0,0.45)',
                  cursor: 'zoom-in',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transformStyle: 'preserve-3d',
                  transition: 'aspect-ratio 0.4s ease-in-out, max-width 0.4s ease-in-out, border-color 0.3s, box-shadow 0.3s',
                }}
                onClick={() => setWrLightbox(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredMediaIndex}
                    src={wrMediaList[featuredMediaIndex].url}
                    alt={wrMediaList[featuredMediaIndex].title}
                    variants={pageFlipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = document.getElementById('wr-embed-placeholder')
                      if (fallback) fallback.style.display = 'flex'
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: wrMediaList[featuredMediaIndex].type === 'certificate' ? 'contain' : 'cover',
                      zIndex: 2,
                      filter: wrHovered ? 'contrast(1.05) brightness(1.03)' : 'contrast(0.98) brightness(0.85)',
                      transition: 'filter 0.3s',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  />
                </AnimatePresence>

                <div
                  id="wr-embed-placeholder"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    zIndex: 3,
                    background: 'linear-gradient(135deg, rgba(17,24,39,0.96) 0%, rgba(10,10,18,0.98) 100%)',
                    fontFamily: 'Share Tech Mono, monospace',
                    textAlign: 'center',
                  }}
                >
                  <FiShield size={36} color="var(--gold)" style={{ marginBottom: 12, filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.4))' }} />
                  <span style={{ color: 'var(--ghost)', fontSize: 13, letterSpacing: '0.05em', marginBottom: 4 }}>TIFA WORLD RECORD</span>
                  <span style={{ color: 'var(--stone)', fontSize: 10 }}>[ VALID CREDENTIAL DATA ]</span>
                </div>

                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${wrSheenX}% ${wrSheenY}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 6 }} />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(10, 10, 18, 0.45)',
                  opacity: wrHovered ? 1 : 0,
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
                    border: '1px solid var(--gold)',
                    color: 'var(--gold)',
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                  }}>
                    <FiMaximize2 size={13} />
                    <span>EXPAND GALLERY VIEW</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Gallery Thumbnail Row */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: '380px',
              padding: '6px',
              background: 'rgba(10, 10, 18, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              {wrMediaList.map((media, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setFeaturedMediaIndex(idx)}
                  onClick={() => setFeaturedMediaIndex(idx)}
                  style={{
                    width: '46px',
                    height: '34px',
                    borderRadius: '4px',
                    border: featuredMediaIndex === idx ? '1.5px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#07070d',
                    padding: 0,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: featuredMediaIndex === idx ? 1 : 0.55,
                    transform: featuredMediaIndex === idx ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: featuredMediaIndex === idx ? '0 0 8px rgba(245,158,11,0.35)' : 'none',
                  }}
                  title={media.title}
                >
                  <img
                    src={media.url}
                    alt={media.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Content descriptions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            justifyContent: 'center',
            alignItems: isTabletOrMobile ? 'center' : 'stretch',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isTabletOrMobile ? 'center' : 'flex-start', gap: 10, flexWrap: 'wrap', width: '100%' }}>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: isTabletOrMobile ? '9px' : '10px',
                color: 'var(--gold)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid var(--gold)',
                borderRadius: '4px',
                padding: '4px 10px',
                letterSpacing: isTabletOrMobile ? '0.04em' : '0.1em',
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textAlign: 'center',
                maxWidth: '100%',
              }}>
                ⭐ S-RANK RECORD ACHIEVEMENT
              </span>
            </div>

            <h3 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: isTabletOrMobile ? '20px' : '26px',
              color: 'var(--ghost)',
              lineHeight: 1.2,
              margin: 0,
              textAlign: isTabletOrMobile ? 'center' : 'left',
            }}>
              World Record: Students Use Robots to Plant a Micro Forest in Chennai
            </h3>

            <p style={{
              color: 'var(--stone)',
              fontSize: '14px',
              lineHeight: 1.6,
              margin: '0 0 12px 0',
              textAlign: isTabletOrMobile ? 'center' : 'left',
            }}>
              On January 25, 2020, at the Anna University campus in Chennai, a remarkable world record attempt took place — instead of humans planting trees, it was student-built robots that did the work. The robots were programmed to pick up saplings, lower them into the soil, and water them. A total of 326 students from 20 centres of SP Robotics Maker Lab, aged between 7 and 17, built and operated these robots to create what is recognized as the world's first micro forest planted by robots.
            </p>
            <p style={{
              color: 'var(--stone)',
              fontSize: '14px',
              lineHeight: 1.6,
              margin: '0 0 12px 0',
              textAlign: isTabletOrMobile ? 'center' : 'left',
            }}>
              The robots were controlled via smartphones over Bluetooth, with one team assembling and operating the robots while another team coded the watering mechanism. The planted saplings were committed to be nurtured for three years by SP Robotics in collaboration with Communitree.
            </p>
            <p style={{
              color: 'var(--stone)',
              fontSize: '14px',
              lineHeight: 1.6,
              margin: '0 0 12px 0',
              textAlign: isTabletOrMobile ? 'center' : 'left',
            }}>
              The initiative was inspired when a student submitted a project featuring a robot planting trees and a friend's robot watering them. The Maker Lab Head, Aarthi Muralitharan, scaled up the idea into a world record attempt to demonstrate that technology can be harnessed to fight climate change and benefit nature.
            </p>
            <p style={{
              color: 'var(--stone)',
              fontSize: '14px',
              lineHeight: 1.6,
              margin: 0,
              textAlign: isTabletOrMobile ? 'center' : 'left',
            }}>
              The event set the world record for <strong style={{ color: 'var(--gold)' }}>"Most Participants with Robots to Create a Micro Forest"</strong> and received a World Record Certificate in recognition of this achievement.
            </p>

            <div style={{ marginTop: 12, width: '100%', display: 'flex', justifyContent: isTabletOrMobile ? 'center' : 'flex-start' }}>
              <a
                href="https://www.ndtv.com/chennai-news/chennai-students-use-robots-to-plant-300-saplings-raise-micro-forest-2170644"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open("https://www.ndtv.com/chennai-news/chennai-students-use-robots-to-plant-300-saplings-raise-micro-forest-2170644", "_blank")
                }}
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(124, 58, 237, 0.15))',
                  border: '1.5px solid var(--gold)',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.15)',
                  color: 'var(--gold)',
                  display: isTabletOrMobile ? 'flex' : 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  width: isTabletOrMobile ? '100%' : 'auto',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--monarch))'
                  e.currentTarget.style.color = '#000'
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(124, 58, 237, 0.15))'
                  e.currentTarget.style.color = 'var(--gold)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.15)'
                }}
              >
                <FiExternalLink size={13} />
                <span>READ OFFICIAL NDTV REPORT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Viewport sliding window */}
        <div 
          ref={deckRef}
          className="wins-card-deck" 
          onScroll={handleScroll}
          style={{
            width: 'auto',
            overflowX: isMobile ? 'auto' : 'hidden',
            padding: isMobile ? '20px 24px' : '20px 0',
            margin: isMobile ? '0 -24px' : '0',
            position: 'relative',
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', gap: `${gap}px`, width: 'max-content' }}>
              {Array.from({ length: visibleCount }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="skeleton" 
                  style={{ 
                    width: `${cardWidth}px`, 
                    height: '450px', 
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--dungeon)',
                    opacity: 0.35,
                    animation: 'pulse 1.8s infinite ease-in-out',
                  }} 
                />
              ))}
            </div>
          ) : (
            <motion.div
              animate={{ x: isMobile ? 0 : slideX }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 24,
              }}
              style={{
                display: 'flex',
                gap: `${gap}px`,
                width: 'max-content',
                willChange: 'transform',
              }}
            >
              {posts.map((post, index) => {
                // Highlight card if inside the current visible viewport slice
                const isCurrentlyVisible = index >= safeActiveIndex && index < safeActiveIndex + visibleCount

              return (
                <motion.div
                  key={post.id}
                  style={{
                    width: `${cardWidth}px`,
                    height: '450px',
                    borderRadius: '16px',
                    background: 'var(--dungeon)',
                    border: isCurrentlyVisible ? '1.5px solid rgba(6, 182, 212, 0.35)' : '1px solid var(--border)',
                    boxShadow: isCurrentlyVisible 
                      ? '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.03)'
                      : '0 10px 25px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transformStyle: 'preserve-3d',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: isMobile ? 'center' : 'none',
                  }}
                  whileHover={{
                    y: -8,
                    borderColor: 'rgba(124, 58, 237, 0.55)',
                    boxShadow: '0 20px 45px rgba(124, 58, 237, 0.2), inset 0 0 24px rgba(124, 58, 237, 0.08)',
                  }}
                >
                  {/* Image Header */}
                  <div style={{
                    width: '100%',
                    height: '170px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {/* Glowing highlight strip */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, ${TYPE_COLORS[post.type]}, transparent)`,
                      zIndex: 5,
                    }} />

                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isCurrentlyVisible ? 'grayscale(0) contrast(1.05)' : 'grayscale(0.3) contrast(0.95)',
                        transition: 'transform 0.5s ease, filter 0.5s ease',
                      }}
                    />

                    {/* LinkedIn badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(10,102,194,0.15)',
                      border: '1px solid rgba(10,102,194,0.3)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0A66C2',
                      fontSize: '15px',
                      zIndex: 10,
                    }}>
                      <FiLinkedin />
                    </div>

                    {/* Badge Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      zIndex: 10,
                    }}>
                      <span className="pill" style={{
                        background: 'rgba(17, 24, 39, 0.75)',
                        color: TYPE_COLORS[post.type],
                        border: `1px solid ${TYPE_COLORS[post.type]}88`,
                        backdropFilter: 'blur(6px)',
                        fontWeight: 700,
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        padding: '4px 10px',
                      }}>
                        {TYPE_LABELS[post.type]}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{
                    padding: '20px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    background: 'linear-gradient(to bottom, var(--dungeon) 0%, rgba(10, 10, 12, 0.95) 100%)',
                  }}>
                    <div>
                      {/* Date */}
                      <p style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '10px',
                        color: 'var(--stone)',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                      }}>
                        [ TRANSMISSION_DATE: {formatDate(post.date)} ]
                      </p>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontSize: '17px',
                        color: 'var(--ghost)',
                        lineHeight: 1.3,
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {post.title}
                      </h3>

                      {/* Summary */}
                      <p style={{
                        color: 'var(--stone)',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {post.summary}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                      borderTop: '0.5px solid var(--border)',
                      paddingTop: '12px',
                    }}>
                      <span style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '9px',
                        color: 'rgba(255,255,255,0.2)',
                      }}>
                        QUEST: COMPLETED
                      </span>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontFamily: 'Share Tech Mono, monospace',
                          fontSize: '12px',
                          color: TYPE_COLORS[post.type],
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 700,
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = TYPE_COLORS[post.type])}
                      >
                        <span>SYNC INTEL</span>
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
          )}
        </div>

        {/* Dynamic Holographic Controls and Progress dots */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginTop: '32px',
        }}>
          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              className="btn-ghost"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                border: '1px solid var(--border)',
                background: 'rgba(17, 24, 39, 0.4)',
                cursor: 'pointer',
                color: 'var(--ghost)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--teal)'
                e.currentTarget.style.color = 'var(--teal)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--ghost)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <FiChevronLeft size={20} />
            </button>

            {/* Pagination Indicators - S-Rank Level Steps */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {Array.from({ length: maxSlideIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    style={{
                      width: i === safeActiveIndex ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: i === safeActiveIndex ? 'var(--gate)' : 'var(--border)',
                      boxShadow: i === safeActiveIndex ? '0 0 10px rgba(59, 130, 246, 0.6)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    title={`Step ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleNext}
              className="btn-ghost"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                border: '1px solid var(--border)',
                background: 'rgba(17, 24, 39, 0.4)',
                cursor: 'pointer',
                color: 'var(--ghost)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--gate)'
                e.currentTarget.style.color = 'var(--gate)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--ghost)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <p style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '12px',
            color: 'var(--stone)',
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            SYSTEM DECK: ACTIVE SCAN [0{safeActiveIndex + 1} / 0{maxSlideIndex + 1}]
          </p>
        </div>
      </div>

      {/* --- B. WORLD RECORD HIGH-RES LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {wrLightbox && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
            boxSizing: 'border-box',
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWrLightbox(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 5, 10, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'zoom-out',
                zIndex: 1,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '960px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: '75vh',
                background: 'rgba(10, 10, 18, 0.6)',
                borderRadius: '16px',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                boxShadow: '0 0 50px rgba(245, 158, 11, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Left navigation arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFeaturedMediaIndex((prev) => (prev === 0 ? wrMediaList.length - 1 : prev - 1))
                  }}
                  style={{
                    position: 'absolute',
                    left: isMobile ? 12 : 20,
                    width: isMobile ? 36 : 44,
                    height: isMobile ? 36 : 44,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    background: 'rgba(10, 10, 18, 0.85)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    zIndex: 20,
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(245,158,11,0.5)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FiChevronLeft size={22} />
                </button>

                {/* Right navigation arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFeaturedMediaIndex((prev) => (prev === wrMediaList.length - 1 ? 0 : prev + 1))
                  }}
                  style={{
                    position: 'absolute',
                    right: isMobile ? 12 : 20,
                    width: isMobile ? 36 : 44,
                    height: isMobile ? 36 : 44,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    background: 'rgba(10, 10, 18, 0.85)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    zIndex: 20,
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(245,158,11,0.5)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FiChevronRight size={22} />
                </button>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredMediaIndex}
                    src={wrMediaList[featuredMediaIndex].url}
                    alt={wrMediaList[featuredMediaIndex].title}
                    variants={pageFlipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const backupModal = document.getElementById('wr-backup-modal')
                      if (backupModal) backupModal.style.display = 'flex'
                    }}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '75vh',
                      display: 'block',
                      objectFit: 'contain',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  />
                </AnimatePresence>

                <div
                  id="wr-backup-modal"
                  style={{
                    display: 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '24px 16px' : '48px',
                    background: 'rgba(10, 10, 18, 0.98)',
                    fontFamily: 'Share Tech Mono, monospace',
                    width: '100%',
                    height: '400px',
                    textAlign: 'center',
                  }}
                >
                  <FiShield size={64} color="var(--gold)" style={{ marginBottom: 20, filter: 'drop-shadow(0 0 15px rgba(245,158,11,0.5))' }} />
                  <h3 style={{ color: 'var(--ghost)', fontSize: isMobile ? 16 : 20, letterSpacing: '0.1em', marginBottom: 12 }}>
                    TIFA WORLD RECORD OFFICIAL VERIFICATION
                  </h3>
                  <p style={{ color: 'var(--stone)', fontSize: isMobile ? 11 : 13, maxWidth: '460px', lineHeight: 1.6, marginBottom: 24 }}>
                    Students designed and operated customized mobile robotic platforms to successfully plant the world's first robot-assisted micro forest at Anna University, Chennai.
                  </p>
                  <div style={{
                    border: '1.5px solid var(--gold)',
                    background: 'rgba(245, 158, 11, 0.06)',
                    padding: isMobile ? '8px 12px' : '8px 16px',
                    borderRadius: 4,
                    color: 'var(--gold)',
                    fontSize: isMobile ? '10px' : '12px',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)',
                    wordBreak: 'break-all',
                    maxWidth: '100%',
                  }}>
                    CREDENTIAL SERIAL: TIFA-WORLD-RECORD-2020-01-25-MICRO-FOREST
                  </div>
                </div>

                <button
                  onClick={() => setWrLightbox(false)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(245, 158, 11, 0.4)',
                    background: 'rgba(10, 10, 18, 0.85)',
                    color: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    outline: 'none',
                    zIndex: 100,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.transform = 'scale(1.08) rotate(90deg)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(245,158,11,0.5)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              <div style={{
                background: 'rgba(10, 10, 18, 0.9)',
                border: '1.5px solid rgba(124, 58, 237, 0.4)',
                borderRadius: 12,
                padding: isMobile ? '16px 20px' : '20px 28px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? 16 : 12,
                color: 'var(--stone)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: 'var(--monarch)', fontWeight: 'bold' }}>// DIVINE VERIFICATION LOG DETECTED</span>
                  <span style={{ color: 'var(--ghost)', fontSize: isMobile ? 13 : 15, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                    {wrMediaList[featuredMediaIndex].title} ({featuredMediaIndex + 1}/{wrMediaList.length})
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: isMobile ? 20 : 40, 
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                  alignItems: 'center' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>RECORD ID</span>
                    <span style={{ color: 'var(--teal)' }}>TIFA_8ffd0025</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>SYSTEM CLASS</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '0.1em' }}>S-RANK VERIFIED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        #wins {
          background-image: 
            radial-gradient(rgba(245, 158, 11, 0.008) 1px, transparent 0),
            radial-gradient(rgba(124, 58, 237, 0.008) 1px, transparent 0);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }
        .wins-card-deck::-webkit-scrollbar {
          display: none;
        }
        .wins-card-deck {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE/Edge */
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.15; }
        }
        @keyframes scanVertical {
          0% { top: -2%; }
          50% { top: 102%; }
          100% { top: -2%; }
        }
        .pulsing-icon {
          animation: pulseIcon 1.5s ease infinite alternate;
        }
        @keyframes pulseIcon {
          from { opacity: 0.5; filter: drop-shadow(0 0 1px var(--teal)); }
          to { opacity: 1; filter: drop-shadow(0 0 8px var(--teal)); }
        }
        @media (max-width: 1024px) {
          .featured-record-card {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px !important;
          }
        }
        @media (max-width: 768px) {
          #wins { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
