import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useDriveImages } from '../hooks/useDriveImages'

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

            {/* 2x2 Feature Grid */}
            <div className="feature-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
              marginTop: 32,
              paddingTop: 40,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {[
                {
                  label: 'TECHNICAL DEPTH',
                  title: 'Pixels to possibilities.',
                  desc: 'I explore AI/ML, IoT, robotics and full-stack development, building at the intersection of software and hardware. I enjoy breaking down complex problems, experimenting with ideas and turning them into practical solutions.'
                },
                {
                  label: 'LEADERSHIP & COMMUNITY',
                  title: 'Build people, not just products.',
                  desc: 'I lead, collaborate and contribute to student tech communities, creating spaces for people to learn, share ideas and grow together. I believe meaningful leadership is about empowering others and building opportunities beyond yourself.'
                },
                {
                  label: 'CREATIVITY & EXPRESSION',
                  title: 'Ideas deserve a voice.',
                  desc: 'Beyond technology, I enjoy writing books, public speaking and sharing what I learn. Whether through words, conversations or code, I see creativity as a way to express ideas, challenge perspectives and connect with people.'
                },
                {
                  label: 'MINDSET & GROWTH',
                  title: 'Level up. Build. Repeat.',
                  desc: "I embrace unfamiliar challenges, learn through experimentation and keep pushing beyond what I already know. For me, growth isn't about having every answer — it's about staying curious, taking action and becoming better with every attempt."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -5, 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease'
                  }}
                >
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    color: 'var(--monarch)',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    marginBottom: 12
                  }}>
                    {item.label}
                  </div>
                  <h4 style={{
                    fontFamily: 'serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    color: 'var(--ghost)',
                    marginBottom: 12,
                    fontWeight: 400
                  }}>
                    {item.title}
                  </h4>
                  <p style={{ color: 'var(--stone)', fontSize: 14, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
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
