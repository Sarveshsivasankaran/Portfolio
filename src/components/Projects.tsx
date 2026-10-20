import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FiExternalLink, FiGithub, FiGitBranch, FiStar } from "react-icons/fi";
import { useGitHubRepos, type GitHubRepo } from "../hooks/useGitHubRepos";
import "./Projects.css";

interface CuratedProjectDefinition {
  key: string;
  repoName: string;
  displayTitle: string;
  description: string;
  language: string;
  defaultStars: number;
  defaultForks: number;
  homepage: string | null;
  match: (repo: GitHubRepo) => boolean;
}

const TARGET_PROJECTS: CuratedProjectDefinition[] = [
  {
    key: "ClaimShield_Nexus",
    repoName: "ClaimShield_Nexus",
    displayTitle: "ClaimShield Nexus",
    description:
      "AI-powered healthcare fraud, waste, and abuse (FWA) intelligence platform combining ML anomaly detection, explainable risk scoring, and graph network analysis.",
    language: "Python / React",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /claimshield/i.test(r.name),
  },
  {
    key: "CacheFusion",
    repoName: "CacheFusion",
    displayTitle: "CacheFusion",
    description:
      "High-performance hybrid LSM-tree inspired Java cache library featuring multi-tiered memory architecture, selectable eviction policies (LRU/LFU), and live React dashboard.",
    language: "Java / React",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /cachefusion/i.test(r.name),
  },
  {
    key: "Students-Notes-Manager---Notezilla",
    repoName: "Students-Notes-Manager---Notezilla",
    displayTitle: "Notezilla 2.0",
    description:
      "Full-stack academic notes and study ecosystem for REC students featuring Supabase storage, Google Drive faculty sync, role-based dashboards, and AI study tools.",
    language: "JavaScript / React",
    defaultStars: 2,
    defaultForks: 0,
    homepage: "https://notezilla-blond.vercel.app",
    match: (r) => /notezilla/i.test(r.name) || /students-notes-manager/i.test(r.name),
  },
  {
    key: "Visualec",
    repoName: "Visualec",
    displayTitle: "Visualec",
    description:
      "AI-powered vision-based adaptive grid energy management system that monitors room occupancy via computer vision and dynamically powers localized zones.",
    language: "Python / FastAPI",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /visualec/i.test(r.name),
  },
  {
    key: "Telegram-Bot-Beru",
    repoName: "Telegram-Bot-Beru",
    displayTitle: "Telegram Bot Beru",
    description:
      "Intelligent Telegram assistant powered by Beru-AI for automated task execution, real-time contextual summaries, custom workflows, and interactive conversational utilities.",
    language: "Python",
    defaultStars: 1,
    defaultForks: 0,
    homepage: "https://telegram-bot-beru.onrender.com/",
    match: (r) => /telegram-bot-beru/i.test(r.name) || (/beru/i.test(r.name) && /bot/i.test(r.name)),
  },
  {
    key: "Disaster-Management-System",
    repoName: "Disaster-Management-System",
    displayTitle: "Disaster Management System",
    description:
      "Comprehensive situational awareness dashboard integrating geospatial hazard tracking, real-time IoT sensors, emergency resource coordination, and public safety alerts.",
    language: "JavaScript / HTML",
    defaultStars: 1,
    defaultForks: 1,
    homepage: "https://disaster-management-system-three.vercel.app",
    match: (r) => /disaster-management/i.test(r.name),
  },
  {
    key: "Smart_Buoy",
    repoName: "Smart_Buoy",
    displayTitle: "Smart Buoy",
    description:
      "Real-time marine oceanographic and disaster monitoring buoy streaming telemetry data for early tsunami/cyclone warnings and environmental hazard tracking.",
    language: "C++ / IoT",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /smart_buoy/i.test(r.name) || /smart-buoy/i.test(r.name),
  },
  {
    key: "Water-Quality-monitoring-ML-model",
    repoName: "Water-Quality-monitoring-ML-model",
    displayTitle: "Water Quality ML Monitor",
    description:
      "Machine learning risk prediction model assessing water potability and contamination thresholds through multi-parametric sensor data and classification pipelines.",
    language: "Python / ML",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /water-quality/i.test(r.name),
  },
  {
    key: "Baby_monitoring_system",
    repoName: "Baby_monitoring_system",
    displayTitle: "Baby Monitoring System",
    description:
      "Smart IoT infant monitoring system streaming real-time biometric and environmental telemetry to Arduino IoT Cloud for proactive safety notifications.",
    language: "C++ / Arduino",
    defaultStars: 1,
    defaultForks: 0,
    homepage: null,
    match: (r) => /^baby/i.test(r.name) || /baby_monitoring_system/i.test(r.name),
  },
];

