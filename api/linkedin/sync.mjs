/**
 * LinkedIn Follower Push — POST /api/linkedin/sync
 *
 * Receive endpoint for the local linkedin-follower-mcp watcher running on the
 * owner's machine. The watcher polls the LinkedIn profile every ~15 minutes
 * with a real logged-in browser session (far more reliable than unauthenticated
 * scraping) and POSTs the parsed follower/connection counts here whenever they
 * change. We upsert them into portfolio_private.site_stats so /api/stats serves
 * fresh numbers without waiting for the daily public-scrape cron
 * (/api/cron/followers) and without a redeploy.
 *
 * Auth: Authorization: Bearer <LINKEDIN_SYNC_TOKEN> (project env var, >= 32
 * chars, same length-check convention as CRON_SECRET).
 */

import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fxnconsxvbmpkmsxjpjq.supabase.co'
const MAX_COUNT = 10_000_000

/** Verify the shared bearer token from the Authorization header. */
function isAuthorised(req) {
  const secret = process.env.LINKEDIN_SYNC_TOKEN
  if (!secret || secret.length < 32) return false
  const received = Buffer.from(
    typeof req.headers.authorization === 'string' ? req.headers.authorization : ''
  )
  const expected = Buffer.from(`Bearer ${secret}`)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  if (!isAuthorised(req)) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (!process.env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_')) {
    return res.status(503).json({ error: 'database_not_configured' })
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}
  const followers = Number(body.followers)
  const connections =
    body.connections === undefined || body.connections === null
      ? null
      : Number(body.connections)

  if (!Number.isInteger(followers) || followers <= 0 || followers > MAX_COUNT) {
    return res.status(400).json({ error: 'invalid_followers' })
  }
  if (
    connections !== null &&
    (!Number.isInteger(connections) || connections < 0 || connections > MAX_COUNT)
  ) {
    return res.status(400).json({ error: 'invalid_connections' })
  }

  const db = createClient(SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const now = new Date().toISOString()
  const rows = [{ key: 'linkedin_followers', value: followers, updated_at: now }]
  if (connections !== null) {
    rows.push({ key: 'linkedin_connections', value: connections, updated_at: now })
  }

  const { error } = await db
    .schema('portfolio_private')
    .from('site_stats')
    .upsert(rows, { onConflict: 'key' })

  if (error) {
    console.error('[linkedin-sync] DB write error:', error.message)
    return res.status(500).json({ error: 'db_write_failed', detail: error.message })
  }

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    ok: true,
    linkedin_followers: followers,
    linkedin_connections: connections,
    updated_at: now,
  })
}
