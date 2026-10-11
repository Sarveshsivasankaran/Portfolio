import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiImage, FiExternalLink } from 'react-icons/fi'
import { type LinkedInPost } from '../data/linkedinPosts'

const TYPE_COLORS: Record<string, string> = {
  post: '#06b6d4',
  article: '#a78bfa',
  certificate: '#fbbf24',
  project: '#10b981',
}

const TYPE_LABELS: Record<string, string> = {
  post: 'INTEL POST',
  article: 'DEV LOG',
  certificate: 'CREDENTIAL',
  project: 'TACTICAL PROJECT',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' })
}

interface WinsGalleryProps {
  posts: LinkedInPost[]
  loading: boolean
}

export default function WinsGallery({ posts, loading }: WinsGalleryProps) {
  const [activeId, setActiveId] = useState<number | string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handlePointerEnter = (id: number | string) => {
    if (isTouchDevice) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveId(id)
  }

  const handlePointerLeave = () => {
    if (isTouchDevice) return
    timeoutRef.current = setTimeout(() => {
      setActiveId(null)
    }, 150)
  }

  const handleTouch = (id: number | string) => {
    if (!isTouchDevice) return
    if (activeId === id) setActiveId(null)
    else setActiveId(id)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%', padding: '20px 0' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: '1 1 250px', height: '350px', borderRadius: '16px', background: 'var(--dungeon)', border: '1px solid var(--border)', opacity: 0.35, animation: 'pulse 1.8s infinite ease-in-out' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '20px', 
      width: '100%', 
      padding: '20px 0',
      minHeight: '500px' 
    }}>
      {posts.map((post, index) => {
        const isExpanded = activeId === post.id
        const color = TYPE_COLORS[post.type] || '#A78BFA'
        const label = post.badge || TYPE_LABELS[post.type] || 'ACHIEVEMENT'
        const image = post.image || (post.images && post.images.length > 0 ? post.images[0] : null)
        
        // Large decorative number
        const displayNum = (index + 1).toString().padStart(2, '0')

        return (
          <motion.div
            key={post.id}
            layout
            onPointerEnter={() => handlePointerEnter(post.id)}
            onPointerLeave={handlePointerLeave}
            onClick={() => handleTouch(post.id)}
            style={{
              flex: isExpanded ? '2 1 500px' : '1 1 250px',
              minWidth: isExpanded ? '300px' : '250px',
              height: isExpanded ? '450px' : '350px',
              borderRadius: '16px',
              background: 'var(--dungeon)',
              border: isExpanded ? '1.5px solid var(--violet)' : '1px solid var(--border)',
              boxShadow: isExpanded ? '0 0 30px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.05)' : '0 10px 25px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              zIndex: isExpanded ? 10 : 1,
            }}
            transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          >
            {/* Image Layer */}
            <motion.div
              layout
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: isExpanded ? '100%' : '35%',
                zIndex: 1,
                background: 'linear-gradient(to bottom right, rgba(17, 24, 39, 0.95), var(--dungeon))',
                overflow: 'hidden',
                borderRadius: isExpanded ? '0' : '16px 16px 0 0',
              }}
              transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            >
              {image ? (
                <motion.img
                  layout
                  src={image}
                  alt={post.imageAlt || post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: post.imagePosition || 'center',
                    filter: isExpanded ? 'grayscale(0) contrast(1.05)' : 'grayscale(0.2) contrast(0.95)',
                    transition: 'filter 0.5s ease, transform 0.5s ease',
                    transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, var(--dungeon) 85%)', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
                  <FiImage size={24} color="var(--violet)" style={{ marginBottom: 8, opacity: 0.7 }} />
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--violet)', letterSpacing: '0.08em' }}>ADD PHOTO</span>
                </div>
              )}
              {isExpanded && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--dungeon) 0%, rgba(10, 10, 12, 0.8) 40%, rgba(10, 10, 12, 0.3) 100%)', pointerEvents: 'none' }} />
              )}
            </motion.div>

            {/* Content Layer */}
            <motion.div
              layout
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: isExpanded ? '0' : '35%',
                height: isExpanded ? '100%' : '65%',
                padding: isExpanded ? '24px 32px' : '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isExpanded ? 'flex-end' : 'flex-start',
              }}
              transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            >
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{ position: 'absolute', top: 24, right: 32, fontSize: '80px', fontWeight: 900, fontFamily: 'Rajdhani, sans-serif', lineHeight: 0.8, background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.4 }}
                >
                  {displayNum}
                </motion.div>
              )}

              <motion.div layout style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ background: 'rgba(17, 24, 39, 0.85)', color, border: `1px solid ${color}88`, backdropFilter: 'blur(6px)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '4px' }}>
                  {label}
                </span>
                {!isExpanded && <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#AAA6BC' }}>{formatDate(post.date)}</span>}
              </motion.div>

              <motion.h3
                layout
                style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: isExpanded ? '28px' : '18px', color: 'var(--ghost)', lineHeight: 1.2, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: isExpanded ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {post.title}
              </motion.h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ color: 'var(--stone)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.summary}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {image && (
                        <a href={image} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: '#3B82F6', textDecoration: 'none', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '4px', transition: 'all 0.2s' }}>
                          VIEW PHOTO <FiExternalLink size={12} />
                        </a>
                      )}
                      <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: color, textDecoration: 'none', padding: '8px 16px', background: `${color}1A`, border: `1px solid ${color}4D`, borderRadius: '4px', transition: 'all 0.2s' }}>
                        READ MORE <FiExternalLink size={12} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isExpanded && (
                <motion.p layout style={{ color: 'var(--stone)', fontSize: '13px', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.summary}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
