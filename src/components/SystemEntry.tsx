import { useState, useEffect, useRef } from 'react'

const BOOT = [
  { t: "MONARCH OS — AWAKENING SEQUENCE INITIATED", c: "#4B5563", d: 0 },
  { t: "LOADING DIMENSIONAL CORE... [OK]", c: "#4B5563", d: 550 },
  { t: "SCANNING LOCAL MANA FREQUENCY...", c: "#6B7280", d: 1100 },
  { t: "> FREQ: 9,847.33 Hz  [IRREGULAR]", c: "#3B82F6", d: 1650 },
  { t: "CROSS-REFERENCING HUNTER REGISTRY...", c: "#6B7280", d: 2100 },
  { t: "> STATUS: NOT REGISTERED  [ANOMALY]", c: "#F59E0B", d: 2600 },
  { t: "WARNING — IRREGULAR MANA SIGNATURE DETECTED", c: "#DC2626", d: 3100 },
  { t: "DIMENSIONAL RANK ASSESSMENT: IMMEASURABLE", c: "#7C3AED", d: 3650 },
  { t: "INITIATING EMERGENCY PROTOCOL ARISE-7...", c: "#6B7280", d: 4100 },
  { t: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%", c: "#7C3AED", d: 4600 },
  { t: "NEW PLAYER DETECTED — CALIBRATING SYSTEM...", c: "#06B6D4", d: 5100 },
]

interface SystemEntryProps {
  onEnter: () => void
}

export default function SystemEntry({ onEnter }: SystemEntryProps) {
  const [status, setStatus] = useState<'boot' | 'alert' | 'accepted' | 'denied'>('boot')
  const [bootLines, setBootLines] = useState<{ t: string; c: string }[]>([])
  const [timeElapsed, setTimeElapsed] = useState('00:00:00')
  const timeoutsRef = useRef<number[]>([])
  const startTimeRef = useRef(Date.now())

  // Update ticking HUD timer
  useEffect(() => {
    startTimeRef.current = Date.now()
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const m = String(Math.floor(elapsed / 60)).padStart(2, '0')
      const s = String(elapsed % 60).padStart(2, '0')
      setTimeElapsed(`00:${m}:${s}`)
    }, 500)
    return () => clearInterval(timer)
  }, [status])

  // Run the sequential log rendering
  const startBootSequence = () => {
    setStatus('boot')
    setBootLines([])
    
    // Clear any active timeouts
    timeoutsRef.current.forEach(id => clearTimeout(id))
    timeoutsRef.current = []

    BOOT.forEach((line, index) => {
      const id = window.setTimeout(() => {
        setBootLines(prev => [...prev, { t: line.t, c: line.c }])
        
        if (index === BOOT.length - 1) {
          const alertId = window.setTimeout(() => {
            setStatus('alert')
          }, 900)
          timeoutsRef.current.push(alertId)
        }
      }, line.d)
      timeoutsRef.current.push(id)
    })
  }

  useEffect(() => {
    startBootSequence()
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id))
    }
  }, [])

  const handleAccept = () => {
    setStatus('accepted')
    // After 2.8s, trigger website reveal
    const id = window.setTimeout(() => {
      onEnter()
    }, 2800)
    timeoutsRef.current.push(id)
  }

  const handleDeny = () => {
    setStatus('denied')
  }

  const handleRetry = () => {
    startBootSequence()
  }

  return (
    <div className="sl-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');
        
        .sl-wrap {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #0A0A12;
          font-family: 'Share Tech Mono', monospace;
          z-index: 99999;
          user-select: none;
        }

        .hex-bg {
          position: absolute;
          inset: 0;
          opacity: .05;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.3L60 34.7L30 52L0 34.7L0 17.3Z' fill='none' stroke='%233B82F6' stroke-width='1'/%3E%3C/svg%3E");
          background-size: 60px 52px;
          pointer-events: none;
        }

        .scan {
          position: absolute;
          width: 100%;
          height: 3px;
          background: rgba(59, 130, 246, .12);
          top: 0;
          animation: scan 5s linear infinite;
          pointer-events: none;
          z-index: 9;
        }
        @keyframes scan {
          0% { top: -3px; }
          100% { top: 100%; }
        }

        .c-tl, .c-tr, .c-bl, .c-br {
          position: absolute;
          width: 22px;
          height: 22px;
          border-color: #3B82F6;
          border-style: solid;
          opacity: .6;
          z-index: 5;
        }
        .c-tl { top: 18px; left: 18px; border-width: 2px 0 0 2px; }
        .c-tr { top: 18px; right: 18px; border-width: 2px 2px 0 0; }
        .c-bl { bottom: 18px; left: 18px; border-width: 0 0 2px 2px; }
        .c-br { bottom: 18px; right: 18px; border-width: 0 2px 2px 0; }

        .hud-top {
          position: absolute;
          top: 18px;
          left: 48px;
          right: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 5;
        }
        .hud-label {
          font-size: 11px;
          letter-spacing: .18em;
          color: #4B5563;
        }
        .hud-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3B82F6;
          animation: pip 1.5s infinite;
        }
        @keyframes pip {
          0%, 100% { opacity: 1; }
          50% { opacity: .2; }
        }

        .boot-log {
          position: absolute;
          top: 64px;
          left: 48px;
          right: 48px;
          bottom: 64px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 4;
          overflow: hidden;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .boot-line {
          font-size: 12px;
          animation: linein .25s ease forwards;
          opacity: 0;
          line-height: 1.4;
        }
        @keyframes linein {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .cursor {
          color: #3B82F6;
          animation: blink-cursor .7s step-end infinite;
        }
        @keyframes blink-cursor {
          50% { opacity: 0; }
        }

        .alert-layer {
          position: absolute;
          inset: 0;
          background: rgba(10, 10, 18, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          animation: fadein .4s ease;
        }
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .alert-box {
          width: 410px;
          max-width: 92%;
          border: 1px solid #3B82F6;
          background: #111827;
          animation: boxin .4s ease, glow 3s ease-in-out infinite;
        }
        @keyframes boxin {
          from { opacity: 0; transform: scale(.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 16px rgba(59, 130, 246, 0.35), 0 0 32px rgba(124, 58, 237, 0.15); }
          50% { box-shadow: 0 0 28px rgba(59, 130, 246, 0.65), 0 0 60px rgba(124, 58, 237, 0.35), 0 0 90px rgba(6, 182, 212, 0.15); }
        }

        .alert-hdr {
          background: #0d1e36;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #1e3a5f;
        }
        .alert-pip {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3B82F6;
          animation: pip 1.2s infinite;
        }
        .alert-hdr-txt {
          font-size: 10px;
          letter-spacing: .18em;
          color: #9CA3AF;
        }
        .alert-body {
          padding: 24px 24px 18px;
          text-align: center;
          font-family: 'Rajdhani', sans-serif;
        }
        .alert-sym {
          font-size: 46px;
          display: block;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px #7C3AED);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        .alert-main {
          font-size: 22px;
          font-weight: 700;
          color: #F1F5F9;
          letter-spacing: .08em;
          line-height: 1.3;
          animation: glitch 6s infinite;
        }
        @keyframes glitch {
          0%, 85%, 100% { text-shadow: none; transform: translate(0); }
          87% { text-shadow: 2px 0 #06B6D4, -2px 0 #DC2626; transform: translate(-1px, 0); }
          89% { text-shadow: -2px 0 #7C3AED; transform: translate(2px, 0); }
          91% { text-shadow: none; transform: translate(0); }
        }

        .alert-arise {
          font-size: 14px;
          color: #06B6D4;
          letter-spacing: .25em;
          margin: 8px 0 0;
          font-family: 'Share Tech Mono', monospace;
        }

        .stats {
          margin: 16px 0 0;
          border-top: 1px solid #1F2937;
          padding-top: 12px;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #1a2233;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
        }
        .stat-row:last-child { border: none; }
        
        .s-key { color: #6B7280; }
        .s-blue { color: #3B82F6; }
        .s-gold { color: #F59E0B; }
        .s-purple { color: #7C3AED; }
        .s-teal { color: #06B6D4; }

        .alert-q {
          font-size: 13px;
          color: #9CA3AF;
          margin-top: 16px;
          line-height: 1.5;
          font-family: 'Share Tech Mono', monospace;
        }

        .alert-actions {
          padding: 16px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          border-top: 1px solid #1F2937;
        }

        .btn-accept {
          background: #3B82F6;
          color: #fff;
          border: none;
          padding: 12px 0;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .15em;
          cursor: pointer;
          transition: all .2s;
          position: relative;
        }
        .btn-accept:hover { background: #2563EB; }
        .btn-accept:active { transform: scale(.97); }

        .btn-deny {
          background: transparent;
          color: #9CA3AF;
          border: 1px solid #374151;
          padding: 12px 0;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .12em;
          cursor: pointer;
          transition: all .2s;
        }
        .btn-deny:hover { border-color: #DC2626; color: #DC2626; }
        .btn-deny:active { transform: scale(.97); }

        .acc-layer {
          position: absolute;
          inset: 0;
          background: #0A0A12;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 30;
          gap: 0;
          animation: fadein .3s ease;
        }

        .portal {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 2px solid #7C3AED;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: portal-open 2.2s ease forwards;
          position: relative;
        }
        @keyframes portal-open {
          0% { transform: scale(0); opacity: 0; box-shadow: none; }
          30% { transform: scale(1); opacity: 1; box-shadow: 0 0 30px #7C3AED, 0 0 60px #3B82F6; }
          70% { transform: scale(1.05); box-shadow: 0 0 50px #7C3AED, 0 0 100px #3B82F6; }
          100% { transform: scale(18); opacity: 0; }
        }

        .portal-inner {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid #3B82F6;
          animation: portal-open 2.2s ease .15s forwards;
          opacity: 0;
        }

        .arise-txt {
          font-family: 'Rajdhani', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: .35em;
          color: #F1F5F9;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: fadein 1s ease 1.8s forwards;
          opacity: 0;
          white-space: nowrap;
          text-align: center;
        }

        .sub-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #3B82F6;
          letter-spacing: .2em;
          margin-top: 60px;
          animation: fadein 1s ease 2.2s forwards;
          opacity: 0;
        }

        .deny-layer {
          position: absolute;
          inset: 0;
          background: #0A0A12;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 30;
          animation: fadein .3s ease;
        }

        .deny-main {
          font-size: 16px;
          letter-spacing: .25em;
          color: #DC2626;
          animation: glitch .4s infinite;
        }

        .deny-sub {
          font-size: 11px;
          color: #4B5563;
          letter-spacing: .12em;
          text-align: center;
          max-width: 280px;
          line-height: 1.6;
        }

        .retry-btn {
          margin-top: 14px;
          background: transparent;
          border: 1px solid #374151;
          color: #6B7280;
          padding: 8px 24px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          letter-spacing: .12em;
          cursor: pointer;
          transition: all .2s;
        }
        .retry-btn:hover { border-color: #3B82F6; color: #3B82F6; }
        .retry-btn:active { transform: scale(.97); }
      ` }} />

      <div className="hex-bg"></div>
      <div className="scan"></div>
      <div className="c-tl"></div>
      <div className="c-tr"></div>
      <div className="c-bl"></div>
      <div className="c-br"></div>
      
      <div className="hud-top">
        <span className="hud-label">SYS://MONARCH-OS v9.4.2</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="hud-dot"></div>
          <span className="hud-label">
            {status === 'boot' ? 'INITIALIZING' : status === 'alert' ? 'AWAITING INPUT' : status === 'accepted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
          </span>
        </div>
        <span className="hud-label">{timeElapsed}</span>
      </div>

      <div 
        className="boot-log" 
        style={{
          opacity: status !== 'boot' ? 0.25 : 1,
          filter: status !== 'boot' ? 'blur(1px)' : 'none',
        }}
      >
        {bootLines.map((line, i) => (
          <div key={i} className="boot-line" style={{ color: line.c }}>
            &gt; {line.t}
          </div>
        ))}
        {status === 'boot' && <span className="cursor">█</span>}
      </div>

      {status === 'alert' && (
        <div className="alert-layer">
          <div className="alert-box">
            <div className="alert-hdr">
              <div className="alert-pip"></div>
              <span className="alert-hdr-txt">// SYSTEM ALERT — PRIORITY: EMERGENCY</span>
            </div>
            <div className="alert-body">
              <span className="alert-sym">⚡</span>
              <div className="alert-main">A NEW PLAYER<br />HAS BEEN DETECTED</div>
              <div className="alert-arise">— A R I S E —</div>
              <div className="stats">
                <div className="stat-row">
                  <span className="s-key">CLASS</span>
                  <span className="s-purple">UNKNOWN [IRREGULAR]</span>
                </div>
                <div className="stat-row">
                  <span className="s-key">MANA LEVEL</span>
                  <span className="s-gold">∞ IMMEASURABLE</span>
                </div>
                <div className="stat-row">
                  <span className="s-key">RANK</span>
                  <span className="s-gold">S — SHADOW MONARCH</span>
                </div>
                <div className="stat-row">
                  <span className="s-key">STATUS</span>
                  <span className="s-teal">AWAKENING...</span>
                </div>
              </div>
              <div className="alert-q">
                Will you accept the calling of the System<br />and enter this dimension?
              </div>
            </div>
            <div className="alert-actions">
              <button className="btn-accept" onClick={handleAccept}>[ ACCEPT ]</button>
              <button className="btn-deny" onClick={handleDeny}>[ DENY ]</button>
            </div>
          </div>
        </div>
      )}

      {status === 'accepted' && (
        <div className="acc-layer">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110, height: 110 }}>
            <div className="portal">
              <div className="portal-inner"></div>
            </div>
          </div>
          <div className="arise-txt">ARISE,&nbsp;PLAYER</div>
          <div className="sub-txt">ENTERING THE SYSTEM...</div>
        </div>
      )}

      {status === 'denied' && (
        <div className="deny-layer">
          <div className="deny-main">ACCESS DENIED</div>
          <div className="deny-sub">
            YOU LACK THE QUALIFICATIONS<br />TO ENTER THIS DUNGEON.
          </div>
          <button className="retry-btn" onClick={handleRetry}>[ RETRY ]</button>
        </div>
      )}
    </div>
  )
}
