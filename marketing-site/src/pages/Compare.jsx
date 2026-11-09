import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ChevronDown, AlertCircle, Check, ExternalLink } from 'lucide-react'
import { loans, loanById } from '../data/loans'
import { lenders, DATA_CHECKED } from '../data/lenders'
import { scoreBands, employmentTypes } from '../data/site'
import { buildOffers, sortOffers, sorters } from '../lib/compare'
import { describeFee, formatDate, formatINR, formatLakh, formatTenure } from '../lib/finance'
import { Field, RangeField, Select, Segmented } from '../components/fields'
import { Button, DataBadge, Note, PageHead } from '../components/ui'
import CostBar from '../components/CostBar'
import BankLogo from '../components/BankLogo'
import { useTitle } from '../lib/useTitle'

const ease = [0.23, 1, 0.32, 1]
const NA = 'Not available / Confirm with lender'

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v))
}

export default function Compare() {
  useTitle('Compare lenders', 'Compare indicative loan offers on rate, fees with GST, upfront charges, EMI and estimated total cost.')
  const [params] = useSearchParams()
  const initialType = loanById[params.get('type')] ? params.get('type') : 'home'
  const l0 = loanById[initialType]

  const [type, setType] = useState(initialType)
  const loan = loanById[type]
  const [amount, setAmount] = useState(clamp(Number(params.get('amount')) || l0.amount.default, l0.amount.min, l0.amount.max))
  const [months, setMonths] = useState(clamp(Number(params.get('months')) || l0.tenure.default, l0.tenure.min, l0.tenure.max))
  const [band, setBand] = useState('750-799')
  const [employment, setEmployment] = useState('')
  const [lenderIds, setLenderIds] = useState(() => {
    const b = params.get('bank')
    return b && lenders.some((l) => l.id === b) ? [b] : []
  })
  const [sortBy, setSortBy] = useState('cost')

  const changeType = (id) => {
    const l = loanById[id]
    setType(id)
    setAmount(l.amount.default)
    setMonths(l.tenure.default)
  }

  const toggleLender = (id) =>
    setLenderIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  const { offers, hidden } = useMemo(
    () => buildOffers({ category: type, amount, months, band, lenderIds }),
    [type, amount, months, band, lenderIds],
  )
  const sorted = useMemo(() => sortOffers(offers, sortBy), [offers, sortBy])
  const sliderMax = Math.min(loan.amount.max, loan.amount.default * 4)

  return (
    <>
      <PageHead title="Compare lenders on the whole cost" aside={<DataBadge date={DATA_CHECKED} />}>
        Each bank is estimated with the same amount and tenure, so the numbers line up. Rates and fees come from each bank’s own published rate cards, not from your credit report.
      </PageHead>

      <section className="wrap grid gap-10 pb-24 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-4">
          <form className="space-y-6 rounded-[20px] bg-mist p-6 md:p-8 lg:sticky lg:top-28" onSubmit={(e) => e.preventDefault()} aria-label="Comparison inputs">
            <Field label="Loan type" id="cmp-type">
              <Select id="cmp-type" value={type} onChange={(e) => changeType(e.target.value)}>
                {loans.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </Select>
            </Field>
            <RangeField label="Loan amount" value={clamp(amount, loan.amount.min, sliderMax)} min={loan.amount.min} max={sliderMax} step={loan.amount.step} onChange={setAmount} display={() => formatLakh(amount)} />
            <RangeField label="Tenure" value={months} min={loan.tenure.min} max={loan.tenure.max} step={loan.tenure.max > 120 ? 12 : 6} onChange={setMonths} display={formatTenure} />
            <Field label="Credit score range" id="cmp-score" hint="Self-reported. We do not check your credit report.">
              <Select id="cmp-score" value={band} onChange={(e) => setBand(e.target.value)}>
                {scoreBands.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </Select>
            </Field>
            <Field label="Employment" id="cmp-emp" optional>
              <Select id="cmp-emp" value={employment} onChange={(e) => setEmployment(e.target.value)}>
                <option value="">Prefer not to say</option>
                {employmentTypes.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm text-slate">Banks <span className="text-xs">(none selected shows all)</span></legend>
              <div className="grid grid-cols-3 gap-2">
                {lenders.map((l) => {
                  const on = lenderIds.includes(l.id)
                  return (
                    <button
                      key={l.id}
                      type="button"
                      aria-pressed={on}
                      title={l.name}
                      onClick={() => toggleLender(l.id)}
                      className={`press relative flex h-14 items-center justify-center rounded-xl bg-white p-2 ring-inset ${
                        on ? 'shadow-[var(--shadow-float)] ring-2 ring-ink' : 'ring-1 ring-line hover:ring-line-strong'
                      }`}
                    >
                      <img src={l.logo} alt={l.name} className={`block min-h-0 min-w-0 object-contain ${l.logoMarkOnly ? 'h-[85%] w-auto' : 'h-full w-full'}`} />
                      {on && (
                        <span aria-hidden className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-white">
                          <Check className="size-3" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </form>
        </aside>

        <div className="lg:col-span-8">
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[1.9rem] leading-tight">
                {loan.name}, {formatLakh(amount)} over {formatTenure(months)}
              </h2>
              <p className="mt-1 text-sm text-slate" aria-live="polite">
                {sorted.filter((o) => o.eligibleShape).length} indicative {sorted.filter((o) => o.eligibleShape).length === 1 ? 'offer' : 'offers'} for these inputs
              </p>
            </div>
            <Segmented
              label="Sort by"
              name="sort"
              value={sortBy}
              onChange={setSortBy}
              options={Object.entries(sorters).map(([value, s]) => ({ value, label: s.short }))}
            />
          </div>

          <Note className="mt-6">
            Sorted by {sorters[sortBy].label.toLowerCase()}
            {sortBy === 'cost' ? ', with banks whose fees are not fully published listed after the rest' : ''}
            {sortBy === 'upfront' ? ', with banks whose fees are not fully published listed last' : ''}. This is a comparison, not a recommendation: the right loan also depends on prepayment terms, rate type and the bank’s service.
            {band === 'unknown' && ' Because you don’t know your score, each rate is estimated cautiously from the upper part of the bank’s published rates.'}
          </Note>

          <LayoutGroup>
            {[
              { key: 'ranked', title: null, items: sorted.filter((o) => o.eligibleShape) },
              { key: 'starting', title: 'Banks that publish only a starting rate', note: 'These banks do not publish a range or score bands, so we cannot estimate your rate. The EMI shown uses the starting rate and is the best case; your rate is likely to be higher. They are not ranked with the estimates above.', items: sorted.filter((o) => o.startingOnly && o.bestCase) },
              { key: 'none', title: 'Not available for these inputs', items: sorted.filter((o) => !o.eligibleShape && !(o.startingOnly && o.bestCase)) },
            ].filter((g) => g.items.length).map((g) => (
              <div key={g.key} className={g.title ? 'mt-12' : ''}>
                {g.title && <h3 className="text-lg font-semibold">{g.title}</h3>}
                {g.note && <p className="mt-1 max-w-[70ch] text-sm text-slate">{g.note}</p>}
                <motion.ul layout className="mt-6 space-y-4">
                  <AnimatePresence initial={false}>
                    {g.items.map((o) => (
                      <OfferRow key={o.product.id} offer={o} amount={amount} months={months} type={type} band={band} employment={employment} />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </div>
            ))}
          </LayoutGroup>
          <Note className="mt-10">
            Bank names and logos are trademarks of their owners, shown only to identify whose published terms these are. Listing a bank here does not mean Excellence Finance has a partnership with it, and only the bank can approve a loan or confirm its rate.
          </Note>

          {sorted.length === 0 && (
            <div className="mt-8 rounded-[20px] border border-dashed border-line-strong p-10 text-center">
              <p className="font-display text-[1.6rem]">No lenders selected match this loan type.</p>
              <p className="mt-2 text-slate">Clear the lender filter to see every published offer, or ask an adviser to look for you.</p>
              <Button type="button" variant="secondary" className="mt-6" onClick={() => setLenderIds([])}>Show all lenders</Button>
            </div>
          )}

          {hidden > 0 && (
            <p className="mt-6 flex items-center gap-2 text-sm text-slate">
              <AlertCircle aria-hidden className="size-4 text-brass-ink" />
              {hidden} {hidden === 1 ? 'offer is' : 'offers are'} hidden because the published terms have expired or need re-checking.
            </p>
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-[20px] bg-sky p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-[1.6rem]">Not sure which to pick?</h2>
              <p className="mt-1 text-slate">An adviser can check these against your actual profile.</p>
            </div>
            <Button to={`/contact?${new URLSearchParams({ loan: type, amount, months, score: band, source: 'compare' })}`}>Ask for a general consultation</Button>
          </div>
        </div>
      </section>
    </>
  )
}

function OfferRow({ offer: o, amount, months, type, band, employment }) {
  const [open, setOpen] = useState(false)
  const p = o.product
  const enquire = new URLSearchParams({
    loan: type, amount, months, score: band, lender: o.lender.name, product: p.name, source: 'compare',
    ...(employment ? { employment } : {}),
  }).toString()

  const reason = o.outsideTenure
    ? `Tenure above this product’s maximum of ${formatTenure(p.maxTenure)}`
    : o.outsideAmount
      ? `Amount outside this product’s stated limits (${formatLakh(p.amount[0])} to ${formatLakh(p.amount[1])})`
      : 'Not offered for the selected credit-score range'

  const rateLabel = {
    bands: 'Rate for your score band',
    range: 'Estimated rate',
    'unknown-score': 'Cautious estimate',
    'unknown-score-range': 'Cautious estimate',
  }[o.basis]
  const rateSub = o.basis === 'bands'
    ? 'Published by the bank'
    : o.basis === 'range'
      ? `Placed within ${p.range[0]}% to ${p.range[1]}%`
      : `Advertised from ${p.advertisedMin}%`
  const feeSub = o.hasUnknownFees ? 'Some fees unconfirmed' : o.hasCeilingFees ? 'At published maximum, incl. GST' : o.upfrontGst ? 'Incl. GST' : null

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease, layout: { duration: 0.45, ease } }}
      className={`overflow-hidden rounded-[20px] border bg-white transition-shadow duration-300 ${
        o.eligibleShape ? 'border-line hover:shadow-[var(--shadow-float)]' : 'border-dashed border-line-strong'
      }`}
    >
      <div className="grid gap-6 p-6 md:p-7">
        <div className="flex items-start gap-4">
          <BankLogo lender={o.lender} size="sm" className="mt-0.5" />
          <div className="min-w-0">
            <p className="font-display text-[1.3rem] leading-tight">{o.lender.name}</p>
            <p className="mt-1 text-sm text-slate">{p.name}</p>
            <p className="mt-1 text-xs text-slate">{o.lender.kind}, {p.rateType.toLowerCase()} rate</p>
          </div>
        </div>

        {o.eligibleShape ? (
          <dl className="tnum grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Stat label={rateLabel} value={`${o.rate.toFixed(2)}%`} sub={rateSub} />
            <Stat label="Indicative EMI" value={formatINR(o.totals.emi)} />
            <Stat label="Upfront fees" value={formatINR(o.upfront)} sub={feeSub} />
            <Stat label="Est. total cost" value={formatINR(o.totalCost)} sub="Interest + fees" strong />
          </dl>
        ) : o.startingOnly && o.bestCase ? (
          <dl className="tnum grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <Stat label="Starting rate" value={`${p.advertisedMin}%`} sub="Only figure published" />
            <Stat label="EMI at starting rate" value={formatINR(o.bestCase.emi)} sub="Best case" />
            <Stat label="Upfront fees" value={formatINR(o.upfront)} sub={feeSub} />
          </dl>
        ) : (
          <p className="text-slate">{reason}. <span className="text-ink">Confirm with lender</span> or ask an adviser for alternatives.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5 md:px-7">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="press inline-flex min-h-10 items-center gap-2 text-sm font-medium text-lapis"
        >
          Fees, terms and source
          <ChevronDown aria-hidden className={`size-4 transition-transform duration-300 ease-[var(--ease-out-strong)] ${open ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate sm:inline">Checked {formatDate(p.verified)}</span>
          <Button to={`/contact?${enquire}`} size="sm">Enquire about this offer</Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-line bg-mist/60 p-6 md:grid-cols-2 md:p-7">
              <div>
                <h3 className="text-sm font-medium">Fees</h3>
                <table className="mt-3 w-full text-sm">
                  <tbody>
                    {o.fees.map((f) => (
                      <tr key={f.label} className="border-b border-line align-top">
                        <th scope="row" className="py-2.5 pr-4 text-left font-normal">
                          {f.label}
                          <span className="block text-xs text-slate">{describeFee(f)}</span>
                        </th>
                        <td className="tnum py-2.5 text-right font-medium whitespace-nowrap">
                          {f.amount ? formatINR(f.amount.total) : <span className="font-normal text-slate">Confirm</span>}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="pt-3 text-left font-medium">Estimated upfront total</th>
                      <td className="tnum pt-3 text-right font-medium">{formatINR(o.upfront)}</td>
                    </tr>
                  </tbody>
                </table>
                {o.totals && (
                  <div className="mt-6">
                    <CostBar principal={amount} interest={o.totals.totalInterest} fees={o.upfront} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium">Terms</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <Term k="Published rates" v={p.range[1] == null ? `From ${p.range[0]}% p.a. (no upper figure published)` : `${p.range[0]}% to ${p.range[1]}% p.a.`} />
                  {o.totals && <Term k="Total interest" v={formatINR(o.totals.totalInterest)} />}
                  {o.totals && <Term k="Total repayment" v={formatINR(o.totals.totalRepayment)} />}
                  <Term k="Prepayment / foreclosure" v={p.prepayment ?? NA} />
                  <Term k="Late payment" v={p.late ?? NA} />
                  {p.conditions.length > 0 && (
                    <Term k="Conditions" v={<ul className="list-disc space-y-1.5 pl-4">{p.conditions.map((c) => <li key={c}>{c}</li>)}</ul>} />
                  )}
                  <Term
                    k="Source"
                    v={
                      <ul className="space-y-1.5">
                        {p.sources.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 py-1 text-lapis underline decoration-lapis/30 underline-offset-2 hover:decoration-lapis">
                              {s.label}
                              <ExternalLink aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                              <span className="sr-only">(opens in a new tab)</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    }
                  />
                  <Term k="Effective from" v={p.effective ? formatDate(p.effective) : 'Not stated by the bank'} />
                  {p.validUntil && <Term k="Valid until" v={formatDate(p.validUntil)} />}
                  <Term k="Last checked" v={formatDate(p.verified)} />
                </dl>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function Stat({ label, value, sub, strong }) {
  return (
    <div>
      <dt className="text-xs text-slate">{label}</dt>
      <dd className={`mt-1 ${strong ? 'figure text-[1.15rem] leading-tight sm:text-[1.35rem]' : 'text-lg font-medium'}`}>{value}</dd>
      {sub && <dd className="mt-0.5 text-xs text-slate">{sub}</dd>}
    </div>
  )
}

function Term({ k, v }) {
  return (
    <div className="grid gap-1 border-b border-line pb-3">
      <dt className="text-slate">{k}</dt>
      <dd className={v === NA ? 'text-slate' : ''}>{v}</dd>
    </div>
  )
}
