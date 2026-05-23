import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { useGitHubRepos, type GitHubRepo } from '../hooks/useGitHubRepos'

gsap.registerPlugin(ScrollTrigger)

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'var(--gold)',
  TypeScript: 'var(--gate)',
  Python:     'var(--teal)',
  C:          'var(--silver)',
  default:    'var(--monarch)',
}

type SortType = 'updated' | 'stars'

function getLangColor(lang: string | null): string {
  if (!lang) return LANG_COLORS.default
  return LANG_COLORS[lang] ?? LANG_COLORS.default
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.25rem', minHeight: 200 }}>
      <div className="skeleton" style={{ height: 3, width: '100%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[60, 50, 70].map((w, i) => <div key={i} className="skeleton" style={{ height: 18, width: w, borderRadius: 9999 }} />)}
      </div>
      <div className="skeleton" style={{ height: 32, width: '100%', marginTop: 'auto', borderRadius: 6 }} />
    </div>
  )
}

function RepoCard({ repo, isTopStarred }: { repo: GitHubRepo; isTopStarred: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 92%',
          once: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        border: isTopStarred ? '1px solid var(--gold)' : '0.5px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: getLangColor(repo.language),
        borderRadius: '12px 12px 0 0',
      }} />

      {/* S-RANK badge */}
      {isTopStarred && (
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 9,
          color: 'var(--gold)',
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid var(--gold)',
          borderRadius: 4,
          padding: '2px 6px',
        }}>
          ⭐ S-RANK
        </span>
      )}

      {/* Repo name */}
      <h3 style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 700,
        fontSize: 18,
        color: 'var(--ghost)',
        marginTop: 8,
        paddingRight: isTopStarred ? 60 : 0,
      }}>
        {repo.name}
      </h3>

      {/* Description */}
      <p style={{
        color: 'var(--stone)',
        fontSize: 13,
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1,
      }}>
        {repo.description || 'No description provided.'}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {repo.topics.slice(0, 4).map(t => (
            <span key={t} className="pill" style={{
              background: 'rgba(6,182,212,0.1)',
              color: 'var(--teal)',
              border: '1px solid rgba(6,182,212,0.2)',
            }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {repo.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--stone)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: getLangColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span style={{ fontSize: 12, color: 'var(--stone)' }}>⭐ {repo.stargazers_count}</span>
        <span style={{ fontSize: 12, color: 'var(--stone)' }}>🍴 {repo.forks_count}</span>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--gate)',
            color: 'var(--gate)',
            fontSize: 12,
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <FiGithub size={13} /> View Code
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: 12 }}
          >
            <FiExternalLink size={13} /> Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const { data: repos = [], isLoading, isError, refetch } = useGitHubRepos()
  const [sort, setSort] = useState<SortType>('updated')
  const [langFilter, setLangFilter] = useState('All')

  const languages = ['All', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean) as string[]))]

  const topStarredIds = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(r => r.id)

  const sorted = [...repos]
    .filter(r => langFilter === 'All' || r.language === langFilter)
    .sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  return (
    <section id="projects" style={{
      padding: '96px 64px 80px',
      background: 'var(--void)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p className="section-label">// DUNGEON.RAIDS</p>
        <h2 className="section-heading">Projects</h2>
        <p style={{ color: 'var(--stone)', fontSize: 14, marginTop: 8, marginBottom: 32 }}>
          Pulled live from GitHub
        </p>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
          {(['updated', 'stars'] as SortType[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: 9999,
                border: sort === s ? 'none' : '1px solid var(--border)',
                background: sort === s ? 'var(--gate)' : 'var(--mist)',
                color: sort === s ? 'white' : 'var(--stone)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {s === 'updated' ? 'Recently Updated' : 'Most Starred'}
            </button>
          ))}

          {/* Language filter */}
          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 9999,
              border: '1px solid var(--border)',
              background: 'var(--mist)',
              color: 'var(--stone)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Error state */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--crimson)' }}>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, marginBottom: 16 }}>
              // FAILED TO LOAD RAIDS
            </p>
            <button className="btn-ghost" onClick={() => refetch()}>Retry</button>
          </div>
        )}

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : sorted.map(repo => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isTopStarred={topStarredIds.includes(repo.id)}
                />
              ))
          }
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #projects { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
