/**
 * Supabase Keep-Alive Cron — server/supabase-keepalive.mjs
 *
 * Prevents the free-tier Supabase project (which auto-pauses after 7 days of
 * inactivity) from pausing by executing a tiny, real Postgres query on a
 * scheduled cadence.
 *
 * Works out of the box with either:
 *   1. SUPABASE_SECRET_KEY (writes a heartbeat timestamp to
 *      portfolio_private.site_stats and reads public.activity_feed_revision), or
 *   2. VITE_SUPABASE_PUBLISHABLE_KEY (reads the single-row public table
 *      public.activity_feed_revision cleanly via PostgREST).
 */

import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

export const EXPECTED_SUPABASE_URL = 'https://fxnconsxvbmpkmsxjpjq.supabase.co'
export const KEEPALIVE_STAT_KEY = 'supabase_keepalive'
const TIMEOUT_MS = 15_000

function respond(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

function isAuthorised(req, env) {
  const secret = env.CRON_SECRET
  if (!secret || secret.length < 32) return null
  const received = Buffer.from(
    typeof req.headers?.authorization === 'string' ? req.headers.authorization : ''
  )
  const expected = Buffer.from(`Bearer ${secret}`)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

function resolveSupabaseConfig(env) {
  const rawUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || EXPECTED_SUPABASE_URL
  const url = String(rawUrl).trim().replace(/\/+$/, '')

  // Guard against misconfigured deployments pointing at an unrelated project.
  if (url !== EXPECTED_SUPABASE_URL) {
    return { error: 'wrong_database_project' }
  }

  const secretKey = typeof env.SUPABASE_SECRET_KEY === 'string' ? env.SUPABASE_SECRET_KEY.trim() : ''
  if (secretKey.startsWith('sb_secret_')) {
    return { url, key: secretKey, mode: 'secret_key' }
  }

  const publishableRaw =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    ''
  const publishableKey = typeof publishableRaw === 'string' ? publishableRaw.trim() : ''
  if (publishableKey.startsWith('sb_publishable_')) {
    return { url, key: publishableKey, mode: 'publishable_key' }
  }

  return { error: 'database_not_configured' }
}

/**
 * Factory for the Vercel Cron GET handler that keeps Supabase active.
 */
export function createSupabaseKeepAliveCron({
  env = process.env,
  client = createClient,
  fetcher = fetch,
  now = () => new Date(),
  log = console.error,
} = {}) {
  return async function handler(req, res) {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return respond(res, 405, { error: 'method_not_allowed' })
    }

    const authResult = isAuthorised(req, env)
    if (authResult === null) {
      return respond(res, 503, { error: 'cron_not_configured' })
    }
    if (!authResult) {
      return respond(res, 401, { error: 'unauthorized' })
    }

    const config = resolveSupabaseConfig(env)
    if (config.error) {
      return respond(res, 503, { error: config.error })
    }

    const db = client(config.url, config.key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, init) =>
          fetcher(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) }),
      },
    })

    const pingDate = now()
    const pingIso = pingDate.toISOString()
    let heartbeatWritten = false

    try {
      if (config.mode === 'secret_key') {
        const { error: writeError } = await db
          .schema('portfolio_private')
          .from('site_stats')
          .upsert(
            {
              key: KEEPALIVE_STAT_KEY,
              value: pingDate.getTime(),
              updated_at: pingIso,
            },
            { onConflict: 'key' }
          )

        if (writeError) {
          log('[supabase-keepalive] heartbeat write failed:', writeError.message)
        } else {
          heartbeatWritten = true
        }
      }

      const { data: revData, error: revError } = await db
        .from('activity_feed_revision')
        .select('id, revision')
        .limit(1)
        .maybeSingle()

      if (revError) {
        log('[supabase-keepalive] revision query failed:', revError.message)
        return respond(res, 500, {
          error: 'keepalive_failed',
          detail: revError.message,
        })
      }

      return respond(res, 200, {
        ok: true,
        status: 'awake',
        mode: config.mode,
        heartbeat_written: heartbeatWritten,
        revision: revData?.revision ?? null,
        pinged_at: pingIso,
      })
    } catch (err) {
      log('[supabase-keepalive] unexpected failure:', err?.message || String(err))
      return respond(res, 500, {
        error: 'keepalive_failed',
        detail: err?.message || 'unexpected_error',
      })
    }
  }
}

