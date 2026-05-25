import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type LinkedInPost } from '../data/linkedinPosts'
import { FiChevronLeft, FiChevronRight, FiLinkedin, FiExternalLink } from 'react-icons/fi'

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

  // Slide translation X
  const slideX = -safeActiveIndex * (cardWidth + gap)

  return (
    <section id="wins" style={{
      padding: '96px 64px 80px',
      background: 'var(--void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
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

        {/* Viewport sliding window */}
        <div 
          ref={deckRef}
          className="wins-card-deck" 
          onScroll={handleScroll}
          style={{
            width: '100%',
            overflowX: isMobile ? 'auto' : 'hidden',
            padding: '20px 0',
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

      <style>{`
        #wins {
          background-image: 
            radial-gradient(rgba(59, 130, 246, 0.015) 1px, transparent 0),
            radial-gradient(rgba(124, 58, 237, 0.015) 1px, transparent 0);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
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
        @media (max-width: 768px) {
          #wins { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
