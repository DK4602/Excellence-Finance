import { Navigate, useLocation } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/ui'
import { useTitle } from '../lib/useTitle'

const methodText = { call: 'by phone', whatsapp: 'on WhatsApp', email: 'by email' }

export default function EnquiryConfirmed() {
  useTitle('Enquiry received')
  const { state } = useLocation()
  const reduce = useReducedMotion()
  if (!state?.ref) return <Navigate to="/contact" replace />

  const next = [
    'An adviser reviews your enquiry.',
    `We contact you ${methodText[state.method] ?? 'by your chosen method'} to understand what you need.`,
    'If it helps, we compare lenders with you and explain the full cost of each.',
  ]

  return (
    <section className="wrap grid min-h-[70svh] place-items-center py-20">
      <div className="max-w-2xl text-center">
        <svg viewBox="0 0 64 64" className="mx-auto size-16" aria-hidden>
          <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
          <motion.path
            d="M20 33 l8 8 l16 -18"
            fill="none"
            stroke="var(--color-brass)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          />
        </svg>
        <h1 className="mt-8 font-display text-[2.6rem] leading-tight md:text-[3.75rem]">
          Thank you, {state.name}. We have your enquiry.
        </h1>
        <p className="mt-5 text-lg text-slate">
          Reference <span className="tnum font-medium text-ink">{state.ref}</span>. Keep it handy if you contact us.
        </p>
        <ol className="mx-auto mt-12 max-w-md space-y-4 text-left">
          {next.map((n, i) => (
            <li key={n} className="flex gap-4">
              <span className="figure grid size-7 shrink-0 place-items-center rounded-full bg-ink text-sm text-white">{i + 1}</span>
              <span className="text-slate">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-md text-sm text-slate">
          This is not a loan application, and it does not mean a loan has been approved. The lender makes that decision after its own assessment.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/compare" variant="secondary">Compare lenders meanwhile</Button>
          <Button to="/">Back to home</Button>
        </div>
      </div>
    </section>
  )
}
