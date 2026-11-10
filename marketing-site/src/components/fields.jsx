import { Children, isValidElement, useId } from 'react'
import { Check } from 'lucide-react'
import Dropdown from './Dropdown'

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
        className="range mt-0.5"
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
      <label id={`${id}-label`} htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
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

// The site's select: the custom Dropdown (accessible combobox) behind the
// familiar <Select><option/></Select> API. onChange receives { target: { value } }
// so handlers written for a native select keep working. Pass `options`
// ([{ value, label }]) instead of children if that is simpler.
export function Select({ id, value, onChange, onBlur, error, children, options, placeholder }) {
  const list =
    options ??
    Children.toArray(children)
      .filter((c) => isValidElement(c) && c.type === 'option')
      .map((c) => {
        const label = Children.toArray(c.props.children).join('')
        return { value: c.props.value ?? label, label }
      })
  // An empty-value option acts as the "nothing chosen" placeholder
  const empty = list.find((o) => o.value === '')
  return (
    <Dropdown
      id={id}
      labelId={`${id}-label`}
      value={value}
      onChange={(v) => onChange?.({ target: { value: v } })}
      onBlur={onBlur}
      options={list}
      placeholder={placeholder ?? empty?.label}
      error={error}
    />
  )
}

// Custom checkbox: the native input stays (visually hidden) for keyboard,
// forms and screen readers; the box is drawn to match the site's controls.
export function Checkbox({ id, checked, onChange, error, children, className = '' }) {
  return (
    <label htmlFor={id} className={`group flex cursor-pointer items-start gap-3 text-sm leading-relaxed ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-[background-color,border-color,box-shadow] duration-150 peer-focus-visible:ring-4 peer-focus-visible:ring-lapis/20 ${
          checked ? 'border-ink bg-ink text-white' : error ? 'border-danger bg-white' : 'border-line-strong bg-white group-hover:border-slate/60'
        }`}
      >
        <Check className={`size-3.5 transition-[opacity,transform] duration-150 ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} strokeWidth={3} />
      </span>
      <span className="text-slate">{children}</span>
    </label>
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
