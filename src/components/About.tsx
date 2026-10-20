import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useDriveImages } from '../hooks/useDriveImages'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { FiGitBranch, FiUsers, FiShield, FiCpu, FiExternalLink } from 'react-icons/fi'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -40])

  const { data: driveImages, isLoading } = useDriveImages('1D2nRTRmMdrnR9cB8wDbzzbBERkTQmeH_')
  const [activeIndex, setActiveIndex] = useState(0)

  // Live dynamic telemetry stats
  const [stats, setStats] = useState({
    linkedinFollowers: 5329,
    githubFollowers: 33,
    githubRepos: 22,
    isLive: false,
  })

  useEffect(() => {
    let active = true

    const loadStats = () => {
      // Direct GitHub user telemetry (CORS enabled by GitHub)
      fetch('https://api.github.com/users/Sarveshsivasankaran')
        .then(res => res.json())
        .then(data => {
          if (!active) return
          if (typeof data.followers === 'number' || typeof data.public_repos === 'number') {
            setStats(prev => ({
              ...prev,
              githubFollowers: typeof data.followers === 'number' ? data.followers : prev.githubFollowers,
              githubRepos: typeof data.public_repos === 'number' ? data.public_repos : prev.githubRepos,
              isLive: true,
            }))
          }
        })
        .catch(() => {})

      // Serverless stats endpoint for LinkedIn & GitHub telemetry
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
          if (!active || !data) return
          setStats(prev => ({
            ...prev,
            linkedinFollowers: data.linkedinFollowers || prev.linkedinFollowers,
            githubFollowers: data.githubFollowers || prev.githubFollowers,
            githubRepos: data.githubRepos || prev.githubRepos,
            isLive: true,
          }))
        })
        .catch(() => {})
    }

    loadStats()
    // Re-poll so the LinkedIn count updates live (the MCP watcher pushes fresh
    // numbers to /api/linkedin/sync within ~15 minutes of a change).
    const interval = setInterval(loadStats, 5 * 60 * 1000)

    return () => { active = false; clearInterval(interval) }
  }, [])

  const handleNextCard = () => {
    if (driveImages && driveImages.length > 0) {
      setActiveIndex((prev) => (prev + 1) % driveImages.length)
    }
  }

  useEffect(() => {
    if (!driveImages || driveImages.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % driveImages.length);
    }, 4000); // Change image automatically every 4 seconds
    return () => clearInterval(interval);
  }, [driveImages]);

  return (
    <section id="about" ref={containerRef} style={{
      padding: '80px 24px 64px',
      position: 'relative',
      zIndex: 2,
      background: 'var(--void)', // Dark background as seen in the image
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
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
            marginBottom: 64,
          }}
        >
          <span style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: 'var(--stone)',
            letterSpacing: '0.1em'
          }}>
            <span style={{ color: 'var(--monarch)' }}>01</span> ABOUT
          </span>
          <span style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: 'var(--stone)',
            fontSize: 14
          }}>
            The person behind the grind
          </span>
        </motion.div>

        {/* Huge Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(32px, 5vw, 80px)',
            fontWeight: 800,
            lineHeight: 1,
            textTransform: 'uppercase',
            color: 'var(--ghost)',
            marginBottom: 64,
            letterSpacing: '-0.02em',
            textAlign: 'left'
          }}
        >
          WHERE <br className="mobile-break" />
          <span style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            textTransform: 'lowercase',
            fontWeight: 400,
            background: 'linear-gradient(135deg, var(--monarch), var(--gate))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0'
          }}>
            levelling
          </span>
          <br />
          MEETS GROWTH.
        </motion.h2>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 64,
        }} className="about-grid">
          
          {/* Left Column: Moving Polaroids */}
          <div 
            style={{ position: 'relative', height: '100%', minHeight: 500, cursor: 'pointer' }} 
            className="polaroid-container"
            onClick={handleNextCard}
          >
            {isLoading ? (
              <div style={{
                position: 'absolute',
                top: 0, left: '10%', width: '80%', aspectRatio: '3/4',
                background: 'rgba(255,255,255,0.05)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: 'var(--stone)' }}>LOADING DRIVE...</span>
              </div>
            ) : driveImages && driveImages.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {driveImages.map((img, i) => {
                  let relativeIndex = i - activeIndex;
                  if (relativeIndex < 0) relativeIndex += driveImages.length;
                  
                  // For the fan out, display maximum 4-5 cards
                  if (relativeIndex > 4) return null;

                  const isLastBeingMoved = relativeIndex === driveImages.length - 1;
                  const isFront = relativeIndex === 0;

                  return (
                    <motion.div 
                      key={img.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '10%',
                        width: '80%',
                        aspectRatio: '3/4',
                        background: '#fff',
                        padding: '12px 12px 48px',
                        borderRadius: 8,
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
                        transformOrigin: 'bottom center',
                        zIndex: driveImages.length - relativeIndex
                      }}
                      initial={{ scale: 0.8, opacity: 0, y: 50 }}
                      animate={{
                        rotate: (relativeIndex % 2 === 0 ? -1 : 1) * (relativeIndex * 3) - (isFront ? 2 : 0),
                        scale: 1 - relativeIndex * 0.04,
                        opacity: 1 - relativeIndex * 0.15,
                        y: relativeIndex * 20,
                        x: isLastBeingMoved ? -250 : 0 // move aside animation
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      whileHover={isFront ? { scale: 1.02, rotate: 0 } : {}}
                    >
                      <img 
                        src={img.thumbnailUrl.replace('=w600', '=w1000')}
                        alt={img.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, background: 'var(--dungeon)' }}
                        loading="lazy"
                      />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            ) : (
              <div style={{ color: 'var(--stone)' }}>No images found.</div>
            )}
          </div>

          {/* Right Column: Text and Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 style={{
                fontFamily: 'serif',
                fontSize: 'clamp(24px, 3.5vw, 40px)',
                fontWeight: 400,
                color: 'var(--ghost)',
                lineHeight: 1.3,
                marginBottom: 24,
              }}>
                I'm Sarvesh Sivasankaran, a pre-final-year CSE student at Rajalakshmi Engineering College, and an engineer who turns ambitious ideas into products people <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>rely on.</span>
              </h3>
              
              <p style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--stone)', fontSize: 18, lineHeight: 1.8, marginBottom: 24, textAlign: 'left' }}>
                I’m a builder who enjoys turning ambitious ideas into real products. I work across AI and ML, IoT, robotics and full stack development, especially where software and hardware come together to solve real problems.

I enjoy taking on difficult problems, learning along the way and figuring things out when there’s no obvious answer. Beyond technology, I enjoy writing books and sharing ideas through public speaking. I like building, experimenting, breaking things, fixing them and pushing an idea until it feels genuinely useful. For me, it’s not just about making something work. It’s about making it better. 

              </p>
              
              <p style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--stone)', fontSize: 18, lineHeight: 1.8, textAlign: 'left' }}>
                I take initiative, bring people together, and turn ideas into action. From leading student communities and organizing technical initiatives to sharing knowledge through workshops and engaging with industry professionals, I’m comfortable taking responsibility and stepping into unfamiliar situations. I thrive under pressure, learn by doing, and believe leadership is measured by what you make happen, not the title you hold. For me, getting it to work is only the beginning — I want to see it delivered, refined, and making a real impact.
              </p>
            </motion.div>

            {/* LIVE DYNAMIC NETWORK TELEMETRY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                marginTop: 16,
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(10, 10, 18, 0.85) 100%)',
                border: '1.5px solid rgba(168, 85, 247, 0.25)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 0 25px rgba(168, 85, 247, 0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                position: 'relative',
              }}
            >
              {/* Telemetry Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="live-dot" style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    display: 'inline-block',
                    animation: 'livePulse 1.8s infinite ease-in-out'
                  }} />
                  <span style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    color: '#10b981',
                    fontWeight: 700,
                  }}>
                    LIVE NETWORK TELEMETRY
                  </span>
                </div>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 10,
                  color: 'var(--stone)',
                  letterSpacing: '0.08em',
                }}>
                  [ AUTO-SYNCED ]
                </span>
              </div>

              {/* 3 Telemetry Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
              }}>
                {/* LinkedIn Followers */}
                <a
                  href="https://in.linkedin.com/in/sarvesh-sivasankaran"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.05)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.7)'
                    e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.12)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(6, 182, 212, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.25)'
                    e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <FaLinkedin size={18} color="#06b6d4" />
                    <FiExternalLink size={12} color="#06b6d4" style={{ opacity: 0.6 }} />
                  </div>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: 32,
                    fontWeight: 800,
                    color: 'var(--ghost)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {stats.linkedinFollowers.toLocaleString()}+
                  </div>
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: '#06b6d4',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    LinkedIn Followers
                  </div>
                  <div style={{ color: 'var(--stone)', fontSize: 11, marginTop: 4 }}>
                    Industry reach &amp; builders
                  </div>
                </a>

                {/* GitHub Followers */}
                <a
                  href="https://github.com/Sarveshsivasankaran"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(168, 85, 247, 0.05)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.7)'
                    e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.12)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
                    e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <FaGithub size={18} color="#a855f7" />
                    <FiExternalLink size={12} color="#a855f7" style={{ opacity: 0.6 }} />
                  </div>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: 32,
                    fontWeight: 800,
                    color: 'var(--ghost)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {stats.githubFollowers.toLocaleString()}+
                  </div>
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: '#a855f7',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    GitHub Followers
                  </div>
                  <div style={{ color: 'var(--stone)', fontSize: 11, marginTop: 4 }}>
                    Active OSS developers
                  </div>
                </a>

                {/* GitHub Public Repositories */}
                <a
                  href="https://github.com/Sarveshsivasankaran?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.7)'
                    e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)'
                    e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <FiGitBranch size={18} color="#f59e0b" />
                    <FiExternalLink size={12} color="#f59e0b" style={{ opacity: 0.6 }} />
                  </div>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: 32,
                    fontWeight: 800,
                    color: 'var(--ghost)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {stats.githubRepos.toLocaleString()}+
                  </div>
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: '#f59e0b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    Public Repositories
                  </div>
                  <div style={{ color: 'var(--stone)', fontSize: 11, marginTop: 4 }}>
                    AI/ML, Web, Hardware &amp; Tools
                  </div>
                </a>
              </div>
            </motion.div>

            {/* GUILDS & COMMUNITY LEADERSHIP SECTION */}
            <div style={{ marginTop: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  color: 'var(--monarch)',
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>
                  COMMUNITY ALLIANCES &amp; LEADERSHIP
                </span>
                <span style={{
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  color: 'var(--stone)',
                  fontSize: 13,
                }}>
                  Sourced from LinkedIn
                </span>
              </div>

              {/* 3 Interactive Community Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* 1. CodeSapiens */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -4, borderColor: 'rgba(6, 182, 212, 0.45)', backgroundColor: 'rgba(6, 182, 212, 0.03)' }}
                  style={{
                    padding: '24px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(10, 10, 18, 0.6)',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiUsers size={18} color="#06b6d4" />
                        <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--ghost)', margin: 0 }}>
                          CodeSapiens
                        </h4>
                        <span style={{ color: 'var(--stone)', fontSize: 13 }}>— The Student Community of Coders</span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#06b6d4',
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.06em',
                    }}>
                      🎙️ SPEAKER &amp; EVENT SPEAKER MANAGER
                    </span>
                  </div>

                  <p style={{ color: 'var(--stone)', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px 0' }}>
                    Active core contributor driving developer initiatives across Chennai and beyond. Served as <strong>Event Speaker Manager</strong> for <em>CodeSapiens Summer Fest 2026</em>, curating high-impact speaker tracks, workshops, and championships alongside Nexora, MLSA, and Google Student Ambassadors. Delivered keynote tech sessions at the <em>February 2K26 Meetup</em> on <strong>Open Source Contribution &amp; GitHub Usage</strong> with live PR reviews, built a full-stack AI web crawler under the D3 &times; CodeSapiens Mentorship Program, and received the <strong>Best Post Keychain Award</strong> for tech community advocacy.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Summer Fest 2026 Speaker Manager', 'Feb 2K26 Keynote Speaker', 'D3 AI Mentorship Graduate', 'Best Post Award Winner'].map((tag, idx) => (
                      <span key={idx} style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.65)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* 2. Intellexa REC Club */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -4, borderColor: 'rgba(168, 85, 247, 0.45)', backgroundColor: 'rgba(168, 85, 247, 0.03)' }}
                  style={{
                    padding: '24px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(10, 10, 18, 0.6)',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCpu size={18} color="#a855f7" />
                        <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--ghost)', margin: 0 }}>
                          Intellexa REC Club
                        </h4>
                        <span style={{ color: 'var(--stone)', fontSize: 13 }}>— Rajalakshmi Engineering College</span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#a855f7',
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.06em',
                    }}>
                      👑 VICE PRESIDENT (2026–2027)
                    </span>
                  </div>

                  <p style={{ color: 'var(--stone)', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px 0' }}>
                    Officially appointed <strong>Vice President</strong> for the 2026–2027 tenure, spearheading club direction, technical member incubation, and college-wide innovation. Represented the club as <strong>SPOC at Titanium 2K26</strong> (India's Largest Techfest), organizing flagship challenges including <em>IoT Olympics</em> and <em>HackRush</em> &mdash; where all three teams under his direct mentorship swept the entire podium. Maintains the open-source Intellexa REC Website repository and actively pioneers embedded systems and smart IoT prototypes.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Appointed Vice President (2026-27)', 'Titanium 2K26 SPOC Lead', 'HackRush Triple Podium Mentor', 'Website Maintainer'].map((tag, idx) => (
                      <span key={idx} style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.65)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* 3. Cyber Sentinels Club */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -4, borderColor: 'rgba(245, 158, 11, 0.45)', backgroundColor: 'rgba(245, 158, 11, 0.03)' }}
                  style={{
                    padding: '24px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(10, 10, 18, 0.6)',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiShield size={18} color="#f59e0b" />
                        <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--ghost)', margin: 0 }}>
                          Cyber Sentinels Club
                        </h4>
                        <span style={{ color: 'var(--stone)', fontSize: 13 }}>— Rajalakshmi Engineering College</span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.06em',
                    }}>
                      🎨 CLUB DESIGN LEAD &amp; CTF OPS
                    </span>
                  </div>

                  <p style={{ color: 'var(--stone)', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px 0' }}>
                    Stepping into the role of <strong>Design Lead</strong> at the Investiture Ceremony, elevating brand identity, UI design, and creative direction across all club initiatives. Core organizing member for <strong>0xTi CTF</strong> &mdash; an intense 24-hour Capture The Flag competition partnered with Altered Security and Titanium 2K26. Competitive CTF hacker: secured 21st place in <em>What's The Flag 2025</em> with team F-Society and competed solo in <em>root@localhost</em>, breaking challenges in Cryptography, Web Exploitation, and OSINT.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Club Design Lead', '0xTi 24-Hour CTF Organizer', "What's The Flag 2025 (Top 21)", 'root@localhost Competitor'].map((tag, idx) => (
                      <span key={idx} style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.65)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .about-grid {
            grid-template-columns: 4fr 6fr !important;
          }
          .mobile-break {
            display: none;
          }
        }
        @media (max-width: 991px) {
          .polaroid-container {
            height: 500px !important;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </section>
  )
}
