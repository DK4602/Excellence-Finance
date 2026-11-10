import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { loans, loanById } from '../data/loans'
import { scoreBands, employmentTypes } from '../data/site'
import { formatLakh, formatTenure } from '../lib/finance'
import { submitEnquiry, newIdempotencyKey } from '../lib/api'
import { Checkbox, Field, Input, Select, Textarea, Segmented } from './fields'
import Dropdown from './Dropdown'
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
  if (v.amount && !(Number(v.amount) > 0)) e.amount = 'Enter an amount above ₹0, or leave it blank.'
  if (v.message.length > 1000) e.message = 'Keep your message under 1,000 characters.'
  if (!v.consent) e.consent = 'Please agree so we can contact you about this enquiry.'
  return e
}

// Server field names → form field names
const SERVER_FIELD = { loan_type: 'loan', name: 'name', mobile: 'mobile', city: 'city', amount: 'amount', message: 'message', consent: 'consent' }
const FIELD_ID = { name: 'f-name', mobile: 'f-mobile', loan: 'f-loan', city: 'f-city', amount: 'f-amount', message: 'f-msg', consent: 'f-consent' }

const loanOptions = loans.map((l) => ({ value: l.id, label: l.name }))

/**
 * variant 'full'    – Contact page: optional details panel with tenure, score, employment, contact method
 * variant 'compact' – Homepage: the required fields plus optional amount and message
 * preset            – { loan, nonce } from an "Enquire Now" button; nonce lets the same loan be re-applied
 */
