import { useId } from 'react'
import { ChevronDown } from 'lucide-react'

export function RangeField({ label, value, min, max, step = 1, onChange, display, hint }) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-slate">{label}</label>
        <output htmlFor={id} className="tnum text-base font-medium text-ink">{display(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
    </div>
  )
}

const control =
  'block w-full h-12 rounded-xl border border-line-strong bg-white px-4 text-ink placeholder:text-slate/70 transition-[border-color,box-shadow] duration-200 hover:border-slate/60 focus:border-lapis focus:outline-none focus:ring-4 focus:ring-lapis/12 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/10'

export function Field({ label, optional, error, hint, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-slate">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ id, error, className = '', ...rest }) {
  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${control} ${className}`}
      {...rest}
    />
  )
}

export function Select({ id, error, children, className = '', ...rest }) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${control} appearance-none pr-10 ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate" />
    </div>
  )
}

export function Textarea({ id, className = '', ...rest }) {
  return <textarea id={id} className={`${control} h-auto min-h-28 py-3 ${className}`} {...rest} />
}

// Segmented single-choice, used for tenure chips and contact method
export function Segmented({ label, options, value, onChange, name }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm text-slate">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value
          return (
            <label
              key={o.value}
              className={`press cursor-pointer rounded-full border px-4 py-2 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lapis ${
                active ? 'border-ink bg-ink text-white' : 'border-line-strong bg-white text-ink hover:border-ink'
              }`}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={active}
                onChange={() => onChange(o.value)}
              />
              {o.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
