import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LINKEDIN_POSTS, type LinkedInPost } from '../data/linkedinPosts'
import { FiChevronLeft, FiChevronRight, FiLinkedin, FiExternalLink } from 'react-icons/fi'

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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + LINKEDIN_POSTS.length) % LINKEDIN_POSTS.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % LINKEDIN_POSTS.length)
  }

  return (
    <section id="wins" style={{
      padding: '96px 64px 80px',
      background: 'var(--void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative cyber grids */}
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

        {/* 3D Stack Carousel Container */}
        <div style={{
          position: 'relative',
          height: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          margin: '0 auto',
          maxWidth: '850px',
        }}>
          {LINKEDIN_POSTS.map((post, index) => {
            // Determine active positioning
            let offset = index - activeIndex
            
            // Handle circular wrapping for stack feel
            if (offset < -LINKEDIN_POSTS.length / 2) {
              offset += LINKEDIN_POSTS.length
            } else if (offset > LINKEDIN_POSTS.length / 2) {
              offset -= LINKEDIN_POSTS.length
            }

            const isActive = index === activeIndex
            const isVisible = Math.abs(offset) <= 2
            
            // Transform calculations
            const xTranslation = offset * 140
            const zTranslation = Math.abs(offset) * -180
            const rotationY = offset * -25
            const scale = 1 - Math.abs(offset) * 0.12
            const opacity = isVisible ? (isActive ? 1 : 0.65 - Math.abs(offset) * 0.2) : 0

            return (
              <motion.div
                key={post.id}
                ref={(el) => (cardRefs.current[index] = el)}
                animate={{
                  x: xTranslation,
                  z: zTranslation,
                  rotateY: rotationY,
                  scale: scale,
                  opacity: opacity,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  maxWidth: '380px',
                  height: '460px',
                  borderRadius: '16px',
                  background: 'var(--dungeon)',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.45)' : '0.5px solid var(--border)',
                  boxShadow: isActive 
                    ? '0 20px 40px rgba(6, 182, 212, 0.15), inset 0 0 20px rgba(6, 182, 212, 0.05)'
                    : '0 10px 25px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  zIndex: 10 - Math.abs(offset),
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => {
                  if (!isActive) setActiveIndex(index)
                }}
                whileHover={isActive ? {
                  y: -8,
                  boxShadow: '0 25px 50px rgba(124, 58, 237, 0.25), inset 0 0 24px rgba(124, 58, 237, 0.1)',
                  borderColor: 'rgba(124, 58, 237, 0.6)',
                } : {}}
              >
                {/* Parallax Image Header Container */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {/* Subtle Neon Glow Line */}
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
                      filter: isActive ? 'grayscale(0) contrast(1.05)' : 'grayscale(0.4) contrast(0.9)',
                      transition: 'transform 0.5s ease, filter 0.5s ease',
                    }}
                    className="wins-card-img"
                  />

                  {/* LinkedIn Logo Tag */}
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

                  {/* Badge Pill overlay */}
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

                {/* Card Content body */}
                <div style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                  background: 'linear-gradient(to bottom, var(--dungeon) 0%, rgba(10, 10, 12, 0.95) 100%)',
                }}>
                  <div>
                    {/* Date stamp */}
                    <p style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '11px',
                      color: 'var(--stone)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}>
                      [ TRANSMISSION_DATE: {formatDate(post.date)} ]
                    </p>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      color: 'var(--ghost)',
                      lineHeight: 1.3,
                      marginBottom: '10px',
                    }}>
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p style={{
                      color: 'var(--stone)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.summary}
                    </p>
                  </div>

                  {/* Card Footer action button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    borderTop: '0.5px solid var(--border)',
                    paddingTop: '12px',
                  }}>
                    <span style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      QUEST_STATUS: COMPLETE
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
              {LINKEDIN_POSTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: i === activeIndex ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: i === activeIndex ? 'var(--gate)' : 'var(--border)',
                    boxShadow: i === activeIndex ? '0 0 10px rgba(59, 130, 246, 0.6)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  title={`Level ${i + 1}`}
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
            SYSTEM DECK: ACTIVE POST [0{activeIndex + 1} / 0{LINKEDIN_POSTS.length}]
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
        @media (max-width: 768px) {
          #wins { padding: 96px 24px 64px !important; }
          .wins-card-img { filter: grayscale(0) !important; }
        }
      `}</style>
    </section>
  )
}
