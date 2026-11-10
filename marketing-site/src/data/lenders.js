// Lender offers compiled from each bank's official website, checked 8 Nov 2026.
// These are published card rates, not offers to any individual. In production
// this data lives in MySQL and is maintained in Filament, with a change log.
//
// rateBasis:
//   'bands' – the bank publishes rates by credit-score band (used directly)
//   'range' – the bank publishes a min–max range only (position estimated by band)
//   'from'  – the bank publishes only a starting rate (no estimate is made)
//
// Bank names are used to compare their published terms. Listing a bank here
// does not imply a partnership with Excellence Finance.

const CHECKED = '2026-11-08'
// Banks added from the carousel list were read from their official sites on this date
const CHECKED_2 = '2026-11-10'

// Logos: from each bank's official website, except PNB (vector from
// Wikimedia Commons, matching the mark on pnb.bank.in). Trademarks of their
// respective owners.
export const lenders = [
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC Bank', kind: 'Private sector bank', logo: '/banks/hdfc.svg' },
  { id: 'bob', name: 'Bank of Baroda', short: 'Bank of Baroda', kind: 'Public sector bank', logo: '/banks/bob.png' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB', kind: 'Public sector bank', logo: '/banks/pnb.svg' },
  { id: 'bom', name: 'Bank of Maharashtra', short: 'Bank of Maharashtra', kind: 'Public sector bank', logo: '/banks/bom.svg' },
  { id: 'idfc', name: 'IDFC FIRST Bank', short: 'IDFC FIRST Bank', kind: 'Private sector bank', logo: '/banks/idfc.svg' },
  { id: 'icici', name: 'ICICI Bank', short: 'ICICI Bank', kind: 'Private sector bank', logo: '/banks/icici.svg' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', short: 'Kotak', kind: 'Private sector bank', logo: '/banks/kotak.svg' },
  { id: 'indian-bank', name: 'Indian Bank', short: 'Indian Bank', kind: 'Public sector bank', logo: '/banks/indian-bank.png' },
  { id: 'central-bank', name: 'Central Bank of India', short: 'Central Bank', kind: 'Public sector bank', logo: '/banks/central-bank.jpg' },
  { id: 'iob', name: 'Indian Overseas Bank', short: 'IOB', kind: 'Public sector bank', logo: '/banks/iob.svg' },
  { id: 'uco', name: 'UCO Bank', short: 'UCO Bank', kind: 'Public sector bank', logo: '/banks/uco.png' },
  { id: 'idbi', name: 'IDBI Bank', short: 'IDBI Bank', kind: 'Private sector bank', logo: '/banks/idbi.svg' },
  { id: 'yes', name: 'YES BANK', short: 'YES BANK', kind: 'Private sector bank', logo: '/banks/yes.png' },
  { id: 'tata-capital', name: 'Tata Capital Housing Finance', short: 'Tata Capital', kind: 'Housing finance company', logo: '/banks/tata-capital.svg' },
  { id: 'bajaj', name: 'Bajaj Housing Finance', short: 'Bajaj Housing', kind: 'Housing finance company', logo: '/banks/bajaj.svg' },
  { id: 'lt-finance', name: 'L&T Finance', short: 'L&T Finance', kind: 'Non-bank lender', logo: '/banks/lt-finance.svg' },
  { id: 'piramal', name: 'Piramal Finance', short: 'Piramal', kind: 'Non-bank lender', logo: '/banks/piramal-mark.png', logoMarkOnly: true },
  { id: 'smfg', name: 'SMFG India Home Finance', short: 'SMFG Grihashakti', kind: 'Housing finance company', logo: '/banks/smfg.svg' },
]

// Fee helpers
const pct = (label, value, opts = {}) => ({ label, kind: 'percent', value, gst: true, ...opts })
const flat = (label, value, opts = {}) => ({ label, kind: 'flat', value, gst: true, ...opts })
const unknown = (label) => ({ label, kind: 'unknown' })
const waived = (label, note, until) => ({ label, kind: 'waived', note, until })

const FLOATING_PREPAY = 'Nil for individual borrowers on a floating rate'

const src = {
  hdfcHome: { label: 'HDFC Bank home loan interest rates', url: 'https://homeloans.hdfc.bank.in/checklist/home-loan-interest-rates' },
  hdfcHomeFee: { label: 'HDFC Bank home loan charges', url: 'https://homeloans.hdfc.bank.in/checklist/documents-charges' },
  hdfcPersonal: { label: 'HDFC Bank personal loan rates and charges (Nov 2026)', url: 'https://www.hdfc.bank.in/personal-loan/interest-rates-and-charges' },
  hdfcCar: { label: 'HDFC Bank car loan rates and charges', url: 'https://www.hdfc.bank.in/car-loan/interest-rates-and-charges' },
  hdfcBusiness: { label: 'HDFC Bank business loan rates and charges (Nov 2026)', url: 'https://www.hdfc.bank.in/business-loan/interest-rates-and-charges' },
  bobHome: { label: 'Baroda Home Loan', url: 'https://bankofbaroda.bank.in/loans/home-loan/baroda-home-loan' },
  bobTakeover: { label: 'Baroda Home Loan Takeover Scheme', url: 'https://bankofbaroda.bank.in/loans/home-loan/baroda-home-loan-takeover-scheme' },
  bobCar: { label: 'Baroda Car Loan', url: 'https://bankofbaroda.bank.in/loans/vehicle-loan/baroda-car-loan' },
  bobPersonal: { label: 'Baroda Personal Loan', url: 'https://bankofbaroda.bank.in/loans/personal-loan/baroda-personal-loan' },
  bobLap: { label: 'Baroda Mortgage Loan', url: 'https://bankofbaroda.bank.in/loans/mortgage-loan/baroda-mortgage-loan' },
  pnbRates: { label: 'PNB interest rates on retail advances', url: 'https://pnb.bank.in/Retail-Advances-interst-rate-on-advances-linked-to-mclr.html' },
  pnbFees: { label: 'PNB service charges on retail advances', url: 'https://pnb.bank.in/service-charges-related-to-retail-advances.html' },
  bomRates: { label: 'Bank of Maharashtra retail loan rates', url: 'https://bankofmaharashtra.bank.in/retail-interest-rates' },
  bomHome: { label: 'Bank of Maharashtra home loan', url: 'https://bankofmaharashtra.bank.in/personal-banking/loans/home-loan' },
  bomCar: { label: 'Maha Super Car Loan Scheme', url: 'https://bankofmaharashtra.bank.in/maha-super-car-loan-scheme' },
  bomPersonal: { label: 'Maha Bank Personal Loan Scheme', url: 'https://bankofmaharashtra.bank.in/mahabank-personalloan-scheme-for-all' },
  idfcHome: { label: 'IDFC FIRST Bank home loan interest rates', url: 'https://www.idfcfirst.bank.in/personal-banking/loans/home-loan/home-loan-interest-rates' },
  idfcHomeFee: { label: 'IDFC FIRST Bank home loan fees and charges', url: 'https://www.idfcfirst.bank.in/personal-banking/loans/home-loan/fees-and-charges' },
  idfcLap: { label: 'IDFC FIRST Bank loan against property rates', url: 'https://www.idfcfirst.bank.in/personal-banking/loans/loan-against-property/lap-interest-rate' },
  idfcLapFee: { label: 'IDFC FIRST Bank loan against property charges', url: 'https://www.idfcfirst.bank.in/personal-banking/loans/loan-against-property/fees-and-charges' },
  idfcPersonal: { label: 'IDFC FIRST Bank personal loan rates and charges', url: 'https://www.idfcfirst.bank.in/personal-banking/loans/personal-loan/personal-loan-interest-rates' },
  iciciHome: { label: 'ICICI Bank home loan interest rates (valid to 30 Nov 2026)', url: 'https://www.icici.bank.in/personal-banking/loans/home-loan/interest-rates' },
  kotakHome: { label: 'Kotak Mahindra Bank home loan interest rates', url: 'https://www.kotak.bank.in/en/personal-banking/loans/home-loan/interest-rates.html' },
  indianRates: { label: 'Indian Bank interest rates on personal segment loans: floating (updated 27 Oct 2026)', url: 'https://indianbank.bank.in/en/interest-rates-on-personal-segment-loan-products' },
  centralRates: { label: 'Central Bank of India rate of interest for retail schemes (updated 8 Oct 2026)', url: 'https://centralbank.bank.in/en/retail-scheme-interest' },
  iobRates: { label: 'Indian Overseas Bank lending interest rates (updated 13 Oct 2026)', url: 'https://www.iob.bank.in/en/lending-interest-rates' },
  ucoHome: { label: 'UCO Bank STP Home Loan (updated 27 Oct 2026)', url: 'https://www.uco.bank.in/stp-home-loan' },
  idbiRates: { label: 'IDBI Bank interest rates: retail loans', url: 'https://www.idbi.bank.in/interest-rates.aspx' },
  yesHome: { label: 'YES BANK home loan', url: 'https://www.yes.bank.in/personal-banking/yes-individual/loans/home-loan' },
  tataHome: { label: 'Tata Capital home loan rates and charges', url: 'https://www.tatacapital.com/home-loan/rates-and-charges.html' },
  bajajHome: { label: 'Bajaj Housing Finance home loan', url: 'https://www.bajajhousingfinance.in/housing-loan' },
  ltHome: { label: 'L&T Finance home loan', url: 'https://www.ltfinance.com/home-loan' },
  piramalHome: { label: 'Piramal Finance home loan interest rates', url: 'https://www.piramalfinance.com/home-loan/home-loan-interest-rates' },
  smfgHome: { label: 'SMFG Grihashakti home loan interest rates', url: 'https://www.grihashakti.com/home-loan-interest-rates.aspx' },
}

const PNB_CAMPAIGN = { effective: '2026-10-01', validUntil: '2026-12-31' }

export const products = [
  // ───────────── Home loans ─────────────
  {
    id: 'hdfc-home', lenderId: 'hdfc', category: 'home', name: 'HDFC Bank Home Loan (adjustable rate)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 8.0, range: [8.0, 13.45],
    maxTenure: 360,
    fees: [pct('Processing fee', 0.5, { min: 4000, upTo: true })],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Benchmarked to the RBI policy repo rate (Repo + 2.50% to 7.95%, as stated on the bank’s page).',
      'The same page headline advertises rates from 7.20%. The table and the headline disagree, so confirm the current rate with the bank.',
      'Processing fee shown is for salaried and self-employed professionals; self-employed non-professionals pay up to 1.50% (minimum ₹5,000).',
    ],
    sources: [src.hdfcHome, src.hdfcHomeFee], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'bob-home', lenderId: 'bob', category: 'home', name: 'Baroda Home Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.4, range: [7.4, 9.15],
    maxTenure: 360,
    fees: [{
      label: 'Processing fee', kind: 'tiers', gst: true,
      tiers: [
        { upTo: 5000000, kind: 'percent', value: 0.5, min: 8500, max: 15000 },
        { kind: 'percent', value: 0.25, min: 8500, max: 25000 },
      ],
      describe: '0.50% up to ₹50 lakh (min ₹8,500, max ₹15,000); 0.25% above ₹50 lakh (max ₹25,000)',
    }],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Same range for salaried and non-salaried applicants; the rate within it depends on the applicant’s profile.',
      'Loan-to-value: up to 90% for loans up to ₹30 lakh, 80% up to ₹75 lakh, 75% above.',
    ],
    sources: [src.bobHome], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'pnb-home', lenderId: 'pnb', category: 'home', name: 'PNB Housing Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.45, range: [7.45, 9.25],
    bands: { '800+': 7.45, '750-799': 7.5, '700-749': 8.05, '650-699': 9.25, 'below-650': 9.25 },
    maxTenure: 360,
    fees: [
      waived('Processing fee', 'Waived under PNB Utsav Festivities 2026 (normally 0.35%, min ₹2,500, max ₹15,000)', '2026-12-31'),
      waived('Documentation charges', 'Waived under the same campaign (normally ₹1,350)', '2026-12-31'),
    ],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Campaign rates valid 1 Oct to 31 Dec 2026.',
      'Rates shown are for loan-to-value up to 80%. Loans up to ₹30 lakh above 80% LTV are priced about 0.10% higher.',
      'The 600–699 band is priced at 9.25%; scores below 600 are not listed.',
    ],
    sources: [src.pnbRates, src.pnbFees], ...PNB_CAMPAIGN, verified: CHECKED, status: 'published',
  },
  {
    id: 'bom-home', lenderId: 'bom', category: 'home', name: 'Maha Super Housing Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.25, range: [7.25, 9.4],
    bands: { '800+': 7.25, '750-799': 7.5, '700-749': 8.0, '650-699': 8.6, 'below-650': 9.4 },
    maxTenure: 360,
    fees: [pct('Processing fee', 0.25)],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Rates for salaried borrowers; non-salaried borrowers pay 0.10% to 0.50% more.',
      'Within a band the bank may price lower (for example 725–749 at 7.95%); the higher figure is shown.',
      'Borrowers scoring below 725 may get a concession, including 0.05% for women borrowers.',
    ],
    sources: [src.bomRates, src.bomHome], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'idfc-home', lenderId: 'idfc', category: 'home', name: 'IDFC FIRST Bank Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 7.75, range: [7.75, null],
    maxTenure: null,
    fees: [pct('Processing fee', 3, { upTo: true })],
    prepayment: FLOATING_PREPAY, late: '12% p.a. on the unpaid EMI or ₹300, whichever is higher',
    conditions: ['The bank publishes a starting rate only. Your rate depends on your profile.'],
    sources: [src.idfcHome, src.idfcHomeFee], effective: null, verified: CHECKED, status: 'published',
  },

  // ───────────── Personal loans ─────────────
  {
    id: 'hdfc-pl', lenderId: 'hdfc', category: 'personal', name: 'HDFC Bank Personal Loan',
    rateType: 'Fixed', rateBasis: 'range', advertisedMin: 9.99, range: [9.99, 24.0],
    maxTenure: null,
    fees: [flat('Processing fee', 6500, { upTo: true })],
    prepayment: '4% of principal outstanding up to 24 EMIs, 3% from 24 to 36 EMIs, 2% after 36 EMIs',
    late: 'Interest at the contracted rate for the days late, added to the next EMI',
    conditions: ['Rack rate for salaried customers.', 'Senior citizens get 10% off service charges.'],
    sources: [src.hdfcPersonal], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'bob-pl', lenderId: 'bob', category: 'personal', name: 'Baroda Personal Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 10.4, range: [14.15, 17.75],
    maxTenure: 60,
    fees: [pct('Processing fee', 2, { min: 1000, max: 10000, upTo: true })],
    prepayment: null, late: null,
    conditions: [
      'Range shown is for private-sector employees and self-employed applicants who bank elsewhere.',
      'Lower ranges apply to government employees and Bank of Baroda salary account holders (from 10.40%).',
      'Processing fee is published as 1% to 2%; nil for government employees with a salary account at the bank.',
    ],
    sources: [src.bobPersonal], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'pnb-pl', lenderId: 'pnb', category: 'personal', name: 'PNB Swaagat Digital Personal Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 10.85, range: [10.85, 12.85],
    bands: { '800+': 10.85, '750-799': 11.85, '700-749': 12.85, '650-699': null, 'below-650': null },
    maxTenure: null,
    fees: [
      pct('Processing fee', 1),
      {
        label: 'Documentation charges', kind: 'tiers', gst: true,
        tiers: [{ upTo: 200000, kind: 'flat', value: 270 }, { kind: 'flat', value: 450 }],
        describe: '₹270 up to ₹2 lakh, ₹450 above',
      },
    ],
    prepayment: null, late: null,
    conditions: ['For customers new to PNB. Not offered below a score of 700.'],
    sources: [src.pnbRates, src.pnbFees], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'bom-pl', lenderId: 'bom', category: 'personal', name: 'Maha Bank Personal Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 10.0, range: [11.75, 15.25],
    bands: { '800+': 11.75, '750-799': 13.25, '700-749': 14.0, '650-699': 15.25, 'below-650': 15.25 },
    maxTenure: null,
    fees: [pct('Processing fee', 1, { min: 1000 }), pct('Documentation charges', 0.2)],
    prepayment: null, late: null,
    conditions: [
      'Rates for employees of private or public limited companies (10+ years old) with a salary account at another bank.',
      'Government employees with a salary account at Bank of Maharashtra get lower rates (from 10.00%).',
      'Within 750–799 the bank prices 776–799 lower (12.50%); the higher figure is shown.',
    ],
    sources: [src.bomRates, src.bomPersonal], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'idfc-pl', lenderId: 'idfc', category: 'personal', name: 'IDFC FIRST Bank FIRSTmoney Personal Loan',
    rateType: 'Fixed', rateBasis: 'from', advertisedMin: 9.99, range: [9.99, null],
    maxTenure: null,
    fees: [waived('Processing fee', 'No processing fee on personal loans, per the bank’s charges table')],
    prepayment: 'Foreclosure nil (needs a sanction letter); part-prepayment not allowed',
    late: '12% p.a. or ₹300, whichever is higher',
    conditions: ['The bank publishes a starting rate only. Pre-qualified loans may carry a processing fee of up to 3.50%.'],
    sources: [src.idfcPersonal], effective: null, verified: CHECKED, status: 'published',
  },

  // ───────────── Business loans ─────────────
  {
    id: 'hdfc-bl', lenderId: 'hdfc', category: 'business', name: 'HDFC Bank Business Loan',
    rateType: 'Fixed', rateBasis: 'range', advertisedMin: 10.75, range: [10.75, 22.5],
    maxTenure: null,
    fees: [pct('Processing fee', 2, { upTo: true })],
    prepayment: '4% of principal outstanding up to 24 EMIs, 3% from 24 to 36 EMIs, 2% after 36 EMIs',
    late: null,
    conditions: [
      'Nil processing fee for micro and small enterprises borrowing up to ₹5 lakh (Udyam certificate needed).',
      'Part-prepayment allowed after the first EMI, up to 25% of principal outstanding, once a financial year.',
    ],
    sources: [src.hdfcBusiness], effective: null, verified: CHECKED, status: 'published',
  },

  // ───────────── Loan against property ─────────────
  {
    id: 'bob-lap', lenderId: 'bob', category: 'lap', name: 'Baroda Mortgage Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 9.15, range: [9.15, 11.75],
    maxTenure: 120,
    fees: [unknown('Unified processing charges')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Priced by the bank’s risk rating of the applicant.',
      'One unified charge covers processing, documentation, legal opinion, valuation and inspection; the amount is not published.',
      'Up to ₹7.5 crore for individuals; tenure up to 10 years.',
    ],
    sources: [src.bobLap], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'pnb-lap', lenderId: 'pnb', category: 'lap', name: 'PNB myProperty (term loan)',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 9.2, range: [9.4, 11.7],
    bands: { '800+': 9.4, '750-799': 9.65, '700-749': 10.2, '650-699': 11.7, 'below-650': null },
    maxTenure: null,
    fees: [
      pct('Processing fee', 0.75, { max: 100000 }),
      {
        label: 'Documentation charges', kind: 'tiers', gst: true,
        tiers: [{ upTo: 5000000, kind: 'flat', value: 2500 }, { kind: 'flat', value: 5000 }],
        describe: '₹2,500 up to ₹50 lakh, ₹5,000 above',
      },
      waived('Legal and valuation', 'Borne by the bank up to ₹15,000 during the campaign', '2026-12-31'),
    ],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Rates for property worth up to 200% of the loan; when security exceeds 200%, rates are 0.20% lower (from 9.20%).',
      'The 650–699 figure applies to scores 681–699 only.',
      'Campaign rates valid 1 Oct to 31 Dec 2026.',
    ],
    sources: [src.pnbRates, src.pnbFees], ...PNB_CAMPAIGN, verified: CHECKED, status: 'published',
  },
  {
    id: 'bom-lap', lenderId: 'bom', category: 'lap', name: 'Bank of Maharashtra Loan Against Property',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 9.95, range: [9.95, 10.95],
    bands: { '800+': 9.95, '750-799': 9.95, '700-749': 10.3, '650-699': 10.45, 'below-650': 10.95 },
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['Rates for individual borrowers. Scores 600–649 are priced at 10.70%; the higher figure is shown.'],
    sources: [src.bomRates], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'idfc-lap', lenderId: 'idfc', category: 'lap', name: 'IDFC FIRST Bank Loan Against Property',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 9.5, range: [9.5, null],
    maxTenure: 300,
    fees: [pct('Processing fee', 3, { upTo: true }), flat('Application fee', 6500, { gst: false })],
    prepayment: FLOATING_PREPAY, late: '12% p.a. on the unpaid EMI or ₹300, whichever is higher',
    conditions: ['The bank publishes a starting rate only. Up to ₹15 crore and 80% of property value.'],
    sources: [src.idfcLap, src.idfcLapFee], effective: null, verified: CHECKED, status: 'published',
  },

  // ───────────── Vehicle (new car) ─────────────
  {
    id: 'hdfc-car', lenderId: 'hdfc', category: 'vehicle', name: 'HDFC Bank New Car Loan',
    rateType: 'Fixed', rateBasis: 'from', advertisedMin: 8.4, range: [8.4, null],
    maxTenure: null,
    fees: [pct('Processing fee', 0.5, { min: 3500, max: 8000, upTo: true })],
    prepayment: '5% of principal outstanding',
    late: 'Interest at the contracted rate for the days late, added to the next EMI',
    conditions: ['The bank publishes a starting rate only; it depends on loan amount, tenure and bureau score.'],
    sources: [src.hdfcCar], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'bob-car', lenderId: 'bob', category: 'vehicle', name: 'Baroda Car Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.6, range: [7.6, 11.3],
    maxTenure: 84,
    fees: [{
      label: 'Processing fee', kind: 'tiers', gst: true,
      tiers: [{ upTo: 1000000, kind: 'flat', value: 1500 }, { kind: 'flat', value: 2000 }],
      describe: '₹1,500 up to ₹10 lakh, ₹2,000 above',
    }],
    prepayment: 'Nil for individuals',
    late: null,
    conditions: ['New cars. Fixed-rate option also available (8.50% to 11.20%).', 'Existing home loan borrowers with a good record get 0.25% off.'],
    sources: [src.bobCar], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'pnb-car', lenderId: 'pnb', category: 'vehicle', name: 'PNB Car Loan (new car)',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.8, range: [7.9, 9.95],
    bands: { '800+': 7.9, '750-799': 7.9, '700-749': 8.95, '650-699': 9.95, 'below-650': null },
    maxTenure: null,
    fees: [waived('Processing and documentation fees', 'Waived under PNB Utsav Festivities 2026', '2026-12-31')],
    prepayment: null, late: null,
    conditions: [
      'Campaign rates valid 1 Oct to 31 Dec 2026. Electric cars are 0.05% lower; women borrowers get 7.90% regardless of score.',
      'The 650–699 figure applies to scores 681–699 only.',
    ],
    sources: [src.pnbRates, src.pnbFees], ...PNB_CAMPAIGN, verified: CHECKED, status: 'published',
  },
  {
    id: 'bom-car', lenderId: 'bom', category: 'vehicle', name: 'Maha Super Car Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.7, range: [7.7, 10.9],
    bands: { '800+': 7.7, '750-799': 8.0, '700-749': 8.3, '650-699': 9.85, 'below-650': 10.9 },
    maxTenure: null,
    fees: [pct('Processing fee', 0.25, { min: 1000, max: 15000 })],
    prepayment: null, late: null,
    conditions: [
      'Rates for salaried borrowers; non-salaried pay 0.10% to 1.10% more.',
      'Within 750–799 the bank prices 776–799 lower (7.90%); the higher figure is shown.',
      'Existing home loan, MSME and salary account customers of 6+ months get 0.25% off.',
    ],
    sources: [src.bomRates, src.bomCar], effective: null, verified: CHECKED, status: 'published',
  },

  // ───────────── Balance transfer (home loan) ─────────────
  {
    id: 'hdfc-bt', lenderId: 'hdfc', category: 'transfer', name: 'HDFC Bank Home Loan Balance Transfer',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 8.0, range: [8.0, 13.45],
    maxTenure: 360,
    fees: [pct('Processing fee', 0.5, { min: 4000, upTo: true })],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['HDFC Bank states that its home loan rates also apply to balance transfer loans.', 'Your current lender cannot charge you for closing a floating-rate home loan.'],
    sources: [src.hdfcHome, src.hdfcHomeFee], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'bob-bt', lenderId: 'bob', category: 'transfer', name: 'Baroda Home Loan Takeover',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.4, range: [7.4, 9.15],
    maxTenure: 360,
    fees: [flat('Processing fee (takeover)', 8500)],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['Rate range from the Baroda Home Loan card; confirm takeover pricing with the bank.'],
    sources: [src.bobTakeover, src.bobHome], effective: null, verified: CHECKED, status: 'published',
  },
  {
    id: 'pnb-bt', lenderId: 'pnb', category: 'transfer', name: 'PNB Housing Loan Takeover',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.45, range: [7.45, 9.25],
    bands: { '800+': 7.45, '750-799': 7.5, '700-749': 8.05, '650-699': 9.25, 'below-650': 9.25 },
    maxTenure: 360,
    fees: [
      waived('Processing fee (takeover)', 'Waived under PNB Utsav Festivities 2026 (normally ₹2,500)', '2026-12-31'),
      waived('Legal and valuation', 'Borne by the bank up to ₹15,000 for takeovers of ₹25 lakh and above', '2026-12-31'),
    ],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['Campaign rates valid 1 Oct to 31 Dec 2026.', 'Rates for loan-to-value up to 80%.'],
    sources: [src.pnbRates, src.pnbFees], ...PNB_CAMPAIGN, verified: CHECKED, status: 'published',
  },
  // ─────────── Banks added from the lender carousel (read 10 Nov 2026) ───────────
  // Fees a bank does not publish on the page read are left unknown, so they
  // show as "Confirm" and never make an offer look cheaper than it is.

  // ICICI Bank
  {
    id: 'icici-home', lenderId: 'icici', category: 'home', name: 'ICICI Bank Home Loan',
    rateType: 'Floating', rateBasis: 'bands', bandFallback: 'range', advertisedMin: 8.75, range: [8.75, 9.9],
    bands: { '800+': 8.75, '750-799': 8.75, '700-749': null, '650-699': null, 'below-650': null },
    maxTenure: null,
    fees: [pct('Processing fee', 0.5)],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Score-based rates are published for 750 and above (salaried 8.75%; self-employed 8.85% for 750–800). Below 750 the rate is estimated within the standard range.',
      'Standard range for salaried borrowers: 8.75%–9.65% up to ₹35 lakh, 8.75%–9.80% for ₹35–75 lakh, 8.75%–9.90% above ₹75 lakh. Self-employed borrowers pay up to 0.15% more at the top of each slab.',
      'Pre-approved customers applying digitally may be offered 7.80%, subject to bureau score.',
      'Rates linked to the repo rate (5.50% from 8 Oct 2026) and valid until 30 Nov 2026.',
    ],
    sources: [src.iciciHome], effective: null, validUntil: '2026-11-30', verified: CHECKED_2, status: 'published',
  },
  {
    id: 'icici-lap', lenderId: 'icici', category: 'lap', name: 'ICICI Bank Loan Against Property',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 10.85, range: [10.85, 12.5],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: [
      'Published by loan slab: 11.35%–12% up to ₹50 lakh, 11.10%–11.75% for ₹50 lakh–₹1 crore, 10.85%–11.50% above ₹1 crore (salaried or priority-sector self-employed).',
      'Self-employed borrowers outside priority sector pay 0.50% more in each slab.',
      'Rates linked to the repo rate and valid until 30 Nov 2026.',
    ],
    sources: [src.iciciHome], effective: null, validUntil: '2026-11-30', verified: CHECKED_2, status: 'published',
  },

  // Kotak Mahindra Bank
  {
    id: 'kotak-home', lenderId: 'kotak', category: 'home', name: 'Kotak Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 7.6, range: [7.6, null],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'The bank publishes a starting rate only (7.60% onwards, salaried and self-employed, repo rate 5.50%). Your rate depends on your profile.',
      'Switching an existing floating loan to a fixed rate is priced from 12% p.a.',
    ],
    sources: [src.kotakHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Indian Bank
  {
    id: 'indian-home', lenderId: 'indian-bank', category: 'home', name: 'IB Home Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.35, range: [7.35, 8.8],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['The bank publishes a range only. Your rate within it depends on your profile and credit score.'],
    sources: [src.indianRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'indian-lap', lenderId: 'indian-bank', category: 'lap', name: 'Ind Mortgage (term loan)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 9.2, range: [9.2, 10.6],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Range for loans up to ₹7.50 crore; larger loans are priced 9.25%–11.10%. The overdraft version is priced 10.20%–12.10%.'],
    sources: [src.indianRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'indian-car', lenderId: 'indian-bank', category: 'vehicle', name: 'IB Vehicle Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.75, range: [7.75, 9.1],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Range for new vehicles. Used cars are priced 9.80%–11.90%.'],
    sources: [src.indianRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'indian-pl', lenderId: 'indian-bank', category: 'personal', name: 'Indian Bank Online Personal Loan (salaried)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 11.3, range: [11.3, 11.3],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['A single published rate for salaried customers. The bank’s clean loan for salaried borrowers is priced 9.90%–10.40% as a term loan.'],
    sources: [src.indianRates], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Central Bank of India
  {
    id: 'central-home', lenderId: 'central-bank', category: 'home', name: 'Cent Home',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.45, range: [7.45, 9.0],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Priced by credit score within RBLR – 1.05% to RBLR + 0.50% (RBLR 8.50%); the bank does not publish the rate for each score.',
      'Women borrowers can apply under Cent Grih Lakshmi at 7.25%–8.50%.',
    ],
    sources: [src.centralRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'central-lap', lenderId: 'central-bank', category: 'lap', name: 'Cent Mortgage',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 8.9, range: [8.9, 12.5],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Priced by credit score within RBLR + 0.40% to RBLR + 4.00%.'],
    sources: [src.centralRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'central-car', lenderId: 'central-bank', category: 'vehicle', name: 'Cent Vehicle (four-wheeler)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.9, range: [7.9, 9.55],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Priced by credit score. Electric cars under Cent Go Green are priced 7.85%–9.50%.'],
    sources: [src.centralRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'central-pl', lenderId: 'central-bank', category: 'personal', name: 'Cent Personal',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 11.5, range: [11.5, 12.0],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Published as 11.50% or 12.00%, set by the bank’s internal risk rating rather than your credit score.'],
    sources: [src.centralRates], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Indian Overseas Bank
  {
    id: 'iob-home', lenderId: 'iob', category: 'home', name: 'IOB Subhagruha Housing Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.45, range: [7.45, 8.45],
    bands: { '800+': 7.45, '750-799': 7.8, '700-749': 8.2, '650-699': 8.45, 'below-650': null },
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Rates for salaried borrowers; non-salaried borrowers pay 0.10% more.',
      'Within a band the bank may price lower (775–799 at 7.50%, 725–749 at 8.10%); the higher figure is shown.',
      'The 650–699 figure is the bank’s rate for 680–699. Scores below 680 are not listed.',
      'Linked to the bank’s RLLR of 8.35% (from 8 Oct 2026).',
    ],
    sources: [src.iobRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'iob-car', lenderId: 'iob', category: 'vehicle', name: 'IOB Vehicle Loan (four-wheeler)',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.85, range: [7.85, 8.85],
    bands: { '800+': 7.85, '750-799': 7.95, '700-749': 8.1, '650-699': 8.85, 'below-650': null },
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: [
      'Within a band the bank may price lower (775–799 at 7.90%, 725–749 at 8.00%); the higher figure is shown.',
      'The 650–699 figure is the bank’s rate for 680–699. Scores below 680 are not listed.',
    ],
    sources: [src.iobRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'iob-pl', lenderId: 'iob', category: 'personal', name: 'IOB Personal Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 10.5, range: [10.5, 13.9],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: [
      'Priced by credit score and by the bank’s employer category (A, B or C): 10.50%–13.25% in category A, up to 13.90% in category C.',
      'Scores below 680 are not listed.',
    ],
    sources: [src.iobRates], effective: null, verified: CHECKED_2, status: 'published',
  },

  // UCO Bank
  {
    id: 'uco-home', lenderId: 'uco', category: 'home', name: 'UCO Home Loan',
    rateType: 'Floating', rateBasis: 'bands', advertisedMin: 7.4, range: [7.4, 9.5],
    bands: { '800+': 7.6, '750-799': 7.8, '700-749': 8.1, '650-699': 9.1, 'below-650': 9.5 },
    maxTenure: 360,
    fees: [waived('Processing fee', 'Presently waived (normally 0.50%, min ₹1,500, max ₹15,000). Documentation charges are nil.', null)],
    prepayment: FLOATING_PREPAY, late: '2% p.a. on the amount in default, for an EMI one month or more late',
    conditions: [
      'Within the 800+ band the bank prices lower for higher scores (825–849 at 7.50%, above 850 at 7.40%); 7.60% is shown.',
      'A further 0.10% may be allowed on takeovers from another lender, and 0.05% for women borrowers.',
      'The page states a minimum score of 650, though it also prices 600–649 at 9.50%.',
      'Linked to the UCO Float Rate of 8.30%.',
    ],
    sources: [src.ucoHome], effective: null, verified: CHECKED_2, status: 'published',
  },
  // IDBI Bank
  {
    id: 'idbi-home', lenderId: 'idbi', category: 'home', name: 'IDBI Bank Home Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.4, range: [7.4, 10.0],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Range for salaried and self-employed professionals. Self-employed non-professionals are priced 7.60%–11.50%.',
      'Linked to the bank’s repo-linked lending rate for retail loans (RLLR SRA 8.15%, as stated on the page).',
    ],
    sources: [src.idbiRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'idbi-lap', lenderId: 'idbi', category: 'lap', name: 'IDBI Bank Mortgage Loan (residential property)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 8.8, range: [8.8, 10.75],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Against commercial property the range is 9.30%–11.00%.'],
    sources: [src.idbiRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'idbi-car', lenderId: 'idbi', category: 'vehicle', name: 'IDBI Bank Auto Loan (new car)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.75, range: [7.75, 8.9],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Certified pre-owned cars are priced 10.40%–11.00%.'],
    sources: [src.idbiRates], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'idbi-pl', lenderId: 'idbi', category: 'personal', name: 'IDBI Bank Personal Loan',
    rateType: 'Fixed', rateBasis: 'range', advertisedMin: 11.0, range: [11.0, 15.5],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Fixed rate. The bank publishes a range only.'],
    sources: [src.idbiRates], effective: null, verified: CHECKED_2, status: 'published',
  },

  // YES BANK
  {
    id: 'yes-home', lenderId: 'yes', category: 'home', name: 'YES BANK Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 8.65, range: [8.65, null],
    maxTenure: null,
    fees: [pct('Processing fee', 1, { min: 10000 })],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['The bank publishes a starting rate only (8.65% onwards). Your rate depends on your profile.'],
    sources: [src.yesHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Tata Capital Housing Finance
  {
    id: 'tata-home', lenderId: 'tata-capital', category: 'home', name: 'Tata Capital Home Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.99, range: [7.99, 13.0],
    maxTenure: null, amount: [500000, 75000000],
    fees: [pct('Processing fee', 3, { upTo: true })],
    prepayment: null, late: '2% per month (24% p.a.) on the defaulted EMI, plus ₹700 per instrument',
    conditions: [
      'Range for salaried borrowers; self-employed borrowers are priced 8.25%–13%.',
      'Loans of ₹5 lakh to ₹7.5 crore. Linked to the lender’s retail prime lending rate (10.90% for customers onboarded from 1 Nov 2026).',
    ],
    sources: [src.tataHome], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'tata-lap', lenderId: 'tata-capital', category: 'lap', name: 'Tata Capital Home Equity Loan',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 9.5, range: [9.5, 17.7],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['A loan against a property you own. Same range for salaried and self-employed borrowers, for any amount.'],
    sources: [src.tataHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Bajaj Housing Finance
  {
    id: 'bajaj-home', lenderId: 'bajaj', category: 'home', name: 'Bajaj Housing Finance Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 7.5, range: [7.5, null],
    maxTenure: 480,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: [
      'The lender publishes a starting rate only (7.50% for salaried applicants). Your rate depends on your profile.',
      'Tenure up to 40 years and loans up to ₹15 crore, subject to eligibility.',
    ],
    sources: [src.bajajHome], effective: null, verified: CHECKED_2, status: 'published',
  },
  {
    id: 'bajaj-bt', lenderId: 'bajaj', category: 'transfer', name: 'Bajaj Housing Finance Balance Transfer',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 7.6, range: [7.6, null],
    maxTenure: 480,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['The lender publishes a starting rate only (7.60% for salaried applicants).', 'Your current lender cannot charge you for closing a floating-rate home loan.'],
    sources: [src.bajajHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // L&T Finance
  {
    id: 'lt-home', lenderId: 'lt-finance', category: 'home', name: 'L&T Finance Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 7.75, range: [7.75, null],
    maxTenure: 360,
    fees: [pct('Processing fee', 3, { upTo: true }), flat('Login fee', 5000, { gst: false, upTo: true })],
    prepayment: null, late: 'Up to 2% per month on the overdue EMI, plus taxes',
    conditions: [
      'The lender publishes a starting rate only (7.75% floating). Your rate depends on your profile.',
      'Loans up to ₹10 crore; the login fee is non-refundable and includes taxes.',
    ],
    sources: [src.ltHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // Piramal Finance
  {
    id: 'piramal-home', lenderId: 'piramal', category: 'home', name: 'Piramal Finance Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 9.99, range: [9.99, null],
    maxTenure: 360, amount: [300000, 20000000],
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['The lender publishes a starting rate only (9.99%) for every loan slab from ₹3 lakh to ₹2 crore.'],
    sources: [src.piramalHome], effective: null, verified: CHECKED_2, status: 'published',
  },

  // SMFG India Home Finance
  {
    id: 'smfg-home', lenderId: 'smfg', category: 'home', name: 'SMFG Grihashakti Home Loan',
    rateType: 'Floating', rateBasis: 'from', advertisedMin: 9.25, range: [9.25, null],
    maxTenure: null,
    fees: [pct('Processing fee', 3, { upTo: true })],
    prepayment: null, late: '2% per month on the overdue EMI, day by day',
    conditions: ['The lender publishes a starting rate only: 9.25% for salaried and 9.75% for self-employed applicants.'],
    sources: [src.smfgHome], effective: null, verified: CHECKED_2, status: 'published',
  },
]

export const lenderById = Object.fromEntries(lenders.map((l) => [l.id, l]))
export const DATA_CHECKED = CHECKED
export const DATA_CHECKED_UNTIL = CHECKED_2
