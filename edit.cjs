const fs = require('fs');
let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

// 1. Add FeaturedRecordCard import and OTHER_EVENTS
content = content.replace(/import ActivityImages from '\.\/ActivityImages'/, 
`import FeaturedRecordCard, { type EventRecord } from './FeaturedRecordCard';

const OTHER_EVENTS: EventRecord[] = [
  {
    id: 1,
    title: "SIH 2025 - Software Edition Internal Hackathon Winner",
    category: "Disaster Management Statement",
    issuer: "SIH 2025",
    year: "2025",
    badge: "⭐ HACKATHON WINNER",
    description: "[ CONTENT PENDING ] Placeholder for SIH 2025 Disaster Management project details.",
    link: "#",
    linkText: "VIEW PROJECT",
    media: []
  },
  {
    id: 2,
    title: "ICC World Cup Project",
    category: "National Level",
    issuer: "SP Robotics Works",
    year: "2019",
    badge: "⭐ NATIONAL LEVEL PROJECT",
    description: "[ CONTENT PENDING ] Placeholder for ICC World Cup Project details.",
    link: "#",
    linkText: "VIEW PROJECT",
    media: []
  },
  {
    id: 3,
    title: "National Level Technical Symposium Technovanza 2025-'26",
    category: "National Level",
    issuer: "Jerusalem College of Engineering",
    year: "2025",
    badge: "⭐ SYMPOSIUM WINNER",
    description: "[ CONTENT PENDING ] Placeholder for Technovanza Symposium details.",
    link: "#",
    linkText: "VIEW CERTIFICATE",
    media: []
  },
  {
    id: 4,
    title: "root@localhost CTF - College level CTF",
    category: "Runner (Top 35)",
    issuer: "Rajalakshmi Engineering College",
    year: "2024",
    badge: "⭐ CTF RUNNER UP",
    description: "[ CONTENT PENDING ] Placeholder for CTF event details.",
    link: "#",
    linkText: "VIEW CERTIFICATE",
    media: []
  }
];`);

// 2. Add slider ref and scroll tracking
content = content.replace(/const containerRef = useRef<HTMLElement>\(null\)/,
`const containerRef = useRef<HTMLElement>(null)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: sliderProgress } = useScroll({
    target: sliderContainerRef,
    offset: ["start start", "end end"]
  })
  const [sliderIndex, setSliderIndex] = useState(0)

  useMotionValueEvent(sliderProgress, "change", (latest) => {
    const idx = Math.min(OTHER_EVENTS.length - 1, Math.floor(latest * OTHER_EVENTS.length))
    if (idx !== sliderIndex) {
      setSliderIndex(idx)
    }
  })`);

// 3. Remove overflow hidden on section
content = content.replace(/overflow: 'hidden',\s*}}>\s*{\/\* HTML5 Cybernetic Grid Canvas \*\/}/,
`}}>
      {/* HTML5 Cybernetic Grid Canvas */}`);

// 4. Replace the WinsGallery block
const galleryStart = content.indexOf('{/* Viewport sliding window */}');
const lightboxStart = content.indexOf('{/* --- B. WORLD RECORD HIGH-RES LIGHTBOX MODAL --- */}');

if (galleryStart !== -1 && lightboxStart !== -1) {
  const replacement = `{/* NEW 400vh SCROLL CAROUSEL FOR MISSING CONTENT */}
        <div ref={sliderContainerRef} style={{ height: '400vh', position: 'relative', marginTop: '64px', margin: '64px -64px 0', '@media (max-width: 1024px)': { margin: '64px -20px 0' } } as any}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <motion.div 
              style={{ display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center' }}
              animate={{ x: \`-\${sliderIndex * 100}vw\` }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {OTHER_EVENTS.map((event, i) => (
                <motion.div
                  key={event.id}
                  animate={{ opacity: i === sliderIndex ? 1 : 0.2, scale: i === sliderIndex ? 1 : 0.95 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100vw', padding: '0 5vw', flexShrink: 0, display: 'flex', justifyContent: 'center' }}
                >
                  <FeaturedRecordCard event={event} />
                </motion.div>
              ))}
            </motion.div>

            {/* Progress Dots */}
            <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 40 }}>
              {OTHER_EVENTS.map((_, i) => (
                <div key={i} style={{
                  width: i === sliderIndex ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === sliderIndex ? 'var(--gate)' : 'var(--border)',
                  boxShadow: i === sliderIndex ? '0 0 10px rgba(59, 130, 246, 0.6)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              ))}
            </div>
          </div>
        </div>

        `;
  content = content.substring(0, galleryStart) + replacement + content.substring(lightboxStart);
}

fs.writeFileSync('src/components/Wins.tsx', content);
