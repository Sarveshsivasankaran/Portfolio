import React from 'react'

export default function MarqueeSection() {
  const contentTags = [
    { text: "Sarvesh Sivasankaran", type: "name" },
    { text: "[S-RANK DEVELOPER]", type: "rank" },
    { text: "Solo-P-Leveller", type: "level" },
    { text: "⚡ UNLEASHING POTENTIAL", type: "action" },
    { text: "Quest Master", type: "status" },
    { text: "⚔️ CODE LEVELLING ACTIVE", type: "system" }
  ]

  const renderContent = () => (
    <div className="marquee-stream" style={{
      display: 'inline-flex',
      alignItems: 'center',
      willChange: 'transform',
    }}>
      {Array.from({ length: 3 }).map((_, repeatIdx) => (
        <span key={repeatIdx} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {contentTags.map((tag, idx) => {
            let textColor = 'var(--stone)'
            let textGlow = 'rgba(255,255,255,0.05)'
            let textWeight = '400'
            let tagBackground = 'transparent'
            let tagBorder = 'none'
            let tagPadding = '0'
            let tagMargin = '0 30px'

            if (tag.type === 'name') {
              textColor = 'var(--ghost)'
              textWeight = '700'
              textGlow = '0 0 12px rgba(241,245,249,0.35)'
            } else if (tag.type === 'rank') {
              textColor = '#fbbf24' // gold
              textWeight = '700'
              textGlow = '0 0 15px rgba(251,191,36,0.5)'
              tagBackground = 'rgba(251,191,36,0.08)'
              tagBorder = '1px solid rgba(251,191,36,0.3)'
              tagPadding = '4px 12px'
              tagMargin = '0 35px'
            } else if (tag.type === 'level') {
              textColor = 'var(--gate)' // neon purple
              textWeight = '600'
              textGlow = '0 0 12px rgba(124,58,237,0.45)'
            } else if (tag.type === 'action') {
              textColor = 'var(--teal)' // neon cyan
              textWeight = '700'
              textGlow = '0 0 12px rgba(6,182,212,0.45)'
              tagBackground = 'rgba(6,182,212,0.06)'
              tagBorder = '1px dashed rgba(6,182,212,0.25)'
              tagPadding = '3px 10px'
            } else if (tag.type === 'status') {
              textColor = 'var(--monarch)' // magenta
              textWeight = '600'
              textGlow = '0 0 10px rgba(168,85,247,0.3)'
            } else if (tag.type === 'system') {
              textColor = 'var(--stone)'
              textWeight = '600'
            }

            return (
              <span
                key={`${tag.text}-${idx}`}
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '19px',
                  textTransform: 'uppercase',
                  color: textColor,
                  letterSpacing: '0.15em',
                  textShadow: textGlow,
                  margin: tagMargin,
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: tagBackground,
                  border: tagBorder,
                  padding: tagPadding,
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                className={`marquee-tag tag-${tag.type}`}
              >
                {tag.text}
              </span>
            )
          })}
          {/* Separator glyph */}
          <span style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.08)',
            margin: '0 40px',
            fontFamily: 'sans-serif'
          }}>
            ❖
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div id="marquee-banner" style={{
      padding: '28px 0',
      background: 'rgba(10, 10, 12, 0.95)',
      borderTop: '2px solid rgba(59, 130, 246, 0.4)',
      borderBottom: '2px solid rgba(124, 58, 237, 0.4)',
      boxShadow: '0 0 25px rgba(6,182,212,0.08), inset 0 0 15px rgba(124,58,237,0.05)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 15,
      display: 'flex',
      whiteSpace: 'nowrap',
      alignItems: 'center',
    }}>
      {/* Background glow strip */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(6,182,212,0.01) 0%, rgba(124,58,237,0.01) 50%, rgba(6,182,212,0.01) 100%)',
        pointerEvents: 'none'
      }} />

      <div className="marquee-wrapper" style={{
        display: 'inline-flex',
        animation: 'marqueeScrollFull 20s linear infinite',
        willChange: 'transform',
      }}>
        {renderContent()}
      </div>
      <div className="marquee-wrapper" aria-hidden="true" style={{
        display: 'inline-flex',
        animation: 'marqueeScrollFull 20s linear infinite',
        willChange: 'transform',
      }}>
        {renderContent()}
      </div>

      <style>{`
        @keyframes marqueeScrollFull {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        #marquee-banner:hover .marquee-wrapper {
          animation-play-state: paused;
        }
        .marquee-tag:hover {
          transform: skewX(-10deg) scale(1.08);
          color: #fff !important;
          text-shadow: 0 0 18px #fff !important;
        }
      `}</style>
    </div>
  )
}
