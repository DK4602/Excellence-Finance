import { useTitle } from '../lib/useTitle'
import { PageHead, Note } from '../components/ui'
import { Close } from './Home'
import Photo from '../components/Photo'
import ProcessRail from '../components/ProcessRail'
import { photos } from '../data/photos'

export const steps = [
  {
    title: 'Enquiry',
    short: 'You share the basics: loan type, amount, city and how to reach you.',
    who: 'You',
    body: 'Use the enquiry form, WhatsApp or a call. We only ask for what a first conversation needs. No documents are collected through the website.',
  },
  {
    title: 'Discussion',
    short: 'An adviser calls to understand your income, plans and constraints.',
    who: 'You and your adviser',
    body: 'We talk through your income type, existing EMIs, the property or asset if any, and what matters most to you: lowest EMI, lowest total cost, speed or flexibility.',
  },
  {
    title: 'Lender comparison',
    short: 'We shortlist lenders and lay out the whole cost of each.',
    who: 'Your adviser',
    body: 'For each shortlisted lender we set out the rate type, indicative rate, every fee with GST, prepayment terms and the conditions that may apply to you, so the choice is yours.',
  },
  {
    title: 'Application help',
    short: 'We help you prepare and submit to the lender you choose.',
    who: 'You, with our help',
    body: 'We tell you which documents the lender is likely to need and how to share them securely with the lender. We help you complete forms accurately.',
  },
  {
    title: 'Lender decision',
    short: 'The lender assesses your application and makes its decision.',
    who: 'The lender',
    body: 'The lender verifies your documents, credit history and, for secured loans, the property or asset. The sanctioned rate, amount and terms are theirs alone, and may differ from the indicative estimate.',
  },
]

export default function Process() {
  useTitle('How it works', 'The five stages from your enquiry to the lender’s decision, and who is responsible for each.')
  return (
    <>
      <PageHead title="How the process works">
        Five stages from first message to the lender’s decision. At each one you know what happens and who is responsible.
      </PageHead>
      <div className="wrap pb-16 md:pb-20">
        <Photo photo={photos.couple} ratio={21 / 9} priority sizes="100vw" className="rounded-3xl max-md:[aspect-ratio:4/3]!" />
      </div>
      <section className="wrap pb-24 md:pb-32">
        <div className="max-w-3xl">
          <ProcessRail
            steps={steps.map((s) => ({ ...s, meta: <>Led by: <span className="font-medium text-ink">{s.who}</span></> }))}
            surface="white"
            headingAs="h2"
          />
        </div>
        <Note className="mt-14 max-w-[80ch]">
          We cannot promise approval, a specific rate or a processing timeline. These depend on the lender’s policy and its assessment of your application.
        </Note>
      </section>
      <Close />
    </>
  )
}
