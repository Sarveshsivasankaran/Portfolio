const fs = require('fs');
let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

content = content.replace(
  /<div ref=\{sliderContainerRef\} className="missing-content-carousel-wrapper" style=\{\{ height: '500vh', position: 'relative', marginTop: '64px', margin: '64px -64px 0' \}\}>/g,
  '</div>\n\n        <div ref={sliderContainerRef} className="missing-content-carousel-wrapper" style={{ height: \'500vh\', position: \'relative\', margin: isTabletOrMobile ? \'64px -20px -48px\' : \'64px -64px -64px\' }}>'
);

fs.writeFileSync('src/components/Wins.tsx', content);
