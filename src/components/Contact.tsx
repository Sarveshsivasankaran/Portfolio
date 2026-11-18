import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiSend, FiUser, FiMail, FiMessageSquare, FiBookOpen } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

interface QueuedMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: number
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSending, setIsSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cybernetic Logo Particles Canvas Background Animation (for Contact section)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let isVisible = false
    let lastTime = 0
    const frameInterval = 1000 / 60
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight)

    // Pre-downscale logo onto a 48x48 offscreen canvas once
    let offscreenLogo: HTMLCanvasElement | null = null
    const logoImg = new Image()
    logoImg.src = '/logo.png'
    const createOffscreenLogo = () => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) return
      const offscreen = document.createElement('canvas')
      offscreen.width = 48
      offscreen.height = 48
      const oCtx = offscreen.getContext('2d')
      if (!oCtx) return
      oCtx.drawImage(logoImg, 0, 0, 48, 48)
      offscreenLogo = offscreen
    }
    logoImg.onload = createOffscreenLogo
    if (logoImg.complete) createOffscreenLogo()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool: logo particles (drastically reduced on mobile for calm, uncluttered UI)
    const isMobile = width < 768
    const particleCount = isMobile ? 6 : 22
    const maxLinkDist = isMobile ? 70 : 110
    const maxLinkDistSq = maxLinkDist * maxLinkDist
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      rotation: number
      rotSpeed: number
      alpha: number
      pulseSpeed: number
      pulseDir: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isMobile ? (Math.random() * 6 + 12) : (Math.random() * 14 + 18),
        speedY: -(Math.random() * 0.45 + 0.12),
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.012 + 0.004,
        pulseDir: Math.random() > 0.5 ? 1 : -1,
      })
    }

    let scanY = 0
    const gridSpacing = 64

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render)
      if (time - lastTime < frameInterval - 1) return
      lastTime = time

      ctx.clearRect(0, 0, width, height)

      // Draw subtle cyber grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.025)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Horizontal tracking scanline
      scanY += 0.7
      if (scanY > height) scanY = 0
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()

      // Render logo particles using pre-scaled offscreen canvas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotSpeed

        if (p.y < -40) {
          p.y = height + 25
          p.x = Math.random() * width
        }
        if (p.x < -40) p.x = width + 25
        if (p.x > width + 40) p.x = -25

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.48 || p.alpha < 0.12) {
          p.pulseDir *= -1
        }

        // Fast blit from offscreen texture
        const texture = offscreenLogo || (logoImg.complete && logoImg.naturalWidth > 0 ? logoImg : null)
        if (texture) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = p.alpha
          ctx.drawImage(texture, -p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        }
      }

      // Optimized Pairwise Strands (O(N^2)/2 instead of O(N^2) with early bounding box rejection)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          if (Math.abs(dx) > maxLinkDist || Math.abs(dy) > maxLinkDist) continue
          const distSq = dx * dx + dy * dy
          if (distSq < maxLinkDistSq) {
            const dist = Math.sqrt(distSq)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.07 * (1 - dist / maxLinkDist)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    }

    // Viewport Visibility Culling: Only run RAF loop when section is visible
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible && !animationFrameId) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }, { threshold: 0.05 })

    observer.observe(canvas)

    const handleVisibility = () => {
      if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      } else if (!document.hidden && isVisible && !animationFrameId) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Scroll-triggered entrance animations for contact content
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('#contact .section-label, #contact .section-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true }
        }
      )
      gsap.fromTo('.contact-grid',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Load stashed queue on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('system_quest_queue')
      if (saved) {
        setQueue(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed to load system quest queue:', err)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFlushQueue = () => {
    if (queue.length === 0) return

    const recipient = 'sarveshsivasankaran@gmail.com'
    
    // Build a beautifully formatted compiled message
    let body = `Hi Sarvesh,\n\nI have the following queued messages from my portfolio contact form:\n\n`
    
    queue.forEach((q, idx) => {
      body += `========================================\n`
      body += `QUEST TRANSMISSION #${idx + 1}\n`
      body += `Date: ${new Date(q.timestamp).toLocaleString()}\n`
      body += `From: ${q.name} (${q.email})\n`
      body += `Subject: ${q.subject}\n\n`
      body += `${q.message}\n`
      body += `========================================\n\n`
    })
    
    body += `Please address these S-Rank hunter inquiries as soon as possible.\n\nBest regards,\nSystem Assistant`

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(`[Solo-P-Leveller  Portfolio Contact] ${queue.length} Queued Messages`) }&body=${encodeURIComponent(body)}`
    
    window.location.href = mailtoUrl
    
    // Clear queue in localStorage and state
    localStorage.removeItem('system_quest_queue')
    setQueue([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return

    setIsSending(true)

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || ''
    const isKeyConfigured = accessKey && accessKey !== 'your_web3forms_access_key_here'

    // Formulate queued message object
    const newMsg: QueuedMessage = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: Date.now()
    }

    if (isKeyConfigured) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            subject: `[Solo-P-Leveller  Portfolio Contact] ${formData.subject}`,
            message: formData.message,
            from_name: 'Solo-P-Leveller  Portfolio Contact'
          })
        })
        
        const result = await response.json()
        if (result.success) {
          setIsSending(false)
          setSubmitted(true)
          setFormData({ name: '', email: '', subject: '', message: '' })
          return
        } else {
          console.warn('Web3Forms returned failure result:', result)
        }
      } catch (err) {
        console.error('Web3Forms background dispatch failed, falling back to queue stashing & mailto:', err)
      }
    }

    // Fallback: Queue the message locally and trigger standard mailto client
    setTimeout(() => {
      setIsSending(false)
      setSubmitted(true)
      
      // Save to queue in localStorage
      let updatedQueue = [...queue, newMsg]
      try {
        localStorage.setItem('system_quest_queue', JSON.stringify(updatedQueue))
        setQueue(updatedQueue)
      } catch (err) {
        console.error('Failed to stash quest in local queue:', err)
      }
      
      const recipient = 'sarveshsivasankaran@gmail.com'
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(`[Solo-P-Leveller  Portfolio Contact] ${formData.subject}`)}&body=${encodeURIComponent(
        `Hi Sarvesh,\n\n${formData.message}\n\nBest regards,\n${formData.name}\nEmail: ${formData.email}`
      )}`
      
      window.location.href = mailtoUrl
      
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }


  return (
    <section id="contact" style={{
      background: 'var(--void)',
      padding: 'clamp(60px, 8vh, 88px) 24px clamp(40px, 6vh, 64px)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* HTML5 Cybernetic Logo Particles Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1140, margin: '0 auto', width: '100%', position: 'relative', zIndex: 5 }}>
        {/* Top Header Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 16,
            marginBottom: 'clamp(16px, 2.5vh, 28px)',
          }}
        >
          <span style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: 'var(--stone)',
            letterSpacing: '0.1em'
          }}>
            <span style={{ color: 'var(--monarch)' }}>06</span> CONTACT
          </span>
          <span style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: 'var(--stone)',
            fontSize: 14
          }}>
            Where intention meets dispatch
          </span>
        </motion.div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(18px, 2.6vh, 32px)' }}>
          <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: 8, fontSize: 'clamp(28px, 4vw, 44px)' }}>Contact Monarch</h2>
          <p style={{ color: 'var(--stone)', fontSize: 'clamp(13px, 1.2vw, 15px)', textAlign: 'center', margin: 0 }}>
            Initiate direct link transmission to S-Rank hunter Sarvesh Sivasankaran
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr',
          gap: 'clamp(20px, 3vw, 36px)',
          alignItems: 'stretch'
        }} className="contact-grid">
          
          {/* Left Column: Quest Info / System Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{
              padding: 'clamp(20px, 2.5vw, 32px)',
              borderLeft: '4px solid var(--gate)',
              background: 'rgba(17, 24, 37, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h3 style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 18,
              color: 'var(--gate)',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              [QUEST DETAILS: DISPATCH MESSAGE]
            </h3>

            {/* Quest constraints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--teal)', fontFamily: 'Share Tech Mono, monospace', fontSize: 13, minWidth: 90 }}>
                  QUEST NAME:
                </span>
                <span style={{ color: 'var(--ghost)', fontSize: 13 }}>
                  Establish Monarch Connection
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--teal)', fontFamily: 'Share Tech Mono, monospace', fontSize: 13, minWidth: 90 }}>
                  DIFFICULTY:
                </span>
                <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.15em' }}>
                  S-RANK
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--teal)', fontFamily: 'Share Tech Mono, monospace', fontSize: 13, minWidth: 90 }}>
                  REWARDS:
                </span>
                <span style={{ color: 'var(--stone)', fontSize: 13, lineHeight: 1.5 }}>
                  Engineering solutions, fast development, and long-term collaboration.
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 24 }} />

            {/* Passive details */}
            <h4 style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 14,
              color: 'var(--monarch)',
              marginBottom: 12,
              textTransform: 'uppercase',
            }}>
              // Monarch Address Registry
            </h4>
            <p style={{ color: 'var(--stone)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Transmission coordinates point to Chennai, India. Active hours are usually aligned with standard IST, but guild operations run 24/7 globally.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--silver)' }}>
                <span style={{ color: 'var(--gate)' }}>■</span> Direct Dispatch: sarveshsivasankaran@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--silver)' }}>
                <span style={{ color: 'var(--gate)' }}>■</span> Guild Base: Chennai, Tamil Nadu, India
              </div>
            </div>

            {/* Local Storage System Queue Module */}
            {queue.length > 0 && (
              <div style={{
                marginTop: 28,
                padding: 20,
                border: '1px dashed var(--monarch)',
                background: 'rgba(168, 85, 247, 0.05)',
                borderRadius: 8,
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)'
              }}>
                <h4 style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 14,
                  color: 'var(--monarch)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 'bold',
                  letterSpacing: '0.05em'
                }}>
                  <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>⚠️</span> [UNSENT QUESTS STASHED: {queue.length}]
                </h4>
                <p style={{ color: 'var(--stone)', fontSize: 12, lineHeight: 1.4, marginBottom: 16 }}>
                  Direct portal dispatch failed or access key is offline. All quest inquiries are safely stashed in local memory.
                </p>
                <div style={{ 
                  maxHeight: 160, 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 8, 
                  marginBottom: 16,
                  paddingRight: 4
                }}>
                  {queue.map((q, idx) => (
                    <div key={q.id} style={{
                      padding: 10,
                      background: 'rgba(10, 10, 18, 0.6)',
                      borderRadius: 6,
                      borderLeft: '3px solid var(--monarch)',
                      fontSize: 12,
                      color: 'var(--ghost)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--gate)' }}>#{idx + 1} {q.subject}</span>
                        <span style={{ color: 'var(--stone)', fontSize: 10 }}>{new Date(q.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div style={{ color: 'var(--stone)', fontSize: 11 }}>From: {q.name} ({q.email})</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleFlushQueue}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: 12,
                    fontSize: 13,
                    fontFamily: 'Share Tech Mono, monospace',
                    background: 'linear-gradient(135deg, var(--monarch), #581c87)',
                    borderColor: 'var(--monarch)',
                    cursor: 'pointer',
                    transform: 'none'
                  }}
                >
                  FORCE PORTAL TRANSMISSION ({queue.length} QUESTS)
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Column: Contact Input Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{
              padding: 'clamp(20px, 2.5vw, 32px)',
              background: 'rgba(17, 24, 37, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.6vh, 18px)' }}>
              
              {/* Name */}
              <div>
                <label className="system-label" htmlFor="contact-name">
                  <FiUser style={{ marginRight: 6, verticalAlign: 'middle' }} /> Hunter Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  className="system-input"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="system-label" htmlFor="contact-email">
                  <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} /> Transmission Address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  className="system-input"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="system-label" htmlFor="contact-subject">
                  <FiBookOpen style={{ marginRight: 6, verticalAlign: 'middle' }} />Quest Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject of negotiation..."
                  className="system-input"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="system-label" htmlFor="contact-message">
                  <FiMessageSquare style={{ marginRight: 6, verticalAlign: 'middle' }} /> Negotiation Details
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write details of the quest..."
                  className="system-input system-textarea"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary no-magnetic"
                disabled={isSending}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: 14,
                  fontSize: 16,
                  fontFamily: 'Share Tech Mono, monospace',
                  letterSpacing: '0.05em',
                  transform: 'none'
                }}
              >
                {isSending ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <FiSend size={16} />
                    <span>LAUNCH quest TRANSMISSION</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>

      {/* Quest Success System Overlay Modal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 10, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="system-window"
            >
              <div className="system-header">// SYSTEM MESSAGE</div>
              <div className="system-success-title">QUEST CLEARED!</div>
              
              <p style={{
                color: 'var(--ghost)',
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 24,
                textAlign: 'left',
                borderLeft: '2.5px solid var(--teal)',
                paddingLeft: 12
              }}>
                <strong>[TRANSMISSION STATUS: SUCCESS]</strong>
                <br /><br />
                Your negotiated quest message has been successfully broadcast. Direct mail routing triggers instantly. S-Rank Hunter Sarvesh will respond via standard psychic portal.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 14,
                  padding: '10px 20px',
                  fontFamily: 'Share Tech Mono, monospace',
                  transform: 'none'
                }}
              >
                CONFIRM DEPLOYMENT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes contactRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes contactRingSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
