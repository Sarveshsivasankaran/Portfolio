import React, { useRef, useState, useEffect, useId } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function HeroNameReveal() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [showNickname, setShowNickname] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseenter', () => setIsHovered(true));
      el.addEventListener('mouseleave', () => setIsHovered(false));
    }
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseenter', () => setIsHovered(true));
        el.removeEventListener('mouseleave', () => setIsHovered(false));
      }
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      
      // Swap text in the middle of the glitch
      setTimeout(() => {
        setShowNickname(prev => !prev);
      }, 250); 
      
      // Stop glitching
      setTimeout(() => {
        setIsGlitching(false);
      }, 550); 
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filterId = useId();

  return (
    <span 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'crosshair',
        paddingRight: '12px',
        zIndex: 1,
        minHeight: '120px', 
      }}
    >
      <style>{`
        .glitch-layer {
          position: relative;
          display: inline-block;
        }

        .glitch-layer::before,
        .glitch-layer::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          color: white; 
          -webkit-text-fill-color: white;
          z-index: 10;
        }

        .glitch-layer::before {
          left: 3px;
          text-shadow: -2px 0 #49FC00;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 0.35s infinite linear alternate-reverse;
        }

        .glitch-layer::after {
          left: -3px;
          text-shadow: -2px 0 #FC00B3; 
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 0.3s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip: rect(42px, 9999px, 44px, 0); }
          5% { clip: rect(12px, 9999px, 59px, 0); }
          10% { clip: rect(48px, 9999px, 29px, 0); }
          15% { clip: rect(42px, 9999px, 73px, 0); }
          20% { clip: rect(63px, 9999px, 27px, 0); }
          25% { clip: rect(34px, 9999px, 55px, 0); }
          30% { clip: rect(86px, 9999px, 73px, 0); }
          35% { clip: rect(20px, 9999px, 20px, 0); }
          40% { clip: rect(26px, 9999px, 60px, 0); }
          45% { clip: rect(25px, 9999px, 66px, 0); }
          50% { clip: rect(57px, 9999px, 98px, 0); }
          55% { clip: rect(5px, 9999px, 46px, 0); }
          60% { clip: rect(82px, 9999px, 31px, 0); }
          65% { clip: rect(54px, 9999px, 27px, 0); }
          70% { clip: rect(28px, 9999px, 99px, 0); }
          75% { clip: rect(45px, 9999px, 69px, 0); }
          80% { clip: rect(23px, 9999px, 85px, 0); }
          85% { clip: rect(54px, 9999px, 84px, 0); }
          90% { clip: rect(45px, 9999px, 47px, 0); }
          95% { clip: rect(37px, 9999px, 20px, 0); }
          100% { clip: rect(4px, 9999px, 91px, 0); }
        }

        @keyframes glitch-anim-2 {
          0% { clip: rect(65px, 9999px, 100px, 0); }
          5% { clip: rect(52px, 9999px, 74px, 0); }
          10% { clip: rect(79px, 9999px, 85px, 0); }
          15% { clip: rect(75px, 9999px, 5px, 0); }
          20% { clip: rect(67px, 9999px, 61px, 0); }
          25% { clip: rect(14px, 9999px, 79px, 0); }
          30% { clip: rect(1px, 9999px, 66px, 0); }
          35% { clip: rect(86px, 9999px, 30px, 0); }
          40% { clip: rect(23px, 9999px, 98px, 0); }
          45% { clip: rect(85px, 9999px, 72px, 0); }
          50% { clip: rect(71px, 9999px, 75px, 0); }
          55% { clip: rect(2px, 9999px, 48px, 0); }
          60% { clip: rect(30px, 9999px, 16px, 0); }
          65% { clip: rect(59px, 9999px, 50px, 0); }
          70% { clip: rect(41px, 9999px, 62px, 0); }
          75% { clip: rect(2px, 9999px, 82px, 0); }
          80% { clip: rect(47px, 9999px, 73px, 0); }
          85% { clip: rect(3px, 9999px, 27px, 0); }
          90% { clip: rect(26px, 9999px, 55px, 0); }
          95% { clip: rect(42px, 9999px, 97px, 0); }
          100% { clip: rect(38px, 9999px, 49px, 0); }
        }
      `}</style>

      {/* SVG Filter for Flame/Fluid Mask Distortion */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.04" 
              numOctaves="3" 
              result="noise" 
            >
              <animate attributeName="baseFrequency" values="0.04;0.07;0.04" dur="2.5s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="35" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Fire Aura Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          right: '-30px',
          bottom: '-30px',
          zIndex: -1,
          pointerEvents: 'none',
          background: `radial-gradient(circle 140px at var(--mouse-x) var(--mouse-y), rgba(147, 51, 234, 1), rgba(124, 58, 237, 0.6) 30%, transparent 60%)`,
          filter: `url(#${filterId}) blur(4px)`,
          mixBlendMode: 'screen',
        }}
        onUpdate={() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty('--mouse-x', `${smoothX.get() + 30}px`);
            containerRef.current.style.setProperty('--mouse-y', `${smoothY.get() + 30}px`);
          }
        }}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
        /* Slight horizontal shake during glitch */
        transform: isGlitching ? `translateX(${Math.random() * 4 - 2}px)` : 'translateX(0)',
      }}>
        {!showNickname ? (
          <>
            <span 
              data-text="Sarvesh" 
              className={isGlitching ? 'glitch-layer' : ''} 
              style={{ fontWeight: 'bold' }}
            >
              Sarvesh
            </span>
            <span 
              data-text="Sivasankaran" 
              className={isGlitching ? 'glitch-layer' : ''} 
              style={{
                fontWeight: 'bold',
                fontSize: '1.15em',
                background: 'linear-gradient(to right, #a855f7, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}
            >
              Sivasankaran
            </span>
          </>
        ) : (
          <span 
            data-text="Solo-P-Leveller" 
            className={isGlitching ? 'glitch-layer' : ''} 
            style={{
              fontWeight: 'bold',
              fontSize: '1.15em',
              background: 'linear-gradient(to right, #a855f7, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}
          >
            Solo-P-Leveller
          </span>
        )}
      </div>
    </span>
  );
}
