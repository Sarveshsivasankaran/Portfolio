import { useEffect } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  // Scroll-triggered entrance animation for footer content
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('footer',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: 'footer', start: 'top 95%', once: true }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer style={{
      background: 'var(--dungeon)',
      borderTop: '1px solid var(--gate)',
      padding: '16px 24px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 -10px 40px -10px rgba(0, 212, 255, 0.4), 0 -2px 15px rgba(59, 130, 246, 0.3)',
      overflow: 'hidden'
    }}>
      {/* Subtle animated aura along the top edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '0%',
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--gate), var(--teal), transparent)',
        animation: 'auraScan 4s linear infinite',
        opacity: 0.8
      }} />
      <style>{`
        @keyframes auraScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {/* Logo monogram */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <img 
          src="logo.png" 
          alt="Sarvesh Sivasankaran Logo" 
          style={{ 
            height: '32px', 
            width: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' 
          }} 
        />
      </div>

      {/* Name */}
      <p style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: 12,
        color: 'var(--stone)',
        marginBottom: 12,
      }}>
        Sarvesh Sivasankaran
      </p>

      {/* Social icons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
        {[
          { icon: <FaGithub size={18} />, href: 'https://github.com/Sarveshsivasankaran', label: 'GitHub' },
          { icon: <FaLinkedin size={18} />, href: 'https://www.linkedin.com/in/sarvesh-sivasankaran/', label: 'LinkedIn' },
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
  )
}
