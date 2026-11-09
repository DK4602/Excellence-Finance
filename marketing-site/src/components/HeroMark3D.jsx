import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'))
  } catch {
    return false
  }
}

// The 3D mark runs only on wider screens with WebGL and motion allowed.
// Everyone else, and everyone while it loads, sees the flat logo mark.
function shouldRender3D(reduce) {
  return !reduce && window.matchMedia('(min-width: 768px)').matches && webglAvailable()
}

function StillMark({ className = '' }) {
  return (
    <img
      src="/brand/logo-mark.png"
      alt=""
      width={160}
      height={248}
      className={`h-[58%] w-auto object-contain drop-shadow-[0_24px_30px_rgb(19_35_92/0.22)] ${className}`}
    />
  )
}

export default function HeroMark3D() {
  const reduce = useReducedMotion()
  const canvasRef = useRef(null)
  const [mode, setMode] = useState('still') // still | loading | live

  useEffect(() => {
    if (!shouldRender3D(reduce)) return
    let dispose
    let cancelled = false
    setMode('loading')
    import('../three/brandMark.js')
      .then(({ createBrandMark }) => {
        if (cancelled || !canvasRef.current) return
        dispose = createBrandMark(canvasRef.current, {
          interactive: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        })
        setMode('live')
      })
      .catch(() => setMode('still'))
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [reduce])

  return (
    <div className="relative aspect-square w-full" aria-hidden="true">
      {/* Soft stage: a pale halo and a floor shadow, from the brand palette */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,var(--color-sky),transparent)]" />
      <div className="absolute bottom-[9%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl" />
      {mode !== 'live' && (
        <div className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${mode === 'loading' ? 'opacity-60' : 'opacity-100'}`}>
          <StillMark />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-700 ${mode === 'live' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
