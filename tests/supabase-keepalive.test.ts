// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import cronEntry from '../api/cron/supabase-keepalive.mjs'
import {
  createSupabaseKeepAliveCron,
  EXPECTED_SUPABASE_URL,
  KEEPALIVE_STAT_KEY,
} from '../server/supabase-keepalive.mjs'

const VALID_CRON_SECRET = 'k'.repeat(40)
const FIXED_DATE = new Date('2026-11-25T04:00:00.000Z')

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    method: 'GET',
    headers: { authorization: `Bearer ${VALID_CRON_SECRET}` },
    ...overrides,
  } as any
}

function makeRes() {
  const res: any = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: undefined,
  }
  res.status = (code: number) => {
    res.statusCode = code
    return res
  }
  res.json = (payload: unknown) => {
    res.body = payload
    return res
  }
  res.setHeader = (key: string, value: string) => {
    res.headers[key] = value
    return res
  }
  return res
}

function makeMockClient({
  upsertResult = { error: null } as { error: { message: string } | null },
  revResult = { data: { id: 1, revision: 7 }, error: null } as {
    data: { id: number; revision: number } | null
    error: { message: string } | null
  },
  throwOnRev = false,
} = {}) {
  const upsert = vi.fn().mockResolvedValue(upsertResult)
  const maybeSingle = throwOnRev
    ? vi.fn().mockRejectedValue(new Error('network_timeout'))
    : vi.fn().mockResolvedValue(revResult)
  const limit = vi.fn(() => ({ maybeSingle }))
  const select = vi.fn(() => ({ limit }))

  const schemaFrom = vi.fn(() => ({ upsert }))
  const schema = vi.fn(() => ({ from: schemaFrom }))
  const from = vi.fn(() => ({ select }))
  const createClient = vi.fn(() => ({ schema, from }))

  return { createClient, schema, schemaFrom, upsert, from, select, limit, maybeSingle }
}

