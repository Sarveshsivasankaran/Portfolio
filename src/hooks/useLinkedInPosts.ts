import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LINKEDIN_POSTS } from '../data/linkedinPosts'
import { getLinkedInPosts } from '../lib/linkedinPosts'
import { supabase } from '../lib/supabase'

export const ACTIVITY_QUERY_KEY = ['linkedin-posts', 'public'] as const

export function useLinkedInPosts() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ACTIVITY_QUERY_KEY,
    queryFn: ({ signal }) => getLinkedInPosts(signal),
    enabled: Boolean(supabase),
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  })

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let timer: ReturnType<typeof setTimeout> | undefined
    let disposed = false
    const refresh = () => {
      if (disposed) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY })
      }, 150)
    }
    const channel = client.channel('portfolio-activities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'linkedin_posts' }, refresh)
      // RLS can suppress an UPDATE that hides a row. This content-free revision also
      // invalidates that row immediately without exposing hidden post contents.
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'activity_feed_revision' }, refresh)
      .subscribe(status => {
        if (status === 'SUBSCRIBED') refresh() // Close initial fetch/subscription and reconnect gaps.
        if (import.meta.env.DEV && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          console.warn('[Activities] Realtime unavailable; periodic refresh remains active.')
        }
      })
    window.addEventListener('online', refresh)
    return () => {
      disposed = true
      clearTimeout(timer)
      window.removeEventListener('online', refresh)
      void client.removeChannel(channel)
    }
  }, [queryClient])

  useEffect(() => {
    if (import.meta.env.DEV && query.error) console.warn('[Activities] Feed refresh failed:', query.error.message)
  }, [query.error])

  return {
    // Never append legacy entries to authoritative results: hidden/deleted records must stay gone.
    posts: query.data ?? LINKEDIN_POSTS,
    loading: Boolean(supabase) && query.isPending && !query.isError,
  }
}
