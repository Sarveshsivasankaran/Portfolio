import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Read sensitive credentials strictly server-side
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey || apiKey.includes('your_')) {
    return res.status(200).json([]) // Safe empty return if not yet configured
  }

  const folderId = '1ULYV5aIjArhpxQP_0V8slDRYkBNdBop2' // Hardcoded public Google Drive folder ID

  try {
    // 1. Discover all subfolders recursively using a BFS queue
    const folderIds = [folderId]
    const queue = [folderId]
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
      } catch (e: any) {
        console.error(`[Secure API Proxy] Subfolder lookup failed for ${currentId}:`, e.message)
      }
    }

    // 2. Fetch images whose parent is in discovered folders
    const chunkSize = 20
    const allImages: any[] = []

    for (let i = 0; i < folderIds.length; i += chunkSize) {
      const chunk = folderIds.slice(i, i + chunkSize)
      const parentClause = chunk.map(id => `'${id}' in parents`).join(' or ')
      const queryClause = `(${parentClause}) and mimeType contains 'image' and trashed = false`

      const { data } = await axios.get('https://www.googleapis.com/drive/v3/files', {
        params: {
          q: queryClause,
          key: apiKey,
          fields: 'files(id,name,mimeType)',
          pageSize: 100,
        },
      })

      const files = data.files || []
      files.forEach((f: any) => {
        allImages.push({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`,
        })
      })
    }

    // Cache the response in the CDN for 1 minute to ensure high performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30')
    return res.status(200).json(allImages)
  } catch (error: any) {
    console.error('[Secure API Proxy] Drive Fetch Failed:', error.message)
    return res.status(error.response?.status || 500).json({ 
      error: 'Monarch System failed to execute Google Drive telemetry.' 
    })
  }
}