describe('GET /api/cron/supabase-keepalive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports a valid Vercel cron handler function', () => {
    expect(typeof cronEntry).toBe('function')
  })

  it('rejects non-GET methods with Allow: GET', async () => {
    const mocks = makeMockClient()
    const handler = createSupabaseKeepAliveCron({
      env: { CRON_SECRET: VALID_CRON_SECRET, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' },
      client: mocks.createClient as any,
    })
    const res = makeRes()
    await handler(makeReq({ method: 'POST' }), res)
    expect(res.statusCode).toBe(405)
    expect(res.headers.Allow).toBe('GET')
  })

  it('returns 503 when CRON_SECRET is missing or too short', async () => {
    const mocks = makeMockClient()
    for (const CRON_SECRET of [undefined, '', 'short']) {
      const handler = createSupabaseKeepAliveCron({
        env: { CRON_SECRET, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' },
        client: mocks.createClient as any,
      })
      const res = makeRes()
      await handler(makeReq(), res)
      expect(res.statusCode).toBe(503)
      expect(res.body.error).toBe('cron_not_configured')
    }
  })

  it('rejects missing or invalid Bearer tokens with 401', async () => {
    const mocks = makeMockClient()
    const handler = createSupabaseKeepAliveCron({
      env: { CRON_SECRET: VALID_CRON_SECRET, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' },
      client: mocks.createClient as any,
    })

    for (const headers of [{}, { authorization: 'Bearer wrong' }]) {
      const res = makeRes()
      await handler(makeReq({ headers }), res)
      expect(res.statusCode).toBe(401)
      expect(mocks.createClient).not.toHaveBeenCalled()
    }
  })

  it('rejects mismatched Supabase project URLs and missing credentials', async () => {
    const mocks = makeMockClient()

    const wrongProjectHandler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        SUPABASE_URL: 'https://wrong-project.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
      },
      client: mocks.createClient as any,
    })
    const wrongRes = makeRes()
    await wrongProjectHandler(makeReq(), wrongRes)
    expect(wrongRes.statusCode).toBe(503)
    expect(wrongRes.body.error).toBe('wrong_database_project')

    const missingKeyHandler = createSupabaseKeepAliveCron({
      env: { CRON_SECRET: VALID_CRON_SECRET, SUPABASE_URL: EXPECTED_SUPABASE_URL },
      client: mocks.createClient as any,
    })
    const missingRes = makeRes()
    await missingKeyHandler(makeReq(), missingRes)
    expect(missingRes.statusCode).toBe(503)
    expect(missingRes.body.error).toBe('database_not_configured')
  })

  it('pings Postgres using publishable key when secret key is absent', async () => {
    const mocks = makeMockClient()
    const handler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        VITE_SUPABASE_URL: EXPECTED_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public_key',
      },
      client: mocks.createClient as any,
      now: () => FIXED_DATE,
    })

    const res = makeRes()
    await handler(makeReq(), res)

    expect(res.statusCode).toBe(200)
    expect(res.headers['Cache-Control']).toBe('no-store')
    expect(res.body).toEqual({
      ok: true,
      status: 'awake',
      mode: 'publishable_key',
      heartbeat_written: false,
      revision: 7,
      pinged_at: FIXED_DATE.toISOString(),
    })
    expect(mocks.createClient).toHaveBeenCalledWith(
      EXPECTED_SUPABASE_URL,
      'sb_publishable_public_key',
      expect.any(Object)
    )
    expect(mocks.schema).not.toHaveBeenCalled()
    expect(mocks.from).toHaveBeenCalledWith('activity_feed_revision')
    expect(mocks.select).toHaveBeenCalledWith('id, revision')
    expect(mocks.limit).toHaveBeenCalledWith(1)
  })

  it('writes heartbeat to site_stats and checks revision when secret key is configured', async () => {
    const mocks = makeMockClient()
    const handler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        SUPABASE_URL: EXPECTED_SUPABASE_URL,
        SUPABASE_SECRET_KEY: 'sb_secret_private_key',
      },
      client: mocks.createClient as any,
      now: () => FIXED_DATE,
    })

    const res = makeRes()
    await handler(makeReq(), res)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      ok: true,
      status: 'awake',
      mode: 'secret_key',
      heartbeat_written: true,
      revision: 7,
      pinged_at: FIXED_DATE.toISOString(),
    })
    expect(mocks.schema).toHaveBeenCalledWith('portfolio_private')
    expect(mocks.schemaFrom).toHaveBeenCalledWith('site_stats')
    expect(mocks.upsert).toHaveBeenCalledWith(
      {
        key: KEEPALIVE_STAT_KEY,
        value: FIXED_DATE.getTime(),
        updated_at: FIXED_DATE.toISOString(),
      },
      { onConflict: 'key' }
    )
    expect(mocks.from).toHaveBeenCalledWith('activity_feed_revision')
  })

  it('stays awake if site_stats write fails while public query succeeds', async () => {
    const mocks = makeMockClient({ upsertResult: { error: { message: 'missing table' } } })
    const log = vi.fn()
    const handler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        SUPABASE_SECRET_KEY: 'sb_secret_private_key',
      },
      client: mocks.createClient as any,
      now: () => FIXED_DATE,
      log,
    })

    const res = makeRes()
    await handler(makeReq(), res)

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.heartbeat_written).toBe(false)
    expect(log).toHaveBeenCalled()
  })

  it('returns 500 when the Postgres keep-alive query fails or throws', async () => {
    const errMocks = makeMockClient({
      revResult: { data: null, error: { message: 'project paused' } },
    })
    const log = vi.fn()
    let handler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public_key',
      },
      client: errMocks.createClient as any,
      log,
    })

    const errRes = makeRes()
    await handler(makeReq(), errRes)
    expect(errRes.statusCode).toBe(500)
    expect(errRes.body).toEqual({ error: 'keepalive_failed', detail: 'project paused' })

    const throwMocks = makeMockClient({ throwOnRev: true })
    handler = createSupabaseKeepAliveCron({
      env: {
        CRON_SECRET: VALID_CRON_SECRET,
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public_key',
      },
      client: throwMocks.createClient as any,
      log,
    })

    const throwRes = makeRes()
    await handler(makeReq(), throwRes)
    expect(throwRes.statusCode).toBe(500)
    expect(throwRes.body).toEqual({ error: 'keepalive_failed', detail: 'network_timeout' })
  })

  it('registers the keep-alive cron in vercel.json on a Vercel Hobby-compatible schedule', () => {
    const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'))
    const entry = vercelConfig.crons?.find((c: any) => c.path === '/api/cron/supabase-keepalive')
    expect(entry).toBeDefined()
    // Ensure minute and hour are fixed integers (daily or less frequent for Vercel Hobby plan)
    const [minute, hour] = String(entry.schedule).split(/\s+/)
    expect(/^\d+$/.test(minute)).toBe(true)
    expect(/^\d+$/.test(hour)).toBe(true)
    expect(vercelConfig.functions?.['api/cron/supabase-keepalive.mjs']).toBeDefined()
  })

  it('verifies keep-alive queries succeed against real Postgres migrations (anon & service_role)', async () => {
    const db = new PGlite()
    try {
      await db.exec(`
        create role anon; create role authenticated; create role service_role bypassrls;
        create schema auth; create schema storage;
        create table auth.users (id uuid primary key);
        create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
        grant usage on schema public, auth, storage to anon, authenticated, service_role;
        create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
        create table storage.objects (id uuid primary key, bucket_id text);
      `)
      await db.exec(readFileSync('supabase/migrations/202609130001_linkedin_activity_feed.sql', 'utf8'))
      await db.exec(readFileSync('supabase/migrations/20260913184039_deployed_linkedin_sync.sql', 'utf8'))
      await db.exec(readFileSync('supabase/migrations/20261013001_site_stats.sql', 'utf8'))

      await db.exec('set role anon')
      const anonRev = await db.query('select id, revision from public.activity_feed_revision limit 1')
      expect(anonRev.rows).toHaveLength(1)
      await db.exec('reset role')

      await db.exec('set role service_role')
      await db.query(
        `insert into portfolio_private.site_stats (key, value, updated_at)
         values ($1, $2, $3)
         on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
        [KEEPALIVE_STAT_KEY, FIXED_DATE.getTime(), FIXED_DATE.toISOString()]
      )
      const stat = await db.query(
        'select key, value from portfolio_private.site_stats where key = $1',
        [KEEPALIVE_STAT_KEY]
      )
      expect(stat.rows[0].key).toBe(KEEPALIVE_STAT_KEY)
      expect(Number(stat.rows[0].value)).toBe(FIXED_DATE.getTime())
      await db.exec('reset role')
    } finally {
      await db.close()
    }
  })
})

