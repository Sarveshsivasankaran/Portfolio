import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGitHubRepos } from '../hooks/useGitHubRepos'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/pnf7pGj7N51D0PzY/scene.splinecode'

gsap.registerPlugin(ScrollTrigger)

type Category = 'All' | 'Language' | 'Frontend' | 'Backend' | 'Cloud' | 'Tools'

const CATEGORIES: Category[] = ['All', 'Language', 'Frontend', 'Backend', 'Cloud', 'Tools']

interface Skill {
  name: string
  icon: string
  level: number
  category: Exclude<Category, 'All'>
  keywords: string[] // Keywords to search in repo names, descriptions, or languages
}

const SKILLS: Skill[] = [
  { name: 'Python',      icon: 'devicon-python-plain colored',      level: 88, category: 'Language', keywords: ['python', 'py'] },
  { name: 'TypeScript',  icon: 'devicon-typescript-plain colored',  level: 82, category: 'Language', keywords: ['typescript', 'ts'] },
  { name: 'JavaScript',  icon: 'devicon-javascript-plain colored',  level: 85, category: 'Language', keywords: ['javascript', 'js'] },
  { name: 'C',           icon: 'devicon-c-plain colored',           level: 70, category: 'Language', keywords: [' c ', '^c$', 'gcc', 'clang'] },
  { name: 'R',           icon: 'devicon-r-plain colored',           level: 65, category: 'Language', keywords: [' r ', '^r$', 'rstudio'] },
  { name: 'React',       icon: 'devicon-react-original colored',    level: 87, category: 'Frontend', keywords: ['react', 'vite', 'nextjs'] },
  { name: 'TailwindCSS', icon: 'devicon-tailwindcss-plain colored', level: 84, category: 'Frontend', keywords: ['tailwind', 'css'] },
  { name: 'HTML5',       icon: 'devicon-html5-plain colored',       level: 90, category: 'Frontend', keywords: ['html', 'web', 'frontend'] },
  { name: 'Node.js',     icon: 'devicon-nodejs-plain colored',      level: 80, category: 'Backend',  keywords: ['node', 'express', 'backend'] },
  { name: 'FastAPI',     icon: 'devicon-fastapi-plain colored',     level: 75, category: 'Backend',  keywords: ['fastapi', 'python', 'api'] },
  { name: 'Express.js',  icon: 'devicon-express-original colored',  level: 78, category: 'Backend',  keywords: ['express', 'node', 'api'] },
  { name: 'Azure',       icon: 'devicon-azure-plain colored',       level: 70, category: 'Cloud',    keywords: ['azure', 'cloud', 'deployment'] },
  { name: 'Supabase',    icon: 'devicon-supabase-plain colored',    level: 76, category: 'Cloud',    keywords: ['supabase', 'database', 'postgres'] },
  { name: 'PostgreSQL',  icon: 'devicon-postgresql-plain colored',  level: 74, category: 'Cloud',    keywords: ['postgres', 'sql', 'database'] },
  { name: 'Git',         icon: 'devicon-git-plain colored',         level: 85, category: 'Tools',    keywords: ['git', 'github', 'version'] },
  { name: 'Docker',      icon: 'devicon-docker-plain colored',      level: 65, category: 'Tools',    keywords: ['docker', 'container', 'compose'] },
  { name: 'Figma',       icon: 'devicon-figma-plain colored',       level: 72, category: 'Tools',    keywords: ['figma', 'design', 'ui', 'ux'] },
  { name: 'Linux',       icon: 'devicon-linux-plain colored',       level: 80, category: 'Tools',    keywords: ['linux', 'ubuntu', 'bash', 'shell'] },
]

const CATEGORY_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Language: 'var(--gate)',
  Frontend: 'var(--teal)',
  Backend:  'var(--monarch)',
  Cloud:    'var(--gold)',
  Tools:    'var(--stone)',
}

interface SkillCardProps {
  skill: Skill
  index: number
  githubCount: number
  computedLevel: number
}

