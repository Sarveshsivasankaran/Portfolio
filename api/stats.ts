import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let linkedinFollowers = 5259
    let githubFollowers = 33
    let githubRepos = 22

    // Fetch GitHub stats server-side
    try {
      const ghRes = await axios.get('https://api.github.com/users/Sarveshsivasankaran', {
        headers: {
          'User-Agent': 'Solo-P-Leveller-Portfolio',
          Accept: 'application/vnd.github+json'
        },
        timeout: 4000
      })
      if (ghRes.data) {
        githubFollowers = ghRes.data.followers ?? githubFollowers
        githubRepos = ghRes.data.public_repos ?? githubRepos
      }
    } catch (e) {
      // Silently fall back to cached
    }

    // Attempt to scrape live LinkedIn userInteractionCount from public activity
    try {
      const liRes = await axios.get(
        'https://www.linkedin.com/posts/sarvesh-sivasankaran_acentra-health-build-to-care-hackathon-2026-activity-7514882623916150784-DSRl',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html'
          },
          timeout: 4000
        }
      )
      const match = liRes.data.match(/"userInteractionCount":\s*(\d+)/)
      if (match && match[1]) {
        linkedinFollowers = parseInt(match[1], 10)
      }
    } catch (e) {
      // Fall back to verified baseline
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=300')
    return res.status(200).json({
      linkedinFollowers,
      githubFollowers,
      githubRepos,
      updatedAt: new Date().toISOString()
    })
  } catch (error: any) {
    return res.status(200).json({
      linkedinFollowers: 5259,
      githubFollowers: 33,
      githubRepos: 22,
      fallback: true
    })
  }
}