const DISPLAY_TITLES: Record<string, string> = Object.fromEntries(
  TARGET_PROJECTS.map((p) => [p.repoName, p.displayTitle])
);

const titleOf = (repo: GitHubRepo) => DISPLAY_TITLES[repo.name] || repo.name.replace(/[-_]+/g, " ");

const safeLink = (url?: string | null) => {
  try {
    const parsed = new URL(url || "");
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
};

export default function Projects() {
  const { data: repos = [], isLoading, isError } = useGitHubRepos();
  const containerRef = useRef<HTMLElement>(null);
  
  // Creates a scroll-driven timeline as the user scrolls through the 400vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const filtered = useMemo<GitHubRepo[]>(() => {
    return TARGET_PROJECTS.map((target, index) => {
      const live = repos.find(target.match);

      return {
        id: live?.id ?? (1000 + index),
        name: live?.name || target.repoName,
        description: live?.description?.trim() || target.description,
        html_url: live?.html_url || `https://github.com/Sarveshsivasankaran/${target.repoName}`,
        homepage: safeLink(live?.homepage) || safeLink(target.homepage),
        stargazers_count: live?.stargazers_count ?? target.defaultStars,
        forks_count: live?.forks_count ?? target.defaultForks,
        language: live?.language || target.language,
        topics: live?.topics?.length ? live.topics : [],
        updated_at: live?.updated_at || new Date().toISOString(),
        pushed_at: live?.pushed_at || new Date().toISOString(),
      };
    });
  }, [repos]);

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!filtered || filtered.length === 0) return;
    const idx = Math.min(filtered.length - 1, Math.floor(latest * filtered.length));
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  return (
    <section id="projects" ref={containerRef} className="projects-dimension" style={{ position: 'relative', height: '400vh', background: 'transparent' }}>
      {/* Sticky container stays in place while we scroll through the 400vh */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        
        {/* Header - Fixed at the top of the sticky container */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '80px 64px 0', zIndex: 30, maxWidth: 1280, margin: '0 auto', pointerEvents: 'none' }}>
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
              marginBottom: 48,
              pointerEvents: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 12,
                color: 'var(--stone)',
                letterSpacing: '0.1em'
              }}>
                <span style={{ color: 'var(--monarch)' }}>05</span> PROJECTS
              </span>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 11,
                color: 'var(--teal)',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.08em',
              }}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{
                fontFamily: 'serif',
                fontStyle: 'italic',
                color: 'var(--stone)',
                fontSize: 14
              }}>
                Where theory meets reality
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  aria-label="Previous project"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                  style={{
                    background: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: activeIndex === 0 ? 'var(--border)' : 'var(--ghost)',
                    borderRadius: '6px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  disabled={activeIndex === filtered.length - 1}
                  onClick={() => setActiveIndex((prev) => Math.min(filtered.length - 1, prev + 1))}
                  style={{
                    background: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: activeIndex === filtered.length - 1 ? 'var(--border)' : 'var(--ghost)',
                    borderRadius: '6px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeIndex === filtered.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                  }}
                >
                  ›
                </button>
              </div>
            </div>
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
              marginBottom: 48,
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
              ideas
            </span>
            <br />
            MEET PRODUCTION.
          </motion.h2>
        </div>

        {/* Character positioned at the bottom right */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: '10%', pointerEvents: 'none', zIndex: 20 }}>
          <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
            <defs>
              <filter id="projects-aura" x="-30%" y="-15%" width="160%" height="130%">
                <feTurbulence type="fractalNoise" baseFrequency=".018 .055" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur stdDeviation="1.1" />
              </filter>
            </defs>
          </svg>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: 'relative', height: '75vh', aspectRatio: '1', display: 'flex', justifyContent: 'center' }}
          >
            <div className="projects-energy" style={{ filter: 'url(#projects-aura) drop-shadow(0 0 15px var(--monarch))' }}>
              <span /><span /><span />
            </div>
            <img 
              src="/characters/sarvesh-projects-wbg.png" 
              alt="Sarvesh Projects" 
              style={{ position: 'relative', height: '100%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.2))' }} 
            />
          </motion.div>
        </div>

        {/* Scroll-driven Horizontal Projects List */}
        <div style={{ 
          position: 'absolute', 
          bottom: '8%', 
          left: '0%', 
          width: '100%', 
          height: '430px', 
          display: 'flex', 
          alignItems: 'center', 
          pointerEvents: 'none', 
          zIndex: 30, 
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)' 
        }}>
          <motion.div 
            style={{ display: 'flex', flexDirection: 'row', gap: '32px', height: '100%', paddingLeft: '10%', pointerEvents: 'auto', alignItems: 'center' }}
            animate={{ x: -activeIndex * 372 }} // 340px card + 32px gap
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {isLoading ? (
              <p style={{ color: 'var(--stone)' }}>Loading projects...</p>
            ) : isError ? (
              <p style={{ color: 'var(--stone)' }}>Projects couldn’t be loaded.</p>
            ) : (
              filtered.map((repo, i) => {
                const isActive = i === activeIndex;
                const realScreenshot = `https://socialify.git.ci/Sarveshsivasankaran/${repo.name}/image?font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark`;

                return (
                  <motion.div
                    key={repo.name}
                    onClick={() => setActiveIndex(i)}
                    animate={{ 
                      opacity: isActive ? 1 : 0.45, 
                      scale: isActive ? 1 : 0.92,
                    }}
                    style={{
                      background: 'var(--dungeon)', 
                      border: isActive ? '1px solid rgba(0, 212, 255, 0.4)' : '1px solid var(--border)', 
                      borderRadius: 16,
                      display: 'flex', 
                      flexDirection: 'column', 
                      overflow: 'hidden', 
                      boxShadow: isActive ? '0 16px 48px rgba(0, 212, 255, 0.22)' : 'none',
                      width: 340,
                      height: 390,
                      flexShrink: 0,
                      transformOrigin: 'center center',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s ease',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {/* Image Section */}
                    <div className="project-image-placeholder" style={{ position: 'relative', overflow: 'hidden', background: '#0b0f19', height: '155px', flexShrink: 0 }}>
                      <img 
                        src={realScreenshot} 
                        className="project-screenshot" 
                        alt={titleOf(repo)} 
                        loading="lazy" 
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                      />
                    </div>

                    {/* Info Section */}
                    <div style={{ padding: '20px 24px 24px', background: 'var(--void)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
                          <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif', color: 'var(--ghost)' }}>{titleOf(repo)}</h3>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--stone)', flexShrink: 0 }}><FiGitBranch aria-hidden="true" /> {repo.forks_count}</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 12 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--gate)' }}><FiStar aria-hidden="true" /> {repo.stargazers_count} stars</span>
                          {repo.language && (
                            <span style={{
                              fontFamily: 'Share Tech Mono, monospace',
                              fontSize: '10px',
                              color: 'var(--teal)',
                              background: 'rgba(6, 182, 212, 0.1)',
                              border: '1px solid rgba(6, 182, 212, 0.2)',
                              padding: '1px 6px',
                              borderRadius: '3px',
                            }}>
                              {repo.language}
                            </span>
                          )}
                       </div>
                       <p style={{ 
                         color: 'var(--stone)', 
                         fontSize: '13px', 
                         lineHeight: 1.5, 
                         marginBottom: 16, 
                         flexGrow: 1,
                         display: '-webkit-box',
                         WebkitLineClamp: 3,
                         WebkitBoxOrient: 'vertical',
                         overflow: 'hidden'
                       }}>
                         {repo.description}
                       </p>
                       <ProjectLinks repo={repo} />
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function ProjectLinks({ repo }: { repo: GitHubRepo }) {
  const code = safeLink(repo.html_url);
  const demo = safeLink(repo.homepage);
  return (
    <div className="project-links" style={{ display: 'flex', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
      {code && (
        <a href={code} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
          <FiGithub aria-hidden="true" /> View code
        </a>
      )}
      {demo && (
        <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          <FiExternalLink aria-hidden="true" /> Live demo
        </a>
      )}
    </div>
  );
}
