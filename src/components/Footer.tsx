import { useState, useEffect } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FiArrowUp } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <footer style={{
        background: 'var(--dungeon)',
        borderTop: '0.5px solid var(--border)',
        padding: '24px 24px',
        textAlign: 'center',
      }}>
        {/* Logo monogram */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <img 
            src="/logo.png" 
            alt="Sarvesh Sivasankaran Logo" 
            style={{ 
              height: '42px', 
              width: 'auto',
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))' 
            }} 
          />
        </div>

        {/* Name */}
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 13,
          color: 'var(--stone)',
          marginBottom: 20,
        }}>
          Sarvesh Sivasankaran
        </p>

        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
          {[
            { icon: <FaGithub size={22} />, href: 'https://github.com/Sarveshsivasankaran', label: 'GitHub' },
            { icon: <FaLinkedin size={22} />, href: 'https://www.linkedin.com/in/sarvesh-sivasankaran/', label: 'LinkedIn' },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              style={{ color: 'var(--stone)', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--stone)')}
            >
              {icon}
            </a>
          ))}
        </div>
      </footer>

      {/* Scroll to top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="scroll-to-top"
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 200,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--gate)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
              fontSize: 18,
            }}
          >
            <FiArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
