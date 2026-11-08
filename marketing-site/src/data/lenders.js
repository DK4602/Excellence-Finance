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

// Logos: from each bank's official website, except SBI (vector of its
// keyhole symbol, Wikimedia Commons) and PNB (vector, Wikimedia Commons,
// matching the mark on pnb.bank.in). Trademarks of their respective owners.
export const lenders = [
  { id: 'sbi', name: 'State Bank of India', short: 'SBI', kind: 'Public sector bank', logo: '/banks/sbi.svg', logoMarkOnly: true },
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC Bank', kind: 'Private sector bank', logo: '/banks/hdfc.svg' },
  { id: 'bob', name: 'Bank of Baroda', short: 'Bank of Baroda', kind: 'Public sector bank', logo: '/banks/bob.png' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB', kind: 'Public sector bank', logo: '/banks/pnb.svg' },
  { id: 'bom', name: 'Bank of Maharashtra', short: 'Bank of Maharashtra', kind: 'Public sector bank', logo: '/banks/bom.svg' },
  { id: 'idfc', name: 'IDFC FIRST Bank', short: 'IDFC FIRST Bank', kind: 'Private sector bank', logo: '/banks/idfc.svg' },
]

// Fee helpers
const pct = (label, value, opts = {}) => ({ label, kind: 'percent', value, gst: true, ...opts })
const flat = (label, value, opts = {}) => ({ label, kind: 'flat', value, gst: true, ...opts })
const unknown = (label) => ({ label, kind: 'unknown' })
const waived = (label, note, until) => ({ label, kind: 'waived', note, until })

const FLOATING_PREPAY = 'Nil for individual borrowers on a floating rate'

const src = {
  sbiHome: { label: 'SBI home loan rate card (w.e.f. 15 Oct 2026)', url: 'https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans-interest-rates-current' },
  sbiFee: { label: 'SBI home loan processing fee card', url: 'https://homeloans.sbi.bank.in/downloads/Processing-Fee-Card-Rates.pdf' },
  sbiAuto: { label: 'SBI auto loan interest rates', url: 'https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/auto-loans' },
  sbiPersonal: { label: 'SBI personal loan interest rates', url: 'https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/personal-loans-schemes' },
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
}

const PNB_CAMPAIGN = { effective: '2026-10-01', validUntil: '2026-12-31' }

export const products = [
  // ───────────── Home loans ─────────────
  {
    id: 'sbi-home', lenderId: 'sbi', category: 'home', name: 'SBI Home Loan (Term Loan)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 7.5, range: [7.5, 8.8],
    maxTenure: 360,
    fees: [pct('Processing fee', 0.35, { min: 5000, max: 15000 })],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: [
      'Linked to SBI’s External Benchmark Lending Rate, currently 8.15%. SBI prices within this range by CIBIL score but does not publish the bands.',
      'Additional 0.10% for non-salaried customers with a CIBIL score below 825.',
      'Processing fee shown is for salaried customers (maximum ₹18,000 for non-salaried).',
    ],
    sources: [src.sbiHome, src.sbiFee], effective: '2026-10-15', verified: CHECKED, status: 'published',
  },
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
    id: 'sbi-pl', lenderId: 'sbi', category: 'personal', name: 'SBI Xpress Credit',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 10.0, range: [10.0, 15.0],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: ['Spread of 1.25% to 6.25% over SBI’s 2-year MCLR.', 'Primarily for salaried customers.'],
    sources: [src.sbiPersonal], effective: null, verified: CHECKED, status: 'published',
  },
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
    id: 'sbi-lap', lenderId: 'sbi', category: 'lap', name: 'SBI Loan Against Property (P-LAP)',
    rateType: 'Floating', rateBasis: 'range', advertisedMin: 9.2, range: [9.2, 10.75],
    maxTenure: null,
    fees: [unknown('Processing fee')],
    prepayment: FLOATING_PREPAY, late: null,
    conditions: ['Linked to SBI’s EBLR (8.15%) and priced by CIBIL score; bands are not published.'],
    sources: [src.sbiHome], effective: '2026-10-15', verified: CHECKED, status: 'published',
  },
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
    id: 'sbi-car', lenderId: 'sbi', category: 'vehicle', name: 'SBI Car Loan',
    rateType: 'Fixed', rateBasis: 'bands', advertisedMin: 8.55, range: [8.65, 9.5],
    bands: { '800+': 8.65, '750-799': 9.15, '700-749': 9.4, '650-699': 9.5, 'below-650': null },
    shortTenure: { upTo: 60, delta: -0.1 },
    maxTenure: 84,
    fees: [unknown('Processing fee')],
    prepayment: null, late: null,
    conditions: [
      'Bands shown are for tenures above 5 years; 3 to 5 year loans are 0.10% lower.',
      'SBI splits 750–799 into finer bands (775–799 at 8.80%); the higher figure is shown.',
    ],
    sources: [src.sbiAuto], effective: null, verified: CHECKED, status: 'published',
  },
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
]

export const lenderById = Object.fromEntries(lenders.map((l) => [l.id, l]))
export const DATA_CHECKED = CHECKED
