import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { FiExternalLink, FiGithub, FiGitBranch, FiStar } from "react-icons/fi";
import { useGitHubRepos, type GitHubRepo } from "../hooks/useGitHubRepos";
import "./Projects.css";

const titleOf = (repo: GitHubRepo) => repo.name.replace(/[-_]+/g, " ");
const safeLink = (url: string | null) => {
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

  const filtered = useMemo(() => {
    const sorted = repos
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime() || a.name.localeCompare(b.name));

    const major = sorted.slice(0, 10);

    const githubCard: GitHubRepo = {
      id: 999999999,
      name: 'View All on GitHub',
      description: 'Everything else lives on my GitHub profile. Explore all my other projects, contributions, and active repositories.',
      html_url: 'https://github.com/Sarveshsivasankaran',
      homepage: 'https://github.com/Sarveshsivasankaran',
      stargazers_count: 0,
      forks_count: 0,
      language: 'GitHub',
      topics: [],
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString()
    };

    return [...major, githubCard];
  }, [repos]);

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!filtered || filtered.length === 0) return;
    const idx = Math.min(filtered.length - 1, Math.floor(latest * filtered.length));
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  // Orbit rotation based on scroll (1 full rotation over the entire section)
  // (Left intact in case we need it, though orbit is being replaced)
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

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
              marginBottom: 64,
            }}
          >
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 12,
              color: 'var(--stone)',
              letterSpacing: '0.1em'
            }}>
              <span style={{ color: 'var(--monarch)' }}>05</span> PROJECTS
            </span>
            <span style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              color: 'var(--stone)',
              fontSize: 14
            }}>
              Where theory meets reality
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
              ideas
            </span>
            <br />
            MEET PRODUCTION.
          </motion.h2>
        </div>

        {/* Character positioned at the bottom */}
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
        {/* Scroll-driven Horizontal Projects List */}
        <div style={{ 
          position: 'absolute', 
          bottom: '10%', 
          left: '0%', 
          width: '100%', 
          height: '420px', 
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

                const realScreenshot = repo.id === 999999999 
                  ? `https://socialify.git.ci/Sarveshsivasankaran/Portfolio/image?font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark`
                  : `https://socialify.git.ci/Sarveshsivasankaran/${repo.name}/image?font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark`;

                return (
                  <motion.div
                    key={repo.id}
                    animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.9 }}
                    style={{
                      background: 'var(--dungeon)', 
                      border: '1px solid var(--border)', 
                      borderRadius: 16,
                      display: 'flex', 
                      flexDirection: 'column', 
                      overflow: 'hidden', 
                      boxShadow: isActive ? '0 12px 40px rgba(0, 212, 255, 0.2)' : 'none',
                      width: 340,
                      height: 380,
                      flexShrink: 0,
                      transformOrigin: 'center center',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {/* Image Section */}
                    <div className="project-image-placeholder" style={{ position: 'relative', overflow: 'hidden', background: '#111', height: '160px', flexShrink: 0 }}>
                      <img 
                        src={realScreenshot} 
                        className="project-screenshot" 
                        alt={titleOf(repo)} 
                        loading="lazy" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                      />
                    </div>

                    {/* Info Section */}
                    <div style={{ padding: '24px', background: 'var(--void)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif', color: 'var(--ghost)' }}>{titleOf(repo)}</h3>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--stone)' }}><FiGitBranch aria-hidden="true" /> {repo.forks_count}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '12px', marginBottom: 16 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--gate)' }}><FiStar aria-hidden="true" /> {repo.stargazers_count} stars</span>
                       </div>
                       <p style={{ color: 'var(--stone)', fontSize: '13px', lineHeight: 1.5, marginBottom: 20, flexGrow: 1 }}>{repo.description || "Explore on GitHub."}</p>
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
    <div className="project-links" style={{ display: 'flex', gap: '12px' }}>
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
