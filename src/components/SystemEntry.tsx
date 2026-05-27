import { useState, useEffect, useRef, Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/pnf7pGj7N51D0PzY/scene.splinecode'

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
  const [status, setStatus] = useState<'connect' | 'boot' | 'alert' | 'accepted' | 'denied'>('connect')
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

  // Bind initial page load click/keydown/touchstart audio unlocking listener
  useEffect(() => {
    const handleInitialTrigger = () => {
      window.removeEventListener('click', handleInitialTrigger)
      window.removeEventListener('keydown', handleInitialTrigger)
      window.removeEventListener('touchstart', handleInitialTrigger)
      startBootSequence()
    }

    window.addEventListener('click', handleInitialTrigger)
    window.addEventListener('keydown', handleInitialTrigger)
    window.addEventListener('touchstart', handleInitialTrigger)

    return () => {
      window.removeEventListener('click', handleInitialTrigger)
      window.removeEventListener('keydown', handleInitialTrigger)
      window.removeEventListener('touchstart', handleInitialTrigger)
      timeoutsRef.current.forEach(id => clearTimeout(id))
    }
  }, [])

  useEffect(() => {
    if (status === 'alert') {
      const audio = new Audio('/sound/solo_leveling_system.mp3')
      audio.volume = 0.5
      audio.play().catch(err => {
        console.warn('System alert sound playback failed:', err)
      })
    }
  }, [status])

  const handleAccept = () => {
    setStatus('accepted')
    
    const audio = new Audio('/sound/Voicy_Arise.mp3')
    audio.volume = 0.8
    
    let transitioned = false
    const transition = () => {
      if (transitioned) return
      transitioned = true
      onEnter()
    }

    // Rely on ended event to transition exactly when "Arise" whisper finishes
    audio.addEventListener('ended', transition)
    
    audio.play().then(() => {
      // safety timeout of 5 seconds max so user is never stuck
      const safetyId = window.setTimeout(transition, 5000)
      timeoutsRef.current.push(safetyId)
    }).catch(err => {
      console.warn('Arise sound playback was prevented by the browser:', err)
      // Fallback timer if browser blocks audio autoplay
      const fallbackId = window.setTimeout(transition, 2800)
      timeoutsRef.current.push(fallbackId)
    })
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

        /* Highly customized Solo Leveling Neon Hologram alert frame from user request */
        .sl-notification-frame {
          position: relative;
          width: 480px;
          max-width: 95%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: sl-box-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          z-index: 25;
        }

        /* Sideways Glitch Stripes */
        .sl-notification-box::before,
        .sl-notification-box::after {
          content: '';
          position: absolute;
          left: -4px;
          right: -4px;
          height: 6px;
          background: rgba(0, 212, 255, 0.55);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.8), 0 0 5px #ffffff;
          opacity: 0;
          pointer-events: none;
          z-index: 10;
        }

        .sl-notification-box::before {
          top: 25%;
          animation: sl-stripe-glitch-top 5s steps(1) infinite;
        }

        .sl-notification-box::after {
          top: 70%;
          animation: sl-stripe-glitch-bottom 5s steps(1) infinite;
        }

        @keyframes sl-stripe-glitch-top {
          0%, 88%, 94%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scaleY(1);
          }
          89% {
            opacity: 1;
            transform: translate3d(-30px, 0, 0) scaleY(1.4);
            background: rgba(0, 212, 255, 0.85);
            height: 10px;
          }
          90% {
            opacity: 1;
            transform: translate3d(25px, 0, 0) scaleY(0.7);
            background: rgba(239, 68, 68, 0.85);
            height: 4px;
          }
          91% {
            opacity: 1;
            transform: translate3d(-18px, 0, 0) scaleY(1.2);
            background: rgba(192, 132, 252, 0.85);
            height: 8px;
          }
          92% {
            opacity: 0.7;
            transform: translate3d(20px, 0, 0) scaleY(1);
            background: rgba(0, 212, 255, 0.6);
          }
          93% {
            opacity: 0;
          }
        }

        @keyframes sl-stripe-glitch-bottom {
          0%, 90%, 96%, 100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scaleY(1);
          }
          91% {
            opacity: 1;
            transform: translate3d(35px, 0, 0) scaleY(1.5);
            background: rgba(0, 212, 255, 0.85);
            height: 8px;
          }
          92% {
            opacity: 1;
            transform: translate3d(-25px, 0, 0) scaleY(0.6);
            background: rgba(251, 191, 36, 0.85);
            height: 3px;
          }
          93% {
            opacity: 1;
            transform: translate3d(20px, 0, 0) scaleY(1.2);
            background: rgba(34, 211, 238, 0.85);
            height: 7px;
          }
          94% {
            opacity: 0.7;
            transform: translate3d(-15px, 0, 0) scaleY(1);
            background: rgba(0, 212, 255, 0.6);
          }
          95% {
            opacity: 0;
          }
        }

        @keyframes sl-box-in {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }

        /* Top and Bottom Horizontal Bars matching the image's cyan caps */
        .sl-frame-border {
          position: absolute;
          left: 12px;
          right: 12px;
          height: 3px;
          background: linear-gradient(90deg, rgba(0, 212, 255, 0) 0%, rgba(0, 212, 255, 0.8) 15%, rgba(0, 212, 255, 0.8) 85%, rgba(0, 212, 255, 0) 100%);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.7);
          z-index: 10;
        }
        .sl-frame-border::before, .sl-frame-border::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 8px;
          background: #00d4ff;
          box-shadow: 0 0 12px #00d4ff;
        }
        .sl-frame-border.top-bar {
          top: 0;
        }
        .sl-frame-border.top-bar::before { left: 0; top: -3px; }
        .sl-frame-border.top-bar::after { right: 0; top: -3px; }

        .sl-frame-border.bottom-bar {
          bottom: 0;
        }
        .sl-frame-border.bottom-bar::before { left: 0; bottom: -3px; }
        .sl-frame-border.bottom-bar::after { right: 0; bottom: -3px; }

        /* Left and Right Brackets with notch styling */
        .sl-frame-bracket {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: rgba(0, 212, 255, 0.3);
          z-index: 9;
        }
        .sl-frame-bracket::before, .sl-frame-bracket::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 24px;
          background: #00d4ff;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
        }
        .sl-frame-bracket.left-bracket {
          left: 0;
          border-left: 2px solid #00d4ff;
        }
        .sl-frame-bracket.left-bracket::before { left: -4px; top: 20%; }
        .sl-frame-bracket.left-bracket::after { left: -4px; bottom: 20%; }

        .sl-frame-bracket.right-bracket {
          right: 0;
          border-right: 2px solid #00d4ff;
        }
        .sl-frame-bracket.right-bracket::before { right: -4px; top: 20%; }
        .sl-frame-bracket.right-bracket::after { right: -4px; bottom: 20%; }

        /* Inner Holographic glass box */
        .sl-notification-box {
          width: 100%;
          background: rgba(5, 12, 28, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 212, 255, 0.35);
          box-shadow: inset 0 0 20px rgba(0, 212, 255, 0.15), 0 0 40px rgba(0, 212, 255, 0.25);
          padding: 32px 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 5;
        }

        /* Top Header Notification Badge */
        .sl-notification-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1.5px solid rgba(0, 212, 255, 0.85);
          padding: 8px 24px;
          background: rgba(0, 20, 48, 0.6);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
          margin-bottom: 24px;
          position: relative;
          min-width: 220px;
        }
        .sl-notification-badge::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(0, 212, 255, 0.25);
          pointer-events: none;
        }

        .sl-badge-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid #00d4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 212, 255, 0.1);
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
        }

        .sl-exclamation {
          color: #00d4ff;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 0 5px #00d4ff;
        }

        .sl-badge-text {
          color: #ffffff;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.18em;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }

        /* Body Typography and Glow Content */
        .sl-notification-body {
          width: 100%;
          text-align: center;
          font-family: 'Rajdhani', sans-serif;
        }

        .sl-notification-glow-title {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          line-height: 1.3;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.5);
          animation: sl-glitch 5s infinite;
        }

        @keyframes sl-glitch {
          0%, 92%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); transform: translate(0); }
          94% { text-shadow: 2px 0 #00d4ff, -2px 0 #DC2626; transform: translate(-1px, 0); }
          96% { text-shadow: -2px 0 #7C3AED; transform: translate(1px, 0); }
          98% { text-shadow: none; transform: translate(0); }
        }

        .sl-notification-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 15px;
          color: #00d4ff;
          letter-spacing: 0.3em;
          margin-bottom: 20px;
          text-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
        }

        /* Sci-Fi Stats Panel */
        .sl-stats-container {
          border-top: 1px solid rgba(0, 212, 255, 0.2);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
          padding: 16px 0;
          margin-bottom: 20px;
          background: rgba(0, 10, 25, 0.35);
        }

        .sl-stat-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 12px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.05);
        }
        .sl-stat-row:last-child {
          border-bottom: none;
        }

        .sl-stat-label {
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.1em;
        }

        .sl-stat-value {
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .sl-stat-value.purple {
          color: #c084fc;
          text-shadow: 0 0 6px rgba(192, 132, 252, 0.8);
        }
        .sl-stat-value.gold {
          color: #fbbf24;
          text-shadow: 0 0 6px rgba(251, 191, 36, 0.8);
        }
        .sl-stat-value.teal {
          color: #22d3ee;
          text-shadow: 0 0 6px rgba(34, 211, 238, 0.8);
        }

        .sl-question {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        /* Buttons & Actions */
        .sl-notification-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }

        .sl-btn {
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 12px 0;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(0, 212, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .sl-btn-accept {
          background: rgba(0, 212, 255, 0.15);
          color: #00d4ff;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
        }
        .sl-btn-accept:hover {
          background: rgba(0, 212, 255, 0.35);
          color: #ffffff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
          border-color: #00d4ff;
        }
        .sl-btn-accept:active {
          transform: scale(0.95);
        }

        .sl-btn-deny {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .sl-btn-deny:hover {
          background: rgba(220, 38, 38, 0.15);
          color: #f87171;
          border-color: #f87171;
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
        }
        .sl-btn-deny:active {
          transform: scale(0.95);
        }

        /* Shadow Monarch Mist Container */
        .shadow-mist-container {
          position: absolute;
          inset: 0;
          z-index: 3; /* Rendered between the 3D Spline scene and HUD overlays */
          overflow: hidden;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: url(#shadow-mist-filter) blur(10px);
          opacity: 0.75;
          animation: mist-fade-in 2.5s ease-out forwards;
        }

        @keyframes mist-fade-in {
          0% { opacity: 0; }
          100% { opacity: 0.75; }
        }

        .mist-cloud {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.5;
          transform-origin: center center;
        }

        /* Ambient organic shadow monarch mist layers */
        .mist-purple-1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(76, 29, 149, 0.18) 50%, rgba(0, 0, 0, 0) 70%);
          left: -150px;
          bottom: -150px;
          animation: float-mist-1 28s infinite ease-in-out;
        }

        .mist-cyan-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.38) 0%, rgba(0, 76, 120, 0.12) 60%, rgba(0, 0, 0, 0) 80%);
          right: -80px;
          top: -80px;
          animation: float-mist-2 32s infinite ease-in-out;
        }

        .mist-dark-2 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(12, 12, 28, 0.95) 0%, rgba(6, 6, 15, 0.45) 55%, rgba(0, 0, 0, 0) 75%);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: float-mist-3 38s infinite ease-in-out;
        }

        .mist-purple-2 {
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(0, 0, 0, 0) 70%);
          left: 25%;
          bottom: -200px;
          animation: float-mist-4 30s infinite ease-in-out;
        }

        /* Fluid organic floating keyframes */
        @keyframes float-mist-1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(100px, -60px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-50px, 90px) scale(0.9) rotate(240deg); }
        }

        @keyframes float-mist-2 {
          0%, 100% { transform: translate(0, 0) scale(1.1) rotate(0deg); }
          50% { transform: translate(-100px, 70px) scale(0.85) rotate(-180deg); }
        }

        @keyframes float-mist-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          33% { transform: translate(-45%, -55%) scale(1.08) rotate(90deg); }
          66% { transform: translate(-55%, -45%) scale(0.92) rotate(-90deg); }
        }

        @keyframes float-mist-4 {
          0%, 100% { transform: translate(0, 0) scale(0.9) rotate(0deg); }
          50% { transform: translate(60px, -90px) scale(1.15) rotate(180deg); }
        }

      ` }} />

      <div className="hex-bg"></div>

      {status === 'connect' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#0d0c15',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Share Tech Mono, monospace',
          color: '#00d4ff',
          cursor: 'pointer',
          padding: '20px',
        }}>
          <div style={{
            fontSize: '18px',
            letterSpacing: '0.2em',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.45)',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            &gt; SYSTEM BOOT INITIATED
          </div>
          <div style={{
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'rgba(255, 255, 255, 0.65)',
            animation: 'blink 1.2s infinite steps(2, start)',
          }}>
            [ CLICK OR TAP ANYWHERE TO SYNC NEURAL LINK ]
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes blink {
              to { visibility: hidden; }
            }
          ` }} />
        </div>
      )}

      {/* Interactive 3D Holographic Backdrop Scene */}
      <Suspense fallback={null}>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.45,
          width: '100%',
          height: '100%',
        }}>
          <Spline scene={SPLINE_URL} />
        </div>
      </Suspense>

      {/* Dark Shadow Monarch Mist Aura (SVG Filtered Organic Fluid Particles) */}
      <div className="shadow-mist-container">
        <div className="mist-cloud mist-purple-1"></div>
        <div className="mist-cloud mist-cyan-1"></div>
        <div className="mist-cloud mist-dark-2"></div>
        <div className="mist-cloud mist-purple-2"></div>
      </div>

      {/* SVG filter for organic liquid/mist turbulence morphing */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="shadow-mist-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise">
              <animate attributeName="baseFrequency" values="0.015;0.022;0.015" dur="30s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

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
          <div className="sl-notification-frame">
            {/* Cybernetic outer corners and glowing brackets */}
            <div className="sl-frame-border top-bar"></div>
            <div className="sl-frame-border bottom-bar"></div>
            <div className="sl-frame-bracket left-bracket"></div>
            <div className="sl-frame-bracket right-bracket"></div>

            <div className="sl-notification-box">
              {/* Header Badge */}
              <div className="sl-notification-badge">
                <div className="sl-badge-icon">
                  <span className="sl-exclamation">!</span>
                </div>
                <span className="sl-badge-text">NOTIFICATION</span>
              </div>

              {/* Body */}
              <div className="sl-notification-body">
                <div className="sl-notification-glow-title">
                  A NEW PLAYER HAS BEEN DETECTED
                </div>
                <div className="sl-notification-subtitle">— A R I S E —</div>
                
                {/* Stats Panel */}
                <div className="sl-stats-container">
                  <div className="sl-stat-row">
                    <span className="sl-stat-label">CLASS</span>
                    <span className="sl-stat-value purple">UNKNOWN [IRREGULAR]</span>
                  </div>
                  <div className="sl-stat-row">
                    <span className="sl-stat-label">MANA LEVEL</span>
                    <span className="sl-stat-value gold">∞ IMMEASURABLE</span>
                  </div>
                  <div className="sl-stat-row">
                    <span className="sl-stat-label">RANK</span>
                    <span className="sl-stat-value gold">S — SHADOW MONARCH</span>
                  </div>
                  <div className="sl-stat-row">
                    <span className="sl-stat-label">STATUS</span>
                    <span className="sl-stat-value teal">AWAKENING...</span>
                  </div>
                </div>

                <div className="sl-question">
                  Will you accept the calling of the System<br />and enter this dimension?
                </div>
              </div>

              {/* Actions */}
              <div className="sl-notification-actions">
                <button className="sl-btn sl-btn-accept" onClick={handleAccept}>ACCEPT</button>
                <button className="sl-btn sl-btn-deny" onClick={handleDeny}>DENY</button>
              </div>
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
