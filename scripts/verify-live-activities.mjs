import { createClient } from '@supabase/supabase-js'
import assert from 'node:assert/strict'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
assert(url && key?.startsWith('sb_publishable_'), 'Load the public project settings with --env-file=.env.local')
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const read = async () => {
  const { data, error } = await db.from('linkedin_posts').select('id,title,visible,published_at,featured,images')
    .eq('visible', true).order('featured', { ascending: false }).order('published_at', { ascending: false }).limit(30)
  assert.ifError(error)
  assert(data.every(post => post.visible))
  return data
}
const posts = await read()
console.log(JSON.stringify({ publicPosts: posts.length, firstTitle: posts[0]?.title }))
const { error: privateError } = await db.from('activity_admins').select('user_id')
assert(privateError, 'Anonymous users must not read administrator memberships')
const id = crypto.randomUUID()
for (const [action, query] of [
  ['INSERT', db.from('linkedin_posts').insert({ id, title: 'Permission probe', description: 'This must be denied.', linkedin_url: `https://www.linkedin.com/posts/permission-probe-${id}`, published_at: new Date().toISOString(), visible: false })],
  ['UPDATE', db.from('linkedin_posts').update({ title: 'This must be denied' }).eq('id', id)],
  ['DELETE', db.from('linkedin_posts').delete().eq('id', id)],
]) {
  const { error } = await query
  assert(error, `Anonymous ${action} unexpectedly allowed`)
  console.log(`${action}: denied (${error.code})`)
}
const { error: uploadError } = await db.storage.from('linkedin-posts').upload(`permission-probe/${id}.webp`, new Uint8Array([0]), { contentType: 'image/webp' })
assert(uploadError, 'Anonymous uploads must be denied')
console.log(`UPLOAD: denied (${uploadError.statusCode || 'RLS'})`)

if (process.argv.includes('--watch')) {
  let channel
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('No Realtime change received within 90 seconds')), 90_000)
    channel = db.channel('portfolio-live-verification')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linkedin_posts' }, async payload => {
        try {
          const refreshed = await read()
          console.log(JSON.stringify({ realtimeEvent: payload.eventType, authoritativePostCount: refreshed.length }))
          clearTimeout(timeout); resolve()
        } catch (error) { clearTimeout(timeout); reject(error) }
      })
      .subscribe(status => {
        console.log(`Realtime: ${status}`)
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') { clearTimeout(timeout); reject(new Error(status)) }
      })
  }).finally(async () => { if (channel) await db.removeChannel(channel) })
}
