import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Lazy 3D scene.
 * load      – () => import('../three/<scene>.js'), module exports `mount(canvas, opts)`
 * fallback  – shown while loading and wherever 3D is not used
 * options   – passed to the scene (e.g. getProgress)
 * onApi     – receives the scene's control API once ready
 * Scenes load only when within about a screen of the viewport and are torn
 * down when far away, so a page never holds many WebGL contexts at once.
 */
export default function Scene3D({ load, fallback = null, options, onApi, className = '', label }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [near, setNear] = useState(false)
  const [state, setState] = useState('idle') // idle | live | unsupported
  const optsRef = useRef(options)
  optsRef.current = options
  const apiRef = useRef(onApi)
  apiRef.current = onApi

  // Mount only near the viewport
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    let cancelled = false
    let handle
    import('../three/runtime.js').then(async ({ canRender3D }) => {
      if (cancelled) return
      if (!canRender3D()) return setState('unsupported')
      const mod = await load()
      if (cancelled || !canvasRef.current) return
      handle = mod.mount(canvasRef.current, { ...optsRef.current, still: !!reduce })
      apiRef.current?.(handle.api)
      setState('live')
    }).catch(() => !cancelled && setState('unsupported'))
    return () => {
      cancelled = true
      handle?.dispose()
      apiRef.current?.(null)
      setState((s) => (s === 'unsupported' ? s : 'idle'))
    }
  }, [near, reduce, load])

  return (
    <div ref={wrapRef} className={`relative ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {state !== 'live' && fallback && <div className="absolute inset-0">{fallback}</div>}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-700 ${state === 'live' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
