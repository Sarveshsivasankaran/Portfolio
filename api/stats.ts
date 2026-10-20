import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fxnconsxvbmpkmsxjpjq.supabase.co'
const FALLBACK_LINKEDIN_FOLLOWERS = 5329

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let linkedinFollowers = FALLBACK_LINKEDIN_FOLLOWERS
    let githubFollowers = 33
    let githubRepos = 22

    // ── 1. Read LinkedIn followers from Supabase (written by the cron job) ───
    // The /api/cron/followers cron scrapes the public LinkedIn profile every 6
    // hours and stores the count in portfolio_private.site_stats.
    try {
      if (process.env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_')) {
        const db = createClient(SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
        const { data } = await db
          .schema('portfolio_private')
          .from('site_stats')
          .select('value')
          .eq('key', 'linkedin_followers')
          .maybeSingle()

        if (data && typeof data.value === 'number' && data.value > 0) {
          linkedinFollowers = data.value
        }
      }
    } catch {
      // Fall back to baseline — cron may not have run yet on fresh deployments
    }

    // ── 2. Fetch GitHub stats server-side (CORS-friendly GitHub API) ─────────
    try {
      const ghRes = await axios.get('https://api.github.com/users/Sarveshsivasankaran', {
        headers: {
          'User-Agent': 'Solo-P-Leveller-Portfolio',
          Accept: 'application/vnd.github+json',
        },
        timeout: 4000,
      })
      if (ghRes.data) {
        githubFollowers = ghRes.data.followers ?? githubFollowers
        githubRepos = ghRes.data.public_repos ?? githubRepos
      }
    } catch {
      // Silently fall back to cached
    }

    // Short cache: the local linkedin-follower-mcp watcher pushes fresh counts
    // to /api/linkedin/sync within ~15 minutes of a change; keep the CDN window
    // shorter than that so visitors see updates quickly.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    return res.status(200).json({
      linkedinFollowers,
      githubFollowers,
      githubRepos,
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    return res.status(200).json({
      linkedinFollowers: FALLBACK_LINKEDIN_FOLLOWERS,
      githubFollowers: 33,
      githubRepos: 22,
      fallback: true,
    })
  }
}
