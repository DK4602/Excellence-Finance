import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Check } from 'lucide-react'
import { loanBySlug, loans } from '../data/loans'
import { products, lenderById, DATA_CHECKED, DATA_CHECKED_UNTIL } from '../data/lenders'
import { formatDate, formatINR, formatLakh, formatTenure, loanTotals } from '../lib/finance'
import { Button, Note, TextLink, DataBadge, checkedLabel } from '../components/ui'
import { RangeField } from '../components/fields'
import AnimatedNumber from '../components/AnimatedNumber'
import Photo from '../components/Photo'
import BankLogo from '../components/BankLogo'
import { photos } from '../data/photos'
import Accordion from '../components/Accordion'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

// Every loan page leads with its photograph
function LoanVisual({ loan }) {
  return (
    <div className="mt-10">
      <Photo photo={photos[loan.photo]} ratio={16 / 9} priority sizes="(min-width: 1024px) 55vw, 100vw" className="size-full rounded-3xl" />
    </div>
  )
}

function QuickEstimate({ loan, advertisedMin }) {
  const [amount, setAmount] = useState(loan.amount.default)
  const [months, setMonths] = useState(loan.tenure.default)
  const rate = loan.rate.default
  const t = useMemo(() => loanTotals(amount, rate, months), [amount, months, rate])
  const q = new URLSearchParams({ type: loan.id, amount, months }).toString()

  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-float)] md:p-8">
      <h2 className="font-display text-[1.6rem]">Quick estimate</h2>
      <div className="mt-6 space-y-4">
        <RangeField label="Amount" value={amount} min={loan.amount.min} max={Math.min(loan.amount.max, loan.amount.default * 4)} step={loan.amount.step} onChange={setAmount} display={formatLakh} />
        <RangeField label="Tenure" value={months} min={loan.tenure.min} max={loan.tenure.max} step={loan.tenure.max > 120 ? 12 : 6} onChange={setMonths} display={formatTenure} />
      </div>
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm text-slate">EMI at an indicative {rate}% p.a.</p>
        <AnimatedNumber value={t.emi} format={formatINR} className="tnum figure mt-1 block  text-[2.5rem] leading-none" />
        <p className="tnum mt-3 text-sm text-slate">
          Total interest <span className="font-medium text-ink">{formatINR(t.totalInterest)}</span>
        </p>
        {advertisedMin != null && (
          <p className="mt-1 text-sm text-slate">
            Lowest published starting rate: <span className="font-medium text-ink">{advertisedMin.rate}% p.a.</span> ({advertisedMin.bank})
          </p>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Button to={`/compare?${q}`}>Compare lenders for this</Button>
        <Button to={`/contact?loan=${loan.id}&amount=${amount}&months=${months}`} variant="secondary">Ask an adviser</Button>
      </div>
    </div>
  )
}

