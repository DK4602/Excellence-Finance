import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { loans, loanById } from '../data/loans'
import { scoreBands, employmentTypes } from '../data/site'
import { formatLakh, formatTenure } from '../lib/finance'
import { Field, Input, Select, Textarea, Segmented } from './fields'
import { Button } from './ui'

const MOBILE = /^[6-9]\d{9}$/

function cleanMobile(v) {
  return v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
}

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Enter your full name.'
  else if (v.name.length > 80) e.name = 'Use 80 characters or fewer.'
  if (!MOBILE.test(cleanMobile(v.mobile))) e.mobile = 'Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.'
  if (!v.loan) e.loan = 'Choose the loan you are interested in.'
  if (v.city.trim().length < 2) e.city = 'Enter your city or town.'
  else if (v.city.length > 60) e.city = 'Use 60 characters or fewer.'
  if (v.message.length > 1000) e.message = 'Keep your message under 1,000 characters.'
  if (!v.consent) e.consent = 'Please agree so we can contact you about this enquiry.'
  return e
}

// In production this posts to Laravel, which validates again, saves to MySQL
// and only then triggers notifications. Here we simulate that round trip.
async function submitEnquiry(payload) {
  await new Promise((r) => setTimeout(r, 900))
  if (payload.website) throw new Error('spam')
  const ref = 'EF-' + Date.now().toString(36).toUpperCase().slice(-6)
  return { ref }
}

