import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

function isPublicConfiguration(): boolean {
  if (!url || !key?.startsWith('sb_publishable_')) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password
  } catch {
    return false
  }
}

// One browser client; only modern publishable keys are accepted, never secret/service-role keys.
export const supabase = isPublicConfiguration()
  ? createClient<Database>(url!, key!)
  : null

if (import.meta.env.DEV && (url || key) && !supabase) {
  console.warn('[Activities] Set an HTTPS VITE_SUPABASE_URL and sb_publishable_ key. Using legacy activities.')
}
