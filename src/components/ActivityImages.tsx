import { useState } from 'react'
import { FiActivity } from 'react-icons/fi'

interface Props {
  images: string[]
  title: string
  color: string
  label: string
  active: boolean
}

export default function ActivityImages({ images, title, color, label, active }: Props) {
  const [failed, setFailed] = useState<string[]>([])
  const available = images.filter(url => url && !failed.includes(url))
  const shown = available.slice(0, 4)
  if (!shown.length) return (
    <div className="activity-image-placeholder" role="img" aria-label={`${title} — activity illustration`}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: `radial-gradient(circle at 50% 50%, ${color}22 0%, rgba(10,10,18,0.95) 85%)` }}>
      <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}55`, display: 'grid', placeItems: 'center', color, marginBottom: 8, boxShadow: `0 0 16px ${color}44` }}><FiActivity size={20} /></div>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: 'var(--ghost)', letterSpacing: '0.08em' }}>[ INTEL RECORD LOG ]</span>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color, marginTop: 3, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
  return (
    <div className="activity-image-grid" style={{ display: 'grid', width: '100%', height: '100%', gap: shown.length > 1 ? 3 : 0,
      gridTemplateColumns: shown.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      gridTemplateRows: shown.length > 2 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)' }}>
      {shown.map((url, index) => (
        <div key={url} style={{ position: 'relative', overflow: 'hidden', minHeight: 0, gridRow: shown.length === 3 && index === 0 ? 'span 2' : undefined }}>
          <img src={url} alt={`${title} — image ${index + 1}`} loading="lazy" decoding="async" referrerPolicy="no-referrer"
            onError={() => setFailed(previous => [...previous, url])}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: active ? 'grayscale(0) contrast(1.05)' : 'grayscale(0.3) contrast(0.95)', transition: 'transform 0.5s ease, filter 0.5s ease' }} />
          {index === 3 && available.length > 4 && <span aria-label={`${available.length - 4} more images on LinkedIn`} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--ghost)', background: 'rgba(10,10,18,0.65)', fontWeight: 700 }}>+{available.length - 4}</span>}
        </div>
      ))}
    </div>
  )
}
