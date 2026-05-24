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
  baseLevel: number // Hardcoded baseline knowledge
  category: Exclude<Category, 'All'>
  keywords: string[]
  githubCount: number // Real-time repository match counter
}

const CATEGORY_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Language: 'var(--gate)',
  Frontend: 'var(--teal)',
  Backend:  'var(--monarch)',
  Cloud:    'var(--gold)',
  Tools:    'var(--stone)',
}

// Complete technology mapping dictionary for real-time scanning
const TECH_MAP: Record<string, {
  name: string
  icon: string
  category: Exclude<Category, 'All'>
  baseLevel: number
  keywords: string[]
}> = {
  python: { name: 'Python', icon: 'devicon-python-plain colored', category: 'Language', baseLevel: 88, keywords: ['python', 'py'] },
  typescript: { name: 'TypeScript', icon: 'devicon-typescript-plain colored', category: 'Language', baseLevel: 82, keywords: ['typescript', 'ts'] },
  javascript: { name: 'JavaScript', icon: 'devicon-javascript-plain colored', category: 'Language', baseLevel: 85, keywords: ['javascript', 'js'] },
  java: { name: 'Java', icon: 'devicon-java-plain colored', category: 'Language', baseLevel: 80, keywords: ['java'] },
  c: { name: 'C', icon: 'devicon-c-plain colored', category: 'Language', baseLevel: 70, keywords: [' c ', '^c$', 'gcc', 'clang'] },
  cpp: { name: 'C++', icon: 'devicon-cplusplus-plain colored', category: 'Language', baseLevel: 72, keywords: ['cpp', 'c\\+\\+', 'g\\+\\+'] },
  r: { name: 'R', icon: 'devicon-r-plain colored', category: 'Language', baseLevel: 65, keywords: [' r ', '^r$', 'rstudio'] },
  react: { name: 'React', icon: 'devicon-react-original colored', category: 'Frontend', baseLevel: 87, keywords: ['react', 'vite', 'nextjs'] },
  tailwindcss: { name: 'TailwindCSS', icon: 'devicon-tailwindcss-plain colored', category: 'Frontend', baseLevel: 84, keywords: ['tailwind', 'css'] },
  html5: { name: 'HTML5', icon: 'devicon-html5-plain colored', category: 'Frontend', baseLevel: 86, keywords: ['html', 'web', 'frontend'] },
  nodejs: { name: 'Node.js', icon: 'devicon-nodejs-plain colored', category: 'Backend', baseLevel: 80, keywords: ['node', 'express', 'backend'] },
  fastapi: { name: 'FastAPI', icon: 'devicon-fastapi-plain colored', category: 'Backend', baseLevel: 75, keywords: ['fastapi', 'python', 'api'] },
  express: { name: 'Express.js', icon: 'devicon-express-original colored', category: 'Backend', baseLevel: 78, keywords: ['express', 'node', 'api'] },
  azure: { name: 'Azure', icon: 'devicon-azure-plain colored', category: 'Cloud', baseLevel: 70, keywords: ['azure', 'cloud', 'deployment'] },
  supabase: { name: 'Supabase', icon: 'devicon-supabase-plain colored', category: 'Cloud', baseLevel: 76, keywords: ['supabase', 'database', 'postgres'] },
  postgresql: { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', category: 'Cloud', baseLevel: 74, keywords: ['postgres', 'sql', 'database'] },
  git: { name: 'Git', icon: 'devicon-git-plain colored', category: 'Tools', baseLevel: 85, keywords: ['git', 'github', 'version'] },
  docker: { name: 'Docker', icon: 'devicon-docker-plain colored', category: 'Tools', baseLevel: 65, keywords: ['docker', 'container', 'compose'] },
  figma: { name: 'Figma', icon: 'devicon-figma-plain colored', category: 'Tools', baseLevel: 72, keywords: ['figma', 'design', 'ui', 'ux'] },
  linux: { name: 'Linux', icon: 'devicon-linux-plain colored', category: 'Tools', baseLevel: 80, keywords: ['linux', 'ubuntu', 'bash', 'shell'] },
}

interface SkillCardProps {
  skill: Skill
  index: number
}

function SkillCard({ skill, index }: SkillCardProps) {
  const baseBarRef = useRef<HTMLDivElement>(null)
  const boostBarRef = useRef<HTMLDivElement>(null)

  const githubCount = skill.githubCount
  const computedLevel = skill.level
  const boost = Math.max(0, computedLevel - skill.baseLevel)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (baseBarRef.current) {
        gsap.fromTo(
          baseBarRef.current,
          { width: 0 },
          {
            width: `${skill.baseLevel}%`,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: baseBarRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        )
      }
      if (boostBarRef.current && boost > 0) {
        gsap.fromTo(
          boostBarRef.current,
          { width: 0 },
          {
            width: `${boost}%`,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: boostBarRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [skill.baseLevel, boost])

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
        {githubCount > 0 ? `⚡ VIBE CODED: ${githubCount} REP` : '🛡️ HARDCODED KNOWLEDGE'}
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
        height: 6,
        background: 'var(--mist)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 6,
        position: 'relative',
        display: 'flex',
      }}>
        <div
          ref={baseBarRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--monarch), var(--gate))',
            borderRadius: boost > 0 ? '2px 0 0 2px' : '2px',
            width: 0,
          }}
        />
        {boost > 0 && (
          <div
            ref={boostBarRef}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--teal), #06b6d4)',
              borderRadius: '0 2px 2px 0',
              width: 0,
              boxShadow: '0 0 8px rgba(6,182,212,0.6)',
            }}
          />
        )}
      </div>

      {/* Dynamic Breakdown Percentage Labels */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        marginTop: 4,
        borderTop: '0.5px solid rgba(255, 255, 255, 0.05)',
        paddingTop: 6
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'Share Tech Mono, monospace' }}>
          <span style={{ color: 'var(--stone)' }}>HARDCODED:</span>
          <span style={{ color: 'var(--ghost)' }}>{skill.baseLevel}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'Share Tech Mono, monospace' }}>
          <span style={{ color: githubCount > 0 ? 'var(--teal)' : 'var(--stone)' }}>VIBE CODED:</span>
          <span style={{ color: githubCount > 0 ? 'var(--teal)' : 'var(--stone)' }}>
            {githubCount > 0 ? `+${boost}%` : 'OFFLINE'}
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: 11, 
          fontFamily: 'Rajdhani, sans-serif', 
          fontWeight: 700, 
          borderTop: '0.5px dotted rgba(255,255,255,0.1)', 
          paddingTop: 3, 
          marginTop: 2 
        }}>
          <span style={{ color: 'var(--stone)' }}>TOTAL KNOWN:</span>
          <span style={{ color: githubCount > 0 ? 'var(--teal)' : 'var(--ghost)', textShadow: githubCount > 0 ? '0 0 5px rgba(6,182,212,0.3)' : 'none' }}>
            {computedLevel}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [vibeFilter, setVibeFilter] = useState<'All' | 'Vibe Coded' | 'Hardcoded'>('All')
  const { data: repos = [], isLoading } = useGitHubRepos()
  const splineApp = useRef<any>(null)
  const [dynamicSkills, setDynamicSkills] = useState<Skill[]>([])

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

  // Scroll-triggered entrance animations for content elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header fade-up
      gsap.fromTo('#skills .section-label, #skills .section-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '#skills', start: 'top 85%', once: true }
        }
      )
      // GitHub status badge
      gsap.fromTo('#skills [style*="LINK"]',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
          scrollTrigger: { trigger: '#skills', start: 'top 85%', once: true }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Real-time aggregation engine that runs when GitHub query returns data
  useEffect(() => {
    // 1. High-fidelity static database (always acts as solid baseline / zero-network fallback)
    const defaultSkills: Skill[] = [
      { name: 'Python',      icon: 'devicon-python-plain colored',      level: 94, baseLevel: 88, category: 'Language', keywords: ['python', 'py'], githubCount: 2 },
      { name: 'TypeScript',  icon: 'devicon-typescript-plain colored',  level: 82, baseLevel: 82, category: 'Language', keywords: ['typescript', 'ts'], githubCount: 0 },
      { name: 'JavaScript',  icon: 'devicon-javascript-plain colored',  level: 85, baseLevel: 85, category: 'Language', keywords: ['javascript', 'js'], githubCount: 0 },
      { name: 'Java',        icon: 'devicon-java-plain colored',        level: 83, baseLevel: 80, category: 'Language', keywords: ['java'], githubCount: 1 },
      { name: 'C',           icon: 'devicon-c-plain colored',           level: 73, baseLevel: 70, category: 'Language', keywords: [' c ', '^c$', 'gcc', 'clang'], githubCount: 1 },
      { name: 'C++',         icon: 'devicon-cplusplus-plain colored',   level: 81, baseLevel: 72, category: 'Language', keywords: ['cpp', 'c\\+\\+', 'g\\+\\+'], githubCount: 3 },
      { name: 'R',           icon: 'devicon-r-plain colored',           level: 65, baseLevel: 65, category: 'Language', keywords: [' r ', '^r$', 'rstudio'], githubCount: 0 },
      { name: 'React',       icon: 'devicon-react-original colored',    level: 87, baseLevel: 87, category: 'Frontend', keywords: ['react', 'vite', 'nextjs'], githubCount: 0 },
      { name: 'TailwindCSS', icon: 'devicon-tailwindcss-plain colored', level: 84, baseLevel: 84, category: 'Frontend', keywords: ['tailwind', 'css'], githubCount: 0 },
      { name: 'HTML5',       icon: 'devicon-html5-plain colored',       level: 95, baseLevel: 86, category: 'Frontend', keywords: ['html', 'web', 'frontend'], githubCount: 3 },
      { name: 'Node.js',     icon: 'devicon-nodejs-plain colored',      level: 80, baseLevel: 80, category: 'Backend',  keywords: ['node', 'express', 'backend'], githubCount: 0 },
      { name: 'FastAPI',     icon: 'devicon-fastapi-plain colored',     level: 75, baseLevel: 75, category: 'Backend',  keywords: ['fastapi', 'python', 'api'], githubCount: 0 },
      { name: 'Express.js',  icon: 'devicon-express-original colored',  level: 78, baseLevel: 78, category: 'Backend',  keywords: ['express', 'node', 'api'], githubCount: 0 },
      { name: 'Azure',       icon: 'devicon-azure-plain colored',       level: 70, baseLevel: 70, category: 'Cloud',    keywords: ['azure', 'cloud', 'deployment'], githubCount: 0 },
      { name: 'Supabase',    icon: 'devicon-supabase-plain colored',    level: 76, baseLevel: 76, category: 'Cloud',    keywords: ['supabase', 'database', 'postgres'], githubCount: 0 },
      { name: 'PostgreSQL',  icon: 'devicon-postgresql-plain colored',  level: 74, baseLevel: 74, category: 'Cloud',    keywords: ['postgres', 'sql', 'database'], githubCount: 0 },
      { name: 'Git',         icon: 'devicon-git-plain colored',         level: 95, baseLevel: 85, category: 'Tools',    keywords: ['git', 'github', 'version'], githubCount: 12 },
      { name: 'Docker',      icon: 'devicon-docker-plain colored',      level: 65, baseLevel: 65, category: 'Tools',    keywords: ['docker', 'container', 'compose'], githubCount: 0 },
      { name: 'Figma',       icon: 'devicon-figma-plain colored',       level: 72, baseLevel: 72, category: 'Tools',    keywords: ['figma', 'design', 'ui', 'ux'], githubCount: 0 },
      { name: 'Linux',       icon: 'devicon-linux-plain colored',       level: 80, baseLevel: 80, category: 'Tools',    keywords: ['linux', 'ubuntu', 'bash', 'shell'], githubCount: 0 },
    ]

    if (!repos || repos.length === 0) {
      setDynamicSkills(defaultSkills)
      return
    }

    // 2. Initialize stats counters for all mapping techs
    const stats: Record<string, { repoCount: number; stars: number }> = {}
    Object.keys(TECH_MAP).forEach(key => {
      stats[key] = { repoCount: 0, stars: 0 }
    })

    // 3. Scan every repository returned from GitHub to build active stats
    repos.forEach(repo => {
      const repoName = (repo.name || '').toLowerCase()
      const repoDesc = (repo.description || '').toLowerCase()
      const primaryLang = (repo.language || '').toLowerCase()
      const topics = (repo.topics || []).map(t => t.toLowerCase())

      // Update counters for matched technologies
      Object.entries(TECH_MAP).forEach(([key, tech]) => {
        let isMatch = false

        // Check if primary language matches
        if (
          primaryLang === key || 
          (key === 'cpp' && primaryLang === 'c++') ||
          (key === 'html5' && primaryLang === 'html')
        ) {
          isMatch = true
        }

        // Auto-match Git for all repositories
        if (key === 'git') {
          isMatch = true
        }

        // Check topics
        if (topics.includes(key) || topics.includes(tech.name.toLowerCase())) {
          isMatch = true
        }

        // Check keyword matches in name/description
        const matchKeyword = tech.keywords.some(kw => {
          if (kw.startsWith('^') || kw.endsWith('$')) {
            const regex = new RegExp(kw, 'i')
            return regex.test(repoName) || regex.test(repoDesc)
          }
          return repoName.includes(kw) || repoDesc.includes(kw)
        })
        if (matchKeyword) {
          isMatch = true
        }

        if (isMatch) {
          stats[key].repoCount++
          stats[key].stars += repo.stargazers_count || 0
        }
      })
    })

    // 4. Dynamically construct skills list, boosting their level based on real-time repository count
    const compiledSkills: Skill[] = []
    Object.entries(TECH_MAP).forEach(([key, tech]) => {
      const { repoCount, stars } = stats[key]
      
      // Calculate dynamic level boost: +3% proficiency per matching public repository, up to max 95%
      const levelBoost = repoCount * 3
      const level = Math.min(95, tech.baseLevel + levelBoost)

      // Only include the skill if:
      // a) The user has at least 1 repository with it, OR
      // b) It is one of their core skills (baseLevel >= 70) so the Arsenal is fully populated
      if (repoCount > 0 || tech.baseLevel >= 70) {
        compiledSkills.push({
          name: tech.name,
          icon: tech.icon,
          level,
          baseLevel: tech.baseLevel,
          category: tech.category,
          keywords: tech.keywords,
          githubCount: repoCount,
        })
      }
    })

    // Sort compiled skills: higher level first
    compiledSkills.sort((a, b) => b.level - a.level)

    setDynamicSkills(compiledSkills)
  }, [repos])

  const filtered = dynamicSkills
    .filter(s => activeCategory === 'All' || s.category === activeCategory)
    .filter(s => {
      if (vibeFilter === 'Vibe Coded') return s.githubCount > 0
      if (vibeFilter === 'Hardcoded') return s.githubCount === 0
      return true
    })

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
          {isLoading ? (
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
          ) : repos.length > 0 ? (
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '12px',
              color: 'var(--teal)',
              textShadow: '0 0 8px rgba(6,182,212,0.4)',
              background: 'rgba(6,182,212,0.05)',
              padding: '6px 12px',
              border: '1px solid rgba(6,182,212,0.25)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 10px rgba(6,182,212,0.1)'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              <span>LINK ACTIVE: GITHUB SECURED</span>
            </span>
          ) : (
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '12px',
              color: 'var(--gold)',
              textShadow: '0 0 8px rgba(251,191,36,0.4)',
              background: 'rgba(251,191,36,0.05)',
              padding: '6px 12px',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>⚠️ LINK OFFLINE: RESILIENT CACHE ENGAGED</span>
            </span>
          )}
        </div>

        {/* Telemetry/Filter Categorization Toggles */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          flexWrap: 'wrap', 
          marginBottom: 32, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingBottom: 20 
        }}>
          {/* Tech category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: '1 1 auto' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 11,
                  padding: '6px 14px',
                  borderRadius: 4,
                  border: activeCategory === cat ? '1px solid var(--gate)' : '1px solid var(--border)',
                  background: activeCategory === cat ? 'rgba(59,130,246,0.1)' : 'var(--mist)',
                  color: activeCategory === cat ? 'white' : 'var(--stone)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Telemetry class filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ 
              fontFamily: 'Share Tech Mono, monospace', 
              fontSize: 11, 
              color: 'var(--stone)', 
              marginRight: 4 
            }}>
              CLASS:
            </span>
            {(['All', 'Vibe Coded', 'Hardcoded'] as const).map(type => (
              <button
                key={type}
                onClick={() => setVibeFilter(type)}
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 11,
                  padding: '6px 14px',
                  borderRadius: 4,
                  border: vibeFilter === type 
                    ? (type === 'Vibe Coded' ? '1px solid var(--teal)' : '1px solid var(--monarch)') 
                    : '1px solid var(--border)',
                  background: vibeFilter === type 
                    ? (type === 'Vibe Coded' ? 'rgba(6,182,212,0.1)' : 'rgba(124,58,237,0.1)') 
                    : 'var(--mist)',
                  color: vibeFilter === type 
                    ? (type === 'Vibe Coded' ? 'var(--teal)' : 'var(--monarch)') 
                    : 'var(--stone)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textShadow: vibeFilter === type ? '0 0 4px currentColor' : 'none'
                }}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
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
            {filtered.map((skill, i) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={i}
              />
            ))}
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
        @keyframes pulse {
          0% { opacity: 0.35; }
          50% { opacity: 1; }
          100% { opacity: 0.35; }
        }
        @media (max-width: 768px) {
          #skills { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
