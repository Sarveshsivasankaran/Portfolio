import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface DriveImage {
  id: string
  name: string
  mimeType: string
  thumbnailUrl: string
  folderId?: string
}

export function getFolderId(): string {
  return '1ULYV5aIjArhpxQP_0V8slDRYkBNdBop2' // Hardcoded public Google Drive folder ID
}

async function fetchDriveImages(): Promise<DriveImage[]> {
  try {
    // 1. Query the secure Vercel Serverless Proxy first (hides tokens in production)
    // Add dynamic cache-busting timestamp parameter to bypass CDN/browser caches
    const { data } = await axios.get<DriveImage[]>(`/api/drive?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
    if (!Array.isArray(data)) {
      throw new Error('Proxy response did not return a valid list of images')
    }
    return data
  } catch (err) {
    console.warn('[Drive Hook] Serverless API proxy offline, falling back to direct client-side scan.', err)

    // 2. Client-side resilient fallback (reads local dev credentials safely)
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
    if (!apiKey || apiKey.includes('your_')) {
      return []
    }

    try {
      const folderId = getFolderId()
      // Direct, highly reliable client-side scan for this specific public folder
      const { data } = await axios.get('https://www.googleapis.com/drive/v3/files', {
        params: {
          q: `'${folderId}' in parents and mimeType contains 'image' and trashed = false`,
          key: apiKey,
          fields: 'files(id,name,mimeType,modifiedTime)',
          pageSize: 100,
          orderBy: 'modifiedTime desc',
        },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      })

      const files = data.files || []
      return files.map((f: any) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`,
      }))
    } catch (e) {
      console.error('[useDriveImages] Fetch drive images failed:', e)
      return []
    }
  }
}

export function useDriveImages() {
  const activeFolderId = getFolderId()
  return useQuery({
    queryKey: ['drive-images', activeFolderId], // Make folder ID part of queryKey for instant cache invalidation on dynamic edits
    queryFn: fetchDriveImages,
    staleTime: 0, // Immediately mark stale to pull fresh lists
    refetchInterval: 1000 * 15, // Continuously fetch in background every 15 seconds
    refetchOnWindowFocus: true, // Refresh list when window is focused
    retry: 1,
  })
}
