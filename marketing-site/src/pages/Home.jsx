import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Mail, MessageCircle, Phone } from 'lucide-react'
import CostInstrument from '../components/CostInstrument'
import CostBar from '../components/CostBar'
import AnimatedNumber from '../components/AnimatedNumber'
import Accordion from '../components/Accordion'
import Photo from '../components/Photo'
import { Button, TextLink, Note } from '../components/ui'
import { loans } from '../data/loans'
import { faqGroups } from '../data/faqs'
import { photos } from '../data/photos'
import { site } from '../data/site'
import { feeAmount, formatDate, formatINR, loanTotals } from '../lib/finance'
import { lenders, DATA_CHECKED } from '../data/lenders'
import BankLogo from '../components/BankLogo'
import { steps } from './Process'
import { useTitle } from '../lib/useTitle'

const ease = [0.23, 1, 0.32, 1]

function Hero() {
  const reduce = useReducedMotion()
  const rise = (d) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease },
  })

  return (
    <section aria-labelledby="hero-title">
      <div className="wrap grid items-center gap-10 py-10 md:py-14 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <motion.h1
            id="hero-title"
            {...rise(0.05)}
            className="font-display text-[2.6rem] leading-[1.06] sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.4rem]"
          >
            Loan advice that shows you the whole cost
          </motion.h1>
          <motion.p {...rise(0.18)} className="mt-6 max-w-[46ch] text-lg text-slate md:text-xl">
            We are independent loan advisers in India, not a bank. We compare lenders on rate, fees, GST and total repayment, then help you apply to the one that suits you.
          </motion.p>
          <motion.div {...rise(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/compare" size="lg">Compare lenders</Button>
            <Button to="/contact" size="lg" variant="secondary">Talk to an adviser</Button>
          </motion.div>
          <motion.ul {...rise(0.38)} className="mt-10 grid gap-2 text-[0.97rem] text-slate sm:grid-cols-2">
            {['Home, personal, business and more', 'Fees and GST shown for every lender', 'No documents needed to enquire', 'Enquiring does not affect your score'].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-lapis" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* The one load moment: the photograph opens from the bottom edge */}
        <motion.div
          className="lg:col-span-6"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.77, 0, 0.175, 1] }}
        >
          <Photo
            photo={photos.familyHome}
            ratio={5 / 4}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-3xl"
          />
        </motion.div>
      </div>
    </section>
  )
}

function YourNumbers() {
  return (
    <section className="bg-mist py-20 md:py-28" aria-labelledby="numbers-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id="numbers-title" className="font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">
            Start with your own numbers
          </h2>
          <p className="mt-5 max-w-[44ch] text-lg text-slate">
            Pick a loan type and move the sliders. You will see the monthly EMI, the interest you pay over the full tenure, and what you repay in total.
          </p>
          <p className="mt-4 max-w-[44ch] text-slate">
            When you are ready, add each lender’s fees and GST to see the full cost side by side.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <CostInstrument />
        </div>
      </div>
    </section>
  )
}

