import { Suspense, lazy, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FiArrowDown } from 'react-icons/fi'
import CursorLens from './CursorLens'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lazy-load Spline to avoid blocking initial render
const Spline = lazy(() => import('@splinetool/react-spline'))

// Interactive 3D Spline background (particle wave/vortex)
const SPLINE_URL = 'https://prod.spline.design/kZiQZ1hp09EE5chm/scene.splinecode'

const TYPEWRITER_STRINGS = [
  'Full Stack Developer',
  'Open Source Builder',
  'Problem Solver',
  'Event Organizer',
  'Solo-P-Leveller',
  'Public Speaker',
  'CTF Player',
  'IOT Enthusiast',
  'AI Enthusiast',
]

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
}

// Animated portal fallback (shown while Spline loads or if no scene URL)
function PortalFallback() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow rings */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          borderRadius: '50%',
          border: `${4 - i}px solid`,
          borderColor: i === 1 ? 'rgba(59,130,246,0.6)' : i === 2 ? 'rgba(124,58,237,0.4)' : 'rgba(6,182,212,0.2)',
          width: `${180 + i * 70}px`,
          height: `${180 + i * 70}px`,
          animation: `spin${i} ${8 + i * 4}s linear infinite`,
        }} />
      ))}
      {/* Inner portal glow */}
      <div style={{
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(124,58,237,0.2) 50%, transparent 70%)',
        boxShadow: '0 0 60px rgba(59,130,246,0.4), 0 0 120px rgba(124,58,237,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700,
          fontSize: 48,
          background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>SS</span>
      </div>
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: 'var(--gate)',
          opacity: 0.4 + (i % 4) * 0.15,
          top: `${10 + (i * 17) % 80}%`,
          left: `${5 + (i * 13) % 90}%`,
          animation: `floatParticle ${3 + (i % 3)}s ease-in-out ${i * 0.3}s infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes spin1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spin3 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes floatParticle { from { transform: translateY(0); } to { transform: translateY(-20px); } }
      `}</style>
    </div>
  )
}

interface HeroProps {
  isMuted: boolean
  toggleMute: () => void
}

