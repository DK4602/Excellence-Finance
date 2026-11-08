// Reducing-balance EMI. Handles zero interest without dividing by zero.
export function emi(principal, annualRatePct, months) {
  if (!(principal > 0) || !(months > 0) || annualRatePct < 0) return 0
  const r = annualRatePct / 12 / 100
  if (r === 0) return principal / months
  const f = Math.pow(1 + r, months)
  return (principal * r * f) / (f - 1)
}

export function loanTotals(principal, annualRatePct, months) {
  const monthly = emi(principal, annualRatePct, months)
  const totalRepayment = monthly * months
  return {
    emi: monthly,
    totalRepayment,
    totalInterest: Math.max(0, totalRepayment - principal),
  }
}

// Year-by-year split of what the EMI pays off
export function yearlySchedule(principal, annualRatePct, months) {
  const r = annualRatePct / 12 / 100
  const monthly = emi(principal, annualRatePct, months)
  let balance = principal
  const years = []
  for (let m = 1; m <= months; m++) {
    const interest = balance * r
    const principalPart = Math.min(balance, monthly - interest)
    balance = Math.max(0, balance - principalPart)
    const y = Math.ceil(m / 12) - 1
    if (!years[y]) years[y] = { year: y + 1, principal: 0, interest: 0, balance: 0 }
    years[y].principal += principalPart
    years[y].interest += interest
    years[y].balance = balance
  }
  return years
}

export const GST_RATE = 0.18

// fee: { label, kind: 'percent'|'flat'|'waived'|'unknown', value, min, max, gst }
export function feeAmount(fee, principal) {
  if (!fee || fee.kind === 'unknown') return null
  if (fee.kind === 'waived') return { base: 0, gst: 0, total: 0 }
  // Tiered fees: pick the first tier whose ceiling covers the loan amount
  const rule = fee.kind === 'tiers' ? fee.tiers.find((t) => t.upTo == null || principal <= t.upTo) : fee
  let base = rule.kind === 'percent' ? (principal * rule.value) / 100 : rule.value
  if (rule.min != null) base = Math.max(base, rule.min)
  if (rule.max != null) base = Math.min(base, rule.max)
  const gst = fee.gst ? base * GST_RATE : 0
  // "Up to" fees are estimated at their published ceiling, never below it
  return { base, gst, total: base + gst, atCeiling: !!fee.upTo }
}

export function describeFee(fee) {
  if (!fee || fee.kind === 'unknown') return 'Not available / Confirm with lender'
  if (fee.kind === 'waived') {
    const until = fee.until ? ` Ends ${formatDate(fee.until)}.` : ''
    return `${fee.note ?? 'Waived'}.${until}`.replace('..', '.')
  }
  const parts = []
  const upTo = fee.upTo ? 'Up to ' : ''
  if (fee.kind === 'tiers') parts.push(fee.describe)
  else if (fee.kind === 'percent') parts.push(`${upTo}${fee.value}% of loan amount`)
  else parts.push(`${upTo}${formatINR(fee.value)}`)
  if (fee.kind !== 'tiers') {
    if (fee.min != null && fee.max != null) parts.push(`min ${formatINR(fee.min)}, max ${formatINR(fee.max)}`)
    else if (fee.min != null) parts.push(`min ${formatINR(fee.min)}`)
    else if (fee.max != null) parts.push(`max ${formatINR(fee.max)}`)
  }
  parts.push(fee.gst ? '+ 18% GST' : 'no GST')
  if (fee.upTo) parts.push('estimated at the maximum')
  return parts.join(', ')
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatINR(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return inr.format(Math.round(n))
}

// ₹25 lakh, ₹1.2 crore
export function formatLakh(n) {
  if (n >= 1e7) {
    const v = n / 1e7
    return `₹${trim(v)} crore`
  }
  if (n >= 1e5) return `₹${trim(n / 1e5)} lakh`
  return formatINR(n)
}

function trim(v) {
  return v.toFixed(2).replace(/\.?0+$/, '')
}

export function formatTenure(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y && m) return `${y} yr ${m} mo`
  if (y) return `${y} ${y === 1 ? 'year' : 'years'}`
  return `${m} months`
}

export function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
