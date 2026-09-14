import { CSSProperties, useEffect, useId, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiPause, FiPlay, FiArrowUpRight } from 'react-icons/fi'
import { SiPython, SiTypescript, SiJavascript, SiC, SiCplusplus, SiR, SiReact, SiTailwindcss, SiHtml5, SiNodedotjs, SiFastapi, SiExpress, SiSupabase, SiPostgresql, SiGit, SiDocker, SiFigma, SiLinux } from 'react-icons/si'
import { FaJava, FaCloud } from 'react-icons/fa'
import type { IconType } from 'react-icons'

gsap.registerPlugin(ScrollTrigger)

const icons: Record<string, IconType> = { Python: SiPython, TypeScript: SiTypescript, JavaScript: SiJavascript, Java: FaJava, C: SiC, 'C++': SiCplusplus, R: SiR, React: SiReact, TailwindCSS: SiTailwindcss, HTML5: SiHtml5, 'Node.js': SiNodedotjs, FastAPI: SiFastapi, 'Express.js': SiExpress, Azure: FaCloud, Supabase: SiSupabase, PostgreSQL: SiPostgresql, Git: SiGit, Docker: SiDocker, Figma: SiFigma, Linux: SiLinux }

interface ArsenalSkill {
  name: string
  icon: string
  category: string
  githubCount: number
  level: number
}

// Keep the center clear for the character, with smaller tiles farther away.
const positions = [
  [12, 12, 1.16, -12], [83, 13, 1.2, 12], [29, 8, .82, -8],
  [67, 5, .78, 8], [6, 40, 1.04, -12], [90, 42, 1.05, 12],
  [25, 35, .86, -8], [73, 34, .9, 10], [15, 67, 1.02, -10],
  [83, 71, 1.08, 12], [32, 65, .78, -8], [67, 65, .78, 8],
  [50, -3, .55, -4], [34, 47, .5, -7], [65, 47, .5, 6],
  [4, 76, .57, -10], [95, 76, .56, 10], [29, 78, .55, -6],
  [69, 78, .54, 6], [50, 78, .5, 0],
]

