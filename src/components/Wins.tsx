import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'
import { type LinkedInPost } from '../data/linkedinPosts'
import { useLinkedInPosts } from '../hooks/useLinkedInPosts'
import { isLinkedInUrl } from '../lib/linkedinPosts'

import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiLinkedin, 
  FiExternalLink,
  FiX,
  FiMaximize2,
  FiShield
} from 'react-icons/fi'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_URL = 'https://prod.spline.design/kZiQZ1hp09EE5chm/scene.splinecode'

const TYPE_COLORS: Record<LinkedInPost['type'], string> = {
  post:        '#06b6d4', // Cyan
  article:     '#a78bfa', // Purple
  certificate: '#fbbf24', // Gold
  project:     '#10b981', // Emerald
}

const TYPE_LABELS: Record<LinkedInPost['type'], string> = {
  post:        'INTEL POST',
  article:     'DEV LOG',
  certificate: 'CREDENTIAL',
  project:     'TACTICAL PROJECT',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' })
}

import FeaturedRecordCard, { type EventRecord } from './FeaturedRecordCard';

const ALL_EVENTS: EventRecord[] = [
  {
    id: 0,
    title: "World Record: Students Use Robots to Plant a Micro Forest in Chennai",
    category: "World Record",
    issuer: "TIFA",
    year: "2020",
    badge: "⭐ S-RANK RECORD ACHIEVEMENT",
    description: (
      <>
        <p style={{ margin: 0 }}>On January 25, 2020, at the Anna University campus in Chennai, a remarkable world record attempt took place — instead of humans planting trees, it was student-built robots that did the work. The robots were programmed to pick up saplings, lower them into the soil, and water them. A total of 326 students from 20 centres of SP Robotics Maker Lab, aged between 7 and 17, built and operated these robots to create what is recognized as the world's first micro forest planted by robots.</p>
        <p style={{ margin: 0 }}>The robots were controlled via smartphones over Bluetooth, with one team assembling and operating the robots while another team coded the watering mechanism. The planted saplings were committed to be nurtured for three years by SP Robotics in collaboration with Communitree.</p>
        <p style={{ margin: 0 }}>The initiative was inspired when a student submitted a project featuring a robot planting trees and a friend's robot watering them. The Maker Lab Head, Aarthi Muralitharan, scaled up the idea into a world record attempt to demonstrate that technology can be harnessed to fight climate change and benefit nature.</p>
        <p style={{ margin: 0 }}>The event set the world record for <strong style={{ color: 'var(--gold)' }}>"Most Participants with Robots to Create a Micro Forest"</strong> and received a World Record Certificate in recognition of this achievement.</p>
      </>
    ),
    link: "https://www.ndtv.com/chennai-news/chennai-students-use-robots-to-plant-300-saplings-raise-micro-forest-2170644",
    linkText: "READ OFFICIAL NDTV REPORT",
    media: [
      { url: '/tifa_micro_forest_certificate.jpg', title: 'World Record Certificate', type: 'certificate' },
      { url: '/micro_forest_event_1.jpg', title: 'Robotics Team World Record Group', type: 'photo' },
      { url: '/micro_forest_event_2.jpg', title: 'Student Team Lead holding record card', type: 'photo' },
      { url: '/micro_forest_event_3.jpg', title: 'World Record presentation ceremony', type: 'photo' },
      { url: '/micro_forest_event_4.jpg', title: 'Participants with the planting robots', type: 'photo' },
      { url: '/micro_forest_event_5.jpg', title: 'Student Operator with autonomous robot', type: 'photo' },
    ]
  },
  {
    id: 6,
    title: "Presented to Honourable AI Minister - AI Nexus 2026 EXPO",
    category: "AI Expo Showcase",
    issuer: "Rajalakshmi Engineering College",
    year: "2026",
    badge: "⭐ EXPO PRESENTATION",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>At the <strong>AI Nexus 2026 EXPO</strong>, our team had the tremendous honor of presenting <strong>NOTEZILLA</strong>, our full-stack academic notes management platform, directly to the <strong>Honourable Minister for AI of Tamil Nadu</strong>.</p>
        <p style={{ margin: 0 }}>Notezilla is built for Rajalakshmi Engineering College, offering a centralized hub with role-based access, featuring advanced AI capabilities via Google Generative AI and LangChain (with Ollama). Showcasing our solution to the Honourable Minister and industry leaders was a defining moment in our technical journey, validating the real-world impact of our platform.</p>
      </>
    ),
    link: "https://lnkd.in/p/g2YZjSQ6",
    linkText: "VIEW POST",
    linkIcon: "linkedin",
    media: [
      { url: '/ainexus_1.jpg', title: 'Team Notezilla at the AI Nexus 2026 EXPO Stall', type: 'photo' },
      { url: '/ainexus_2.jpg', title: 'Group Photo at AI Nexus 2026 EXPO', type: 'photo' },
      { url: '/ainexus_3.jpg', title: 'Notezilla Project Details Poster', type: 'photo' }
    ]
  },
  {
    id: 7,
    title: "Acentra Health 'Build to Care' Hackathon 2026 - Grand Finalist",
    category: "Healthcare AI & FWA Intelligence",
    issuer: "Hackforge.ai × Acentra Health",
    year: "2026",
    badge: "⭐ GRAND FINALIST (TOP 34 OF 650+)",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>Our team advanced to the Grand Finals of the <strong>Hackforge.ai × Acentra Health &ldquo;Build to Care&rdquo; Hackathon 2026</strong>, emerging among the <strong>Top 34 finalist teams selected from 650+ teams</strong> spanning Chennai, Hyderabad, Bengaluru, and beyond. Representing Rajalakshmi Engineering College, we were one of the 9 finalist teams out of 11 shortlisted from our institution.</p>
        <p style={{ margin: 0, marginBottom: 12 }}>Tackling Problem Statement 3 &mdash; <em>Healthcare Fraud, Waste, and Abuse (FWA) Intelligence</em> &mdash; we architected <strong>ClaimShield Nexus</strong>. Designed for healthcare payers and Special Investigation Units (SIUs), our platform combines ML anomaly detection, explainable risk scoring, graph network analysis to uncover fraudulent collusions, an audit-ready evidence ledger, and an Elasticsearch-powered &ldquo;Second Brain&rdquo; semantic retrieval copilot with human-in-the-loop workflows.</p>
        <p style={{ margin: 0 }}>Over an intense 36-hour sprint of development, debugging, and pitching against fierce competition, this hackathon tested our resilience, systems thinking, and presentation skills under high pressure. Built together with teammates S. Rithika Saran, Sabnish Seetharaman, and Nandhini VS, this journey delivered immense growth in building scalable healthcare AI and communicating architectural value.</p>
      </>
    ),
    link: "https://github.com/Sarveshsivasankaran/ClaimShield_Nexus",
    linkText: "VIEW PROJECT",
    linkIcon: "github",
    secondaryLink: "https://lnkd.in/p/gdiunmfi",
    secondaryLinkText: "VIEW POST",
    secondaryLinkIcon: "linkedin",
    media: [
      { url: '/acentra_hackathon_1.png', title: 'Build to Care Finals - The Finalist Badge', type: 'certificate' },
      { url: '/acentra_hackathon_4.png', title: 'Certificate of Participation & Goodies', type: 'certificate' },
      { url: '/acentra_hackathon_2.png', title: 'Grand Finals Stage - 34 Finalist Teams from 650+', type: 'certificate' },
      { url: '/acentra_hackathon_3.png', title: 'Team & Mentor Experience at Acentra Health', type: 'certificate' }
    ]
  },
  {
    id: 8,
    title: "Featured in Texplore Magazine 2026 - REC CSE Department",
    category: "Official Department Publication",
    issuer: "Rajalakshmi Engineering College",
    year: "2026",
    badge: "⭐ STUDENT SPOTLIGHT FEATURE",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>Honored to be spotlighted in <strong>Texplore Magazine 2026 (Jan–Mar Edition)</strong>, the official digital publication of the Department of Computer Science &amp; Engineering at Rajalakshmi Engineering College. Recognized under the alias <strong>Solo-P-Leveller</strong> (&ldquo;Code. Create. Conquer.&rdquo;), the feature celebrates my active technical journey and community contributions.</p>
        <p style={{ margin: 0, marginBottom: 12 }}>Highlighted in the magazine&rsquo;s <strong>Student Spotlights</strong> for my work as a speaker at the <em>Codesapiens Meetup 2K26</em>, this recognition reflects months of stepping beyond conventional coursework &mdash; leading speaker sessions, coordinating technical fests, building impactful projects, and actively driving student tech initiatives.</p>
        <p style={{ margin: 0 }}>Special gratitude to Thiyaga B Sir, Keerthana M G, and the entire CodeSapiens family for providing platforms where students can step forward, share knowledge, and lead. A defining milestone proving that showing up consistently, building in public, and embracing every opportunity creates meaningful, lasting impact.</p>
      </>
    ),
    link: "https://recmagazine.vercel.app/",
    linkText: "VIEW MAGAZINE",
    linkIcon: "external",
    secondaryLink: "https://lnkd.in/p/gbe2Sgep",
    secondaryLinkText: "VIEW POST",
    secondaryLinkIcon: "linkedin",
    media: [
      { url: '/texplore_magazine_2026.png', title: 'Texplore Magazine 2026 - Solo-P-Leveller Feature', type: 'certificate' }
    ]
  },
  {
    id: 1,
    title: "SIH 2025 - Software Edition Internal Hackathon Winner",
    category: "Disaster Management Statement",
    issuer: "SIH 2025",
    year: "2025",
    badge: "⭐ HACKATHON WINNER",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>Our team <strong>Code-O-Philes</strong> made it to the Top 50 among 160+ teams in the SIH Internal Hackathon 2025 (Software Edition) conducted at Rajalakshmi Engineering College. The past month has been transformative — countless brainstorming sessions, continuous iterations, and late-night discussions all shaped our solution.</p>
        <p style={{ margin: 0, marginBottom: 12 }}>During the 30-hour hackathon, we faced unexpected issues with our hardware sensors on the first night. We worked through the night, barely managing an hour of inconsistent sleep, until we solved the problem and got everything back on track. This experience pushed us to stay calm under pressure, troubleshoot effectively, and find solutions despite fatigue and constraints.</p>
        <p style={{ margin: 0 }}>Participating in this hackathon gave us an incredible opportunity to strengthen our technical skills, improve our problem-solving approach, and experience the excitement of building something meaningful under time pressure. It was a month-long journey of growth, collaboration, and learning.</p>
      </>
    ),
    link: "https://lnkd.in/p/gsaDTfV8",
    linkText: "VIEW POST",
    linkIcon: "linkedin",
    media: [
      { url: '/sih_hackathon_1.png', title: 'Code-O-Philes Team at SIH 2025', type: 'photo' },
      { url: '/sih_hackathon_2.png', title: 'SIH 2025 Hackathon Prize', type: 'photo' },
      { url: '/sih_hackathon_3.png', title: 'Team Code-O-Philes Hackathon Workspace', type: 'photo' },
      { url: '/sih_hackathon_4.png', title: 'Team Collaborating at SIH 2025', type: 'photo' },
      { url: '/sih_hackathon_5.png', title: 'Troubleshooting Hardware at SIH 2025', type: 'photo' }
    ]
  },
  {
    id: 2,
    title: "Appointed as Vice President - Intellexa REC Club",
    category: "Student Leadership",
    issuer: "Intellexa REC, Rajalakshmi Engineering College",
    year: "2026",
    badge: "⭐ LEADERSHIP APPOINTMENT",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>On August 12, 2026, I was officially appointed as the <strong>Vice President of the Intellexa REC Club</strong> for the 2026-2027 academic tenure. This role represents a major step in my leadership journey, allowing me to spearhead club activities and strengthen member participation.</p>
        <p style={{ margin: 0 }}>Stepping into this role, I am committed to fostering a positive environment where innovation thrives, members can actively develop their technical skills, and creative ideas can grow. I'm excited to work closely with the President and fellow club leads to achieve our shared vision for the upcoming year.</p>
      </>
    ),
    link: "https://lnkd.in/p/gDGfM5MX",
    linkText: "VIEW POST",
    linkIcon: "linkedin",
    media: [
      { url: '/intellexa_vp_1.png', title: 'Vice President Announcement', type: 'photo' },
      { url: '/intellexa_vp_3.png', title: 'Official Letter of Appointment', type: 'photo' },
      { url: '/intellexa_vp_2.png', title: 'Intellexa Tenure 2026-2027 Group Photo', type: 'photo' },
      { url: '/intellexa_vp_4.png', title: 'Addressing the Club as Vice President', type: 'photo' }
    ]
  },
  {
    id: 3,
    title: "ICC World Cup Project - Cheering & Cleaning Robot",
    category: "National Level",
    issuer: "SP Robotics Works",
    year: "2019",
    badge: "⭐ NATIONAL LEVEL PROJECT",
    description: (
      <>
        <p style={{ margin: 0 }}>On July 6, 2019, I actively participated in the National Level ICC World Cup robotics competition organized by SP Robotics Maker Lab. For my entry, I designed and built a functional prototype titled the <strong>"Cheering & Cleaning Robot"</strong>.</p>
        <p style={{ margin: 0, marginTop: 12 }}>This unique edutainment robot combined the excitement of the game with real-world utility. I created a video presentation showcasing the prototype in action, demonstrating my ability to integrate sensors and programming logic to solve practical problems. I was awarded a Certification for Appreciation for my invaluable participation and excellent technical showcase.</p>
      </>
    ),
    link: "",
    linkText: "",
    media: [
      { url: '/icc_certificate_rotated.png', title: 'ICC World Cup Project Certificate', type: 'certificate' }
    ]
  },
  {
    id: 4,
    title: "Featured on REC Official Website",
    category: "Beyond Grades: The Lessons That Shaped My Engineering Journey",
    issuer: "Rajalakshmi Engineering College",
    year: "2026",
    badge: "⭐ PROUD MILESTONE",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>I am incredibly proud to see my writing go live on the front page blog section of the official Rajalakshmi Engineering College website. The published article, <strong>"Beyond Grades: The Lessons That Shaped My Engineering Journey"</strong>, is a specially adapted version of my book <em>'The Faces Behind Faces'</em>.</p>
        <p style={{ margin: 0 }}>The piece explores how learning goes far beyond classrooms and academic performance, focusing instead on the invaluable lessons learned through real-world experiences, challenges, and relationships. It was an honor to share my journey and insights with the entire college community.</p>
      </>
    ),
    link: "https://www.rajalakshmi.org/blogs/beyond-grades-lessons-that-shaped-my-engineering-journey",
    linkText: "VIEW BLOG",
    linkIcon: "external",
    secondaryLink: "https://lnkd.in/p/gjA9Zhvk",
    secondaryLinkText: "VIEW POST",
    secondaryLinkIcon: "linkedin",
    media: [
      { url: '/rec_blog_feature.png', title: 'Featured on REC Website Blog', type: 'photo' }
    ]
  },
  {
    id: 5,
    title: "Guest Speaker - Codesapiens February Meetup 2k26",
    category: "Tech Talk & Knowledge Sharing",
    issuer: "Codesapiens",
    year: "2026",
    badge: "⭐ GUEST SPEAKER",
    description: (
      <>
        <p style={{ margin: 0, marginBottom: 12 }}>I had the incredible opportunity to be a guest speaker at the <strong>Codesapiens February Meetup 2k26</strong>. It was a fantastic experience taking the stage to share my insights on productivity, time management, and mastering technical skills with an enthusiastic crowd of peers.</p>
        <p style={{ margin: 0 }}>The vibe was absolutely amazing—everyone was eager to learn, think deeply about their goals, and find purpose in their work. Engaging with such a vibrant community of developers and sharing ideas in such a chill, collaborative environment was truly inspiring.</p>
      </>
    ),
    link: "https://lnkd.in/p/gaqrxNR4",
    linkText: "VIEW POST",
    linkIcon: "linkedin",
    media: [
      { url: '/codesapiens_speaker_main.png', title: 'Guest Speaker at Codesapiens', type: 'photo' },
      { url: '/codesapiens_collage.png', title: 'Speaking Engagements', type: 'photo' },
      { url: '/codesapiens_1.png', title: 'Speaking at Codesapiens Meetup', type: 'photo' },
      { url: '/codesapiens_2.png', title: 'Sharing Insights on Purpose and Mastery', type: 'photo' },
      { url: '/codesapiens_3.png', title: 'Engaging with the Audience', type: 'photo' },
      { url: '/codesapiens_4.png', title: 'The Vibe: Chill, Think, and Connect', type: 'photo' }
    ]
  }
];
export default function Wins() {
  const containerRef = useRef<HTMLElement>(null)
  const [viewportWidth, setViewportWidth] = useState(1200)
  const isTabletOrMobile = viewportWidth < 1024
  const splineApp = useRef<any>(null)
  const splineCamera = useRef<any>(null)

  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sliderContainerRef,
    offset: ["start start", "end end"]
  })

  // Physics-based spring smoothing to eliminate stepped mouse-wheel jitter
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 140,
    mass: 0.16
  })
  const x = useTransform(smoothProgress, [0, 1], ["0vw", `-${(ALL_EVENTS.length - 1) * 100}vw`])

  const [sliderIndex, setSliderIndex] = useState(0)

  useMotionValueEvent(smoothProgress, "change", (latest: number) => {
    const idx = Math.min(ALL_EVENTS.length - 1, Math.max(0, Math.round(latest * (ALL_EVENTS.length - 1))))
    if (idx !== sliderIndex) {
      setSliderIndex(idx)
    }
  })

  const scrollToCard = (index: number) => {
    if (!sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top
    const totalScrollable = sliderContainerRef.current.offsetHeight - window.innerHeight
    if (totalScrollable <= 0) return
    const target = scrollTop + (index / (ALL_EVENTS.length - 1)) * totalScrollable
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    scrollToCard(Math.max(0, sliderIndex - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    scrollToCard(Math.min(ALL_EVENTS.length - 1, sliderIndex + 1))
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  // High-Performance HTML5 Canvas Grid & Particle Background Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Lightweight particle pool for smooth 60fps performance
    const particleCount = 24
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      alpha: number
      pulseSpeed: number
      pulseDir: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.35 + 0.1),
        alpha: Math.random() * 0.45 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      })
    }

    let scanY = 0
    const gridSpacing = 60

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grids
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.025)' // Gold grid lines
      ctx.lineWidth = 0.5
      
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Tech radars in corner
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.04)' // Purple radar
      ctx.beginPath()
      ctx.arc(40, 40, 100, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width - 40, height - 40, 150, 0, Math.PI * 2)
      ctx.stroke()

      // Horizontal sweeping tracking lines
      scanY += 0.8
      if (scanY > height) scanY = 0
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)' // Teal scanline
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()

      // Render lightweight coordinates particles
      particles.forEach((p) => {
        p.y += p.speedY
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.8 || p.alpha < 0.1) {
          p.pulseDir *= -1
        }

        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])



  // Track screen size for responsive card calculations
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    if (!splineCamera.current) return
    try {
      splineCamera.current.rotation.y = latest * Math.PI * 0.4
    } catch (e) {}
  })

  function onSplineLoad(app: any) {
    splineApp.current = app
    try {
      splineCamera.current = app.findObjectByName('Camera')
    } catch (e) {}
  }

  
  return (
    <section id="wins" ref={containerRef} style={{
      padding: isTabletOrMobile ? '64px 20px 48px' : '80px 64px 64px',
      background: 'var(--void)',
      position: 'relative',
    }}>
      {/* HTML5 Cybernetic Grid Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />

      {/* 3D Interactive Spline Background Canvas */}
      <Suspense fallback={null}>
        <motion.div className="wins-spline-wrapper" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.12, // Cohesive premium subtle depth
          willChange: 'transform',
          rotate: useTransform(scrollYProgress, [0, 1], [0, -45]),
          scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.3]),
          y: useTransform(scrollYProgress, [0, 1], [-50, 80]),
        }}>
          <Spline scene={SPLINE_URL} onLoad={onSplineLoad} />
        </motion.div>
      </Suspense>

      {/* Ambient glowing fields */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 5 }}>

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
            <span style={{ color: 'var(--monarch)' }}>04</span> HALL OF FAME
          </span>
          <span style={{
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: 'var(--stone)',
            fontSize: 14
          }}>
            Where effort meets recognition
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
            effort
          </span>
          <br />
          MEETS RECOGNITION.
        </motion.h2>

        {/* SCROLL CAROUSEL FOR ALL EVENTS */}
        </div>

        <div ref={sliderContainerRef} className="missing-content-carousel-wrapper" style={{ height: `${ALL_EVENTS.length * 52}vh`, position: 'relative', margin: isTabletOrMobile ? '48px -20px -32px' : '48px -64px -48px' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            
            {/* Left Chevron Button */}
            <button
              onClick={handlePrev}
              disabled={sliderIndex === 0}
              aria-label="Previous Achievement"
              style={{
                position: 'absolute',
                left: isTabletOrMobile ? '12px' : '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 50,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(10, 10, 18, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: sliderIndex === 0 ? 'rgba(255, 255, 255, 0.2)' : 'var(--ghost)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: sliderIndex === 0 ? 'default' : 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (sliderIndex > 0) {
                  e.currentTarget.style.borderColor = 'var(--gate)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FiChevronLeft size={24} />
            </button>

            {/* Right Chevron Button */}
            <button
              onClick={handleNext}
              disabled={sliderIndex === ALL_EVENTS.length - 1}
              aria-label="Next Achievement"
              style={{
                position: 'absolute',
                right: isTabletOrMobile ? '12px' : '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 50,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(10, 10, 18, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: sliderIndex === ALL_EVENTS.length - 1 ? 'rgba(255, 255, 255, 0.2)' : 'var(--ghost)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: sliderIndex === ALL_EVENTS.length - 1 ? 'default' : 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (sliderIndex < ALL_EVENTS.length - 1) {
                  e.currentTarget.style.borderColor = 'var(--gate)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FiChevronRight size={24} />
            </button>

            {/* Carousel sliding track */}
            <motion.div 
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                height: '100%', 
                alignItems: 'center',
                willChange: 'transform',
                x
              }}
            >
              {ALL_EVENTS.map((event) => (
                <div
                  key={event.id}
                  style={{
                    width: '100vw',
                    padding: isTabletOrMobile ? '0 3vw' : '0 5vw',
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FeaturedRecordCard event={event} />
                </div>
              ))}
            </motion.div>

            {/* Bottom Progress Controls & Counter */}
            <div style={{
              position: 'absolute',
              bottom: '28px',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              zIndex: 40,
              pointerEvents: 'auto'
            }}>
              {/* Badge Counter */}
              <div style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.12em',
                color: 'var(--teal)',
                background: 'rgba(10, 10, 18, 0.85)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '4px 14px',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
              }}>
                RECORD 0{sliderIndex + 1} / 0{ALL_EVENTS.length}
              </div>

              {/* Clickable Progress Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {ALL_EVENTS.map((evt, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToCard(i)}
                    aria-label={`Go to ${evt.title}`}
                    style={{
                      width: i === sliderIndex ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === sliderIndex ? 'var(--gate)' : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: i === sliderIndex ? '0 0 10px rgba(59, 130, 246, 0.8)' : 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      <style>{`
        #wins a:focus-visible, #wins button:focus-visible { outline: 2px solid var(--teal); outline-offset: 4px; }
        #wins button:disabled { opacity: 0.4; cursor: default; }

        #wins {
          background-image: 
            radial-gradient(rgba(245, 158, 11, 0.008) 1px, transparent 0),
            radial-gradient(rgba(124, 58, 237, 0.008) 1px, transparent 0);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }
        .wins-card-deck::-webkit-scrollbar {
          display: none;
        }
        .wins-card-deck {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE/Edge */
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.15; }
        }
        @keyframes scanVertical {
          0% { top: -2%; }
          50% { top: 102%; }
          100% { top: -2%; }
        }
        .pulsing-icon {
          animation: pulseIcon 1.5s ease infinite alternate;
        }
        @keyframes pulseIcon {
          from { opacity: 0.5; filter: drop-shadow(0 0 1px var(--teal)); }
          to { opacity: 1; filter: drop-shadow(0 0 8px var(--teal)); }
        }
        @media (max-width: 1024px) {
          .featured-record-card {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px !important;
          }
        }
        @media (max-width: 768px) {
          #wins { padding: 96px 24px 64px !important; }
        }
        @media (max-width: 480px) {
          .featured-record-card {
            padding: 20px 14px !important;
            gap: 20px !important;
          }
          #wins {
            padding: 72px 14px 48px !important;
          }
        }
      `}</style>
    </section>
  )
}
