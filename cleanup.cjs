const fs = require('fs');
let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

// 1. Rename sliderProgress to scrollYProgress
content = content.replace(/const \{ scrollYProgress: sliderProgress \} = useScroll/g, 'const { scrollYProgress } = useScroll');
content = content.replace(/useMotionValueEvent\(sliderProgress,\s*"change",\s*\(latest\)/g, 'useMotionValueEvent(scrollYProgress, "change", (latest: number)');

// 2. Fix 'latest' implicitly has an 'any' type in the other useMotionValueEvent
content = content.replace(/useMotionValueEvent\(scrollYProgress,\s*"change",\s*\(latest\)/g, 'useMotionValueEvent(scrollYProgress, "change", (latest: number)');

// 3. Remove deckRef, posts, activeIndex logic
const deckStart = content.indexOf('const deckRef = useRef<HTMLDivElement>(null)');
const slideXStart = content.indexOf('const slideX = -safeActiveIndex * (cardWidth + gap)');
if (deckStart !== -1 && slideXStart !== -1) {
  const slideXEnd = content.indexOf('\n', slideXStart);
  content = content.substring(0, deckStart) + content.substring(slideXEnd + 1);
}

fs.writeFileSync('src/components/Wins.tsx', content);
