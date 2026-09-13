import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { LinkedInPostInput, LinkedInPostRow } from '../lib/database.types'
import { deleteActivity, listAdminActivities, saveActivity, updateActivityFlag } from '../lib/activityAdmin'
import './ActivitiesAdmin.css'

const messageOf = (error: unknown) => error instanceof Error ? error.message :
  typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : 'Something went wrong. Please retry.'

export default function ActivitiesAdmin() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!supabase) { setChecking(false); return }
    const client = supabase
    let live = true
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, value) => {
      if (live) { setAllowed(false); setChecking(Boolean(value)); setSession(value) }
    })
    return () => { live = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!session || !supabase) return
    let live = true
    void supabase.rpc('is_activity_admin').then(({ data, error: authError }) => {
      if (!live) return
      setAllowed(data === true && !authError)
      setError(authError ? 'Could not verify administrator access. Check the Supabase migration and retry signing in.' : '')
      setChecking(false)
    })
    return () => { live = false }
  }, [session])

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    const form = new FormData(event.currentTarget)
    setBusy(true); setError('')
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: String(form.get('email')), password: String(form.get('password')) })
      if (signInError) throw signInError
    } catch (cause) { setError(messageOf(cause)) }
    finally { setBusy(false) }
  }

  return <main className="activities-admin">
    <a href="/#wins" className="admin-back">← Back to portfolio</a>
    <p className="section-label">// CORE.ACHIEVEMENTS</p>
    <h1 className="section-heading">Manage activities</h1>
    {!supabase ? <p role="status">Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart the dev server or rebuild your deployment.</p>
      : checking ? <p role="status">Checking access…</p>
      : !session ? <form onSubmit={signIn} className="admin-panel admin-login">
        <h2>Administrator sign in</h2>
        <label>Email<input name="email" type="email" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form> : <>
        <button className="btn-ghost" disabled={busy} onClick={async () => {
          setBusy(true)
          const { error: signOutError } = await supabase!.auth.signOut()
          if (signOutError) setError(signOutError.message)
          setBusy(false)
        }}>Sign out</button>
        {allowed ? <ActivityEditor key={session.user.id} /> : <p role="status">This account does not have activity administrator access. Ask the project owner to add your user ID to activity_admins.</p>}
      </>}
    {error && <p role="alert" className="admin-error">{error}</p>}
  </main>
}

