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
  // Set to true only if the first consultation is genuinely free of charge.
  // While null, CTAs avoid the word "free" and the fee FAQ stays unpublished.
  consultationIsFree: null,
  // Plain-language statement of any advisory fee, e.g. 'Our first consultation is free…'
  consultationFeeNote: null,
}

// Where the consultation enquiry lives. The homepage hosts the form.
export const ENQUIRY_HREF = '/#enquiry'

export const consultationLabel = () => (site.consultationIsFree === true ? 'Get Free Consultation' : 'Request a Consultation')

export const nav = [
  { label: 'Home', to: '/', end: true },
  { label: 'Loan Services', to: '/loans' },
  { label: 'Compare Banks', to: '/compare' },
  { label: 'EMI Calculator', to: '/emi-calculator' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
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
