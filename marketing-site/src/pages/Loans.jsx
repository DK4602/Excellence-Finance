import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { loans } from '../data/loans'
import { photos } from '../data/photos'
import Photo from '../components/Photo'
import { PageHead, Note } from '../components/ui'
import { useTitle } from '../lib/useTitle'
import { Close } from './Home'

export default function Loans() {
  useTitle('Loans', 'Home, personal, business, property, vehicle and balance-transfer loans: who each suits, what lenders consider, and the fees to expect.')
  return (
    <>
      <PageHead title="Loans we advise on">
        Who each loan suits, what lenders look at, and the fees that usually apply. Pick one to see indicative terms, or compare lenders directly.
      </PageHead>
      <section className="wrap pb-24 md:pb-32">
        <ul className="grid gap-6 md:grid-cols-2">
          {loans.map((l) => (
            <li key={l.id}>
              <Link
                to={`/loans/${l.slug}`}
                className="group grid h-full overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[2fr_3fr]"
              >
                <Photo
                  photo={photos[l.photo]}
                  ratio={4 / 3}
                  widths={[400, 640]}
                  sizes="(min-width: 768px) 20vw, 100vw"
                  className="sm:h-full sm:[aspect-ratio:auto]!"
                  imgClassName="group-hover:scale-[1.03]"
                />
                <div className="flex flex-col gap-4 p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-[1.6rem] leading-tight">{l.name}</h2>
                    <ArrowRight aria-hidden className="mt-1.5 size-5 shrink-0 text-lapis transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                  </div>
                  <p className="text-slate">{l.suits}</p>
                  <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
                  <div>
                    <dt className="text-slate">Typical tenure</dt>
                    <dd className="mt-0.5 font-medium">{l.typicalTenure}</dd>
                  </div>
                  <div>
                    <dt className="text-slate">Common fees</dt>
                    <dd className="mt-0.5 font-medium">{l.fees.slice(0, 2).join(', ')}</dd>
                  </div>
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Note className="mt-10 max-w-[80ch]">
          Availability, rates and eligibility differ by lender and by applicant. Nothing on this page is an offer of credit.
        </Note>
      </section>
      <Close />
    </>
  )
}