function SkillCard({ skill, index, githubCount, computedLevel }: SkillCardProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { width: 0 },
        {
          width: `${computedLevel}%`,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [computedLevel])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.25 }}
      whileHover={{
        y: -6,
        scale: 1.04,
        borderColor: CATEGORY_COLORS[skill.category],
        boxShadow: `0 10px 30px ${CATEGORY_COLORS[skill.category]}22`,
      }}
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        cursor: 'default',
        position: 'relative',
        border: githubCount > 0 ? '1px solid rgba(6, 182, 212, 0.25)' : '0.5px solid var(--border)',
        boxShadow: githubCount > 0 ? '0 8px 24px rgba(6, 182, 212, 0.05)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Icon */}
      <i className={skill.icon} style={{ fontSize: 38 }} />

      {/* Name */}
      <span style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 700,
        fontSize: 14,
        color: 'var(--ghost)',
        textAlign: 'center',
      }}>
        {skill.name}
      </span>

      {/* Verification Badge */}
      <span style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '9px',
        padding: '2px 8px',
        borderRadius: '4px',
        background: githubCount > 0 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        color: githubCount > 0 ? 'var(--teal)' : 'var(--stone)',
        border: githubCount > 0 ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
        textShadow: githubCount > 0 ? '0 0 5px rgba(6, 182, 212, 0.3)' : 'none',
      }}>
        {githubCount > 0 ? `⚡ GITHUB: ${githubCount} REP` : '🛡️ SYSTEM VERIFIED'}
      </span>

      {/* Category badge */}
      <span className="pill" style={{
        background: `${CATEGORY_COLORS[skill.category]}18`,
        color: CATEGORY_COLORS[skill.category],
        border: `1px solid ${CATEGORY_COLORS[skill.category]}33`,
      }}>
        {skill.category}
      </span>

      {/* Proficiency bar */}
      <div style={{
        width: '100%',
        height: 5,
        background: 'var(--mist)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 6,
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: githubCount > 0 
              ? 'linear-gradient(90deg, var(--teal), var(--gate))'
              : 'linear-gradient(90deg, var(--gate), var(--border))',
            borderRadius: 2,
            width: 0,
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 2
      }}>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--stone)' }}>
          {computedLevel}%
        </span>
        {githubCount > 0 && (
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--teal)' }}>
            + {githubCount * 2}% BOOST
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const { data: repos = [], isLoading } = useGitHubRepos()
  const splineApp = useRef<any>(null)

  useEffect(() => {
    // 3D container scroll parallax animation using GPU-accelerated CSS transitions
    const ctx = gsap.context(() => {
      gsap.fromTo('.skills-spline-wrapper',
        { rotation: 0, scale: 1.05, y: -50 },
        {
          rotation: -40, // Rotate opposite direction
          scale: 1.25,   // Zoom in parallax
          y: 100,        // Downward vertical displacement
          ease: 'none',
          scrollTrigger: {
            trigger: '#skills',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  function onSplineLoad(app: any) {
    splineApp.current = app

    // Hook scroll updates to animate properties of the 3D spline scene dynamically
    gsap.to({}, {
      scrollTrigger: {
        trigger: '#skills',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2, // Smooth scrubbing interaction
        onUpdate: (self) => {
          if (!splineApp.current) return
          try {
            const camera = splineApp.current.findObjectByName('Camera')
            if (camera) {
              // Rotate camera on Y-axis as user scrolls down, and tilt vertically
              camera.rotation.y = self.progress * Math.PI * 0.8 // Elegant 144 degree camera orbit
              camera.rotation.x = -0.3 + self.progress * 0.4 // Subtle vertical swing
            } else {
              // Fallback: zoom scene dynamically
              splineApp.current.setZoom(1.0 + self.progress * 0.2)
            }
          } catch (e) {
            try {
              splineApp.current.setZoom(1.0 + self.progress * 0.15)
            } catch (err) {}
          }
        }
      }
    })
  }

  // Calculate dynamic skill metrics based on GitHub active data
  const assessSkill = (skill: Skill) => {
    let githubCount = 0

    if (repos && repos.length > 0) {
      repos.forEach(repo => {
        // 1. Language matching
        if (repo.language && repo.language.toLowerCase() === skill.name.toLowerCase()) {
          githubCount++
        }
        
        // 2. Keyword scan in repo name or description
        const repoName = (repo.name || '').toLowerCase()
        const repoDesc = (repo.description || '').toLowerCase()
        
        const hasKeyword = skill.keywords.some(kw => {
          if (kw.startsWith('^') || kw.endsWith('$')) {
            // Regex match
            const regex = new RegExp(kw, 'i')
            return regex.test(repoName) || regex.test(repoDesc)
          }
          return repoName.includes(kw) || repoDesc.includes(kw)
        })

        if (hasKeyword) {
          githubCount++
        }
      })
    }

    // Dynamic level boost (+2% per repo match, maxed at 95%)
    const computedLevel = githubCount > 0 
      ? Math.min(95, skill.level + githubCount * 2) 
      : skill.level

    return {
      githubCount,
      computedLevel
    }
  }

  const filtered = activeCategory === 'All'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeCategory)

  return (
    <section id="skills" style={{
      padding: '96px 64px 80px',
      background: 'var(--dungeon)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 3D Interactive Spline Background Canvas */}
      <Suspense fallback={null}>
        <div className="skills-spline-wrapper" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.16, // Premium soft cyber visibility
          willChange: 'transform',
        }}>
          <Spline scene={SPLINE_URL} onLoad={onSplineLoad} />
        </div>
      </Suspense>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label">// SYSTEM.SKILLS</p>
            <h2 className="section-heading" style={{ margin: 0 }}>Arsenal</h2>
          </div>
          {isLoading && (
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '12px',
              color: 'var(--teal)',
              textShadow: '0 0 8px rgba(6,182,212,0.4)',
              background: 'rgba(6,182,212,0.05)',
              padding: '6px 12px',
              border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: '4px',
            }}>
              ⚙️ SCANNING GITHUB SYSTEM STATS...
            </span>
          )}
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 9999,
                border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                background: activeCategory === cat ? 'var(--gate)' : 'var(--mist)',
                color: activeCategory === cat ? 'white' : 'var(--stone)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => {
              const { githubCount, computedLevel } = assessSkill(skill)
              return (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={i}
                  githubCount={githubCount}
                  computedLevel={computedLevel}
                />
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        #skills {
          background-image: 
            radial-gradient(rgba(59, 130, 246, 0.012) 1px, transparent 0),
            radial-gradient(rgba(124, 58, 237, 0.012) 1px, transparent 0);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }
        @media (max-width: 768px) {
          #skills { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
