import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeSection from './components/MarqueeSection'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Wins from './components/Wins'
import Events from './components/Events'
import Publications from './components/Publications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SystemEntry from './components/SystemEntry'
import ScrollMotionLoader from './components/ScrollMotionLoader'
import ParallaxBackground from './components/ParallaxBackground'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasEnteredSystem') === 'true'
    }
    return false
  })

  const [isMuted, setIsMuted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

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
    a.volume = 0.5
    return a
  })

  useEffect(() => {
    if (hasEntered) {
      if (isMuted) {
        bgAudio.pause()
      } else {
        bgAudio.play().catch(err => {
          console.warn('Dark Aria audio playback was blocked or failed:', err)
        })
      }
    }
    return () => {
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
      const sections = ['#skills', '#marquee-banner', '#projects', '#wins', '#events', '#publications', '#contact']
      
      sections.forEach((selector) => {
        const el = document.querySelector(selector)
        if (!el) return

        // Section container entry motion
        gsap.fromTo(el,
          { 
            opacity: 0, 
            y: 45,
            scale: 0.985,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      })

      // Multi-plane parallax shifts on section sub-elements during scroll
      const parallaxSections = document.querySelectorAll('section[id]')
      parallaxSections.forEach((section) => {
        const id = section.getAttribute('id')
        if (id === 'hero') return

        const heading = section.querySelector('.section-label, .section-heading')
        const bgDeco = section.querySelector('.room-atmosphere, canvas, .marquee-3d-container')

        // Header parallax float
        if (heading) {
          gsap.fromTo(heading,
            { y: 35 },
            {
              y: -25,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              }
            }
          )
        }

        // Background decorative element parallax shift
        if (bgDeco) {
          gsap.fromTo(bgDeco,
            { y: -50 },
            {
              y: 50,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              }
            }
          )
        }
      })
    })

    return () => ctx.revert()
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
      <ParallaxBackground />
      <div className="main-reveal">
        <ScrollMotionLoader />
        <Navbar />
        <main>
          <Hero isMuted={isMuted} toggleMute={toggleMute} />
          <Skills />
          <MarqueeSection />
          <Projects />
          <Wins />
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
