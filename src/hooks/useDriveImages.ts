import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface DriveImage {
  id: string
  name: string
  mimeType: string
  thumbnailUrl: string
  folderId?: string
}

const FOLDER_ID = '1ULYV5aIjArhpxQP_0V8slDRYkBNdBop2'

/**
 * Discover all subfolder IDs recursively using a BFS queue.
 * Capped to avoid massive number of requests or hitting rate limits.
 */
async function fetchAllSubfolders(rootId: string, apiKey: string): Promise<string[]> {
  const folderIds = [rootId]
  const queue = [rootId]
  const maxFolders = 50

  while (queue.length > 0 && folderIds.length < maxFolders) {
    const currentId = queue.shift()!
    try {
      const { data } = await axios.get('https://www.googleapis.com/drive/v3/files', {
        params: {
          q: `'${currentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
          key: apiKey,
          fields: 'files(id)',
          pageSize: 100,
        },
      })
      const subfolders = data.files || []
      for (const folder of subfolders) {
        if (!folderIds.includes(folder.id)) {
          folderIds.push(folder.id)
          queue.push(folder.id)
        }
      }
    } catch (e) {
      console.error(`[useDriveImages] Error discovering subfolders of ${currentId}:`, e)
    }
  }
  return folderIds
}

async function fetchDriveImages(): Promise<DriveImage[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  if (!apiKey || apiKey.includes('your_')) {
    return []
  }

  try {
    // 1. Get all folders recursively starting from FOLDER_ID
    const allFolderIds = await fetchAllSubfolders(FOLDER_ID, apiKey)

    // 2. Fetch images whose parent is in our discovered folders
    // Chunk queries to keep them within the safe length limit of the q parameter
    const chunkSize = 20
    const allImages: DriveImage[] = []

    for (let i = 0; i < allFolderIds.length; i += chunkSize) {
      const chunk = allFolderIds.slice(i, i + chunkSize)
      const parentClause = chunk.map(id => `'${id}' in parents`).join(' or ')
      const query = `(${parentClause}) and mimeType contains 'image' and trashed = false`

      const { data } = await axios.get('https://www.googleapis.com/drive/v3/files', {
        params: {
          q: query,
          key: apiKey,
          fields: 'files(id,name,mimeType)',
          pageSize: 100,
        },
      })

      const files = data.files || []
      files.forEach((f: { id: string; name: string; mimeType: string }) => {
        allImages.push({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`,
        })
      })
    }

    return allImages
  } catch (e) {
    console.error('[useDriveImages] Fetch drive images failed:', e)
    return []
  }
}

export function useDriveImages() {
  return useQuery({
    queryKey: ['drive-images'],
    queryFn: fetchDriveImages,
    staleTime: 0, // Immediately mark stale to pull fresh lists
    refetchInterval: 1000 * 15, // Continuously fetch in background every 15 seconds
    refetchOnWindowFocus: true, // Refresh list when window is focused
    retry: 1,
  })
}

