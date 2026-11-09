import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'

// Accessible custom select (WAI-ARIA "select-only combobox" pattern).
// options: [{ value, label }]. onChange receives the chosen value.
export default function Dropdown({ id, value, onChange, onBlur, options, placeholder = 'Choose an option', error, labelId }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const typeahead = useRef({ text: '', at: 0 })
  const reduce = useReducedMotion()
  const listId = useId()
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActive(index)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const choose = (i) => {
    if (i >= 0 && options[i]) onChange(options[i].value)
    close()
  }

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        close()
        onBlur?.()
      }
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, onBlur])

  // Keep the active option in view
  useEffect(() => {
    if (open && active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (e) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList(e.key === 'ArrowUp' ? Math.max(selectedIndex, 0) : undefined)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((a) => Math.min(a + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Tab':
        close()
        break
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const t = typeahead.current
          t.text = Date.now() - t.at < 600 ? t.text + e.key.toLowerCase() : e.key.toLowerCase()
          t.at = Date.now()
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text))
          if (i >= 0) setActive(i)
        }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId ? `${labelId} ${id}` : undefined}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!rootRef.current?.contains(e.relatedTarget) && !open) onBlur?.()
        }}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:border-lapis focus-visible:ring-4 focus-visible:ring-lapis/12 ${
          error ? 'border-danger ring-danger/10' : open ? 'border-lapis ring-4 ring-lapis/12' : 'border-line-strong hover:border-slate/60'
        }`}
      >
        <span className={`truncate ${selected ? 'text-ink' : 'text-slate/80'}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-slate transition-transform duration-200 ease-[var(--ease-out-strong)] ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-72 overflow-auto rounded-xl border border-line bg-white p-1.5 shadow-[var(--shadow-lift)]"
          >
            {options.map((o, i) => {
              const isSelected = o.value === value
              return (
                <li
                  key={o.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActive(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                    i === active ? 'bg-sky text-ink' : 'text-ink'
                  } ${isSelected ? 'font-semibold' : ''}`}
                >
                  {o.label}
                  {isSelected && <Check aria-hidden className="size-4 shrink-0 text-lapis" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
