// Homepage content. Everything an administrator should be able to edit lives
// here, in the shape the Laravel app will pass to the page as Inertia props
// (see docs/homepage-content.md). Items with `published: false` are hidden.
// Business facts (phone, address, consultation fee) come from data/site.js,
// which maps to Filament → Settings, and are never repeated here.
import { site, consultationLabel } from '../data/site'

export const homeContent = {
  seo: {
    title: null, // null → default site title
    description:
      'Loan advisory and brokerage in India. Get help exploring home, personal, business, property, vehicle and balance transfer loans from different lenders.',
  },

  hero: {
    headline: 'Loan advice for your home, your business and your plans',
    description:
      'Excellence Finance is a loan advisory and brokerage firm. We help you understand your options, explore offers from different banks and housing finance companies, and prepare your application.',
    lenderNote:
      'We are not a lender. We help you explore financing options from different lenders, and each lender makes its own decision on your application.',
    primaryCta: { label: consultationLabel(), href: '#enquiry' },
    secondaryCta: { label: 'Explore Our Services', href: '#services' },
  },

  partners: {
    title: 'Banks and housing finance companies we work with',
    note: 'Each lender assesses applications under its own policies and makes its own lending decision.',
  },

  services: {
    title: 'Our loan services',
    intro: 'Six types of loan, each with guidance from first question to application.',
    items: [
      {
        loanId: 'home',
        published: true,
        description: 'Help financing the purchase or construction of a residential property.',
        useCases: ['Buying a ready or under-construction home', 'Building on land you already own', 'Extending or improving your home'],
      },
      {
        loanId: 'personal',
        published: true,
        description: 'Guidance on unsecured loans for planned or unexpected personal needs.',
        useCases: ['Weddings and family occasions', 'Medical or education expenses', 'Consolidating higher-interest debt'],
      },
      {
        loanId: 'business',
        published: true,
        description: 'Financing assistance for running and growing your business.',
        useCases: ['Working capital for day-to-day operations', 'Buying machinery or equipment', 'Opening a new location'],
      },
      {
        loanId: 'lap',
        published: true,
        description: 'Loans secured against residential or commercial property you own.',
        useCases: ['Larger amounts over longer tenures', 'Business or personal funding needs', 'You keep using or renting out the property'],
      },
      {
        loanId: 'vehicle',
        published: true,
        description: 'Financing assistance for buying a new or pre-owned vehicle.',
        useCases: ['New cars and two-wheelers', 'Pre-owned vehicles', 'Vehicles for personal or business use'],
      },
      {
        loanId: 'transfer',
        published: true,
        description: 'Help moving an existing loan to another lender, where it suits you.',
        useCases: ['Checking whether a lower rate is available', 'Weighing switching costs against savings', 'Top-up funds, subject to eligibility'],
      },
    ],
  },

  about: {
    title: 'About Excellence Finance',
    paragraphs: [
      'Excellence Finance is an independent loan advisory and brokerage firm. We are not a bank or a lender.',
      'We specialise in home, personal, business, property, vehicle and balance transfer loans. We help you understand what each lender offers, what it costs, and what it will ask of you.',
      'We start by listening: your income, your plans and what matters most to you. Then we explain your options in plain language and help you take the next step with the lender you choose.',
    ],
    link: { label: 'Read more about us', href: '/about' },
  },

  whyChooseUs: {
    title: 'Why choose us',
    items: [
      { icon: 'user', title: 'Personalised loan guidance', body: 'Advice based on your income, plans and priorities, not a one-size-fits-all product.', published: true },
      { icon: 'building', title: 'Multiple lender options', body: 'We help you explore offers from different banks and housing finance companies.', published: true },
      { icon: 'receipt', title: 'Rates and charges explained', body: 'We go through the interest rate, processing fees, GST and other charges with you.', published: true },
      { icon: 'clipboard', title: 'Eligibility made clear', body: 'We help you understand what lenders look for and the documents they usually need.', published: true },
      { icon: 'handshake', title: 'Support with your application', body: 'We help you prepare and submit your application to the lender you choose.', published: true },
      { icon: 'message', title: 'Follow-up and communication', body: 'We keep in touch through the process and answer your questions as they come up.', published: true },
    ],
  },

  process: {
    title: 'How our process works',
    steps: [
      { title: 'Share your requirements', body: 'Tell us what kind of loan you need and roughly how much.' },
      { title: 'Explore loan options', body: 'We help identify lenders and products that may suit your situation.' },
      { title: 'Get expert assistance', body: 'Your adviser explains eligibility, fees and what the application needs.' },
      { title: 'Proceed with your application', body: 'We help with the next steps and coordinate with the lender.' },
    ],
    note: 'The final decision on any loan, including its rate and terms, is made by the lending institution.',
  },

  whoWeHelp: {
    title: 'Who we help',
    items: [
      { icon: 'briefcase', title: 'Salaried professionals', body: 'Home, personal and vehicle loans matched to your salary and existing EMIs.', loans: ['home', 'personal', 'vehicle'], published: true },
      { icon: 'user', title: 'Self-employed individuals', body: 'Help presenting your income documents to lenders who assess self-employed applicants.', loans: ['home', 'personal', 'lap'], published: true },
      { icon: 'store', title: 'Business owners', body: 'Working capital, equipment and expansion funding, secured or unsecured.', loans: ['business', 'lap'], published: true },
      { icon: 'key', title: 'First-time homebuyers', body: 'Guidance on down payment, eligibility and what to check before you commit.', loans: ['home'], published: true },
      { icon: 'home', title: 'Property owners', body: 'Unlock funds against a residential or commercial property you own.', loans: ['lap'], published: true },
      { icon: 'swap', title: 'Existing borrowers', body: 'Check whether moving your loan to another lender could lower your cost.', loans: ['transfer'], published: true },
    ],
  },

  tools: {
    title: 'Plan before you talk to us',
    items: [
      { title: 'Compare banks', body: 'Published rates and fees from several banks, side by side.', href: '/compare', cta: 'Compare banks' },
      { title: 'EMI calculator', body: 'Estimate your monthly instalment and total interest.', href: '/emi-calculator', cta: 'Open the calculator' },
    ],
  },

  enquiry: {
    title: consultationLabel(),
    intro: 'Share a few details and an adviser will contact you to discuss your loan. No documents are needed at this stage.',
    whatsappLabel: 'Prefer WhatsApp? Message us',
  },

  faqs: {
    title: 'Frequently asked questions',
    link: { label: 'See all FAQs', href: '/faqs' },
    items: [
      {
        q: 'Which types of loans do you help with?',
        a: 'Home loans, personal loans, business loans, loans against property, vehicle loans and balance transfers of existing loans.',
        published: true,
      },
      {
        q: 'How does your loan advisory assistance work?',
        a: 'You share your requirements, we help you explore suitable lenders and products, explain eligibility, fees and documents, and then help you apply and coordinate with the lender you choose.',
        published: true,
      },
      {
        q: 'What affects my loan eligibility?',
        a: 'Lenders usually look at your income and how stable it is, your credit history, existing EMIs, age and employment or business profile. For secured loans they also assess the property or vehicle.',
        published: true,
      },
      {
        q: 'Can I compare lenders?',
        a: 'Yes. Our Compare Banks page shows published rates and fees from several banks for the same amount and tenure. An adviser can then check those options against your profile.',
        published: true,
      },
      {
        q: 'How are interest rates and processing charges decided?',
        a: 'Each lender sets its own rate and charges based on its policy and its assessment of your application. Processing fees usually attract GST. We explain the rate and charges of any offer before you apply.',
        published: true,
      },
      {
        q: 'Do you charge for a consultation?',
        a: site.consultationFeeNote,
        published: Boolean(site.consultationFeeNote),
      },
      {
        q: 'How do I start?',
        a: 'Fill in the consultation form on this page, or contact us by phone, email or WhatsApp. An adviser will get in touch to understand what you need.',
        published: true,
      },
    ],
  },
}

// Returns content with unpublished items removed. `override` is where the
// Laravel controller's Inertia props will be merged in after the port.
export function getHomeContent(override) {
  const c = override ? { ...homeContent, ...override } : homeContent
  const pub = (list) => list.filter((i) => i.published !== false)
  return {
    ...c,
    services: { ...c.services, items: pub(c.services.items) },
    whyChooseUs: { ...c.whyChooseUs, items: pub(c.whyChooseUs.items) },
    whoWeHelp: { ...c.whoWeHelp, items: pub(c.whoWeHelp.items) },
    faqs: { ...c.faqs, items: pub(c.faqs.items) },
  }
}
