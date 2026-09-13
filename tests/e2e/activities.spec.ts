import { test, expect, type Page, type WebSocketRoute } from '@playwright/test'

function row(index: number, imageCount = index) {
  return { id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`, title: `Activity ${index}`, description: 'A very long description with useful details. '.repeat(50),
    linkedin_url: `https://www.linkedin.com/posts/activity-${index}`, images: Array.from({ length: imageCount }, (_, i) => `https://images.test/${index}-${i}.webp`),
    published_at: '2026-09-13T10:00:00Z', category: 'Hackathon', featured: index === 0, visible: true, sort_order: null, created_at: '2026-09-13T10:00:00Z', updated_at: '2026-09-13T10:00:00Z' }
}
async function setup(page: Page) {
  let rows = Array.from({ length: 6 }, (_, i) => row(i))
  let requests = 0
  let socket: WebSocketRoute | undefined
  let topic = ''
  let joinRef: string | null = null
  const encode = (message: { topic: string; event: string; ref?: string; payload: unknown }) => JSON.stringify([joinRef, message.ref ?? null, message.topic, message.event, message.payload])
  await page.route('**/node_modules/.vite/deps/@splinetool_react-spline.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'export default function Spline(){return null}' }))
  await page.route('https://images.test/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#374151"/><circle cx="200" cy="150" r="80" fill="#06b6d4"/></svg>' }))
  await page.route('https://portfolio-test.supabase.co/rest/v1/linkedin_posts*', route => {
    const url = new URL(route.request().url())
    expect(url.searchParams.get('visible')).toBe('eq.true')
    expect(url.searchParams.get('limit')).toBe('30')
    expect(url.searchParams.get('order')).toContain('featured.desc,published_at.desc')
    requests++
    return route.fulfill({ json: rows })
  })
  await page.routeWebSocket('wss://portfolio-test.supabase.co/**', ws => {
    socket = ws
    ws.onMessage(raw => {
      const [incomingJoinRef, ref, incomingTopic, event, payload] = JSON.parse(String(raw))
      const message = { ref, topic: incomingTopic, event, payload }
      joinRef = incomingJoinRef
      if (message.event === 'phx_join') {
        topic = message.topic
        ws.send(encode({ topic, event: 'phx_reply', ref: message.ref, payload: { status: 'ok', response: { postgres_changes: message.payload.config.postgres_changes.map((filter: object, i: number) => ({ ...filter, id: i + 1 })) } } }))
      } else if (message.event === 'heartbeat' || message.event === 'phx_leave') {
        ws.send(encode({ topic: message.topic, event: 'phx_reply', ref: message.ref, payload: { status: 'ok', response: {} } }))
      }
    })
  })
  return {
    setRows: (next: typeof rows) => { rows = next },
    requests: () => requests,
    notify: (type: 'INSERT' | 'UPDATE' | 'DELETE', revision = false) => {
      if (!socket || !topic) throw new Error('Realtime did not subscribe')
      socket.send(encode({ topic, event: 'postgres_changes', payload: { ids: [revision ? 2 : 1], data: { schema: 'public', table: revision ? 'activity_feed_revision' : 'linkedin_posts', type, commit_timestamp: new Date().toISOString(), columns: [], record: {}, old_record: {}, errors: null } } }))
    },
  }
}

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`existing carousel remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await setup(page)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/tests/e2e/harness.html')
    await expect(page.getByRole('heading', { name: 'Wins & Activity' })).toHaveCount(1)
    await expect(page.locator('.activity-card')).toHaveCount(6)
    await page.locator('.wins-card-deck').scrollIntoViewIfNeeded()
    const card = page.locator('.activity-card').first()
    await expect(card.getByRole('link', { name: 'View on LinkedIn' })).toBeVisible()
    const geometry = await card.evaluate(element => {
      const cardRect = element.getBoundingClientRect()
      const linkRect = element.querySelector('a')!.getBoundingClientRect()
      return { height: cardRect.height, fits: linkRect.bottom <= cardRect.bottom && linkRect.right <= cardRect.right, overflow: document.documentElement.scrollWidth > innerWidth }
    })
    expect(geometry.height).toBeCloseTo(450, 0)
    expect(geometry.fits).toBe(true)
    expect(geometry.overflow).toBe(false)
    await expect(card.getByRole('link')).toHaveAttribute('target', '_blank')
    await expect(card.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
    await page.getByRole('button', { name: 'Next activities', exact: true }).click()
    await expect(page.getByText(/ACTIVE SCAN \[2/)).toBeVisible()
    await page.getByRole('button', { name: 'Previous activities', exact: true }).click()
    await expect(page.getByText(/ACTIVE SCAN \[1/)).toBeVisible()
    if (width >= 768) {
      await expect.poll(async () => page.locator('.activity-card').first().evaluate(element => Math.abs(element.getBoundingClientRect().left - element.closest('.wins-card-deck')!.getBoundingClientRect().left))).toBeLessThan(2)
      // The last card must be fully reachable, including narrow desktop widths.
      await page.getByRole('button', { name: 'Go to activity', exact: false }).last().click()
      await expect.poll(async () => page.locator('.activity-card').last().evaluate(element => element.getBoundingClientRect().right - element.closest('.wins-card-deck')!.getBoundingClientRect().right)).toBeLessThanOrEqual(1)
      await page.getByRole('button', { name: 'Go to activity 1', exact: true }).click()
      await expect.poll(async () => page.locator('.activity-card').first().evaluate(element => Math.abs(element.getBoundingClientRect().left - element.closest('.wins-card-deck')!.getBoundingClientRect().left))).toBeLessThan(2)
    }
    if (width < 768) {
      await page.locator('.wins-card-deck').evaluate(element => { element.scrollLeft = 620 })
      await expect(page.getByText(/ACTIVE SCAN \[3/)).toBeVisible()
    }
    expect(errors).toEqual([])
    if (width === 375 || width === 1440) await page.screenshot({ path: `test-results/activities-${width}.png`, fullPage: true })
  })
}

test('Realtime insert/update/delete/hide refresh the authoritative feed and clamp navigation', async ({ page }) => {
  const feed = await setup(page)
  await page.goto('/tests/e2e/harness.html')
  await expect(page.locator('.activity-card')).toHaveCount(6)
  await expect.poll(feed.requests).toBeGreaterThan(1)
  feed.setRows([row(9), row(0)])
  feed.notify('INSERT')
  await expect(page.locator('.activity-card').first().getByRole('heading')).toHaveText('Activity 9')
  feed.setRows([{ ...row(9), title: 'Updated in Supabase' }])
  feed.notify('UPDATE')
  await expect(page.locator('.activity-card').first().getByRole('heading')).toHaveText('Updated in Supabase')
  feed.setRows([])
  feed.notify('UPDATE', true)
  await expect(page.getByText('No recent activities yet.')).toBeVisible()
  feed.setRows([row(2)])
  feed.notify('INSERT')
  await expect(page.locator('.activity-card')).toHaveCount(1)
  feed.setRows([])
  feed.notify('DELETE')
  await expect(page.locator('.activity-card')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Next activities', exact: true })).toBeDisabled()
})

test('initial service failure falls back to legacy content and admin remains sign-in protected', async ({ page }) => {
  await setup(page)
  await page.route('https://portfolio-test.supabase.co/rest/v1/linkedin_posts*', route => route.fulfill({ status: 503, json: { message: 'Test outage' } }))
  await page.goto('/tests/e2e/harness.html')
  await expect(page.locator('.activity-card').first()).toBeVisible({ timeout: 20_000 })
  await page.goto('/admin/activities')
  await expect(page.getByRole('heading', { name: 'Administrator sign in' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Publish activity' })).toHaveCount(0)
})

test('admin can sign in, upload, create, edit, hide, feature and delete an activity', async ({ page }) => {
  let posts: ReturnType<typeof row>[] = []
  let uploads = 0
  await page.route('https://portfolio-test.supabase.co/auth/v1/token*', route => route.fulfill({ json: {
    access_token: 'test-access-token', refresh_token: 'test-refresh-token', expires_in: 3600, token_type: 'bearer',
    user: { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'admin@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-09-13T10:00:00Z' },
  } }))
  await page.route('https://portfolio-test.supabase.co/rest/v1/rpc/is_activity_admin', route => route.fulfill({ json: true }))
  await page.route('https://portfolio-test.supabase.co/storage/v1/object/linkedin-posts/**', route => {
    uploads++
    expect(route.request().method()).toBe('POST')
    return route.fulfill({ json: { Key: 'linkedin-posts/test/image.webp' } })
  })
  await page.route('https://portfolio-test.supabase.co/rest/v1/linkedin_posts*', async route => {
    const request = route.request()
    if (request.method() === 'POST') {
      const input = request.postDataJSON()
      posts = [{ ...row(1), ...input }]
      return route.fulfill({ json: { id: posts[0].id } })
    }
    if (request.method() === 'PATCH') {
      posts[0] = { ...posts[0], ...request.postDataJSON() }
      return route.fulfill({ json: { id: posts[0].id } })
    }
    if (request.method() === 'DELETE') {
      const id = posts[0].id; posts = []
      return route.fulfill({ json: { id } })
    }
    return route.fulfill({ json: posts, headers: { 'content-range': `0-${Math.max(0, posts.length - 1)}/${posts.length}` } })
  })
  await page.goto('/admin/activities')
  await page.getByLabel('Email', { exact: true }).fill('admin@example.test')
  await page.getByLabel('Password', { exact: true }).fill('test-password')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Add activity', exact: true })).toBeVisible()
  await page.getByLabel('Title *', { exact: true }).fill('Browser tested activity')
  await page.getByLabel('Short description *').fill('Created from the protected editor.')
  await page.getByLabel('LinkedIn post URL *').fill('https://www.linkedin.com/posts/editor-test')
  await page.getByLabel('Upload images').setInputFiles({ name: 'activity.webp', mimeType: 'image/webp', buffer: Buffer.from('test upload bytes') })
  await page.getByRole('button', { name: 'Publish activity', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Browser tested activity' })).toBeVisible()
  expect(uploads).toBe(1)
  expect(posts[0].images).toHaveLength(1)
  await page.getByRole('button', { name: 'Edit', exact: true }).click()
  await page.getByLabel('Title *', { exact: true }).fill('Edited activity')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('heading', { name: 'Edited activity' })).toBeVisible()
  await page.getByRole('button', { name: 'Hide', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Show', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Feature', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Unfeature', exact: true })).toBeVisible()
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByText('No activities yet. Use the form above to add your first post.')).toBeVisible()
})
