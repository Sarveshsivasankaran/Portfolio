import { beforeEach, expect, it, vi } from 'vitest'
import { saveActivity } from '../src/lib/activityAdmin'

const mocked = vi.hoisted(() => {
  const upload = vi.fn()
  const remove = vi.fn()
  const single = vi.fn()
  const query = { select: () => ({ single }) }
  const insert = vi.fn(() => query)
  const rpc = vi.fn()
  return { upload, remove, single, insert, rpc }
})
vi.mock('../src/lib/supabase', () => ({ supabase: {
  rpc: mocked.rpc,
  from: () => ({ insert: mocked.insert }),
  storage: { from: () => ({ upload: mocked.upload, remove: mocked.remove, getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.test/${path}` } }) }) },
} }))
const input = { title: 'Activity', description: 'Summary', published_at: '2026-09-13T10:00:00Z', linkedin_url: 'https://www.linkedin.com/posts/test' }
const file = () => new File(['image'], 'test.webp', { type: 'image/webp' })
beforeEach(() => {
  vi.clearAllMocks()
  mocked.rpc.mockResolvedValue({ data: true, error: null })
  mocked.upload.mockResolvedValue({ error: null })
  mocked.remove.mockResolvedValue({ error: null })
  mocked.single.mockResolvedValue({ error: null })
})
it('blocks unapproved users before uploading or writing', async () => {
  mocked.rpc.mockResolvedValue({ data: false, error: null })
  await expect(saveActivity(input, [file()], false, vi.fn())).rejects.toThrow('administrator')
  expect(mocked.upload).not.toHaveBeenCalled()
  expect(mocked.insert).not.toHaveBeenCalled()
})
it('cleans up successful uploads if a later upload fails', async () => {
  mocked.upload.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: new Error('Upload failed') })
  await expect(saveActivity(input, [file(), file()], false, vi.fn())).rejects.toThrow('Upload failed')
  expect(mocked.remove.mock.calls[0][0]).toHaveLength(1)
  expect(mocked.insert).not.toHaveBeenCalled()
})
it('cleans up new uploads when saving fails without removing existing images', async () => {
  mocked.single.mockResolvedValue({ error: new Error('Save failed') })
  await expect(saveActivity({ ...input, images: ['https://example.test/existing.webp'] }, [file()], false, vi.fn())).rejects.toThrow('Save failed')
  expect(mocked.remove.mock.calls[0][0]).toHaveLength(1)
  expect(mocked.remove.mock.calls[0][0][0]).not.toContain('existing.webp')
})
it('reports cleanup failure and keeps saved uploads on success', async () => {
  await saveActivity(input, [file()], false, vi.fn())
  expect(mocked.remove).not.toHaveBeenCalled()
  mocked.single.mockResolvedValue({ error: new Error('Save failed') })
  mocked.remove.mockResolvedValue({ error: new Error('Offline') })
  await expect(saveActivity(input, [file()], false, vi.fn())).rejects.toThrow('could not be cleaned up')
})
