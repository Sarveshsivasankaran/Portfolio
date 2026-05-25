export interface LinkedInPost {
  id: number
  title: string
  summary: string
  date: string
  url: string
  type: 'post' | 'article' | 'certificate' | 'project'
  badge: string
  image: string
}

export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: 1,
    title: "Won 1st Place at SIH '25 Internal Hackathon!",
    summary: "Super excited to announce that our team won 1st place in the Smart India Hackathon (SIH) 2025 Internal Hackathon! Built 'Jalvigyaan', an integrated platform for crowdsourced ocean hazard reporting and real-time social media analytics.",
    date: "2025-08-20",
    url: "https://www.linkedin.com/posts/sarvesh-sivasankaran_hackathon-sih2025-softwareedition-activity-7375878224737677312-vDqG",
    type: "project",
    badge: "Hackathon Winner",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Achieved TIFA World Record for Robotic Tree Planting!",
    summary: "Honored to be part of the historical TIFA World Record event! Designed and deployed autonomous robotic systems to successfully plant 300 saplings, showcasing the power of automation and robotics in environmental conservation.",
    date: "2025-06-10",
    url: "https://in.linkedin.com/in/sarvesh-sivasankaran",
    type: "project",
    badge: "World Record",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Secured 1st Place at CRYPTRIX '25 Cybersecurity Symposium!",
    summary: "Victorious in St. Joseph's College CRYPTRIX '25 Cybersecurity Symposium! Competed in hands-on CTF (Capture The Flag) challenges covering web exploitation, cryptography, and network forensics. Proud of the S-Rank performance!",
    date: "2025-02-15",
    url: "https://www.linkedin.com/posts/sarvesh-sivasankaran-4b075b318_rootatlocalhost-ctf-ctftop35-activity-7275152533763858432-WZ3R",
    type: "certificate",
    badge: "Symposium Winner",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Co-led IoT activities & mentoring at Intellexa REC",
    summary: "Thrilled to take on the role of IoT Co-Lead at Intellexa REC! Supporting and mentoring junior developers in building hands-on embedded systems, IoT sensors, and automation architectures. Let's build the future of connected devices!",
    date: "2025-09-01",
    url: "https://www.linkedin.com/posts/sarvesh-sivasankaran-4b075b318_iot-internetofthings-technology-activity-7256713860835901440-hnMh",
    type: "post",
    badge: "Leadership",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "Appointed as Campus Lead for Open Source Connect!",
    summary: "Proudly representing Rajalakshmi Engineering College in the global OSC network! Building developer communities, driving awareness for open-source contributions, and organizing dynamic technical hackathons and code jams.",
    date: "2025-12-01",
    url: "https://www.linkedin.com/posts/sarvesh-sivasankaran_codesapiens-february-meetup-2k26-activity-7431704641278697472-eCDa",
    type: "post",
    badge: "Community",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    title: "1st Place Winner at Technovanza '25!",
    summary: "Excited to share that we won 1st Place at the JCE College Symposium Technovanza '25! Pitched and demonstrated our 'Water Quality Risk Prediction' IoT system that leverages machine learning to predict risks in real-time.",
    date: "2025-03-01",
    url: "https://in.linkedin.com/in/sarvesh-sivasankaran",
    type: "certificate",
    badge: "Symposium Winner",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80"
  }
]