export default function EnquiryForm() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const context = useMemo(() => {
    const c = {}
    for (const k of ['amount', 'months', 'rate', 'lender', 'product', 'source', 'score', 'employment']) {
      if (params.get(k)) c[k] = params.get(k)
    }
    return c
  }, [params])

  const [v, setV] = useState({
    name: '',
    mobile: '',
    loan: loanById[params.get('loan')] ? params.get('loan') : '',
    city: '',
    amount: context.amount ?? '',
    tenure: context.months ?? '',
    score: scoreBands.some((b) => b.id === context.score) ? context.score : '',
    employment: context.employment ?? '',
    method: 'call',
    message: '',
    consent: false,
    website: '', // honeypot
  })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | error
  const sending = useRef(false)
  const errors = validate(v)
  const show = (k) => (touched[k] || touched._submit) && errors[k]

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }))
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  async function onSubmit(e) {
    e.preventDefault()
    setTouched((t) => ({ ...t, _submit: true }))
    const order = ['name', 'mobile', 'loan', 'city', 'message', 'consent']
    const firstBad = order.find((k) => errors[k])
    if (firstBad) {
      const ids = { name: 'f-name', mobile: 'f-mobile', loan: 'f-loan', city: 'f-city', message: 'f-msg', consent: 'f-consent' }
      document.getElementById(ids[firstBad])?.focus()
      return
    }
    if (sending.current) return
    sending.current = true
    setStatus('sending')
    try {
      const { ref } = await submitEnquiry({ ...v, mobile: cleanMobile(v.mobile), context, page: window.location.pathname })
      navigate('/enquiry/confirmed', { state: { ref, name: v.name.trim().split(' ')[0], method: v.method } })
    } catch {
      setStatus('error')
      sending.current = false
    }
  }

  const hasContext = context.lender || context.amount

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Enquiry form">
      <AnimatePresence>
        {hasContext && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sky p-5 text-sm">
            <p className="font-medium text-ink">Details carried over</p>
            <p className="mt-1 text-slate">
              {[
                context.lender && `${context.lender}${context.product ? `, ${context.product}` : ''}`,
                context.amount && formatLakh(Number(context.amount)),
                context.months && formatTenure(Number(context.months)),
                context.rate && `${context.rate}% p.a.`,
              ].filter(Boolean).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Full name" id="f-name" error={show('name')}>
          <Input id="f-name" autoComplete="name" maxLength={80} value={v.name} onChange={set('name')} onBlur={blur('name')} error={show('name')} />
        </Field>
        <Field label="Mobile number" id="f-mobile" error={show('mobile')} hint="10 digits, e.g. 98XXXXXXXX">
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate">+91</span>
            <Input id="f-mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} className="pl-14" value={v.mobile} onChange={set('mobile')} onBlur={blur('mobile')} error={show('mobile')} />
          </div>
        </Field>
        <Field label="Loan type" id="f-loan" error={show('loan')}>
          <Select id="f-loan" value={v.loan} onChange={set('loan')} onBlur={blur('loan')} error={show('loan')}>
            <option value="">Choose a loan</option>
            {loans.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
        </Field>
        <Field label="City or town" id="f-city" error={show('city')}>
          <Input id="f-city" autoComplete="address-level2" maxLength={60} value={v.city} onChange={set('city')} onBlur={blur('city')} error={show('city')} />
        </Field>
      </div>

      <details className="group rounded-2xl border border-line" open={!!hasContext}>
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-medium [&::-webkit-details-marker]:hidden">
          More details <span className="text-sm font-normal text-slate">Optional, helps us prepare</span>
        </summary>
        <div className="grid gap-6 border-t border-line p-5 md:grid-cols-2">
          <Field label="Loan amount (₹)" id="f-amount" optional>
            <Input id="f-amount" inputMode="numeric" value={v.amount} onChange={(e) => setV((s) => ({ ...s, amount: e.target.value.replace(/\D/g, '') }))} />
          </Field>
          <Field label="Preferred tenure (months)" id="f-tenure" optional>
            <Input id="f-tenure" inputMode="numeric" value={v.tenure} onChange={(e) => setV((s) => ({ ...s, tenure: e.target.value.replace(/\D/g, '') }))} />
          </Field>
          <Field label="Credit score range" id="f-score" optional>
            <Select id="f-score" value={v.score} onChange={set('score')}>
              <option value="">Prefer not to say</option>
              {scoreBands.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </Select>
          </Field>
          <Field label="Employment or business type" id="f-emp" optional>
            <Select id="f-emp" value={v.employment} onChange={set('employment')}>
              <option value="">Prefer not to say</option>
              {employmentTypes.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Segmented
              label="How should we contact you?"
              name="method"
              value={v.method}
              onChange={set('method')}
              options={[{ value: 'call', label: 'Phone call' }, { value: 'whatsapp', label: 'WhatsApp' }, { value: 'email', label: 'Email' }]}
            />
          </div>
          <div className="md:col-span-2">
            <Field label="Anything else we should know?" id="f-msg" optional error={show('message')}>
              <Textarea id="f-msg" maxLength={1000} value={v.message} onChange={set('message')} placeholder="Please don’t include PAN, Aadhaar or bank details." />
            </Field>
          </div>
        </div>
      </details>

      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
      </div>

      <div>
        <label className="flex cursor-pointer gap-3 text-sm leading-relaxed">
          <input
            id="f-consent"
            type="checkbox"
            checked={v.consent}
            onChange={set('consent')}
            aria-invalid={!!show('consent')}
            aria-describedby={show('consent') ? 'f-consent-error' : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
          />
          <span className="text-slate">
            I agree to be contacted by Excellence Finance about this enquiry by my chosen method, and I have read the{' '}
            <Link to="/privacy" className="text-lapis underline">Privacy Policy</Link>.
          </span>
        </label>
        {show('consent') && <p id="f-consent-error" role="alert" className="mt-1.5 text-sm text-danger">{errors.consent}</p>}
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-danger/8 px-4 py-3 text-sm text-danger">
          Your enquiry was not sent. Check your connection and try again, or email us directly.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? (<><Loader2 className="size-4 animate-spin" aria-hidden />Sending enquiry</>) : 'Send enquiry'}
      </Button>
      <p className="text-xs text-slate">Sending an enquiry does not apply for a loan or affect your credit score.</p>
    </form>
  )
}
