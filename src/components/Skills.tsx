import { useEffect, useState } from 'react'
import { useGitHubRepos, type GitHubRepo } from '../hooks/useGitHubRepos'
import ArsenalScene from './ArsenalScene'
import './Arsenal.css'

const EMPTY_REPOS: GitHubRepo[] = []

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
  Backend: 'var(--monarch)',
  Cloud: 'var(--gold)',
  Tools: 'var(--stone)',
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


export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [vibeFilter, setVibeFilter] = useState<'All' | 'Vibe Coded' | 'Hardcoded'>('All')
  const { data: repos = EMPTY_REPOS, isLoading } = useGitHubRepos()
  const [dynamicSkills, setDynamicSkills] = useState<Skill[]>([])
  // Real-time aggregation engine that runs when GitHub query returns data
  useEffect(() => {
    // 1. High-fidelity static database (always acts as solid baseline / zero-network fallback)
    const defaultSkills: Skill[] = [
      { name: 'Python', icon: 'devicon-python-plain colored', level: 94, baseLevel: 88, category: 'Language', keywords: ['python', 'py'], githubCount: 2 },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored', level: 82, baseLevel: 82, category: 'Language', keywords: ['typescript', 'ts'], githubCount: 0 },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored', level: 85, baseLevel: 85, category: 'Language', keywords: ['javascript', 'js'], githubCount: 0 },
      { name: 'Java', icon: 'devicon-java-plain colored', level: 83, baseLevel: 80, category: 'Language', keywords: ['java'], githubCount: 1 },
      { name: 'C', icon: 'devicon-c-plain colored', level: 73, baseLevel: 70, category: 'Language', keywords: [' c ', '^c$', 'gcc', 'clang'], githubCount: 1 },
      { name: 'C++', icon: 'devicon-cplusplus-plain colored', level: 81, baseLevel: 72, category: 'Language', keywords: ['cpp', 'c\\+\\+', 'g\\+\\+'], githubCount: 3 },
      { name: 'R', icon: 'devicon-r-plain colored', level: 65, baseLevel: 65, category: 'Language', keywords: [' r ', '^r$', 'rstudio'], githubCount: 0 },
      { name: 'React', icon: 'devicon-react-original colored', level: 87, baseLevel: 87, category: 'Frontend', keywords: ['react', 'vite', 'nextjs'], githubCount: 0 },
      { name: 'TailwindCSS', icon: 'devicon-tailwindcss-plain colored', level: 84, baseLevel: 84, category: 'Frontend', keywords: ['tailwind', 'css'], githubCount: 0 },
      { name: 'HTML5', icon: 'devicon-html5-plain colored', level: 95, baseLevel: 86, category: 'Frontend', keywords: ['html', 'web', 'frontend'], githubCount: 3 },
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored', level: 80, baseLevel: 80, category: 'Backend', keywords: ['node', 'express', 'backend'], githubCount: 0 },
      { name: 'FastAPI', icon: 'devicon-fastapi-plain colored', level: 75, baseLevel: 75, category: 'Backend', keywords: ['fastapi', 'python', 'api'], githubCount: 0 },
      { name: 'Express.js', icon: 'devicon-express-original colored', level: 78, baseLevel: 78, category: 'Backend', keywords: ['express', 'node', 'api'], githubCount: 0 },
      { name: 'Azure', icon: 'devicon-azure-plain colored', level: 70, baseLevel: 70, category: 'Cloud', keywords: ['azure', 'cloud', 'deployment'], githubCount: 0 },
      { name: 'Supabase', icon: 'devicon-supabase-plain colored', level: 76, baseLevel: 76, category: 'Cloud', keywords: ['supabase', 'database', 'postgres'], githubCount: 0 },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', level: 74, baseLevel: 74, category: 'Cloud', keywords: ['postgres', 'sql', 'database'], githubCount: 0 },
      { name: 'Git', icon: 'devicon-git-plain colored', level: 95, baseLevel: 85, category: 'Tools', keywords: ['git', 'github', 'version'], githubCount: 12 },
      { name: 'Docker', icon: 'devicon-docker-plain colored', level: 65, baseLevel: 65, category: 'Tools', keywords: ['docker', 'container', 'compose'], githubCount: 0 },
      { name: 'Figma', icon: 'devicon-figma-plain colored', level: 72, baseLevel: 72, category: 'Tools', keywords: ['figma', 'design', 'ui', 'ux'], githubCount: 0 },
      { name: 'Linux', icon: 'devicon-linux-plain colored', level: 80, baseLevel: 80, category: 'Tools', keywords: ['linux', 'ubuntu', 'bash', 'shell'], githubCount: 0 },
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
    <section id="skills" className="arsenal-section">
      <div className="arsenal-heading">
        <div><p className="section-label">// SYSTEM.SKILLS</p><h2 className="section-heading">Arsenal</h2></div>
        <p className="arsenal-status" role="status">
          <span className={isLoading ? 'is-scanning' : ''} />
          {isLoading ? 'Syncing skills with GitHub' : repos.length ? 'Connected to GitHub' : 'Showing saved skills'}
        </p>
      </div>
      <div className="arsenal-intro"><h3>Every skill.<br /><span>A new possibility.</span></h3><p>The tools behind the ideas.<br />Explore my evolving arsenal.</p></div>
      <div className="arsenal-filters">
        <div role="group" aria-label="Skill category">
          {CATEGORIES.map(category => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
        </div>
        <label>Experience
          <select aria-label="Filter skill experience" value={vibeFilter} onChange={event => setVibeFilter(event.target.value as typeof vibeFilter)}>
            <option value="All">All skills</option><option value="Vibe Coded">Used in repositories</option><option value="Hardcoded">Other skills</option>
          </select>
        </label>
      </div>
      <ArsenalScene skills={filtered} loading={isLoading} />
    </section>
  )
}
