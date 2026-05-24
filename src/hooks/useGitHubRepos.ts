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
const EXCLUDED_REPOS = ['salesp07', 'letifyy']

function getFromCache(): GitHubRepo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    const list = data as GitHubRepo[]
    return list.filter(repo => !EXCLUDED_REPOS.includes(repo.name.toLowerCase()))
  } catch {
    return null
  }
}

function setCache(data: GitHubRepo[]) {
  const filtered = data.filter(repo => !EXCLUDED_REPOS.includes(repo.name.toLowerCase()))
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: filtered, ts: Date.now() }))
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const cached = getFromCache()
  if (cached) return cached

  try {
    // 1. Query the secure Vercel Serverless Proxy first (hides tokens in production)
    const { data } = await axios.get<GitHubRepo[]>('/api/github')
    if (!Array.isArray(data)) {
      throw new Error('Proxy response did not return a valid list of repositories')
    }
    setCache(data)
    return data
  } catch (err) {
    console.warn('[GitHub Hook] Serverless API proxy offline, falling back to direct client-side scan.', err)

    // 2. Client-side resilient fallback (reads local dev credentials safely)
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
        params: { sort: 'updated', per_page: 100, type: 'public' },
        headers,
      }
    )
    const filtered = data.filter(repo => !EXCLUDED_REPOS.includes(repo.name.toLowerCase()))
    setCache(filtered)
    return filtered
  }
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchRepos,
    staleTime: CACHE_TTL,
    retry: 2,
  })
}
