const fs = require('fs');
let content = fs.readFileSync('src/components/FeaturedRecordCard.tsx', 'utf8');

// 1. Add auto-play useEffect
const autoplayCode = `
  useEffect(() => {
    if (!hasMedia || event.media.length <= 1) return;
    if (wrHovered || wrLightbox) return;
    const interval = setInterval(() => {
      setFeaturedMediaIndex(prev => (prev === event.media.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [hasMedia, event.media, wrHovered, wrLightbox]);
`;
content = content.replace(/(const activeMedia = hasMedia \? event\.media\[featuredMediaIndex\] : null\r?\n)/, '$1' + autoplayCode + '\n');

// 2. Fix the Lightbox Portal + AnimatePresence structure
content = content.replace(/<AnimatePresence>\s*\{wrLightbox && hasMedia && activeMedia && createPortal\(/, '{createPortal(\n        <AnimatePresence>\n        {wrLightbox && hasMedia && activeMedia && (');
content = content.replace(/\), document\.body\)}\s*<\/AnimatePresence>/, ')}\n        </AnimatePresence>\n      , document.body)}');

fs.writeFileSync('src/components/FeaturedRecordCard.tsx', content);
