const fs = require('fs');
let content = fs.readFileSync('src/components/FeaturedRecordCard.tsx', 'utf8');

// Add createPortal import
content = content.replace(/import \{ useState, useEffect \} from 'react'/, 
  `import { useState, useEffect } from 'react'\nimport { createPortal } from 'react-dom'`);

// Find the AnimatePresence block
const lightboxStart = content.indexOf('{/* --- WORLD RECORD HIGH-RES LIGHTBOX MODAL --- */}');
if (lightboxStart !== -1) {
  content = content.replace(/\{wrLightbox && hasMedia && activeMedia && \(/g,
    `{wrLightbox && hasMedia && activeMedia && createPortal(`);
    
  // Find the end of the AnimatePresence block
  const endPattern = /<\/\s*AnimatePresence\s*>/;
  content = content.replace(endPattern, `, document.body)}\n      </AnimatePresence>`);
}

fs.writeFileSync('src/components/FeaturedRecordCard.tsx', content);