export default function EnquiryForm({ variant = 'full', preset, source }) {
  const compact = variant === 'compact'
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
  const [serverErrors, setServerErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' }) // idle | sending | error
  const sending = useRef(false)
  const idempotencyKey = useRef(newIdempotencyKey())

  // Apply a loan type chosen from an "Enquire Now" button elsewhere on the page
  useEffect(() => {
    if (preset?.loan && loanById[preset.loan]) setV((s) => ({ ...s, loan: preset.loan }))
  }, [preset?.loan, preset?.nonce])

  const errors = validate(v)
  const show = (k) => ((touched[k] || touched._submit) && errors[k]) || serverErrors[k]

  const update = (k, value) => {
    setV((s) => ({ ...s, [k]: value }))
    if (serverErrors[k]) setServerErrors(({ [k]: _drop, ...rest }) => rest)
  }
  const set = (k) => (e) => update(k, e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e)
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  async function onSubmit(e) {
    e.preventDefault()
    if (sending.current) return // blocks double clicks and repeat Enter presses
    setTouched((t) => ({ ...t, _submit: true }))
    const firstBad = ['name', 'mobile', 'loan', 'city', 'amount', 'message', 'consent'].find((k) => errors[k])
    if (firstBad) {
      document.getElementById(FIELD_ID[firstBad])?.focus()
      return
    }
    sending.current = true
    setStatus({ state: 'sending', message: '' })
    setServerErrors({})

    const payload = {
      name: v.name.trim(),
      mobile: cleanMobile(v.mobile),
      loan_type: v.loan,
      city: v.city.trim(),
      amount: v.amount ? Number(v.amount) : null,
      message: v.message.trim() || null,
      consent: v.consent,
      source_page: window.location.pathname,
      source: source ?? context.source ?? null,
      context: Object.keys(context).length ? context : null,
      website: v.website,
      ...(compact
        ? {}
        : {
            tenure_months: v.tenure ? Number(v.tenure) : null,
            credit_score_band: v.score || null,
            employment_type: v.employment || null,
            contact_method: v.method,
          }),
    }

    try {
      const { reference } = await submitEnquiry(payload, idempotencyKey.current)
      navigate('/enquiry/confirmed', {
        state: { ref: reference, name: v.name.trim().split(' ')[0], method: compact ? undefined : v.method },
      })
    } catch (err) {
      sending.current = false
      if (err.kind === 'validation') {
        const mapped = {}
        for (const [k, msg] of Object.entries(err.fieldErrors)) if (SERVER_FIELD[k]) mapped[SERVER_FIELD[k]] = msg
        setServerErrors(mapped)
        const first = Object.keys(mapped)[0]
        if (first) document.getElementById(FIELD_ID[first])?.focus()
      }
      setStatus({ state: 'error', message: err.message })
    }
  }

  const hasContext = context.lender || context.amount
  const busy = status.state === 'sending'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Enquiry form" aria-busy={busy}>
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
          {compact ? (
            <Dropdown
              id="f-loan"
              labelId="f-loan-label"
              value={v.loan}
              onChange={(val) => update('loan', val)}
              onBlur={blur('loan')}
              options={loanOptions}
              placeholder="Choose a loan"
              error={show('loan')}
            />
          ) : (
            <Select id="f-loan" value={v.loan} onChange={set('loan')} onBlur={blur('loan')} error={show('loan')} options={loanOptions} placeholder="Choose a loan" />
          )}
        </Field>
        <Field label="City or town" id="f-city" error={show('city')}>
          <Input id="f-city" autoComplete="address-level2" maxLength={60} value={v.city} onChange={set('city')} onBlur={blur('city')} error={show('city')} />
        </Field>

        {compact && (
          <>
            <Field label="Loan amount (₹)" id="f-amount" optional error={show('amount')} hint={!show('amount') && Number(v.amount) > 0 ? formatLakh(Number(v.amount)) : null}>
              <Input id="f-amount" inputMode="numeric" value={v.amount} onChange={(e) => update('amount', e.target.value.replace(/\D/g, ''))} onBlur={blur('amount')} error={show('amount')} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Message" id="f-msg" optional error={show('message')}>
                <Textarea id="f-msg" maxLength={1000} rows={3} value={v.message} onChange={set('message')} placeholder="Anything that would help us prepare. Please don’t include PAN, Aadhaar or bank details." />
              </Field>
            </div>
          </>
        )}
      </div>

      {!compact && (
        <details className="group rounded-2xl border border-line" open={!!hasContext}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-medium [&::-webkit-details-marker]:hidden">
            More details <span className="text-sm font-normal text-slate">Optional, helps us prepare</span>
          </summary>
          <div className="grid gap-6 border-t border-line p-5 md:grid-cols-2">
            <Field label="Loan amount (₹)" id="f-amount" optional error={show('amount')}>
              <Input id="f-amount" inputMode="numeric" value={v.amount} onChange={(e) => update('amount', e.target.value.replace(/\D/g, ''))} error={show('amount')} />
            </Field>
            <Field label="Preferred tenure (months)" id="f-tenure" optional>
              <Input id="f-tenure" inputMode="numeric" value={v.tenure} onChange={(e) => update('tenure', e.target.value.replace(/\D/g, ''))} />
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
      )}

      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
      </div>

      <div>
        <Checkbox id="f-consent" checked={v.consent} onChange={set('consent')} error={show('consent')}>
          I agree to be contacted by Excellence Finance about this enquiry, and I have read the{' '}
          <Link to="/privacy" className="text-lapis underline">Privacy Policy</Link>.
        </Checkbox>
        {show('consent') && <p id="f-consent-error" role="alert" className="mt-1.5 text-sm text-danger">{show('consent')}</p>}
      </div>

      <div aria-live="polite">
        {status.state === 'error' && (
          <p role="alert" className="rounded-xl bg-danger/8 px-4 py-3 text-sm text-danger">
            {status.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={busy}>
        {busy ? (<><Loader2 className="size-4 animate-spin" aria-hidden />Sending enquiry</>) : 'Send enquiry'}
      </Button>
      <p className="text-xs text-slate">Sending an enquiry does not apply for a loan or affect your credit score.</p>
    </form>
  )
}
