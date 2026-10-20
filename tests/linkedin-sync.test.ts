import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const upsert = vi.fn()
  const from = vi.fn(() => ({ upsert }))
  const schema = vi.fn(() => ({ from }))
  const createClient = vi.fn(() => ({ schema }))
  return { upsert, from, schema, createClient }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: mocks.createClient,
}))

import handler from '../api/linkedin/sync.mjs'

const VALID_TOKEN = 'a'.repeat(64)

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    headers: { authorization: `Bearer ${VALID_TOKEN}` },
    body: { followers: 5329, connections: 500 },
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

describe('POST /api/linkedin/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.upsert.mockResolvedValue({ error: null })
    process.env.LINKEDIN_SYNC_TOKEN = VALID_TOKEN
    process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_key'
  })

  it('rejects non-POST methods', async () => {
    const res = makeRes()
    await handler(makeReq({ method: 'GET' }), res)
    expect(res.statusCode).toBe(405)
  })

  it('rejects missing or wrong bearer token', async () => {
    const res = makeRes()
    await handler(makeReq({ headers: { authorization: 'Bearer wrong' } }), res)
    expect(res.statusCode).toBe(401)
    expect(mocks.upsert).not.toHaveBeenCalled()
  })

  it('rejects when the sync token is not configured', async () => {
    delete process.env.LINKEDIN_SYNC_TOKEN
    const res = makeRes()
    await handler(makeReq(), res)
    expect(res.statusCode).toBe(401)
  })

  it('rejects invalid followers values', async () => {
    for (const followers of [0, -5, 3.5, 'abc', Number.NaN]) {
      const res = makeRes()
      await handler(makeReq({ body: { followers } }), res)
      expect(res.statusCode).toBe(400)
    }
    expect(mocks.upsert).not.toHaveBeenCalled()
  })

  it('rejects invalid connections values', async () => {
    const res = makeRes()
    await handler(makeReq({ body: { followers: 100, connections: -1 } }), res)
    expect(res.statusCode).toBe(400)
  })

  it('upserts followers and connections into site_stats', async () => {
    const res = makeRes()
    await handler(makeReq(), res)
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.linkedin_followers).toBe(5329)
    expect(mocks.schema).toHaveBeenCalledWith('portfolio_private')
    expect(mocks.from).toHaveBeenCalledWith('site_stats')
    const [rows, options] = mocks.upsert.mock.calls[0]
    expect(rows).toEqual([
      expect.objectContaining({ key: 'linkedin_followers', value: 5329 }),
      expect.objectContaining({ key: 'linkedin_connections', value: 500 }),
    ])
    expect(options).toEqual({ onConflict: 'key' })
  })

  it('omits the connections row when not provided', async () => {
    const res = makeRes()
    await handler(makeReq({ body: { followers: 6000 } }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body.linkedin_connections).toBeNull()
    const [rows] = mocks.upsert.mock.calls[0]
    expect(rows).toHaveLength(1)
    expect(rows[0].key).toBe('linkedin_followers')
  })

  it('returns 500 when the database write fails', async () => {
    mocks.upsert.mockResolvedValue({ error: { message: 'boom' } })
    const res = makeRes()
    await handler(makeReq(), res)
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('db_write_failed')
  })
})
