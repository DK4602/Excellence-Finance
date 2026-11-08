import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { loans, loanById } from '../data/loans'
import { formatINR, formatLakh, loanTotals, yearlySchedule } from '../lib/finance'
import { Field, Input, Select, Segmented } from '../components/fields'
import { Button, Note, PageHead } from '../components/ui'
import AnimatedNumber from '../components/AnimatedNumber'
import CostBar from '../components/CostBar'
import { useTitle } from '../lib/useTitle'

function validate({ amount, rate, tenure, unit }) {
  const e = {}
  const months = unit === 'years' ? tenure * 12 : tenure
  if (!(amount > 0)) e.amount = 'Enter a loan amount above ₹0.'
  else if (amount > 1e9) e.amount = 'Enter an amount up to ₹100 crore.'
  if (rate === '' || Number.isNaN(rate) || rate < 0) e.rate = 'Enter an interest rate of 0% or more.'
  else if (rate > 50) e.rate = 'Enter a rate up to 50% p.a.'
  if (!(months >= 1) || !Number.isInteger(months)) e.tenure = unit === 'years' ? 'Enter a whole number of years, at least 1.' : 'Enter a whole number of months, at least 1.'
  else if (months > 480) e.tenure = 'Enter a tenure up to 40 years.'
  return { e, months }
}

export default function EmiCalculator() {
  useTitle('EMI calculator', 'Calculate your monthly EMI, total interest and total repayment, with a year-by-year split of principal and interest.')
  const [params] = useSearchParams()
  const start = loanById[params.get('type')] ?? loanById.home
  const [type, setType] = useState(start.id)
  const [amount, setAmount] = useState(String(start.amount.default))
  const [rate, setRate] = useState(String(start.rate.default))
  const [tenure, setTenure] = useState(String(start.tenure.default / 12))
  const [unit, setUnit] = useState('years')
  const [charges, setCharges] = useState('')

  const parsed = { amount: Number(amount), rate: rate === '' ? '' : Number(rate), tenure: Number(tenure), unit }
  const { e: errors, months } = validate(parsed)
  const valid = Object.keys(errors).length === 0

  const totals = useMemo(() => (valid ? loanTotals(parsed.amount, parsed.rate, months) : null), [valid, parsed.amount, parsed.rate, months])
  const schedule = useMemo(() => (valid ? yearlySchedule(parsed.amount, parsed.rate, months) : []), [valid, parsed.amount, parsed.rate, months])
  const extra = Math.max(0, Number(charges) || 0)

  const pickType = (id) => {
    const l = loanById[id]
    setType(id)
    setAmount(String(l.amount.default))
    setRate(String(l.rate.default))
    setTenure(unit === 'years' ? String(l.tenure.default / 12) : String(l.tenure.default))
  }

  const switchUnit = (u) => {
    if (u === unit) return
    const t = Number(tenure)
    setTenure(u === 'months' ? String(Math.round(t * 12)) : String(+(t / 12).toFixed(1)))
    setUnit(u)
  }

  const enquiry = valid ? `/contact?${new URLSearchParams({ loan: type, amount: parsed.amount, months, rate: parsed.rate, source: 'emi-calculator' })}` : '/contact'

  return (
    <>
      <PageHead title="EMI calculator">
        Your monthly instalment on a regular reducing-balance loan, how much of it is interest, and what you repay in total.
      </PageHead>

      <section className="wrap grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12">
        <form className="space-y-6 rounded-[20px] bg-mist p-6 md:p-8 lg:col-span-5" onSubmit={(e) => e.preventDefault()} noValidate aria-label="EMI inputs">
          <Field label="Loan type" id="emi-type" hint="Fills typical values. You can change any of them.">
            <Select id="emi-type" value={type} onChange={(e) => pickType(e.target.value)}>
              {loans.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </Select>
          </Field>
          <Field label="Loan amount (₹)" id="emi-amount" error={errors.amount} hint={!errors.amount && parsed.amount > 0 ? formatLakh(parsed.amount) : null}>
            <Input id="emi-amount" inputMode="numeric" value={amount} error={errors.amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} />
          </Field>
          <Field label="Annual interest rate (%)" id="emi-rate" error={errors.rate}>
            <Input id="emi-rate" inputMode="decimal" value={rate} error={errors.rate} onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))} />
          </Field>
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <Field label="Tenure" id="emi-tenure" error={errors.tenure}>
              <Input id="emi-tenure" inputMode="decimal" value={tenure} error={errors.tenure} onChange={(e) => setTenure(e.target.value.replace(/[^\d.]/g, ''))} />
            </Field>
            <div className={errors.tenure ? 'mb-7' : ''}>
              <Segmented label={<span className="sr-only">Tenure unit</span>} name="unit" value={unit} onChange={switchUnit} options={[{ value: 'years', label: 'Years' }, { value: 'months', label: 'Months' }]} />
            </div>
          </div>
          <Field label="Lender charges (₹)" id="emi-charges" optional hint="Processing, legal or other one-time fees. Shown separately from your EMI.">
            <Input id="emi-charges" inputMode="numeric" value={charges} onChange={(e) => setCharges(e.target.value.replace(/[^\d]/g, ''))} placeholder="0" />
          </Field>
        </form>

        <div className="lg:col-span-7">
          {valid && totals ? (
            <div className="rounded-[20px] border border-line p-6 md:p-10">
              <p className="text-sm text-slate">Monthly EMI</p>
              <AnimatedNumber value={totals.emi} format={formatINR} className="tnum figure mt-2 block  text-[3.25rem] leading-none md:text-[4.5rem]" />
              <dl className="tnum mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-slate">Principal</dt>
                  <dd className="mt-1 text-xl font-medium">{formatINR(parsed.amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate">Total interest</dt>
                  <dd className="mt-1 text-xl font-medium"><AnimatedNumber value={totals.totalInterest} format={formatINR} /></dd>
                </div>
                <div>
                  <dt className="text-sm text-slate">Total repayment</dt>
                  <dd className="mt-1 text-xl font-medium"><AnimatedNumber value={totals.totalRepayment} format={formatINR} /></dd>
                </div>
              </dl>
              {extra > 0 && (
                <p className="tnum mt-6 rounded-xl bg-brass-pale px-4 py-3 text-sm text-brass-ink">
                  Plus {formatINR(extra)} in one-time lender charges, paid separately from your EMIs. Total outlay {formatINR(totals.totalRepayment + extra)}.
                </p>
              )}
              <div className="mt-8">
                <CostBar principal={parsed.amount} interest={totals.totalInterest} fees={extra} />
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button to={enquiry}>Get help with this loan</Button>
                <Button to={`/compare?${new URLSearchParams({ type, amount: parsed.amount, months })}`} variant="secondary">Compare lenders</Button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center rounded-[20px] border border-dashed border-line-strong p-10 text-center">
              <div>
                <p className="font-display text-[1.6rem]">Check the highlighted fields</p>
                <p className="mt-2 text-slate">Your EMI appears here as soon as the amount, rate and tenure are valid.</p>
              </div>
            </div>
          )}
          <Note className="mt-6">
            Estimate only. Your lender’s schedule may differ because of floating-rate changes, broken-period interest, staged disbursements or other charges.
          </Note>
        </div>
      </section>

      {valid && schedule.length > 0 && <ScheduleChart schedule={schedule} />}
    </>
  )
}

