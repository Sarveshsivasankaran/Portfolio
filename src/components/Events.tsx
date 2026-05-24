import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMaximize2 } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDriveImages } from '../hooks/useDriveImages'
import { DRIVE_IMAGES } from '../data/driveImages'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/pnf7pGj7N51D0PzY/scene.splinecode'

gsap.registerPlugin(ScrollTrigger)


// Placeholder shimmer cards for fallback / loading
function ShimmerCard() {
  return (
    <div className="skeleton" style={{
      width: '320px',
      height: '240px',
      borderRadius: 12,
      flexShrink: 0,
    }} />
  )
}

interface EventImageProps {
  src: string
  alt: string
  onClick: () => void
}

// Individual image card
function EventImage({ src, alt, onClick }: EventImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        width: 'auto', // Dynamic width wrapper
        height: '240px',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        backgroundColor: '#0c0c16',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04) translateY(-4px)'
        e.currentTarget.style.borderColor = 'var(--gate)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: 'auto', // Dynamic proportional width
          height: '100%',
          maxWidth: '480px', // Prevent overly wide landscape cards
          minWidth: '120px', // Nice default baseline size
          objectFit: 'contain',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
      {/* Dynamic Hover Holographic Scan line & icon */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.15))',
        opacity: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s',
        zIndex: 5,
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
      >
        <div style={{
          background: 'rgba(10, 10, 18, 0.85)',
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid var(--gate)',
          color: 'var(--teal)',
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
        }}>
          <FiMaximize2 size={13} />
          <span>VIEW RECORD</span>
        </div>
      </div>
    </div>
  )
}

interface MarqueeRowProps {
  images: { id?: string; thumbnailUrl: string; name: string }[]
  duration: number
  reverse: boolean
  onImageClick: (img: { id?: string; thumbnailUrl: string; name: string }) => void
}

