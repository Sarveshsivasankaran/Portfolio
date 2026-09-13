import type { LinkedInPostInput, LinkedInPostRow } from './database.types'
import { isImageUrl, isLinkedInUrl, POST_FIELDS } from './linkedinPosts'
import { supabase } from './supabase'

export const MAX_IMAGES = 12
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const extensions: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/avif': 'avif' }

function client() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export function validateActivity(input: LinkedInPostInput, files: File[] = []) {
  if (!input.title.trim() || input.title.length > 240) throw new Error('Title must be 1–240 characters.')
  if (!input.description.trim() || input.description.length > 5000) throw new Error('Description must be 1–5,000 characters.')
  if (!isLinkedInUrl(input.linkedin_url)) throw new Error('Enter an HTTPS LinkedIn post or sharing URL.')
  if (!Number.isFinite(Date.parse(input.published_at))) throw new Error('Choose a valid published date.')
  if ((input.category?.length ?? 0) > 80) throw new Error('Category must be at most 80 characters.')
  if ((input.images?.length ?? 0) + files.length > MAX_IMAGES) throw new Error('Use at most 12 images per activity.')
  if (input.images?.some(url => !isImageUrl(url))) throw new Error('Images must use HTTPS URLs.')
  for (const file of files) {
    if (!extensions[file.type]) throw new Error('Use WebP, JPEG, PNG, or AVIF images.')
    if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('Each image must be nonempty and no larger than 5 MB.')
  }
}

export async function listAdminActivities(page: number): Promise<{ posts: LinkedInPostRow[]; count: number }> {
  const { data, count, error } = await client().from('linkedin_posts').select(POST_FIELDS, { count: 'exact' })
    .order('published_at', { ascending: false }).order('id').range(page * 20, page * 20 + 19)
  if (error) throw error
  return { posts: data || [], count: count || 0 }
}

export async function saveActivity(input: LinkedInPostInput, files: File[], existing: boolean, onProgress: (text: string) => void) {
  validateActivity(input, files)
  const db = client()
  const { data: admin, error: adminError } = await db.rpc('is_activity_admin')
  if (adminError || !admin) throw new Error('Your account is not an activity administrator.')
  const id = input.id || crypto.randomUUID()
  const uploaded: string[] = []
  const images = [...(input.images || [])]
  try {
    for (const [index, file] of files.entries()) {
      onProgress(`Uploading image ${index + 1} of ${files.length}…`)
      const path = `${id}/${crypto.randomUUID()}.${extensions[file.type]}`
      const { error } = await db.storage.from('linkedin-posts').upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
      if (error) throw error
      uploaded.push(path)
      images.push(db.storage.from('linkedin-posts').getPublicUrl(path).data.publicUrl)
    }
    onProgress('Saving activity…')
    const payload = { ...input, id, title: input.title.trim(), description: input.description.trim(), category: input.category?.trim() || null, images }
    const query = existing ? db.from('linkedin_posts').update(payload).eq('id', id) : db.from('linkedin_posts').insert(payload)
    const { error } = await query.select('id').single()
    if (error) throw error
  } catch (error) {
    if (uploaded.length) {
      const { error: cleanupError } = await db.storage.from('linkedin-posts').remove(uploaded)
      if (cleanupError) throw new Error('Save failed; uploaded files could not be cleaned up. Check this activity folder in Storage before retrying.')
    }
    throw error
  }
}

export async function updateActivityFlag(id: string, field: 'visible' | 'featured', value: boolean) {
  const change = field === 'visible' ? { visible: value } : { featured: value }
  const { error } = await client().from('linkedin_posts').update(change).eq('id', id).select('id').single()
  if (error) throw error
}

export async function deleteActivity(id: string) {
  const { error } = await client().from('linkedin_posts').delete().eq('id', id).select('id').single()
  if (error) throw error
}
