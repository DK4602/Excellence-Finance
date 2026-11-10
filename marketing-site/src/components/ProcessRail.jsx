import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

// The reading line: the rail's fill tip stays level with this point of the
// viewport, so progress moves down the steps along with the visitor.
const READ_LINE = 0.55

/**
 * A vertical step rail whose brass fill grows downward as the page scrolls.
 * steps      – [{ title, body, meta? }]
 * surface    – background behind the rail ('mist' | 'white'), for the ring offset
 * spacious   – give each step about 40% of the screen height on large screens
 * headingAs  – heading element for step titles
 * onProgress – receives 0..1 through the steps (piecewise: 1/(n-1) per step),
 *              for anything that follows along, such as the 3D journey
 */
export default function ProcessRail({ steps, surface = 'mist', spacious = false, headingAs: H = 'h3', onProgress, className = '' }) {
  const reduce = useReducedMotion()
  const listRef = useRef(null)
  const nodeRefs = useRef([])
  const geo = useRef({ H: 0, centers: [] })
  const [rail, setRail] = useState({ top: 0, len: 0 })
  const [active, setActive] = useState(-1)
  const fill = useMotionValue(0)
  const tipY = useMotionValue(0)
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: [`start ${READ_LINE * 100}%`, `end ${READ_LINE * 100}%`],
  })

  const update = useCallback((p) => {
    const { H: h, centers } = geo.current
    if (!centers.length) return
    const first = centers[0]
    const last = centers[centers.length - 1]
    const y = Math.min(last, Math.max(first, p * h))
    tipY.set(y)
    fill.set(last > first ? (y - first) / (last - first) : 0)

    // Which steps the tip has reached, and how far between them (for the 3D card)
    let passed = -1
    centers.forEach((c, i) => {
      if (p * h >= c - 1) passed = i
    })
    setActive(passed)
    let s = 0
    for (let i = 0; i < centers.length - 1; i++) {
      if (y >= centers[i + 1]) s = i + 1
      else if (y > centers[i]) s = i + (y - centers[i]) / (centers[i + 1] - centers[i])
    }
    onProgressRef.current?.(centers.length > 1 ? s / (centers.length - 1) : 0)
  }, [fill, tipY])

  // Measure node centres relative to the list; re-measure when anything resizes
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const top = list.getBoundingClientRect().top
      const centers = nodeRefs.current.filter(Boolean).map((n) => {
        const r = n.getBoundingClientRect()
        return r.top - top + r.height / 2
      })
      geo.current = { H: list.offsetHeight, centers }
      const top0 = centers[0] ?? 0
      const len = (centers[centers.length - 1] ?? 0) - top0
      setRail((r) => (r.top === top0 && r.len === len ? r : { top: top0, len }))
      update(scrollYProgress.get())
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [steps.length, update, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', update)

  const offset = surface === 'white' ? 'ring-offset-white' : 'ring-offset-mist'
  const done = (i) => reduce || i <= active

  return (
    <ol ref={listRef} className={`relative ${className}`}>
      {/* Track and fill, from the first node's centre to the last */}
      <span
        aria-hidden
        className="absolute left-5 w-px -translate-x-1/2 bg-line-strong"
        style={{ top: rail.top, height: rail.len }}
      />
      <motion.span
        aria-hidden
        className="absolute left-5 w-[3px] origin-top -translate-x-1/2 rounded-full bg-brass"
        style={{ top: rail.top, height: rail.len, scaleY: reduce ? 1 : fill }}
      />
      {/* The tip: a small application card riding the fill */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute top-0 left-5 z-10 -mt-[9px] -ml-[7px] h-[18px] w-[14px] rounded-[3px] border border-line-strong bg-white shadow-[0_4px_10px_-2px_rgb(19_35_92/0.25)]"
          style={{ y: tipY, opacity: active >= 0 && active < steps.length - 1 ? 1 : 0 }}
        >
          <span className="absolute inset-x-0 top-0 h-[5px] rounded-t-[2px] bg-ink" />
          <span className="absolute top-[8px] left-[3px] h-px w-[6px] bg-brass" />
          <span className="absolute top-[11px] left-[3px] h-px w-[4px] bg-brass" />
        </motion.span>
      )}

      {steps.map((s, i) => {
        const current = !reduce && i === active
        return (
          <li
            key={s.title}
            aria-current={current ? 'step' : undefined}
            className={`relative grid grid-cols-[2.5rem_1fr] gap-x-5 md:gap-x-7 ${
              i < steps.length - 1 ? (spacious ? 'pb-14 lg:min-h-[40vh] lg:pb-16' : 'pb-12 md:pb-14') : ''
            }`}
          >
            <span
              ref={(n) => (nodeRefs.current[i] = n)}
              className={`figure relative z-20 grid size-10 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-300 ${
                done(i) ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line-strong'
              } ${current ? `ring-2 ring-brass ring-offset-2 ${offset}` : ''}`}
            >
              {i + 1}
            </span>
            <div className="pt-1.5">
              <H className={`font-display text-[1.5rem] leading-tight transition-colors duration-300 md:text-[1.75rem] ${done(i) ? 'text-ink' : 'text-slate'}`}>
                {s.title}
              </H>
              {s.meta && <p className="mt-2 text-sm text-slate">{s.meta}</p>}
              <p className="mt-3 max-w-[52ch] text-slate md:text-lg">{s.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
