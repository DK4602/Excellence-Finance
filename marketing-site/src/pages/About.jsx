import { PageHead, Note } from '../components/ui'
import Photo from '../components/Photo'
import { photos } from '../data/photos'
import { site } from '../data/site'
import { useTitle } from '../lib/useTitle'
import { Close } from './Home'

export default function About() {
  useTitle('About', 'Excellence Finance is an independent loan advisory and brokerage business in India. We are not a bank or lender.')
  const facts = [
    ['What we are', 'An independent loan advisory and brokerage business.'],
    ['What we are not', 'A bank, NBFC or lender. We do not approve or disburse loans.'],
    ['What we do', 'Explain loan options, compare lenders on total cost, and help you apply.'],
    ['Where', site.area + '.'],
    ['Registered name', site.legalName + '.'],
    ['Office', site.office + '.'],
  ]
  return (
    <>
      <PageHead title="Advisers on your side of the table">
        A loan is often the largest financial commitment a household or business makes. We help you see the whole of it before you sign.
      </PageHead>

      <div className="wrap pb-16 md:pb-20">
        <Photo photo={photos.family} ratio={21 / 9} priority sizes="100vw" className="rounded-3xl max-md:[aspect-ratio:4/3]!" />
      </div>

      <section className="wrap grid gap-14 pb-24 lg:grid-cols-12">
        <div className="space-y-6 text-lg text-slate lg:col-span-6">
          <p>
            Lenders advertise their lowest rate. Borrowers live with the full cost: the rate they are actually offered, processing and legal fees, GST, insurance they may not need, and terms that decide whether they can prepay without a penalty.
          </p>
          <p>
            Excellence Finance exists to put those pieces side by side. We talk to you first, understand your income and plans, and then compare the lenders that fit, so you can choose on the full picture.
          </p>
          <p className="text-ink">
            We will never promise an approval, a rate or a timeline. Those belong to the lender. What we can promise is to show you where every figure comes from.
          </p>
        </div>
        <dl className="divide-y divide-line border-y border-line lg:col-span-5 lg:col-start-8">
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm text-slate">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap pb-24">
        <Note className="max-w-[80ch]">
          Lender relationships, accreditations, years of experience and team credentials will be added here once verified. We do not publish claims we cannot substantiate.
        </Note>
      </section>
      <Close />
    </>
  )
}
