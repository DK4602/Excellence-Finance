import { Link } from 'react-router'
import { ArrowUpRight, Info } from 'lucide-react'

const base =
  'press inline-flex items-center justify-center gap-2 rounded-full text-center font-medium leading-tight select-none sm:whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none'
const sizes = {
  md: 'min-h-12 px-6 py-2.5 text-[0.98rem]',
  sm: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-14 px-8 py-3 text-base',
}
const variants = {
  primary: 'bg-ink text-white hover:bg-lapis shadow-[0_8px_20px_-10px_rgb(19_35_92/0.6)]',
  secondary: 'border border-line-strong text-ink hover:border-ink bg-white',
  light: 'bg-white text-ink hover:bg-sky',
  ghostLight: 'border border-white/30 text-white hover:border-white hover:bg-white/5',
}

export function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button className={cls} {...rest}>{children}</button>
}

export function TextLink({ to, children, className = '' }) {
  return (
    <Link to={to} className={`group inline-flex min-h-11 items-center gap-1.5 font-medium text-lapis ${className}`}>
      <span className="link-draw pb-0.5">{children}</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  )
}

export function Note({ children, className = '' }) {
  return (
    <p className={`flex gap-2.5 text-sm leading-relaxed text-slate ${className}`}>
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brass-ink" />
      <span>{children}</span>
    </p>
  )
}

// "8 Nov 2026", or "8–10 Nov 2026" when lenders were checked over a few days
export function checkedLabel(date, until) {
  const f = (x, o) => new Date(x + 'T00:00:00').toLocaleDateString('en-IN', o)
  const full = { day: 'numeric', month: 'short', year: 'numeric' }
  if (!until || until === date) return f(date, full)
  if (date.slice(0, 7) === until.slice(0, 7)) return `${f(date, { day: 'numeric' })}–${f(until, full)}`
  return `${f(date, full)} to ${f(until, full)}`
}

export function DataBadge({ date, until }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky px-3 py-1 text-xs font-medium text-ink">
      <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
      Lenders’ published rates, checked {checkedLabel(date, until)}
    </span>
  )
}

export function PageHead({ title, children, aside }) {
  return (
    <header className="wrap pt-14 pb-12 md:pt-24 md:pb-16">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h1 className="font-display text-[2.4rem] leading-[1.08] md:text-[3.5rem]">{title}</h1>
          {children && <div className="mt-6 max-w-[58ch] text-lg text-slate">{children}</div>}
        </div>
        {aside && <div className="md:col-span-4">{aside}</div>}
      </div>
    </header>
  )
}
