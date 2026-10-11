const fs = require('fs');
let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

content = content.replace(
  /\{\/\* NEW 400vh SCROLL CAROUSEL FOR MISSING CONTENT \*\/\}/,
  `</div>\n\n        {/* NEW 400vh SCROLL CAROUSEL FOR MISSING CONTENT */}`
);

content = content.replace(
  /'@media \(max-width: 1024px\)': \{ margin: '64px -20px 0' \} \} as any/,
  `} className="missing-content-carousel-wrapper"`
);

fs.writeFileSync('src/components/Wins.tsx', content);
