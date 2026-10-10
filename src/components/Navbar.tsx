import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const NAV_LINKS = [
  { label: 'Solo-P-Leveller', href: '#hero' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Hall of Fame',     href: '#wins' },
  { label: 'Projects', href: '#projects' },
  { label: 'Events',   href: '#events' },
  { label: 'Books',    href: '#publications' },
  { label: 'Contact',  href: '#contact' },
]

const SECTIONS = NAV_LINKS.map(l => l.href.slice(1))

interface NavbarProps {
  isMuted: boolean
  toggleMute: () => void
}

export default function Navbar({ isMuted, toggleMute }: NavbarProps) {
  const [active, setActive] = useState('hero')
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setHidden(false) // Navbar stays visible
    }
  })

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div 
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        paddingTop: 24,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div className="nav-container" style={{
        background: 'rgba(10, 10, 18, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '30px',
        padding: '8px 24px',
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        pointerEvents: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '90vw',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}>
        {NAV_LINKS.map(link => {
          const id = link.href.slice(1)
          const isActive = active === id
          return (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="nav-item"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 14,
                color: isActive ? 'var(--gate)' : 'var(--stone)',
                position: 'relative',
                padding: '4px 8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ghost)'}
              onMouseLeave={e => e.currentTarget.style.color = isActive ? 'var(--gate)' : 'var(--stone)'}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--gate)',
                    borderRadius: 2
                  }}
                />
              )}
            </button>
          )
        })}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '0 4px' }} />
        
        <a href="https://github.com/Sarveshsivasankaran" target="_blank" rel="noreferrer"
          style={{ color: 'var(--stone)', fontSize: 18, transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
        ><FaGithub /></a>
        <a href="https://www.linkedin.com/in/sarvesh-sivasankaran/" target="_blank" rel="noreferrer"
          style={{ color: 'var(--stone)', fontSize: 18, transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
        ><FaLinkedin /></a>
      </div>
      </div>
      


      <style>{`
        .nav-container::-webkit-scrollbar {
          display: none;
        }
        .nav-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  )
}
