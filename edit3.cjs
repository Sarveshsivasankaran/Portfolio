const fs = require('fs');

let content = fs.readFileSync('src/components/Wins.tsx', 'utf8');

// 1. Replace OTHER_EVENTS with ALL_EVENTS
const newEventsData = `const ALL_EVENTS: EventRecord[] = [
  {
    id: 0,
    title: "World Record: Students Use Robots to Plant a Micro Forest in Chennai",
    category: "World Record",
    issuer: "TIFA",
    year: "2020",
    badge: "⭐ S-RANK RECORD ACHIEVEMENT",
    description: "On January 25, 2020, at the Anna University campus in Chennai, a remarkable world record attempt took place — instead of humans planting trees, it was student-built robots that did the work. A total of 326 students built and operated these robots to create what is recognized as the world's first micro forest planted by robots.",
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
];`;

content = content.replace(/const OTHER_EVENTS: EventRecord\[\] = \[[\s\S]*?\];/g, newEventsData);

// Replace mapping OTHER_EVENTS with ALL_EVENTS
content = content.replace(/OTHER_EVENTS/g, 'ALL_EVENTS');

// Remove static featured card and lightbox modal block
const featuredCardStart = content.indexOf('{/* --- A. NEW INTEGRATED FEATURED WORLD RECORD CERTIFICATE --- */}');
const scrollCarouselStart = content.indexOf('{/* NEW 400vh SCROLL CAROUSEL FOR MISSING CONTENT */}');

if (featuredCardStart !== -1 && scrollCarouselStart !== -1) {
  content = content.substring(0, featuredCardStart) + content.substring(scrollCarouselStart);
}

// Remove B. WORLD RECORD HIGH-RES LIGHTBOX MODAL
const lightboxStart = content.indexOf('{/* --- B. WORLD RECORD HIGH-RES LIGHTBOX MODAL --- */}');
const lightboxEnd = content.indexOf('</AnimatePresence>');

if (lightboxStart !== -1 && lightboxEnd !== -1) {
  content = content.substring(0, lightboxStart) + content.substring(lightboxEnd + '</AnimatePresence>'.length);
}

// Update the 400vh to 500vh to accommodate 5 items better
content = content.replace(/height: '400vh'/g, "height: '500vh'");

fs.writeFileSync('src/components/Wins.tsx', content);
