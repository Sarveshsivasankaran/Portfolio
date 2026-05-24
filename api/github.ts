import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Read sensitive credentials strictly server-side
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Solo-P-Leveller-Portfolio-Serverless-Proxy',
  }

  if (token && !token.includes('your_')) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const { data } = await axios.get(
      'https://api.github.com/users/Sarveshsivasankaran/repos',
      {
        params: { sort: 'updated', per_page: 100, type: 'public' },
        headers,
      }
    )
    
    // Filter out 'salesp07' and 'letifyy' at server layer for complete safety
    const EXCLUDED_REPOS = ['salesp07', 'letifyy']
    const filtered = data.filter((repo: any) => !EXCLUDED_REPOS.includes(repo.name.toLowerCase()))
    
    // Cache the response in the CDN for 15 minutes to prevent GitHub rate limit spikes
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300')
    return res.status(200).json(filtered)
  } catch (error: any) {
    console.error('[Secure API Proxy] GitHub Fetch Failed:', error.message)
    return res.status(error.response?.status || 500).json({ 
      error: 'Monarch System failed to execute GitHub telemetry.' 
    })
  }
}
