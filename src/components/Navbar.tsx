import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiMenu, HiX } from 'react-icons/hi'

const NAV_LINKS = [
  { label: 'Hero',     href: '#hero' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Wins',     href: '#wins' },
  { label: 'Events',   href: '#events' },
  { label: 'Contact',  href: '#contact' },
]

const SECTIONS = NAV_LINKS.map(l => l.href.slice(1))

export default function Navbar() {
  const [active, setActive]   = useState('hero')
  const [open, setOpen]       = useState(false)

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
    setOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Floating S-Rank Menu Toggle Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        style={{
          position: 'sticky',
          top: 24,
          left: 24,
          zIndex: 101,
          marginBottom: -48,
          background: 'rgba(10, 10, 18, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--ghost)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none',
        }}
        className="navbar-toggle-btn"
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--gate)'
          e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.45)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)'
        }}
      >
        {open ? <HiX size={22} /> : <HiMenu size={22} />}
      </button>

      {/* Retractable Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <div style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            zIndex: 99,
          }}>
            {/* Backdrop dimming overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(5, 5, 10, 0.45)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 99,
              }}
            />

            {/* Side Drawer System Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 290,
                height: '100vh',
                maxWidth: '85vw',
                background: 'rgba(10, 10, 18, 0.95)',
                borderRight: '1px solid rgba(59, 130, 246, 0.15)',
                boxShadow: '10px 0 35px rgba(0, 0, 0, 0.65)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                padding: '96px 32px 40px',
              }}
            >
              {/* Decorative S-Rank Header */}
              <div style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                color: 'var(--monarch)',
                letterSpacing: '0.18em',
                marginBottom: 36,
                borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
                paddingBottom: 12,
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}>
                // SYSTEM.QUEST.LOG
              </div>

              {/* Vertical Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1 }}>
                {NAV_LINKS.map(link => {
                  const id = link.href.slice(1)
                  const isActive = active === id
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleNav(link.href)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 15,
                        color: isActive ? 'var(--ghost)' : 'var(--stone)',
                        textAlign: 'left',
                        position: 'relative',
                        padding: '6px 0',
                        transition: 'color 0.15s, transform 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transform: isActive ? 'translateX(4px)' : 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = 'var(--ghost)'
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = isActive ? 'var(--ghost)' : 'var(--stone)'
                        e.currentTarget.style.transform = isActive ? 'translateX(4px)' : 'none'
                      }}
                    >
                      <span style={{
                        color: isActive ? 'var(--gate)' : 'transparent',
                        fontSize: 11,
                        transition: 'color 0.15s'
                      }}>■</span>
                      <span>{link.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Social icons at bottom */}
              <div style={{
                borderTop: '1px solid rgba(55, 65, 81, 0.3)',
                paddingTop: 24,
                display: 'flex',
                gap: 20,
                justifyContent: 'center'
              }}>
                <a href="https://github.com/Sarveshsivasankaran" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--stone)', fontSize: 20, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
                ><FaGithub /></a>
                <a href="https://www.linkedin.com/in/sarvesh-sivasankaran/" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--stone)', fontSize: 20, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
                ><FaLinkedin /></a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
