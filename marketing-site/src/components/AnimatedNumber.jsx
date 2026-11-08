import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'

// Tweens a number between values; interrupts cleanly when the target changes.
export default function AnimatedNumber({ value, format, className, duration = 0.6 }) {
  const ref = useRef(null)
  const from = useRef(value)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = format(value)
      from.current = value
      return
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        from.current = v
        el.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [value, format, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
