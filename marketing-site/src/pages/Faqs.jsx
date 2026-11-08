import Accordion from '../components/Accordion'
import { PageHead } from '../components/ui'
import { faqGroups } from '../data/faqs'
import { useTitle } from '../lib/useTitle'
import { Close } from './Home'

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-')

export default function Faqs() {
  useTitle('FAQs', 'Answers about eligibility, credit scores, rates, fees, timelines, documents, privacy and our role as loan advisers.')
  return (
    <>
      <PageHead title="Frequently asked questions">
        About our role, rates and fees, eligibility, and what happens after you enquire.
      </PageHead>
      <section className="wrap grid gap-12 pb-24 md:pb-32 lg:grid-cols-12">
        <nav aria-label="FAQ topics" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-28 lg:flex-col lg:gap-1">
            {faqGroups.map((g) => (
              <li key={g.title}>
                <a href={`#${slug(g.title)}`} className="press inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink lg:border-0 lg:px-0 lg:text-base lg:text-slate lg:hover:text-ink">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-20 lg:col-span-8 lg:col-start-5">
          {faqGroups.map((g) => (
            <section key={g.title} id={slug(g.title)} aria-labelledby={`${slug(g.title)}-h`}>
              <h2 id={`${slug(g.title)}-h`} className="mb-4 font-display text-[2rem] md:text-[2.4rem]">{g.title}</h2>
              <Accordion items={g.items} />
            </section>
          ))}
        </div>
      </section>
      <Close />
    </>
  )
}
