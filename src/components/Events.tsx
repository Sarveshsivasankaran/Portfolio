import { useRef, useState } from 'react'
import { useDriveImages } from '../hooks/useDriveImages'
import { DRIVE_IMAGES } from '../data/driveImages'

// Placeholder shimmer cards for fallback / loading
function ShimmerCard() {
  return (
    <div className="skeleton" style={{
      width: '100%',
      aspectRatio: '4/3',
      borderRadius: 10,
    }} />
  )
}

// Individual image card
function EventImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      backgroundColor: 'rgba(31, 41, 55, 0.4)', // Subtle background color
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
      {/* Teal overlay on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(59,130,246,0.12)',
        mixBlendMode: 'color',
        opacity: 0,
        transition: 'opacity 0.2s',
        zIndex: 5,
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
      />
    </div>
  )
}

// Marquee column with pause-on-hover
function MarqueeColumn({
  images,
  duration,
  reverse,
}: {
  images: { id?: string; thumbnailUrl: string; name: string }[]
  duration: number
  reverse: boolean
}) {
  const colRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (colRef.current) colRef.current.style.animationPlayState = 'paused'
  }
  const handleMouseLeave = () => {
    if (colRef.current) colRef.current.style.animationPlayState = 'running'
  }

  // Duplicate for seamless loop
  const doubled = [...images, ...images]

  return (
    <div
      style={{ flex: 1, overflow: 'hidden' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={colRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          animation: `scrollUp ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {doubled.map((img, i) => (
          <EventImage key={`${img.id || img.thumbnailUrl}-${i}`} src={img.thumbnailUrl} alt={img.name} />
        ))}
      </div>
    </div>
  )
}

// Static drive images (pre-fetched from Drive folder)
const PLACEHOLDER_IMAGES = DRIVE_IMAGES

export default function Events() {
  const { data: driveImages, isLoading, isError } = useDriveImages()

  const images = (isError || !driveImages || driveImages.length === 0)
    ? PLACEHOLDER_IMAGES
    : driveImages

  const colA = images.filter((_, i) => i % 2 === 0)
  const colB = images.filter((_, i) => i % 2 === 1)

  return (
    <section id="events" style={{
      padding: '96px 64px 80px',
      background: 'var(--dungeon)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p className="section-label">// FIELD.OPERATIONS</p>
        <h2 className="section-heading" style={{ marginBottom: 48 }}>Events &amp; Speaking</h2>

        {/* Marquee container */}
        <div style={{
          position: 'relative',
          height: 600,
          overflow: 'hidden',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          {/* Top fade */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to bottom, var(--dungeon), transparent)',
            zIndex: 10,
            pointerEvents: 'none',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to top, var(--dungeon), transparent)',
            zIndex: 10,
            pointerEvents: 'none',
          }} />

          {/* Column A */}
          {isLoading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => <ShimmerCard key={i} />)}
            </div>
          ) : (
            <MarqueeColumn images={colA.length > 0 ? colA : PLACEHOLDER_IMAGES.filter((_, i) => i % 2 === 0)} duration={85} reverse={false} />
          )}

          {/* Center decorative text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: 48,
              color: 'rgba(241,245,249,0.06)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing: '0.2em',
              userSelect: 'none',
            }}>
              EVENTS
            </span>
          </div>

          {/* Column B */}
          {isLoading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => <ShimmerCard key={i} />)}
            </div>
          ) : (
            <MarqueeColumn images={colB.length > 0 ? colB : PLACEHOLDER_IMAGES.filter((_, i) => i % 2 === 1)} duration={85} reverse={true} />
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          #events { padding: 96px 24px 64px !important; }
        }
      `}</style>
    </section>
  )
}