function BanksCompared() {
  return (
    <section className="border-b border-line py-16 md:py-20" aria-labelledby="banks-title">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <h2 id="banks-title" className="font-display text-[1.75rem] leading-tight md:text-[2.1rem]">
            Banks in our comparison
          </h2>
          <p className="mt-3 text-slate">
            Rates and fees taken from each bank’s own website, last checked {formatDate(DATA_CHECKED)}.
          </p>
          <TextLink to="/compare" className="mt-5">Compare these banks</TextLink>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8">
          {lenders.map((l) => (
            <li key={l.id}>
              <Link
                to={`/compare?bank=${l.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl p-1 transition-transform duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5"
              >
                <BankLogo lender={l} size="lg" className="transition-shadow duration-300 group-hover:shadow-[var(--shadow-float)]" />
                <span className="text-sm text-slate group-hover:text-ink">{l.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate lg:col-span-12">
          Bank names and logos are trademarks of their owners and identify whose published terms we show. Inclusion does not mean a partnership with Excellence Finance.
        </p>
      </div>
    </section>
  )
}

// The one scroll moment: the anatomy of a loan's cost draws in.
function Anatomy() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const principal = 5000000
  const t = loanTotals(principal, 8.75, 240)
  const pf = feeAmount({ kind: 'percent', value: 0.5, min: 5000, max: 15000, gst: true }, principal)
  const legal = feeAmount({ kind: 'flat', value: 6500, gst: true }, principal)
  const fees = pf.total + legal.total
  const all = principal + t.totalInterest + fees

  const cols = [
    { title: 'Principal', color: 'bg-principal', value: principal, body: 'The amount you borrow. Interest is charged on whatever is still outstanding, so it falls as you repay.' },
    { title: 'Interest', color: 'bg-interest', value: t.totalInterest, body: 'Over 20 years at 8.75%, interest adds up to more than the loan itself. A rate just 0.25% lower saves lakhs.' },
    { title: 'Upfront fees', color: 'bg-fees', value: fees, body: 'Processing, legal and valuation charges, plus 18% GST. Paid at the start and easy to overlook when comparing rates.' },
  ]

  return (
    <section ref={ref} className="py-20 md:py-28" aria-labelledby="anatomy-title">
      <div className="wrap">
        <h2 id="anatomy-title" className="max-w-[22ch] font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">
          A ₹50 lakh home loan can cost more than ₹1 crore over 20 years
        </h2>

        <div className="mt-12 rounded-3xl border border-line p-6 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-slate">Estimated total repaid</p>
            <AnimatedNumber value={inView ? all : 0} duration={1.4} format={formatINR} className="figure text-[2rem] md:text-[2.6rem]" />
          </div>
          <div className="mt-5">
            <CostBar principal={principal} interest={t.totalInterest} fees={fees} animateIn inView={inView} />
          </div>
          <dl className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {cols.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease }}
              >
                <dt className="flex items-center gap-2.5 font-semibold">
                  <span className={`size-2.5 rounded-full ${c.color}`} aria-hidden />
                  {c.title}
                  <span className="figure ml-auto text-lg md:hidden">{formatINR(c.value)}</span>
                </dt>
                <dd className="mt-2 text-slate">{c.body}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        <Note className="mt-6 max-w-[80ch]">
          Example at an indicative 8.75% p.a., with a 0.5% processing fee capped at ₹15,000 and ₹6,500 in legal and valuation charges. Lender offers vary.
        </Note>
      </div>
    </section>
  )
}

function LoanIndex() {
  return (
    <section className="bg-mist py-20 md:py-28" aria-labelledby="loans-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="loans-title" className="font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">Loans we advise on</h2>
          <TextLink to="/loans">See every loan type</TextLink>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((l) => (
            <li key={l.id}>
              <Link
                to={`/loans/${l.slug}`}
                className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-float)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-strong)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <Photo
                  photo={photos[l.photo]}
                  ratio={16 / 10}
                  widths={[480, 720]}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  imgClassName="group-hover:scale-[1.03]"
                />
                <div className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-[1.45rem] leading-tight">{l.name}</h3>
                    <p className="mt-1.5 text-slate">{l.short}</p>
                  </div>
                  <ArrowRight aria-hidden className="mt-1.5 size-5 shrink-0 text-lapis transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProcessStrip() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="process-title">
      <div className="wrap">
        <h2 id="process-title" className="max-w-[24ch] font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">
          From your first message to the lender’s decision
        </h2>
        <p className="mt-5 max-w-[56ch] text-lg text-slate">
          We prepare and compare. The lender assesses and decides. At every stage you know what is happening and who is responsible.
        </p>
        <ol className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title}>
              <div className="flex items-center gap-3">
                <span className="figure grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm text-white">{i + 1}</span>
                {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-line-strong md:block" aria-hidden />}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate">{s.short}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <TextLink to="/how-it-works">Read how the process works</TextLink>
        </div>
      </div>
    </section>
  )
}

function Commitments() {
  const items = [
    { title: 'We never promise approval', body: 'Only the lender approves a loan. We will not promise an outcome, a rate or a timeline we do not control.' },
    { title: 'Every figure has a source', body: 'Each rate and fee shows where it came from and when we last checked it. If we do not know, we say so.' },
    { title: 'We ask for very little', body: 'Your name, mobile number, city and loan type are enough to begin. No PAN, Aadhaar or documents through this website.' },
  ]
  return (
    <section className="bg-mist py-20 md:py-28" aria-labelledby="commitments-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="order-last lg:order-first lg:col-span-5">
          <Photo photo={photos.adviser} ratio={4 / 5} sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-3xl" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="commitments-title" className="font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">
            What you can expect from us
          </h2>
          <ul className="mt-10 divide-y divide-line-strong border-y border-line-strong">
            {items.map((it) => (
              <li key={it.title} className="py-6">
                <h3 className="text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-slate">{it.body}</p>
              </li>
            ))}
          </ul>
          <TextLink to="/about" className="mt-8">More about us</TextLink>
        </div>
      </div>
    </section>
  )
}

function Tools() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="tools-title">
      <div className="wrap">
        <h2 id="tools-title" className="font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">Plan before you talk to us</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <ToolLink
            to="/emi-calculator"
            title="EMI calculator"
            body="Work out your monthly EMI, total interest and a year-by-year split of principal and interest. Your numbers carry into an enquiry."
            points={['Any amount, rate and tenure', 'Year-by-year schedule', 'Lender charges shown separately']}
            cta="Open the calculator"
          />
          <ToolLink
            to="/compare"
            title="Compare lenders"
            body="See several lenders for the same amount and tenure: rate, every fee with GST, the upfront total and the estimated total cost."
            points={['Sort by EMI, fees or total cost', 'Source and date on every offer', 'Enquire about a specific offer']}
            cta="Start a comparison"
          />
        </div>
      </div>
    </section>
  )
}

function ToolLink({ to, title, body, points, cta }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-8 rounded-3xl border border-line p-8 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[var(--shadow-float)] md:p-10"
    >
      <div>
        <h3 className="font-display text-[1.75rem] leading-tight">{title}</h3>
        <p className="mt-3 max-w-[48ch] text-slate">{body}</p>
      </div>
      <ul className="space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-lapis" />
            {p}
          </li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-2 font-semibold text-lapis">
        <span className="link-draw">{cta}</span>
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function FaqPreview() {
  const items = [faqGroups[0].items[0], faqGroups[1].items[0], faqGroups[2].items[0], faqGroups[3].items[1]]
  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem]">Common questions</h2>
          <TextLink to="/faqs" className="mt-6">Read all FAQs</TextLink>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}

export function Close() {
  const contacts = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Business number to be added', href: site.whatsappHref },
    { icon: Phone, label: 'Call', value: site.phoneDisplay, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ]
  return (
    <section className="bg-sky py-20 md:py-28" aria-labelledby="close-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="order-last lg:order-first lg:col-span-5">
          <Photo photo={photos.phoneCall} ratio={1} sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-3xl" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="close-title" className="font-display text-[2.3rem] leading-[1.1] md:text-[3.2rem]">
            Talk to an adviser about your loan
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-slate">
            Tell us what you need and we will call you back. {site.hours}.
          </p>
          <Button to="/contact" size="lg" className="mt-8">Start an enquiry</Button>
          <ul className="mt-10 divide-y divide-line-strong border-y border-line-strong">
            {contacts.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <Icon aria-hidden className="size-5 text-lapis" />
                  <span className="text-slate">{label}</span>
                  <span className="ml-auto text-right font-medium text-ink">{value}</span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex min-h-14 items-center gap-4 py-3 transition-colors hover:text-lapis">{inner}</a>
                  ) : (
                    <div className="flex min-h-14 items-center gap-4 py-3">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useTitle(null)
  return (
    <>
      <Hero />
      <BanksCompared />
      <YourNumbers />
      <Anatomy />
      <LoanIndex />
      <ProcessStrip />
      <Commitments />
      <Tools />
      <FaqPreview />
      <Close />
    </>
  )
}
