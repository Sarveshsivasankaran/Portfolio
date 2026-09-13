import type { LinkedInPost } from '../data/linkedinPosts'
import type { LinkedInPostRow } from './database.types'
import { supabase } from './supabase'

export const POST_FIELDS = 'id,title,description,linkedin_url,images,category,published_at,featured,visible,sort_order,created_at,updated_at' as const
export const FEED_LIMIT = 30

export function isLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
      (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) && url.pathname !== '/'
  } catch { return false }
}

export function isImageUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch { return false }
}

export function toActivity(row: LinkedInPostRow): LinkedInPost {
  const category = row.category?.trim() || ''
  const type = /project|hackathon/i.test(category) ? 'project'
    : /award|certificate|credential/i.test(category) ? 'certificate'
    : /article|publication/i.test(category) ? 'article' : 'post'
  const images = [...new Set((row.images || []).filter(isImageUrl))]
  return {
    id: row.id, title: row.title, summary: row.description, date: row.published_at,
    url: row.linkedin_url, type, badge: category, category, featured: row.featured,
    image: images[0] || '', images,
  }
}

export async function getLinkedInPosts(signal?: AbortSignal): Promise<LinkedInPost[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) abort()
  const timeout = setTimeout(abort, 12_000)
  try {
    const { data, error } = await supabase.from('linkedin_posts').select(POST_FIELDS)
      .eq('visible', true)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true })
      .limit(FEED_LIMIT).abortSignal(controller.signal)
    if (error) throw error
    const seen = new Set<string>()
    return (data || []).filter(row => {
      if (!row.visible || !isLinkedInUrl(row.linkedin_url) || !Number.isFinite(Date.parse(row.published_at))) return false
      const url = new URL(row.linkedin_url)
      const identity = url.pathname.replace(/\/$/, '')
      if (seen.has(identity)) return false
      seen.add(identity)
      return true
    }).map(toActivity)
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}
