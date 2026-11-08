import { useCallback, useMemo, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { loans, loanById } from '../data/loans'
import { formatINR, formatLakh, formatTenure, loanTotals } from '../lib/finance'
import AnimatedNumber from './AnimatedNumber'
import CostBar from './CostBar'
import { RangeField } from './fields'
import { Button } from './ui'

const fmtINR = (v) => formatINR(v)

export default function CostInstrument() {
  const [type, setType] = useState('home')
  const loan = loanById[type]
  const [amount, setAmount] = useState(loan.amount.default)
  const [months, setMonths] = useState(loan.tenure.default)
  const [rate, setRate] = useState(loan.rate.default)

  const changeType = (id) => {
    const l = loanById[id]
    setType(id)
    setAmount(l.amount.default)
    setMonths(l.tenure.default)
    setRate(l.rate.default)
  }

  const t = useMemo(() => loanTotals(amount, rate, months), [amount, rate, months])
  const tenureStep = loan.tenure.max > 120 ? 12 : 6
  const displayTenure = useCallback((m) => formatTenure(m), [])

  const query = new URLSearchParams({ type, amount, months }).toString()

  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-lift)] md:p-8">
      <p className="font-display text-[1.45rem] leading-[1.5] md:text-[1.7rem]">
        A{' '}
        <span className="relative inline-flex items-center align-baseline">
          <label htmlFor="instrument-type" className="sr-only">Loan type</label>
          <select
            id="instrument-type"
            value={type}
            onChange={(e) => changeType(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg bg-sky py-0.5 pr-8 pl-2.5 text-lapis transition-colors hover:bg-[#dde6fa] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lapis"
          >
            {loans.map((l) => (
              <option key={l.id} value={l.id}>{l.name.toLowerCase()}</option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 size-4 text-lapis" />
        </span>{' '}
        of <span className="tnum">{formatLakh(amount)}</span> over{' '}
        <span className="tnum">{formatTenure(months)}</span>
      </p>

      <div className="mt-6 space-y-4">
        <RangeField
          label="Amount"
          value={amount}
          min={loan.amount.min}
          max={Math.min(loan.amount.max, loan.amount.default * 4)}
          step={loan.amount.step}
          onChange={setAmount}
          display={formatLakh}
        />
        <RangeField
          label="Tenure"
          value={months}
          min={loan.tenure.min}
          max={loan.tenure.max}
          step={tenureStep}
          onChange={setMonths}
          display={displayTenure}
        />
        <RangeField
          label="Interest rate"
          value={rate}
          min={loan.rate.min}
          max={loan.rate.max}
          step={0.05}
          onChange={setRate}
          display={(v) => `${v.toFixed(2)}% p.a.`}
        />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
        <div className="col-span-2">
          <p className="text-sm text-slate">Monthly EMI</p>
          <AnimatedNumber value={t.emi} format={fmtINR} className="tnum figure mt-1 block  text-[2.75rem] leading-none md:text-[3.25rem]" />
        </div>
        <div>
          <p className="text-sm text-slate">Total interest</p>
          <AnimatedNumber value={t.totalInterest} format={fmtINR} className="tnum mt-0.5 block text-lg font-medium" />
        </div>
        <div>
          <p className="text-sm text-slate">Total repayment</p>
          <AnimatedNumber value={t.totalRepayment} format={fmtINR} className="tnum mt-0.5 block text-lg font-medium" />
        </div>
        <div className="col-span-2">
          <CostBar principal={amount} interest={t.totalInterest} compact />
          <div className="mt-2.5 flex justify-between text-xs text-slate">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-principal" aria-hidden />Principal</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-interest" aria-hidden />Interest</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate sm:max-w-[30ch]">
          Estimate before lender fees. Rates are indicative; your offer depends on the lender’s assessment.
        </p>
        <Button to={`/compare?${query}`} variant="secondary" size="sm" className="group">
          Add fees by lender
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  )
}
