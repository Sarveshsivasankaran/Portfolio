import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiUser, FiMail, FiMessageSquare, FiBookOpen } from 'react-icons/fi'

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
      padding: '96px 24px 80px',
      background: 'var(--void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <p className="section-label" style={{ textAlign: 'center' }}>// SYSTEM.QUESTS</p>
        <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: 12 }}>Contact Monarch</h2>
        <p style={{ color: 'var(--stone)', fontSize: 14, textAlign: 'center', marginBottom: 48 }}>
          Initiate direct link transmission to S-Rank hunter Sarvesh Sivasankaran
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 40,
          alignItems: 'start'
        }} className="contact-grid">
          
          {/* Left Column: Quest Info / System Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{
              padding: 32,
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
                  Collaborative synergy, top-tier engineering solutions, lightning-fast development, guild expansion.
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: 'var(--teal)', fontFamily: 'Share Tech Mono, monospace', fontSize: 13, minWidth: 90 }}>
                  SILENT SEND:
                </span>
                <span style={{ color: 'var(--stone)', fontSize: 13, lineHeight: 1.5 }}>
                  {import.meta.env.VITE_WEB3FORMS_ACCESS_KEY && import.meta.env.VITE_WEB3FORMS_ACCESS_KEY !== 'your_web3forms_access_key_here' ? (
                    <span style={{ color: 'var(--teal)', fontWeight: 'bold' }}>[ACTIVE] Silent Background Transmission Enabled</span>
                  ) : (
                    <span>[INACTIVE] mailto client. Set <code style={{ color: 'var(--monarch)', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: 4, fontFamily: 'Share Tech Mono, monospace' }}>VITE_WEB3FORMS_ACCESS_KEY</code> in `.env` to unlock silent background sending!</span>
                  )}
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
                    cursor: 'pointer'
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
              padding: 32,
              background: 'rgba(17, 24, 37, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
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
                className="btn-primary"
                disabled={isSending}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: 14,
                  fontSize: 16,
                  fontFamily: 'Share Tech Mono, monospace',
                  letterSpacing: '0.05em'
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
                  fontFamily: 'Share Tech Mono, monospace'
                }}
              >
                CONFIRM DEPLOYMENT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
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
