import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

interface LinkedInPost {
  id: number | string
  title: string
  summary: string
  date: string
  url: string
  type: 'post' | 'article' | 'certificate' | 'project'
  badge: string
  image: string
}

const FALLBACK_POSTS: LinkedInPost[] = [
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.RAPIDAPI_LINKEDIN_KEY

  // Return static fallback if API key is missing
  if (!apiKey || apiKey.includes('your_') || apiKey === '') {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600') // Cache fallback for 24h
    return res.status(200).json(FALLBACK_POSTS)
  }

  try {
    const response = await axios.get('https://linkedin-data-api.p.rapidapi.com/get-profile-featured', {
      params: { 
        username: 'sarvesh-sivasankaran'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      }
    })

    const rawItems = response.data?.data || response.data || []
    
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.warn('[Secure API Proxy] Empty response from LinkedIn Featured API, returning fallbacks.')
      return res.status(200).json(FALLBACK_POSTS)
    }

    const mappedPosts: LinkedInPost[] = rawItems.slice(0, 10).map((item: any, idx: number) => {
      const text = item.text || item.commentary || item.description || item.title || ''
      const lines = text.split('\n').filter((l: string) => l.trim() !== '')
      
      const title = item.title || lines[0] || 'LinkedIn Featured'
      const summary = item.description || lines.slice(1).join('\n') || text || 'Read the full transmission on LinkedIn.'
      
      // Handle image extraction (thumbnails, attachments, custom headers)
      let image = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80' // default
      if (item.images && item.images.length > 0) {
        image = item.images[0]
      } else if (item.attachments && item.attachments[0]?.mediaUrl) {
        image = item.attachments[0].mediaUrl
      } else if (item.image) {
        image = item.image
      } else if (item.imageUrl) {
        image = item.imageUrl
      } else if (item.thumbnail) {
        image = item.thumbnail
      } else if (item.thumbnailUrl) {
        image = item.thumbnailUrl
      }

      // Handle variable date schemas
      let date = new Date().toISOString().split('T')[0]
      if (item.time) {
        date = new Date(item.time).toISOString().split('T')[0]
      } else if (item.postDate) {
        date = new Date(item.postDate).toISOString().split('T')[0]
      } else if (item.createdAt) {
        date = new Date(item.createdAt).toISOString().split('T')[0]
      }

      // Resolve URL link (handles postUrl, links, urns)
      let url = 'https://in.linkedin.com/in/sarvesh-sivasankaran'
      if (item.url) {
        url = item.url
      } else if (item.postUrl) {
        url = item.postUrl
      } else if (item.link) {
        url = item.link
      } else if (item.itemUrl) {
        url = item.itemUrl
      } else if (item.urn) {
        url = `https://www.linkedin.com/feed/update/${item.urn}`
      }

      // Keyword type classification for themed highlights
      let type: 'post' | 'article' | 'certificate' | 'project' = 'post'
      const lowerText = text.toLowerCase()
      if (lowerText.includes('hackathon') || lowerText.includes('project') || lowerText.includes('built')) {
        type = 'project'
      } else if (lowerText.includes('certificate') || lowerText.includes('certified') || lowerText.includes('award') || lowerText.includes('record')) {
        type = 'certificate'
      } else if (lowerText.includes('article') || lowerText.includes('blog') || lowerText.includes('writeup') || lowerText.includes('dev log')) {
        type = 'article'
      }

      // Choose a structured S-rank subtitle badge
      const badge = type === 'project' ? 'TACTICAL WIN' : type === 'certificate' ? 'CREDENTIAL' : 'SYSTEM LOG'

      return {
        id: item.id || item.urn || idx,
        title: title.length > 70 ? title.substring(0, 67) + '...' : title,
        summary: summary.length > 200 ? summary.substring(0, 197) + '...' : summary,
        date,
        url,
        type,
        badge,
        image
      }
    })

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600') // Cache serverless for 1 hour
    return res.status(200).json(mappedPosts)

  } catch (error: any) {
    console.error('[Secure API Proxy] LinkedIn Scraper Failed, returning fallback static wins:', error.message)
    res.setHeader('Cache-Control', 's-maxage=300') // Cache error for 5 mins
    return res.status(200).json(FALLBACK_POSTS)
  }
}
