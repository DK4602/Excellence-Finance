// Business details. Every value here must be verified before launch.
// In production these come from Filament → Settings.
export const site = {
  name: 'Excellence Finance',
  legalName: 'Excellence Finance (legal name to be confirmed)',
  role: 'Independent loan advisory and brokerage. Not a bank or lender.',
  phoneDisplay: 'Phone number to be added',
  phoneHref: null, // e.g. 'tel:+91XXXXXXXXXX' once verified
  whatsappHref: null, // e.g. 'https://wa.me/91XXXXXXXXXX' once verified
  email: 'hello@excellencefinance.example',
  area: 'Serving clients across India',
  office: 'Office address to be confirmed',
  hours: 'Monday to Saturday, 10:00 to 19:00 IST',
}

export const nav = [
  { label: 'Loans', to: '/loans' },
  { label: 'Compare lenders', to: '/compare' },
  { label: 'EMI calculator', to: '/emi-calculator' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
]

export const scoreBands = [
  { id: '800+', label: '800 and above' },
  { id: '750-799', label: '750 to 799' },
  { id: '700-749', label: '700 to 749' },
  { id: '650-699', label: '650 to 699' },
  { id: 'below-650', label: 'Below 650' },
  { id: 'unknown', label: "I don't know my score" },
]

export const employmentTypes = [
  'Salaried',
  'Self-employed professional',
  'Business owner',
  'Retired / pensioner',
  'Other',
]
