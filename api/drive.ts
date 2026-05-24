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
    const cb = Date.now()
    // Direct, highly reliable realtime query for this specific public folder
    const { data } = await axios.get('https://www.googleapis.com/drive/v3/files', {
      params: {
        q: `'${folderId}' in parents and mimeType contains 'image' and trashed = false and name != 'cb_${cb}'`,
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
    const allImages = files.map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      modifiedTime: f.modifiedTime,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`,
    }))

    // Disable caching completely to ensure 100% real-time updates from Google Drive
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    return res.status(200).json(allImages)
  } catch (error: any) {
    console.error('[Secure API Proxy] Drive Fetch Failed:', error.message)
    return res.status(error.response?.status || 500).json({ 
      error: 'Monarch System failed to execute Google Drive telemetry.' 
    })
  }
}
