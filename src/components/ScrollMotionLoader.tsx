import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SectionItem {
  id: string
  label: string
  code: string
}

const SECTIONS: SectionItem[] = [
  { id: 'hero', label: 'Monarch Hub', code: '01/HERO' },
  { id: 'skills', label: 'Hunter Skills', code: '02/SKILLS' },
  { id: 'marquee-banner', label: 'Domain Expansion', code: '03/DOMAIN' },
  { id: 'projects', label: 'Dungeon Raids', code: '04/PROJECTS' },
  { id: 'wins', label: 'Rank Victories', code: '05/WINS' },
  { id: 'events', label: 'Global Raids', code: '06/EVENTS' },
  { id: 'publications', label: 'Mana Archives', code: '07/PAPERS' },
  { id: 'contact', label: 'System Quest', code: '08/CONTACT' },
]

export default function ScrollMotionLoader() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [isLoadingTransition, setIsLoadingTransition] = useState(false)
  const lastSectionRef = useRef<string>('hero')

  // Smooth scroll progress & section detection via IntersectionObserver / scroll tick
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate global scroll progress percentage
          const winScroll = window.scrollY
          const height = document.documentElement.scrollHeight - window.innerHeight
          const progress = height > 0 ? (winScroll / height) * 100 : 0
          setScrollProgress(progress)

          // Detect active section
          const scrollPos = window.scrollY + window.innerHeight * 0.35
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(SECTIONS[i].id)
            if (el) {
              const top = el.offsetTop
              const height = el.offsetHeight
              if (scrollPos >= top && scrollPos < top + height) {
                if (SECTIONS[i].id !== lastSectionRef.current) {
                  lastSectionRef.current = SECTIONS[i].id
                  setActiveSection(SECTIONS[i].id)
                  
                  // Trigger quick micro-motion loading pulse when switching sections
                  setIsLoadingTransition(true)
                  setTimeout(() => setIsLoadingTransition(false), 600)
                }
                break
              }
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const currentSectionObj = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0]

  return (
    <>
      {/* 1. Global Holographic Top Scroll Motion Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 100000,
        pointerEvents: 'none',
        background: 'rgba(10, 10, 18, 0.4)',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 55%, #7C3AED 100%)',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(124, 58, 237, 0.5)',
            width: `${scrollProgress}%`,
            willChange: 'width',
          }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>

      {/* 2. Inter-Section Motion Loading Transition Laser Overlay */}
      <AnimatePresence>
        {isLoadingTransition && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 1.05 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '2.5px',
              background: '#00d4ff',
              boxShadow: '0 0 25px #00d4ff, 0 0 40px #7C3AED',
              zIndex: 99999,
              transformOrigin: 'left center',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. Floating Sci-Fi Section Motion HUD Navigator (Right Side) */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          pointerEvents: 'auto',
        }}
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        aria-label="Section Navigation"
      >
        {/* Floating Active Section Status HUD Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              background: 'rgba(10, 10, 18, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 212, 255, 0.35)',
              boxShadow: '0 0 16px rgba(0, 212, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px',
              color: '#00d4ff',
              letterSpacing: '0.12em',
              marginBottom: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00d4ff',
              boxShadow: '0 0 8px #00d4ff',
              display: 'inline-block',
            }} />
            <span style={{ color: '#9CA3AF' }}>{currentSectionObj.code}</span>
            <span style={{ fontWeight: 700, color: '#F1F5F9' }}>{currentSectionObj.label}</span>
          </motion.div>
        </AnimatePresence>

        {/* Section Dots List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          background: 'rgba(10, 10, 18, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          padding: '10px 8px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}>
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                }}
                aria-label={`Scroll to ${sec.label}`}
                title={sec.label}
              >
                {/* Dot graphic */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.35 : 1,
                    backgroundColor: isActive ? '#00d4ff' : 'rgba(156, 163, 175, 0.35)',
                    boxShadow: isActive ? '0 0 12px #00d4ff, 0 0 20px rgba(124, 58, 237, 0.6)' : 'none',
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    willChange: 'transform, background-color',
                  }}
                />

                {/* Hover label hint */}
                {isNavHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: -16 }}
                    style={{
                      position: 'absolute',
                      right: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(10, 10, 18, 0.85)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: isActive ? '#00d4ff' : '#9CA3AF',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {sec.label}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
