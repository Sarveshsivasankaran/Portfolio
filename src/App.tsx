import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import MarqueeSection from './components/MarqueeSection'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Wins from './components/Wins'
import Events from './components/Events'
import Publications from './components/Publications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SystemEntry from './components/SystemEntry'
import BlueParticleBackground from './components/BlueParticleBackground'
import CustomCursor from './components/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasEnteredSystem') === 'true'
    }
    return false
  })

  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('siteMuted') === 'true'
    }
    return false
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { scrollYProgress } = useScroll()

  // Scroll listener to show/hide go-up button with throttling
  useEffect(() => {
    if (!hasEntered) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > window.innerHeight - 80) {
            setShowScrollTop(true)
          } else {
            setShowScrollTop(false)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasEntered])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const [bgAudio] = useState(() => {
    const a = new Audio('/sound/dark_aria_lofi_solo_le.mp3')
    a.loop = true
    a.volume = 0.2
    return a
  })

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        bgAudio.pause()
      } else if (hasEntered && !isMuted) {
        bgAudio.play().catch(err => {
          console.warn('Dark Aria audio playback was blocked or failed:', err)
        })
      }
    }

    if (hasEntered) {
      if (isMuted || document.hidden) {
        bgAudio.pause()
      } else {
        bgAudio.play().catch(err => {
          console.warn('Dark Aria audio playback was blocked or failed:', err)
        })
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      bgAudio.pause()
    }
  }, [hasEntered, isMuted, bgAudio])

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev
      localStorage.setItem('siteMuted', String(next))
      return next
    })
  }

  // Lock body scroll while in system entry sequence
  useEffect(() => {
    if (!hasEntered) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [hasEntered])

  // Global scroll-driven multi-plane section parallax animations (60fps)
  useEffect(() => {
    if (!hasEntered) return

    const ctx = gsap.context(() => {
      // Exclude #projects to avoid interfering with its own ScrollTrigger pinning logic
      const sections = ['#about', '#skills', '#marquee-banner', '#wins', '#events', '#publications', '#contact']
      
      sections.forEach((selector) => {
        const el = document.querySelector(selector)
        if (!el) return

        // Clean, modern fade-up motion
        gsap.fromTo(el,
          { 
            opacity: 0, 
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      })
    })

    // Magnetic Button Effect
    const magneticElements = document.querySelectorAll('.btn-primary:not(.no-magnetic), .btn-ghost:not(.no-magnetic), button:not(.nav-item):not(.no-magnetic)')
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const btn = mouseEvent.currentTarget as HTMLElement
      const rect = btn.getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left - rect.width / 2
      const y = mouseEvent.clientY - rect.top - rect.height / 2
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }
    const handleMouseLeave = (e: Event) => {
      const btn = e.currentTarget as HTMLElement
      btn.style.transform = 'translate(0px, 0px)'
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }
    const handleMouseEnter = (e: Event) => {
      const btn = e.currentTarget as HTMLElement
      btn.style.transition = 'none' // Remove transition for instant follow
    }

    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove)
      btn.addEventListener('mouseleave', handleMouseLeave)
      btn.addEventListener('mouseenter', handleMouseEnter)
      ;(btn as HTMLElement).style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    })

    return () => {
      magneticElements.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove)
        btn.removeEventListener('mouseleave', handleMouseLeave)
        btn.removeEventListener('mouseenter', handleMouseEnter)
      })
      ctx.revert()
    }
  }, [hasEntered])

  if (!hasEntered) {
    return (
      <SystemEntry 
        onEnter={() => {
          setHasEntered(true)
          sessionStorage.setItem('hasEnteredSystem', 'true')
        }} 
      />
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mainFadeIn {
          from { opacity: 0; transform: scale(0.985); }
          to { opacity: 1; transform: none; }
        }
        .main-reveal {
          animation: mainFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: opacity, transform;
          position: relative;
          z-index: 1;
        }
        section[id] {
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
          position: relative;
          z-index: 2;
        }
      ` }} />
      <BlueParticleBackground />
      <CustomCursor />
      <motion.div
        className="progress-bar"
        style={{
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--gate), var(--teal))',
          transformOrigin: '0%',
          zIndex: 999999
        }}
      />
      <div className="main-reveal">
        {/* Non-sticky Logo */}
        <img 
          src="/invader-logo.png" 
          alt="Space Invader Logo" 
          style={{
            position: 'absolute',
            top: '24px',
            left: '32px',
            width: '40px',
            height: '40px',
            zIndex: 100,
            objectFit: 'contain'
          }}
        />
        {/* Top Right Controls: Resume & Sound (Non-sticky) */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <a 
            href="https://drive.google.com/uc?export=download&id=19Czf6xdxeH9e7yNvngj3-Sg3CWG6h35X"
            target="_blank"
            rel="noreferrer"
            className="magnetic-btn"
            style={{ 
               display: 'flex', alignItems: 'center', gap: '6px',
               background: 'linear-gradient(135deg, var(--gate), #2563eb)', color: '#ffffff',
               padding: '0 16px', borderRadius: '20px', height: '40px',
               fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
               textDecoration: 'none', fontWeight: 'bold',
               boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
               transition: 'all 0.2s ease',
               pointerEvents: 'auto',
               whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            <span>RESUME</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          <button
            onClick={toggleMute}
            style={{
              background: 'rgba(10, 10, 18, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(0, 212, 255, 0.45)',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isMuted ? 'rgba(255, 255, 255, 0.35)' : '#00d4ff',
              transition: 'all 0.2s ease-in-out',
              pointerEvents: 'auto'
            }}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
                <span className="sound-bar" style={{ animationDelay: '0s' }}></span>
                <span className="sound-bar" style={{ animationDelay: '0.2s' }}></span>
                <span className="sound-bar" style={{ animationDelay: '0.4s' }}></span>
                <span className="sound-bar" style={{ animationDelay: '0.1s' }}></span>
              </div>
            )}
          </button>
        </div>
        <Navbar isMuted={isMuted} toggleMute={toggleMute} />
        <main>
          <Hero isMuted={isMuted} toggleMute={toggleMute} />
          <About />
          <Skills />
          <MarqueeSection />
          <Wins />
          <Projects />
          <Events />
          <Publications />
          <Contact />
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 99999, // Floating above everything including the footer
          background: 'rgba(10, 10, 18, 0.18)', // Transparent background
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1.2px solid rgba(0, 212, 255, 0.25)', // Subtle cyan border
          boxShadow: '0 0 12px rgba(0, 212, 255, 0.05)',
          borderRadius: '50%', // Round shape
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(0, 212, 255, 0.55)', // Subtle color
          transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? 'auto' : 'none',
          transform: showScrollTop ? 'translateY(0)' : 'translateY(16px)',
        }}
        className="scroll-to-top-btn"
        aria-label="Scroll to top"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#00d4ff'
          e.currentTarget.style.color = '#00d4ff'
          e.currentTarget.style.background = 'rgba(10, 10, 18, 0.45)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.35)'
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.25)'
          e.currentTarget.style.color = 'rgba(0, 212, 255, 0.55)'
          e.currentTarget.style.background = 'rgba(10, 10, 18, 0.18)'
          e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}
