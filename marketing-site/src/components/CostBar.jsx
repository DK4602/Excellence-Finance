import { motion, useReducedMotion } from 'motion/react'
import { formatINR } from '../lib/finance'

// Stacked bar: principal / interest / upfront fees. Labelled, never colour-only.
export default function CostBar({ principal, interest, fees = 0, animateIn = false, inView = true, compact = false }) {
  const reduce = useReducedMotion()
  const total = principal + interest + fees
  const parts = [
    { key: 'principal', label: 'Principal', value: principal, color: 'bg-principal' },
    { key: 'interest', label: 'Interest', value: interest, color: 'bg-interest' },
    ...(fees > 0 ? [{ key: 'fees', label: 'Upfront fees', value: fees, color: 'bg-fees' }] : []),
  ]

  return (
    <div>
      <div
        className={`flex w-full gap-[2px] overflow-hidden rounded-full ${compact ? 'h-2.5' : 'h-4'}`}
        role="img"
        aria-label={parts.map((p) => `${p.label} ${formatINR(p.value)}`).join(', ')}
      >
        {parts.map((p, i) => (
          <motion.div
            key={p.key}
            className={`${p.color} h-full origin-left first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${(p.value / total) * 100}%`, minWidth: p.value > 0 ? 6 : 0 }}
            initial={animateIn && !reduce ? { scaleX: 0 } : false}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.9, delay: animateIn ? 0.15 + i * 0.12 : 0, ease: [0.23, 1, 0.32, 1] }}
            title={`${p.label}: ${formatINR(p.value)}`}
          />
        ))}
      </div>
      {!compact && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {parts.map((p) => (
            <li key={p.key} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${p.color}`} aria-hidden />
              <span className="text-slate">{p.label}</span>
              <span className="tnum font-medium text-ink">{formatINR(p.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
