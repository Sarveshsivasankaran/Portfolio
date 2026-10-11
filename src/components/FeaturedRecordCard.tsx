import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiMaximize2, FiShield, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaLinkedin, FaGithub } from 'react-icons/fa'

export interface EventMedia {
  url: string
  title: string
  type: string // 'certificate' | 'photo'
}

export interface EventRecord {
  id: number
  title: string
  category: string
  issuer: string
  year: string
  badge: string
  description: React.ReactNode
  link: string
  linkText: string
  linkIcon?: 'linkedin' | 'external' | 'github'
  secondaryLink?: string
  secondaryLinkText?: string
  secondaryLinkIcon?: 'linkedin' | 'external' | 'github'
  media: EventMedia[]
}

interface Props {
  event: EventRecord
}

export default function FeaturedRecordCard({ event }: Props) {
  const [viewportWidth, setViewportWidth] = useState(1200)
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isTabletOrMobile = viewportWidth < 1024

  const [wrRotateX, setWrRotateX] = useState(0)
  const [wrRotateY, setWrRotateY] = useState(0)
  const [wrSheenX, setWrSheenX] = useState(50)
  const [wrSheenY, setWrSheenY] = useState(50)
  const [wrHovered, setWrHovered] = useState(false)
  const [wrLightbox, setWrLightbox] = useState(false)
  const [featuredMediaIndex, setFeaturedMediaIndex] = useState(0)

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

  const hasMedia = event.media && event.media.length > 0
  const activeMedia = hasMedia ? event.media[featuredMediaIndex] : null

  useEffect(() => {
    if (!hasMedia || event.media.length <= 1) return;
    if (wrHovered || wrLightbox) return;
    const interval = setInterval(() => {
      setFeaturedMediaIndex(prev => (prev === event.media.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [hasMedia, event.media, wrHovered, wrLightbox]);


  return (
    <>
      <div className="featured-record-card" style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.65) 0%, rgba(10, 10, 18, 0.8) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '16px',
        padding: isTabletOrMobile ? '24px 16px' : '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: isTabletOrMobile ? '1fr' : 'minmax(280px, 1fr) minmax(320px, 1.25fr)',
        gap: isTabletOrMobile ? '24px' : '40px',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
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
                maxWidth: isTabletOrMobile
                  ? (activeMedia?.type === 'certificate' ? '260px' : '100%')
                  : (activeMedia?.type === 'certificate' ? '290px' : '420px'),
                aspectRatio: activeMedia?.type === 'certificate' ? '0.707' : '1.333',
                borderRadius: '12px',
                background: 'rgba(5, 5, 12, 0.95)',
                border: wrHovered ? '2px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: wrHovered
                  ? '0 25px 50px rgba(0,0,0,0.65), 0 0 30px rgba(245,158,11,0.12)'
                  : '0 15px 30px rgba(0,0,0,0.45)',
                cursor: hasMedia ? 'zoom-in' : 'default',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformStyle: 'preserve-3d',
                transition: 'aspect-ratio 0.4s ease-in-out, max-width 0.4s ease-in-out, border-color 0.3s, box-shadow 0.3s',
              }}
              onClick={() => hasMedia && setWrLightbox(true)}
            >
              <AnimatePresence mode="wait">
                {hasMedia && activeMedia ? (
                  <motion.img
                    key={featuredMediaIndex}
                    src={activeMedia.url}
                    alt={activeMedia.title}
                    variants={pageFlipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      zIndex: 2,
                      filter: wrHovered ? 'contrast(1.05) brightness(1.03)' : 'contrast(0.98) brightness(0.85)',
                      transition: 'filter 0.3s',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    zIndex: 3,
                    background: 'linear-gradient(135deg, rgba(17,24,39,0.96) 0%, rgba(10,10,18,0.98) 100%)',
                    fontFamily: 'Share Tech Mono, monospace',
                    textAlign: 'center',
                  }}>
                    <FiShield size={36} color="var(--gold)" style={{ marginBottom: 12, filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.4))', opacity: 0.5 }} />
                    <span style={{ color: 'var(--stone)', fontSize: 13, letterSpacing: '0.05em', marginBottom: 4 }}>NO MEDIA AVAILABLE</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>[ DATA PENDING UPDATE ]</span>
                  </div>
                )}
              </AnimatePresence>

              {hasMedia && (
                <>
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
                </>
              )}
            </motion.div>
          </div>

          {/* Gallery Thumbnail Row */}
          {hasMedia && event.media.length > 1 && (
            <div style={{
              display: 'flex',
              gap: isTabletOrMobile ? '6px' : '10px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: isTabletOrMobile ? '300px' : '380px',
              padding: '6px',
              background: 'rgba(10, 10, 18, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              {event.media.map((media, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setFeaturedMediaIndex(idx)}
                  onClick={() => setFeaturedMediaIndex(idx)}
                  style={{
                    width: isTabletOrMobile ? '38px' : '46px',
                    height: isTabletOrMobile ? '28px' : '34px',
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
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
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
              {event.badge}
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
            {event.title}
          </h3>
          
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '12px',
            color: 'var(--stone)',
            textAlign: isTabletOrMobile ? 'center' : 'left',
            marginBottom: '4px'
          }}>
            <span style={{ color: 'var(--monarch)' }}>{event.category}</span> • {event.issuer} • {event.year}
          </div>

          <div style={{
            color: 'var(--stone)',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: '0 0 12px 0',
            textAlign: isTabletOrMobile ? 'center' : 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {event.description}
          </div>

          {(event.link || event.secondaryLink) && (
            <div style={{ marginTop: 12, width: '100%', display: 'flex', gap: 12, justifyContent: isTabletOrMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (event.link === '#') e.preventDefault()
                  }}
                  style={{
                    textDecoration: 'none',
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
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                    cursor: event.link === '#' ? 'default' : 'pointer',
                    opacity: event.link === '#' ? 0.6 : 1,
                    flex: isTabletOrMobile ? '1 1 auto' : '0 1 auto',
                  }}
                  onMouseEnter={e => {
                    if (event.link === '#') return
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--monarch))'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.4)'
                  }}
                  onMouseLeave={e => {
                    if (event.link === '#') return
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(124, 58, 237, 0.15))'
                    e.currentTarget.style.color = 'var(--gold)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.15)'
                  }}
                >
                  {event.linkIcon === 'linkedin' ? <FaLinkedin size={14} /> : event.linkIcon === 'github' ? <FaGithub size={14} /> : <FiExternalLink size={13} />}
                  <span>{event.linkText}</span>
                </a>
              )}
              {event.secondaryLink && (
                <a
                  href={event.secondaryLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (event.secondaryLink === '#') e.preventDefault()
                  }}
                  style={{
                    textDecoration: 'none',
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
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                    cursor: event.secondaryLink === '#' ? 'default' : 'pointer',
                    opacity: event.secondaryLink === '#' ? 0.6 : 1,
                    flex: isTabletOrMobile ? '1 1 auto' : '0 1 auto',
                  }}
                  onMouseEnter={e => {
                    if (event.secondaryLink === '#') return
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--monarch))'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.4)'
                  }}
                  onMouseLeave={e => {
                    if (event.secondaryLink === '#') return
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(124, 58, 237, 0.15))'
                    e.currentTarget.style.color = 'var(--gold)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.15)'
                  }}
                >
                  {event.secondaryLinkIcon === 'linkedin' ? <FaLinkedin size={14} /> : event.secondaryLinkIcon === 'github' ? <FaGithub size={14} /> : <FiExternalLink size={13} />}
                  <span>{event.secondaryLinkText}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- WORLD RECORD HIGH-RES LIGHTBOX MODAL --- */}
      {createPortal(
        <AnimatePresence>
        {wrLightbox && hasMedia && activeMedia && (
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
                {event.media.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFeaturedMediaIndex((prev) => (prev === 0 ? event.media.length - 1 : prev - 1))
                    }}
                    style={{
                      position: 'absolute',
                      left: '20px',
                      zIndex: 20,
                      background: 'rgba(10, 10, 18, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ghost)',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <FiChevronLeft size={24} />
                  </button>
                )}

                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  referrerPolicy="no-referrer"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />

                {/* Right navigation arrow */}
                {event.media.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFeaturedMediaIndex((prev) => (prev === event.media.length - 1 ? 0 : prev + 1))
                    }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      zIndex: 20,
                      background: 'rgba(10, 10, 18, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ghost)',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <FiChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* Close Button and Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h4 style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 24, color: 'var(--ghost)', fontWeight: 600 }}>
                    {activeMedia.title}
                  </h4>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--stone)' }}>
                    [ ARCHIVE MEDIA #{featuredMediaIndex + 1} / {event.media.length} ]
                  </span>
                </div>

                <button
                  onClick={() => setWrLightbox(false)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FiX size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>
      , document.body)}
    </>
  )
}