export default function LoanDetail() {
  const { slug } = useParams()
  const loan = loanBySlug[slug]
  useTitle(loan?.name, loan?.suits)
  if (!loan) return <NotFound />

  const today = new Date().toISOString().slice(0, 10)
  const live = products.filter((p) => p.category === loan.id && p.status === 'published' && !(p.validUntil && p.validUntil < today))
  const best = live.length ? live.reduce((a, b) => (b.advertisedMin < a.advertisedMin ? b : a)) : null
  const advertisedMin = best ? { rate: best.advertisedMin, bank: lenderById[best.lenderId].short } : null
  const others = loans.filter((l) => l.id !== loan.id).slice(0, 3)

  return (
    <>
      <header className="wrap pt-10 pb-16 md:pt-16 md:pb-24">
        <nav aria-label="Breadcrumb" className="text-sm text-slate">
          <Link to="/loans" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink"><span className="link-draw">Loans</span></Link>
          <span className="mx-2" aria-hidden>/</span>
          <span className="text-ink">{loan.name}</span>
        </nav>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-[4rem]">{loan.name}</h1>
            <p className="mt-6 max-w-[48ch] text-xl text-slate">{loan.short}</p>
            <LoanVisual loan={loan} />
            <h2 className="mt-10 text-lg font-semibold text-ink">Who it may suit</h2>
            <p className="mt-2 max-w-[60ch] text-lg text-slate">{loan.suits}</p>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-slate">Typical tenure</dt>
                <dd className="mt-1 text-xl font-semibold">{loan.typicalTenure}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate">Calculator range</dt>
                <dd className="figure mt-1 text-xl whitespace-normal">{formatLakh(loan.amount.min)} to {formatLakh(loan.amount.max)}</dd>
              </div>
            </dl>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <QuickEstimate loan={loan} advertisedMin={advertisedMin} />
            <div className="mt-4"><DataBadge date={DATA_CHECKED} until={DATA_CHECKED_UNTIL} /></div>
          </div>
        </div>
      </header>

      {live.length > 0 && (
        <section className="wrap pb-20 md:pb-24" aria-labelledby="published-title">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 id="published-title" className="font-display text-[2rem] leading-tight md:text-[2.4rem]">Published rates for this loan</h2>
            <TextLink to={`/compare?type=${loan.id}`}>Compare with fees and EMI</TextLink>
          </div>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {[...live].sort((a, b) => a.advertisedMin - b.advertisedMin).map((p) => {
              const l = lenderById[p.lenderId]
              const rates = p.range[1] == null ? `From ${p.range[0]}%` : `${p.range[0]}% to ${p.range[1]}%`
              return (
                <li key={p.id} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[auto_1fr_auto]">
                  <BankLogo lender={l} size="sm" className="row-span-2 sm:row-span-1" />
                  <div className="min-w-0">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-sm text-slate">{p.name}, {p.rateType.toLowerCase()}</p>
                  </div>
                  <p className="figure text-lg whitespace-normal sm:text-right">
                    {rates} <span className="text-sm font-normal text-slate">p.a.</span>
                    {p.rateBasis === 'bands' && <span className="block text-xs font-normal text-slate">By credit score</span>}
                  </p>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-xs text-slate">
            From each lender’s own website, checked {checkedLabel(DATA_CHECKED, DATA_CHECKED_UNTIL)}. Lender names and logos are trademarks of their owners.
          </p>
        </section>
      )}

      <section className="bg-mist py-20 md:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[2.2rem] leading-tight md:text-[2.75rem]">What lenders look at</h2>
            <ul className="mt-8 space-y-4">
              {loan.eligibility.map((e) => (
                <li key={e} className="flex gap-3 text-lg">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-lapis" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-[2.2rem] leading-tight md:text-[2.75rem]">Before you apply</h2>
            <ul className="mt-8 divide-y divide-line-strong border-y border-line-strong">
              {loan.considerations.map((c) => (
                <li key={c} className="py-4 text-slate">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[2.2rem] leading-tight md:text-[2.75rem]">Fees to expect</h2>
            <p className="mt-4 text-slate">Not every lender charges each of these. The comparison shows the actual fee, GST and caps per lender.</p>
            <TextLink to={`/compare?type=${loan.id}`} className="mt-6">See fees by lender</TextLink>
          </div>
          <ul className="grid gap-px self-start overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {loan.fees.map((f) => (
              <li key={f} className="bg-white p-6 text-lg">{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 className="font-display text-[2.2rem] leading-tight md:text-[2.75rem] lg:col-span-4">{loan.name} questions</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion items={loan.faqs} />
            <Note className="mt-8">Indicative information only. Terms depend on the lender and your circumstances.</Note>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-24">
        <div className="wrap">
          <h2 className="font-display text-[2rem] md:text-[2.5rem]">Other loans</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.id}>
                <Link to={`/loans/${o.slug}`} className="block h-full bg-ink p-7 transition-colors duration-300 hover:bg-ink-soft">
                  <span className="font-display text-[1.6rem]">{o.name}</span>
                  <span className="mt-2 block text-white/70">{o.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
