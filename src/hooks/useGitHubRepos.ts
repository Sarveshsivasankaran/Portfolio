import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  pushed_at: string
}

const CACHE_KEY = 'github_repos_cache'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function getFromCache(): GitHubRepo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data as GitHubRepo[]
  } catch {
    return null
  }
}

function setCache(data: GitHubRepo[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const cached = getFromCache()
  if (cached) return cached

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  }
  const token = import.meta.env.VITE_GITHUB_TOKEN
  if (token && !token.includes('your_')) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const { data } = await axios.get<GitHubRepo[]>(
    'https://api.github.com/users/Sarveshsivasankaran/repos',
    {
      params: { sort: 'updated', per_page: 18, type: 'public' },
      headers,
    }
  )
  setCache(data)
  return data
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchRepos,
    staleTime: CACHE_TTL,
    retry: 2,
  })
}
