const fs = require('fs');
let content = fs.readFileSync('src/components/FeaturedRecordCard.tsx', 'utf8');

// 1. Remove the bad portal wrapping from the first AnimatePresence
content = content.replace(/\)\}\s*, document\.body\)\}\s*<\/AnimatePresence>/g, ')}\n              </AnimatePresence>');

// 2. Add the createPortal import if missing
if (!content.includes('createPortal')) {
    content = content.replace(/import \{ useState, useEffect \} from 'react'/, `import { useState, useEffect } from 'react'\nimport { createPortal } from 'react-dom'`);
} else {
    // I already added the import in the first try, so it should be there, but let's check
}

// 3. Fix the lightbox AnimatePresence wrapping
// Currently, it might be: {wrLightbox && hasMedia && activeMedia && createPortal(
// Wait, my previous script ALREADY replaced it with createPortal(!
// Let's check what's actually there.
let lastIndex = content.lastIndexOf('<AnimatePresence>');
let lastBlock = content.substring(lastIndex);
if (lastBlock.includes('createPortal(')) {
    // If it has createPortal, but NO document.body, append it to the end.
    if (!lastBlock.includes('document.body')) {
        let fixedBlock = lastBlock.replace(/\)\}\s*<\/AnimatePresence>/, '), document.body)}\n        </AnimatePresence>');
        content = content.substring(0, lastIndex) + fixedBlock;
    }
} else {
    // It hasn't been wrapped yet, wrap it
    let newBlock = lastBlock.replace(/\{wrLightbox && hasMedia && activeMedia && \(/, '{wrLightbox && hasMedia && activeMedia && createPortal(');
    newBlock = newBlock.replace(/\)\}\s*<\/AnimatePresence>/, '), document.body)}\n        </AnimatePresence>');
    content = content.substring(0, lastIndex) + newBlock;
}

fs.writeFileSync('src/components/FeaturedRecordCard.tsx', content);