// Horizontal scroll row with pause-on-hover
function MarqueeRow({
  images,
  duration,
  reverse,
  onImageClick,
}: MarqueeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (rowRef.current) rowRef.current.style.animationPlayState = 'paused'
  }
  const handleMouseLeave = () => {
    if (rowRef.current) rowRef.current.style.animationPlayState = 'running'
  }

  // Duplicate images multiple times to ensure continuous seamless horizontal scroll width
  const doubled = [...images, ...images, ...images]

  return (
    <div
      style={{ overflow: 'hidden', width: '100%', padding: '8px 0' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={rowRef}
        style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animation: `scrollHorizontal ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {doubled.map((img, i) => (
          <EventImage 
            key={`${img.id || img.thumbnailUrl}-${i}`} 
            src={img.thumbnailUrl} 
            alt={img.name}
            onClick={() => onImageClick(img)} 
          />
        ))}
      </div>
    </div>
  )
}

// Static drive images pre-fetched fallback
const PLACEHOLDER_IMAGES = DRIVE_IMAGES

export default function Events() {
  const { data: driveImages, isLoading, isError } = useDriveImages()
  const splineApp = useRef<any>(null)

  // Holographic configurations states
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ id?: string; thumbnailUrl: string; name: string } | null>(null)

  useEffect(() => {
    // 3D container scroll parallax animation using GPU-accelerated CSS transitions
    const ctx = gsap.context(() => {
      gsap.fromTo('.events-spline-wrapper',
        { rotation: 0, scale: 1.1, y: -50 },
        {
          rotation: -25, // Rotate opposite direction
          scale: 1.3,   // Zoom in parallax
          y: 80,        // Downward vertical displacement
          ease: 'none',
          scrollTrigger: {
            trigger: '#events',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Scroll-triggered entrance animations for section content
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('#events .section-label, #events .section-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '#events', start: 'top 80%', once: true }
        }
      )
      // Marquee tracks staggered entrance
      gsap.fromTo('.events-marquee-track',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '#events', start: 'top 75%', once: true }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  function onSplineLoad(app: any) {
    splineApp.current = app
    
    // Hook scroll updates to animate properties of the 3D spline scene dynamically
    gsap.to({}, {
      scrollTrigger: {
        trigger: '#events',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2, // Smooth scrubbing interaction
        onUpdate: (self) => {
          if (!splineApp.current) return
          try {
            const camera = splineApp.current.findObjectByName('Camera')
            if (camera) {
              // Rotate camera on Y-axis slowly as user scrolls
              camera.rotation.y = -self.progress * Math.PI * 0.4
            } else {
              // Fallback: zoom scene dynamically
              splineApp.current.setZoom(1.0 + self.progress * 0.1)
            }
          } catch (e) {
            try {
              splineApp.current.setZoom(1.0 + self.progress * 0.1)
            } catch (err) {}
          }
        }
      }
    })
  }

  const images = (isError || !driveImages || driveImages.length === 0)
    ? PLACEHOLDER_IMAGES
    : driveImages

  // Split images into two horizontal tracks
  const rowA = images.filter((_, i) => i % 2 === 0)
  const rowB = images.filter((_, i) => i % 2 === 1)

  return (
    <section id="events" style={{
      padding: '96px 64px 80px',
      background: 'var(--dungeon)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 3D Interactive Spline Background Canvas */}
      <Suspense fallback={null}>
        <div className="events-spline-wrapper" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.12, // Subtle, dark-mode cyber atmosphere
          willChange: 'transform',
        }}>
          <Spline scene={SPLINE_URL} onLoad={onSplineLoad} />
        </div>
      </Suspense>

      {/* Cyber ambient grids */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '15%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <p className="section-label">// FIELD.OPERATIONS</p>
            <h2 className="section-heading" style={{ margin: 0 }}>Events &amp; Speaking</h2>
          </div>
        </div>

        {/* Dynamic Double Horizontal Opposing Scroll tracks */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
          width: '100%',
          padding: '12px 0',
        }}>
          {/* Left fading overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 120,
            background: 'linear-gradient(to right, var(--dungeon), transparent)',
            zIndex: 10,
            pointerEvents: 'none',
          }} />
          {/* Right fading overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 120,
            background: 'linear-gradient(to left, var(--dungeon), transparent)',
            zIndex: 10,
            pointerEvents: 'none',
          }} />

          {/* Row 1: Slides Left */}
          {isLoading ? (
            <div style={{ display: 'flex', gap: 16 }}>
              {Array.from({ length: 4 }).map((_, i) => <ShimmerCard key={i} />)}
            </div>
          ) : (
            <MarqueeRow 
              images={rowA.length > 0 ? rowA : PLACEHOLDER_IMAGES.filter((_, i) => i % 2 === 0)} 
              duration={65} 
              reverse={false}
              onImageClick={(img) => setActiveLightboxImage(img)}
            />
          )}

          {/* Row 2: Slides Right */}
          {isLoading ? (
            <div style={{ display: 'flex', gap: 16 }}>
              {Array.from({ length: 4 }).map((_, i) => <ShimmerCard key={i} />)}
            </div>
          ) : (
            <MarqueeRow 
              images={rowB.length > 0 ? rowB : PLACEHOLDER_IMAGES.filter((_, i) => i % 2 === 1)} 
              duration={65} 
              reverse={true}
              onImageClick={(img) => setActiveLightboxImage(img)}
            />
          )}
        </div>
      </div>

      {/* --- A. SYSTEM S-RANK LIGHTBOX VIEWER OVERLAY --- */}
      <AnimatePresence>
        {activeLightboxImage && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '24px',
          }}>
            {/* Fullscreen backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxImage(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 5, 10, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'zoom-out',
                zIndex: 1,
              }}
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '90%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                pointerEvents: 'none',
              }}
            >
              {/* Image Frame */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: '70vh',
                background: 'rgba(10, 10, 18, 0.5)',
                borderRadius: 16,
                border: '1.5px solid rgba(6, 182, 212, 0.35)',
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}>
                <img 
                  src={activeLightboxImage.thumbnailUrl} 
                  alt={activeLightboxImage.name} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />

                {/* Close Button on frame */}
                <button
                  onClick={() => setActiveLightboxImage(null)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    background: 'rgba(10, 10, 18, 0.8)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gate)'
                    e.currentTarget.style.transform = 'scale(1.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Holographic Intel Readout Dashboard */}
              <div style={{
                background: 'rgba(10, 10, 18, 0.85)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 12,
                padding: '16px 24px',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--stone)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                pointerEvents: 'auto',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: 'var(--monarch)', fontWeight: 'bold' }}>// OBJECT INTEL DETECTED</span>
                  <span style={{ color: 'var(--ghost)', fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                    {activeLightboxImage.name.replace(/\.[^/.]+$/, "")}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>RECORD ID</span>
                    <span style={{ color: 'var(--teal)' }}>{activeLightboxImage.id ? activeLightboxImage.id.substring(0, 12) : 'OFFLINE_CACHE'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>STATUS</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '0.1em' }}>S-RANK COMPLETE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      <style>{`
        @keyframes scrollHorizontal {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        @media (max-width: 768px) {
          #events { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