function localDate(value: string) {
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function ActivityEditor() {
  const [posts, setPosts] = useState<LinkedInPostRow[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<LinkedInPostRow | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [formVersion, setFormVersion] = useState(0)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)
  const refresh = useCallback(() => setRefreshVersion(value => value + 1), [])

  useEffect(() => {
    let live = true
    setLoading(true)
    void listAdminActivities(page).then(result => {
      if (live) {
        if (!result.posts.length && page > 0) setPage(value => value - 1)
        setPosts(result.posts); setCount(result.count)
      }
    }).catch(cause => { if (live) setError(messageOf(cause)) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [page, refreshVersion])

  function selectPost(post: LinkedInPostRow | null) {
    setEditing(post); setImages(post?.images || []); setFiles([]); setFormVersion(value => value + 1)
    setError(''); setStatus('')
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true); setError(''); setStatus('Validating activity…')
    try {
      const input: LinkedInPostInput = {
        id: editing?.id, title: String(form.get('title')), description: String(form.get('description')),
        linkedin_url: String(form.get('linkedin_url')).trim(), published_at: new Date(String(form.get('published_at'))).toISOString(),
        category: String(form.get('category')).trim() || null, images,
        featured: form.get('featured') === 'on', visible: form.get('visible') === 'on',
      }
      await saveActivity(input, files, Boolean(editing), setStatus)
      selectPost(null); setStatus('Activity saved. The public feed will refresh automatically.'); refresh()
    } catch (cause) { setError(messageOf(cause)); setStatus('') }
    finally { setBusy(false) }
  }

  async function mutate(action: () => Promise<void>, success: string) {
    setBusy(true); setError(''); setStatus('')
    try { await action(); setStatus(success); refresh() }
    catch (cause) { setError(messageOf(cause)) }
    finally { setBusy(false) }
  }

  return <>
    <div className="admin-toolbar"><h2>{editing ? 'Edit activity' : 'Add activity'}</h2><button className="btn-ghost" disabled={busy} onClick={() => selectPost(null)}>New activity</button></div>
    <form key={formVersion} onSubmit={save} className="admin-panel">
      <fieldset disabled={busy}>
        <label>Title *<input name="title" required maxLength={240} defaultValue={editing?.title} /></label>
        <label>Short description *<textarea name="description" required maxLength={5000} rows={4} defaultValue={editing?.description} /></label>
        <label>LinkedIn post URL *<input name="linkedin_url" type="url" required placeholder="https://www.linkedin.com/posts/…" defaultValue={editing?.linkedin_url} /></label>
        <div className="admin-form-row">
          <label>Published date *<input name="published_at" type="datetime-local" required defaultValue={localDate(editing?.published_at || new Date().toISOString())} /><small>Your local time zone; displayed in UTC on the portfolio.</small></label>
          <label>Category<input name="category" maxLength={80} placeholder="Hackathon, award, project…" defaultValue={editing?.category || ''} /></label>
        </div>
        <div className="admin-checks">
          <label><input type="checkbox" name="featured" defaultChecked={editing?.featured || false} />Featured</label>
          <label><input type="checkbox" name="visible" defaultChecked={editing?.visible ?? true} />Visible on portfolio</label>
        </div>
        <label>Upload images<input type="file" accept="image/webp,image/jpeg,image/png,image/avif" multiple onChange={event => setFiles(Array.from(event.target.files || []))} />
          <small>Up to 12 images, 5 MB each. WebP, JPEG, PNG, or AVIF. Images are stored publicly.</small>
        </label>
        {files.length > 0 && <p>{files.length} image(s) ready to upload</p>}
        <div className="admin-images">{images.map((url, index) => <div key={`${url}-${index}`}>
          <a href={url} target="_blank" rel="noopener noreferrer">Image {index + 1}</a>
          <button type="button" onClick={() => setImages(previous => previous.filter((_, i) => i !== index))} aria-label={`Remove image ${index + 1}`}>Remove</button>
        </div>)}</div>
        <button className="btn-primary" type="submit">{busy ? 'Saving…' : editing ? 'Save changes' : 'Publish activity'}</button>
      </fieldset>
    </form>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <p role="status" aria-live="polite">{status}</p>
    <div className="admin-toolbar"><h2>Activities ({count})</h2><button className="btn-ghost" disabled={busy || loading} onClick={refresh}>Refresh</button></div>
    {loading && <p role="status">Loading activities…</p>}
    {!loading && !posts.length && <p>No activities yet. Use the form above to add your first post.</p>}
    <div className="admin-list">{posts.map(post => <article key={post.id} className="admin-panel">
      <h3>{post.title}</h3><p>{new Date(post.published_at).toLocaleDateString()} · {post.visible ? 'Visible' : 'Hidden'}{post.featured ? ' · Featured' : ''}</p>
      <div className="admin-actions">
        <button disabled={busy} onClick={() => { selectPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
        <button disabled={busy || editing?.id === post.id} onClick={() => void mutate(() => updateActivityFlag(post.id, 'visible', !post.visible), 'Visibility updated.')}>{post.visible ? 'Hide' : 'Show'}</button>
        <button disabled={busy || editing?.id === post.id} onClick={() => void mutate(() => updateActivityFlag(post.id, 'featured', !post.featured), 'Featured status updated.')}>{post.featured ? 'Unfeature' : 'Feature'}</button>
        <button disabled={busy} onClick={() => {
          if (window.confirm(`Delete “${post.title}”? This cannot be undone.`)) void mutate(async () => {
            await deleteActivity(post.id)
            if (editing?.id === post.id) selectPost(null)
          }, 'Activity deleted.')
        }}>Delete</button>
      </div>
    </article>)}</div>
    <nav className="admin-actions" aria-label="Activity pages">
      <button disabled={busy || loading || page === 0} onClick={() => setPage(value => value - 1)}>Previous page</button>
      <span>Page {page + 1}</span>
      <button disabled={busy || loading || (page + 1) * 20 >= count} onClick={() => setPage(value => value + 1)}>Next page</button>
    </nav>
  </>
}
