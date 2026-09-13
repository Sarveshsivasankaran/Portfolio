import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLinkedInPosts } from '../src/hooks/useLinkedInPosts'

const mocked = vi.hoisted(() => {
  const events: Record<string, () => void> = {}
  const channel = { on: vi.fn(function (_event: string, filter: { table: string }, callback: () => void) { events[filter.table] = callback; return channel }), subscribe: vi.fn(() => channel) }
  return { events, channel, fetch: vi.fn(), remove: vi.fn() }
})
vi.mock('../src/lib/supabase', () => ({ supabase: { channel: () => mocked.channel, removeChannel: mocked.remove } }))
vi.mock('../src/lib/linkedinPosts', () => ({ getLinkedInPosts: mocked.fetch }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
function wrapper({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
it('loads authoritative posts, refetches every change and handles hide/delete without restoring legacy data', async () => {
  mocked.fetch.mockResolvedValue([{ id: 'new', title: 'Dynamic' }])
  const { result, unmount } = renderHook(useLinkedInPosts, { wrapper })
  await waitFor(() => expect(result.current.posts[0].title).toBe('Dynamic'))
  for (const title of ['Inserted', 'Updated']) {
    mocked.fetch.mockResolvedValue([{ id: 'new', title }])
    act(() => mocked.events.linkedin_posts())
    await waitFor(() => expect(result.current.posts[0].title).toBe(title))
  }
  mocked.fetch.mockResolvedValue([])
  act(() => mocked.events.activity_feed_revision())
  await waitFor(() => expect(result.current.posts).toEqual([]))
  // A later successful DELETE notification also keeps the empty authoritative list.
  act(() => mocked.events.linkedin_posts())
  await waitFor(() => expect(mocked.fetch).toHaveBeenCalledTimes(5))
  expect(result.current.posts).toEqual([])
  unmount()
  expect(mocked.remove).toHaveBeenCalledWith(mocked.channel)
})
it('ignores delayed notifications after unmount', async () => {
  mocked.fetch.mockResolvedValue([])
  const { unmount } = renderHook(useLinkedInPosts, { wrapper })
  await waitFor(() => expect(mocked.fetch).toHaveBeenCalledTimes(1))
  act(() => mocked.events.linkedin_posts())
  unmount()
  await new Promise(resolve => setTimeout(resolve, 220))
  expect(mocked.fetch).toHaveBeenCalledTimes(1)
})