export default function ArsenalScene({ skills, loading, videoSrc = import.meta.env.VITE_ARSENAL_VIDEO_URL }: {
  skills: ArsenalSkill[]
  loading: boolean
  videoSrc?: string
}) {
  const scene = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const auraId = useId().replace(/:/g, '')
  const visible = useInView(scene, { margin: '0px' })
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [paused, setPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [selectedName, setSelectedName] = useState('')
  const [imageReady, setImageReady] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const moving = visible && pageVisible && !paused && !reduced
  const selected = skills.find(skill => skill.name === selectedName) || skills[0]
  const SelectedIcon = selected ? icons[selected.name] || FiArrowUpRight : FiArrowUpRight
  const skillKey = skills.map(skill => skill.name).join('|')

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (visible && videoSrc && !videoFailed && video.current?.readyState === 0) video.current.load()
  }, [visible, videoSrc, videoFailed])

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!moving || !scene.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.arsenal-tile-position', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: .8, stagger: .035, ease: 'power3.out',
      })
      gsap.fromTo('.arsenal-depth', { yPercent: -5 }, { yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: scene.current, start: 'top bottom', end: 'bottom top', scrub: .7 },
      })
      gsap.fromTo('.arsenal-character-camera', { scale: 1.06 }, { scale: .94, ease: 'none',
        scrollTrigger: { trigger: scene.current, start: 'top 70%', end: 'bottom 15%', scrub: 1 },
      })
    }, scene)
    return () => ctx.revert()
  }, [moving, skillKey])

  useEffect(() => {
    const player = video.current
    if (!player) return
    if (moving && videoReady) {
      void player.play().catch(() => setVideoFailed(true))
    } else player.pause()
  }, [moving, videoReady])

  return (
    <div className="arsenal-universe" data-moving={moving} data-ready={imageReady || imageFailed}>
      <div ref={scene} className="arsenal-scene" role="region" aria-label="Interactive skill arsenal">
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}><defs><filter id={auraId} x="-30%" y="-15%" width="160%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".018 .055" numOctaves="2" seed="7" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" /><feGaussianBlur stdDeviation="1.1" /></filter></defs></svg>
        <div className="arsenal-depth" aria-hidden="true">
          <div className="arsenal-halo" /><div className="arsenal-orbit orbit-back" /><div className="arsenal-orbit orbit-front" />
          <div className="arsenal-floor" /><div className="arsenal-floor-ring" />
          {Array.from({ length: 12 }, (_, i) => <span key={i} className="arsenal-spark" style={{ '--i': i } as CSSProperties} />)}
        </div>
        <p className="arsenal-side-note" aria-hidden="true">LEARN<br />BUILD<br />EVOLVE</p>
        <p className="arsenal-side-note note-right" aria-hidden="true">IDEAS INTO<br />EXPERIENCES</p>

        <div className="arsenal-character-anchor" aria-hidden="true"><div className="arsenal-character-camera">
          <div className="arsenal-character">
            <div className="arsenal-energy" style={{ filter: `url(#${auraId}) drop-shadow(0 0 9px var(--monarch))` }}><span /><span /><span /></div>
            <div className="arsenal-contact-shadow" />
            <img className="arsenal-character-image" src="/characters/sarvesh-arsenal-awakened.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" onLoad={() => setImageReady(true)} onError={() => setImageFailed(true)} />
          </div>
        </div></div>
        {videoSrc && !videoFailed && <video ref={video} className="arsenal-character-video" data-loaded={videoReady} src={videoSrc} muted loop playsInline preload="none" onLoadedData={() => setVideoReady(true)} onError={() => setVideoFailed(true)} aria-label="Sarvesh's animated Arsenal character" controls={!moving} />}

        <div className="arsenal-tiles">
          {skills.map((skill, index) => {
            const [x, y, scale, tilt] = positions[index % positions.length]
            const Icon = icons[skill.name] || FiArrowUpRight
            return <div key={skill.name} className="arsenal-tile-position" style={{ '--x': `${x}%`, '--y': `${y}%`, '--tile-scale': scale, '--tilt': `${tilt}deg`, '--delay': `${index * -.63}s` } as CSSProperties}>
              <button className="arsenal-tile" type="button" aria-pressed={selected?.name === skill.name} aria-label={`Explore ${skill.name}`} onClick={() => setSelectedName(skill.name)}>
                <span className="arsenal-tile-index">{String(index + 1).padStart(2, '0')} / {skill.category}</span>
                <Icon className="arsenal-skill-icon" aria-hidden="true" />
                <span className="arsenal-tile-name">{skill.name}</span>
                <FiArrowUpRight className="arsenal-tile-arrow" aria-hidden="true" />
              </button>
            </div>
          })}
        </div>
        {!skills.length && !loading && <p className="arsenal-empty">No skills match these filters. Choose All to explore the full arsenal.</p>}
        <div className="arsenal-scene-caption" aria-hidden="true"><span>THE BUILDER</span><p>SARVESH SIVASANKARAN</p></div>
      </div>
      <div className="arsenal-scene-controls">
        <p role="status">{loading ? 'Loading skill activity…' : `${skills.length} skills in this arsenal`}{!imageReady && !imageFailed && <span className="arsenal-loading-line" aria-label="Loading character" />}</p>
        <button type="button" onClick={() => setPaused(value => !value)} disabled={!!reduced} aria-label={paused ? 'Resume arsenal motion' : 'Pause arsenal motion'}>
          {paused || reduced ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}{reduced ? 'Reduced motion' : paused ? 'Motion paused' : 'Pause motion'}
        </button>
      </div>
      {selected && <div className="arsenal-skill-detail" aria-live="polite">
        <SelectedIcon className="arsenal-detail-icon" aria-hidden="true" />
        <div><p className="section-label">{selected.category} / SELECTED SKILL</p><h3>{selected.name}</h3></div>
        <p>{selected.githubCount ? `Used across ${selected.githubCount} public ${selected.githubCount === 1 ? 'repository' : 'repositories'}.` : 'Part of my toolkit.'}<span>Select another tile to explore.</span></p>
      </div>}
    </div>
  )
}
