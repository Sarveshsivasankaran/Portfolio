/**
 * LinkedIn Followers Cron — /api/cron/followers.mjs
 *
 * Runs on a schedule (see vercel.json). Fetches the public LinkedIn profile
 * page for sarvesh-sivasankaran, extracts the follower count from JSON-LD
 * structured data embedded in the HTML, then stores it in Supabase so that
 * /api/stats can serve a fresh, accurate number to the frontend.
 *
 * LinkedIn embeds a <script type="application/ld+json"> block on every public
 * profile that contains an "interactionStatistic" entry with
 * "interactionType": "https://schema.org/FollowAction" and a
 * "userInteractionCount" for the PROFILE (not a post). This is different from
 * the same field on a post page and is the correct source for follower counts.
 *
 * Security: the route is protected by a Bearer token (CRON_SECRET) that Vercel
 * injects automatically into the Authorization header when it calls cron paths.
 */

import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/sarvesh-sivasankaran/'
const SUPABASE_URL = 'https://fxnconsxvbmpkmsxjpjq.supabase.co'
const TIMEOUT_MS = 15_000

/** Verify the Vercel cron secret from the Authorization header. */
function isAuthorised(req, env) {
  const secret = env.CRON_SECRET
  if (!secret || secret.length < 32) return false
  const received = Buffer.from(
    typeof req.headers.authorization === 'string' ? req.headers.authorization : ''
  )
  const expected = Buffer.from(`Bearer ${secret}`)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

/**
 * Scrape the LinkedIn public profile page and extract the follower count from
 * the embedded JSON-LD structured data block.
 *
 * LinkedIn places a block like:
 *   <script type="application/ld+json">
 *     { "@type": "Person", "interactionStatistic": [
 *       { "interactionType": "https://schema.org/FollowAction",
 *         "userInteractionCount": 5342 }
 *     ] }
 *   </script>
 *
 * We also try a secondary regex pattern as a fallback in case the JSON-LD
 * structure differs across regions or profile types.
 *
 * @returns {Promise<number|null>} Follower count, or null if not found.
 */
async function scrapeLinkedInFollowers() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(LINKEDIN_PROFILE_URL, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // Use a realistic browser UA — LinkedIn blocks obvious bot agents.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    })

    if (!res.ok) return null

    const html = await res.text()

    // ── Strategy 1: JSON-LD structured data (most reliable) ──────────────────
    // Extract all <script type="application/ld+json"> blocks
    const ldJsonBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    for (const [, raw] of ldJsonBlocks) {
      try {
        const data = JSON.parse(raw.trim())
        const entries = Array.isArray(data)
          ? data
          : data['@graph']
            ? data['@graph']
            : [data]

        for (const entry of entries) {
          const stats = Array.isArray(entry.interactionStatistic)
            ? entry.interactionStatistic
            : entry.interactionStatistic
              ? [entry.interactionStatistic]
              : []

          for (const stat of stats) {
            if (
              typeof stat.userInteractionCount === 'number' &&
              (stat.interactionType === 'https://schema.org/FollowAction' ||
                stat['@type'] === 'InteractionCounter')
            ) {
              return stat.userInteractionCount
            }
          }
        }
      } catch {
        // malformed JSON-LD block — try next
      }
    }

    // ── Strategy 2: meta tag og:description often contains "X followers" ──────
    const metaDesc = html.match(/<meta[^>]+(?:name|property)=["'](?:og:description|description)["'][^>]+content=["']([^"']+)["']/i)
    if (metaDesc) {
      const m = metaDesc[1].match(/([\d,]+)\s+followers?/i)
      if (m) return parseInt(m[1].replace(/,/g, ''), 10)
    }

    // ── Strategy 3: plain-text pattern anywhere in the HTML ───────────────────
    // LinkedIn sometimes embeds "followersCount\":5259" in a hydration payload
    const hydration = html.match(/"followersCount"\s*:\s*(\d+)/)
    if (hydration) return parseInt(hydration[1], 10)

    const altPattern = html.match(/([\d,]+)\s+followers?\s*(?:on\s+LinkedIn)?/i)
    if (altPattern) return parseInt(altPattern[1].replace(/,/g, ''), 10)

    return null
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(req, res) {
  const env = process.env

  // Only GET is supported (Vercel cron always uses GET)
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  // Verify cron secret
  if (!isAuthorised(req, env)) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  // Validate Supabase config
  if (!env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_')) {
    return res.status(503).json({ error: 'database_not_configured' })
  }

  const db = createClient(SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Scrape LinkedIn
  let followers = null
  try {
    followers = await scrapeLinkedInFollowers()
  } catch (err) {
    // Network failure — still respond OK so Vercel doesn't retry aggressively
    console.error('[followers-cron] scrape error:', err?.message)
  }

  if (typeof followers !== 'number' || followers <= 0) {
    return res.status(200).json({
      status: 'scrape_failed',
      message: 'Could not extract follower count from LinkedIn. Cached value unchanged.',
    })
  }

  // Upsert into Supabase
  const { error } = await db
    .from('site_stats')
    .upsert(
      { key: 'linkedin_followers', value: followers, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
    .schema('portfolio_private')

  if (error) {
    console.error('[followers-cron] DB write error:', error.message)
    return res.status(500).json({ error: 'db_write_failed', detail: error.message })
  }

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    status: 'success',
    linkedin_followers: followers,
    updated_at: new Date().toISOString(),
  })
}
