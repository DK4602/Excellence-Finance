import { useEffect, useRef, useState } from 'react'
import { photoUrl } from '../data/photos'

// Responsive, lazy photograph with a calm load fade. `ratio` is width/height.
export default function Photo({ photo, ratio = 4 / 3, widths = [480, 800, 1200, 1600], sizes = '100vw', priority = false, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)
  // A cached image can finish before React attaches onLoad
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [])
  const h = (w) => Math.round(w / ratio)
  const srcSet = widths.map((w) => `${photoUrl(photo.id, w, h(w))} ${w}w`).join(', ')
  const mid = widths[Math.min(1, widths.length - 1)]

  return (
    <div className={`relative overflow-hidden bg-sky ${className}`} style={{ aspectRatio: ratio }}>
      <img
        ref={ref}
        src={photoUrl(photo.id, mid, h(mid))}
        srcSet={srcSet}
        sizes={sizes}
        width={mid}
        height={h(mid)}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-strong)] ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  )
}
