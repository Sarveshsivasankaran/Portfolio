const fs = require('fs');
let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

content = content.replace(/position: 'relative',\s*overflow: 'hidden',/, "position: 'relative',");

fs.writeFileSync('src/components/Wins.tsx', content);