function ScheduleChart({ schedule }) {
  const [view, setView] = useState('chart')
  const [hover, setHover] = useState(null)
  const max = Math.max(...schedule.map((y) => y.principal + y.interest))
  const dense = schedule.length > 20

  return (
    <section className="border-t border-line py-20 md:py-24" aria-labelledby="schedule-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="schedule-title" className="font-display text-[2.2rem] leading-tight md:text-[2.75rem]">Principal and interest by year</h2>
            <p className="mt-2 max-w-[60ch] text-slate">Early EMIs are mostly interest. As the balance falls, more of each EMI goes to principal.</p>
          </div>
          <Segmented label={<span className="sr-only">View</span>} name="view" value={view} onChange={setView} options={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
        </div>

        {view === 'chart' ? (
          <div className="mt-10">
            <ul className="mb-5 flex gap-6 text-sm">
              <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-principal" aria-hidden />Principal</li>
              <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-interest" aria-hidden />Interest</li>
            </ul>
            <div className="relative">
              <div className="flex h-64 items-end gap-[2px] border-b border-line-strong md:h-80" onMouseLeave={() => setHover(null)}>
                {schedule.map((y, i) => {
                  const total = y.principal + y.interest
                  return (
                    <button
                      key={y.year}
                      type="button"
                      className="group relative flex h-full flex-1 flex-col justify-end focus-visible:outline-offset-0"
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                      aria-label={`Year ${y.year}: principal ${formatINR(y.principal)}, interest ${formatINR(y.interest)}`}
                    >
                      <span className="flex w-full flex-col gap-[2px] transition-opacity duration-150" style={{ height: `${(total / max) * 100}%`, opacity: hover == null || hover === i ? 1 : 0.45 }}>
                        <span className="w-full rounded-t-[4px] bg-interest" style={{ flexGrow: y.interest }} />
                        <span className="w-full bg-principal" style={{ flexGrow: y.principal }} />
                      </span>
                    </button>
                  )
                })}
              </div>
              {hover != null && (
                <div
                  className="tnum pointer-events-none absolute top-3 z-10 w-52 rounded-xl bg-ink p-3 text-xs text-white shadow-[var(--shadow-lift)]"
                  style={{ left: `clamp(0px, calc(${((hover + 0.5) / schedule.length) * 100}% - 104px), calc(100% - 208px))` }}
                  role="status"
                >
                  <p className="font-medium">Year {schedule[hover].year}</p>
                  <p className="mt-1 flex justify-between"><span className="text-white/70">Principal</span>{formatINR(schedule[hover].principal)}</p>
                  <p className="flex justify-between"><span className="text-white/70">Interest</span>{formatINR(schedule[hover].interest)}</p>
                  <p className="mt-1 flex justify-between border-t border-white/15 pt-1"><span className="text-white/70">Balance</span>{formatINR(schedule[hover].balance)}</p>
                </div>
              )}
              <div className="tnum mt-2 flex justify-between text-xs text-slate">
                <span>Year 1</span>
                {!dense && schedule.length > 2 && <span>Year {Math.ceil(schedule.length / 2)}</span>}
                <span>Year {schedule.length}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 max-h-[28rem] overflow-auto rounded-2xl border border-line">
            <table className="tnum w-full text-left text-sm">
              <thead className="sticky top-0 bg-mist text-slate">
                <tr>
                  <th className="px-4 py-3 font-normal">Year</th>
                  <th className="px-4 py-3 text-right font-normal">Principal paid</th>
                  <th className="px-4 py-3 text-right font-normal">Interest paid</th>
                  <th className="px-4 py-3 text-right font-normal">Balance at year end</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((y) => (
                  <tr key={y.year} className="border-t border-line">
                    <td className="px-4 py-2.5">{y.year}</td>
                    <td className="px-4 py-2.5 text-right">{formatINR(y.principal)}</td>
                    <td className="px-4 py-2.5 text-right">{formatINR(y.interest)}</td>
                    <td className="px-4 py-2.5 text-right">{formatINR(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