export default function Hero({ isMuted, toggleMute }: HeroProps) {
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineError, setSplineError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const splineApp = useRef<any>(null)

  function onSplineLoad(app: any) {
    splineApp.current = app
    setSplineLoaded(true)

    // Build dynamic scroll-based camera and vortex rotation animation
    gsap.to({}, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.0, // Smooth real-time scrubbing
        onUpdate: (self) => {
          if (!splineApp.current) return
          try {
            const camera = splineApp.current.findObjectByName('Camera')
            if (camera) {
              // Rotate particle vortex around Y-axis as user scrolls, and add slight roll angle
              camera.rotation.y = self.progress * Math.PI * 0.4 // Orbit camera 72 degrees
              camera.position.y = self.progress * 150 // Scroll up/down camera parallax
            } else {
              splineApp.current.setZoom(1.0 - self.progress * 0.15) // Subtle zoom out parallax
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // 3D container scroll parallax animation using GPU-accelerated CSS transitions
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-spline-wrapper',
        { rotation: 0, scale: 1.02, y: 0 },
        {
          rotation: 30, // Smooth elegant tilt
          scale: 1.25,  // Deepening zoom
          y: 150,       // Interactive scroll speed offset
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.0,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0px 64px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Sound Mute/Unmute Toggle Button */}
      <button 
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          zIndex: 100,
          background: 'rgba(10, 10, 18, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(0, 212, 255, 0.45)',
          boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isMuted ? 'rgba(255, 255, 255, 0.35)' : '#00d4ff',
          transition: 'all 0.2s ease-in-out',
        }}
        className="sound-toggle-btn"
        aria-label={isMuted ? 'Unmute Background Music' : 'Mute Background Music'}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = isMuted ? 'rgba(255,255,255,0.6)' : '#00d4ff'
          e.currentTarget.style.boxShadow = isMuted ? '0 0 15px rgba(255,255,255,0.2)' : '0 0 25px rgba(0, 212, 255, 0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isMuted ? 'rgba(0, 212, 255, 0.25)' : 'rgba(0, 212, 255, 0.45)'
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.15)'
        }}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="sound-wave wave-1"></span>
            <span className="sound-wave wave-2"></span>
          </div>
        )}
      </button>
      {/* 1. Full-Screen Height Interactive 3D CursorLens Background Portrait */}
      <div className="hero-framer-container" style={{
        position: 'absolute',
        top: '0px',
        bottom: 0,
        right: 0,
        left: 'auto', // Don't stretch to left edge — keep anchored right
        width: '56vw', // Narrower container matching image's near-square aspect ratio to eliminate 47% vertical crop
        zIndex: 5, // Raised above ribbons (3) and vignette (4)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          // Soft linear bottom mask to blend the full-screen portrait seamlessly
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }} className="hero-framer-mask">
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            pointerEvents: 'auto',
            borderRadius: '24px',
            overflow: 'hidden',
            // Subtle premium glowing border to clearly define the rounded overlay corners in S-rank style
            border: 'none',
            boxShadow: 'none',
          }} className="hero-framer-inner">
            <CursorLens 
              baseImage="/outer image-bgr.png"
              revealImage="/beard image-inner-bdr.png"
              objectFit="cover"
              blobSize={260} // Adjusted cursor lens size as requested
              previewCursor={false} // Ensure the reveal lens is invisible when the cursor is not hovering
              scale={1.0} // Full scale — container aspect ratio now matches image, no extra zoom-out needed
              backgroundPosition={isMobile ? 'center' : 'center'} // Center portrait in the properly-sized container
              showBackground={true} // Enable background circles as requested
            />

          </div>
        </div>
      </div>

      {/* 2. Interactive 3D Spline Vortex Background Layer */}
      {(!splineLoaded || splineError) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.35,
        }}>
          <PortalFallback />
        </div>
      )}
      {!splineError && (
        <Suspense fallback={null}>
          <div className="hero-spline-wrapper" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.25,
            willChange: 'transform',
            display: splineLoaded ? 'block' : 'none',
          }}>
            <Spline 
              scene={SPLINE_URL} 
              onLoad={onSplineLoad}
              onError={() => setSplineError(true)}
            />
          </div>
        </Suspense>
      )}

      {/* 3. Cybernetic Background Topo-Curves & Intersecting Diagonal Scrolling Ribbons Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {/* Curved contour vector curves */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
          <path d="M-100,200 C300,100 800,400 1300,250 C1800,100 2100,300 2300,150" fill="none" stroke="var(--gate)" strokeWidth="1.5" />
          <path d="M-100,350 C400,250 700,550 1200,400 C1700,250 2000,450 2300,300" fill="none" stroke="var(--teal)" strokeWidth="1" />
          <path d="M-100,500 C300,400 900,700 1400,550 C1900,400 2100,600 2300,450" fill="none" stroke="var(--gate)" strokeWidth="1.5" />
        </svg>

        {/* Diagonal Ribbon 1 (Gate Blue) */}
        <div style={{
          position: 'absolute',
          top: '32%',
          left: '-10%',
          width: '120%',
          height: '42px',
          background: 'rgba(59, 130, 246, 0.95)', // Gate Blue (#3B82F6)
          borderTop: '2px solid rgba(255, 255, 255, 0.4)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.45)',
          transform: 'rotate(-10deg)',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          <div className="hero-ribbon-content-left" style={{
            display: 'inline-flex',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '15px',
            fontWeight: 700,
            color: '#0A0A12', // Void Black text
            letterSpacing: '0.15em',
            animation: 'ribbonScrollLeft 24s linear infinite',
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={{ paddingRight: '50px' }}>
                SARVESH SIVASANKARAN // SOLO-P-LEVELLER // ソロPレベラー // S-RANK SYSTEM // ACTIVE QUEST //  覚悟 //
              </span>
            ))}
          </div>
        </div>

        {/* Diagonal Ribbon 2 (Mana Teal) */}
        <div style={{
          position: 'absolute',
          top: '52%',
          left: '-10%',
          width: '120%',
          height: '42px',
          background: 'rgba(6, 182, 212, 0.9)', // Mana Teal (#06B6D4)
          borderTop: '2px solid rgba(255, 255, 255, 0.4)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.45)',
          transform: 'rotate(12deg)',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          <div className="hero-ribbon-content-right" style={{
            display: 'inline-flex',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '15px',
            fontWeight: 700,
            color: '#0A0A12', // Void Black text
            letterSpacing: '0.15em',
            animation: 'ribbonScrollRight 24s linear infinite',
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={{ paddingRight: '50px' }}>
                SHADOW MONARCH // 影の君主 // LEVEL UP ACTIVE // CLASS: FULL-STACK // 決意 //
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Readability Dark Horizontal Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(10, 10, 18, 0.9) 0%, rgba(10, 10, 18, 0.6) 40%, rgba(10, 10, 18, 0) 100%)',
        zIndex: 4, // Behind portrait container (5) to let the character cutout shine bright, showing through the transparent PNG background
        pointerEvents: 'none',
      }} />

      {/* Column 1: Left Text Content */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 10, maxWidth: 720 }}
        className="hero-text-pane"
      >
        {/* Section label */}
        <motion.p variants={stagger.item} className="section-label">
          // INITIALIZING SYSTEM
        </motion.p>

        {/* Name */}
        <motion.h1 variants={stagger.item} style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(52px, 7vw, 92px)',
          lineHeight: 1.0,
          marginBottom: 4,
          textShadow: '0 4px 12px rgba(10, 10, 18, 0.5)',
        }}>
          Sarvesh
          <br />
          <span style={{
            color: '#F59E0B',
          }}>
            Sivasankaran
          </span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div variants={stagger.item} style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(16px, 2vw, 22px)',
          color: 'var(--teal)',
          marginTop: 12,
          marginBottom: 16,
          minHeight: 32,
          textShadow: '0 2px 8px rgba(10, 10, 18, 0.5)',
        }}>
          <Typewriter
            options={{
              strings: TYPEWRITER_STRINGS,
              autoStart: true,
              loop: true,
              cursor: '_',
              cursorClassName: 'typewriter-cursor',
              delay: 60,
              deleteSpeed: 30,
            }}
          />
        </motion.div>

        {/* Blurb */}
        <motion.p variants={stagger.item} style={{
          color: 'var(--stone)',
          fontSize: 17,
          lineHeight: 1.7,
          maxWidth: 500,
          marginBottom: 32,
          textShadow: '0 2px 8px rgba(10, 10, 18, 0.5)',
        }}>
          Building things that matter.
          <br />
          From Chennai, India.
        </motion.p>

        {/* CTA row */}
        <motion.div variants={stagger.item} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 36 }} className="hero-cta-row">
          <button className="btn-primary" onClick={scrollToProjects} id="hero-view-projects">
            View Projects
          </button>
          <a
            href="https://drive.google.com/uc?export=download&id=19Czf6xdxeH9e7yNvngj3-Sg3CWG6h35X"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            id="hero-download-resume"
            style={{ background: 'rgba(17, 24, 39, 0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Download Resume
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div variants={stagger.item} style={{ display: 'flex', gap: 24 }}>
          {[
            { icon: <FaGithub size={28} />, href: 'https://github.com/Sarveshsivasankaran', label: 'GitHub' },
            { icon: <FaLinkedin size={28} />, href: 'https://www.linkedin.com/in/sarvesh-sivasankaran/', label: 'LinkedIn' },
          ].map(({ icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{ color: 'var(--stone)', transition: 'color 0.15s' }}
              aria-label={label}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
            >
              {icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Bounce arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--gate)',
          fontSize: 24,
          animation: 'bounce 2s ease-in-out infinite',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <FiArrowDown />
      </motion.div>

      <style>{`
        .sound-toggle-btn:active {
          transform: scale(0.92);
        }
        .sound-wave {
          position: absolute;
          border: 1.5px solid #00d4ff;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .wave-1 {
          width: 32px;
          height: 32px;
          animation: sound-pulse 1.8s infinite linear;
        }
        .wave-2 {
          width: 44px;
          height: 44px;
          animation: sound-pulse 1.8s infinite linear 0.9s;
        }
        @keyframes sound-pulse {
          0% { transform: scale(0.6); opacity: 0; }
          50% { opacity: 0.35; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .typewriter-cursor { color: var(--gate) !important; }
        @keyframes ribbonScrollLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ribbonScrollRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (max-width: 1024px) {
          #hero {
            padding: 0px 24px 60px !important;
            flex-direction: column !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .hero-text-pane {
            background: rgba(10, 10, 18, 0.45) !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            border: 1px solid rgba(59, 130, 246, 0.15) !important;
            border-radius: 16px !important;
            padding: 36px 24px !important;
            max-width: 100% !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
            margin-top: 100px !important;
          }
          .hero-framer-container {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .hero-cta-row {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}
