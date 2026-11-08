import { products, lenderById } from '../data/lenders'
import { feeAmount, loanTotals } from './finance'

// Where a band sits inside a published range, for banks that price by score
// but publish only the range. A disclosed assumption, shown next to the rate.
const RANGE_POSITION = { '800+': 0.1, '750-799': 0.3, '700-749': 0.55, '650-699': 0.8, 'below-650': 1, unknown: 0.75 }

export function rateFor(product, band, months) {
  const [lo, hi] = product.range
  let rate = null
  let basis = product.rateBasis

  if (product.rateBasis === 'bands') {
    if (band === 'unknown') {
      // Cautious: three-quarters of the way up the published band rates
      rate = lo + (hi - lo) * RANGE_POSITION.unknown
      basis = 'unknown-score'
    } else {
      rate = product.bands[band] ?? null
      if (rate == null) basis = 'band-not-offered'
    }
  } else if (product.rateBasis === 'range') {
    rate = lo + (hi - lo) * RANGE_POSITION[band]
    basis = band === 'unknown' ? 'unknown-score-range' : 'range'
  } else {
    rate = null // 'from': only a starting rate is published
  }

  if (rate != null && product.shortTenure && months <= product.shortTenure.upTo) rate += product.shortTenure.delta
  return { rate: rate == null ? null : Math.round(rate * 100) / 100, basis }
}

function isCurrent(p, today) {
  if (p.status !== 'published') return false
  if (p.validUntil && p.validUntil < today) return false
  if (p.effective && p.effective > today) return false
  return true
}

export function buildOffers({ category, amount, months, band, lenderIds }, today = new Date().toISOString().slice(0, 10)) {
  const inCategory = products.filter((p) => p.category === category)
  const current = inCategory.filter((p) => isCurrent(p, today))
  const hidden = inCategory.length - current.length

  const offers = current
    .filter((p) => !lenderIds?.length || lenderIds.includes(p.lenderId))
    .map((p) => {
      const lender = lenderById[p.lenderId]
      const { rate, basis } = rateFor(p, band, months)
      const outsideAmount = p.amount ? amount < p.amount[0] || amount > p.amount[1] : false
      const outsideTenure = p.maxTenure ? months > p.maxTenure : false

      // Fees: a waiver that has ended is treated as unknown, never as free
      const fees = p.fees.map((f) => {
        const expired = f.kind === 'waived' && f.until && f.until < today
        const fee = expired ? { ...f, kind: 'unknown' } : f
        return { ...fee, amount: feeAmount(fee, amount) }
      })
      const knownFees = fees.filter((f) => f.amount)
      const upfront = knownFees.reduce((s, f) => s + f.amount.total, 0)
      const upfrontGst = knownFees.reduce((s, f) => s + f.amount.gst, 0)
      const hasUnknownFees = fees.some((f) => !f.amount)
      const hasCeilingFees = fees.some((f) => f.amount?.atCeiling)

      const startingOnly = p.rateBasis === 'from'
      const eligibleShape = !startingOnly && rate != null && !outsideAmount && !outsideTenure
      const totals = eligibleShape ? loanTotals(amount, rate, months) : null
      const bestCase = startingOnly && !outsideAmount && !outsideTenure ? loanTotals(amount, p.advertisedMin, months) : null

      return {
        product: p,
        lender,
        rate,
        basis,
        outsideAmount,
        outsideTenure,
        startingOnly,
        eligibleShape,
        fees,
        upfront,
        upfrontGst,
        hasUnknownFees,
        hasCeilingFees,
        totals,
        bestCase,
        totalCost: totals ? totals.totalInterest + upfront : null,
      }
    })

  return { offers, hidden }
}

export const sorters = {
  cost: { label: 'Lowest estimated total cost', short: 'Total cost', key: (o) => o.totalCost },
  emi: { label: 'Lowest indicative EMI', short: 'EMI', key: (o) => o.totals?.emi },
  upfront: { label: 'Lowest stated upfront fees', short: 'Upfront fees', key: (o) => (o.hasUnknownFees ? null : o.upfront) },
}

// Estimated offers are ranked; starting-rate-only and not-offered rows follow.
// When sorting by total cost, offers with unpublished fees follow those with
// complete fee data, so a missing fee is never mistaken for a free one.
export function sortOffers(offers, by) {
  const k = sorters[by].key
  const group = (o) => (o.eligibleShape ? 0 : o.startingOnly && o.bestCase ? 1 : 2)
  const feeTier = (o) => (by === 'cost' && o.hasUnknownFees ? 1 : 0)
  return [...offers].sort((a, b) => {
    if (group(a) !== group(b)) return group(a) - group(b)
    if (feeTier(a) !== feeTier(b)) return feeTier(a) - feeTier(b)
    const ka = k(a)
    const kb = k(b)
    if (ka == null && kb == null) return a.lender.name.localeCompare(b.lender.name)
    if (ka == null) return 1
    if (kb == null) return -1
    return ka - kb
  })
}
