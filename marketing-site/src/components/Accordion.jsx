import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'

export function AccordionItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="text-lg font-medium text-ink transition-colors duration-200 group-hover:text-lapis md:text-xl">{q}</span>
          <span
            className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-out-strong)] ${
              open ? 'rotate-45 border-ink bg-ink text-white' : 'border-line-strong text-ink group-hover:border-ink'
            }`}
            aria-hidden
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[68ch] pb-7 text-slate">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items }) {
  return (
    <div className="border-t border-line">
      {items.map((it) => (
        <AccordionItem key={it.q} {...it} />
      ))}
    </div>
  )
}
