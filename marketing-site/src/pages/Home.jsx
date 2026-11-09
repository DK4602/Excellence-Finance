import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeftRight, ArrowRight, Briefcase, Building2, Check, ClipboardCheck, Clock, Handshake, House,
  KeyRound, Mail, MessageCircle, MessagesSquare, Phone, ReceiptText, Store, UserRound,
} from 'lucide-react'
import Accordion from '../components/Accordion'
import EnquiryForm from '../components/EnquiryForm'
import HeroMark3D from '../components/HeroMark3D'
import PartnerCarousel from '../components/PartnerCarousel'
import Photo from '../components/Photo'
import { Button, Note, TextLink } from '../components/ui'
import { getHomeContent } from '../content/home'
import { loanById } from '../data/loans'
import { partners } from '../data/partners'
import { photos } from '../data/photos'
import { site } from '../data/site'
import { useTitle } from '../lib/useTitle'

// Kept so inner pages can keep importing the shared closing section from here
export { Close } from '../components/Close'

const ease = [0.23, 1, 0.32, 1]
const ICONS = {
  user: UserRound, building: Building2, receipt: ReceiptText, clipboard: ClipboardCheck, handshake: Handshake,
  message: MessagesSquare, briefcase: Briefcase, store: Store, key: KeyRound, home: House, swap: ArrowLeftRight,
}

function SectionTitle({ id, children, className = '' }) {
  return (
    <h2 id={id} className={`font-display text-[2.1rem] leading-[1.12] md:text-[2.8rem] ${className}`}>
      {children}
    </h2>
  )
}

// A. Hero
function Hero({ hero }) {
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
          <motion.h1 id="hero-title" {...rise(0.05)} className="font-display text-[2.6rem] leading-[1.06] sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.4rem] 2xl:text-[4.9rem]">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.18)} className="mt-6 max-w-[48ch] text-lg text-slate md:text-xl">
            {hero.description}
          </motion.p>
          <motion.div {...rise(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href} size="lg">{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="secondary">{hero.secondaryCta.label}</Button>
          </motion.div>
          <motion.p {...rise(0.38)} className="mt-8 flex max-w-[52ch] items-start gap-2.5 text-[0.97rem] text-slate">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-lapis" />
            {hero.lenderNote}
          </motion.p>
        </div>
        <motion.div
          className="mx-auto w-full max-w-[13rem] sm:max-w-[18rem] md:max-w-sm lg:col-span-6 lg:max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <HeroMark3D />
        </motion.div>
      </div>
    </section>
  )
}

// Lenders the company works with
function Partners({ content }) {
  const list = partners.filter((p) => p.published)
  return (
    <section className="border-y border-line bg-white py-14 md:py-16" aria-labelledby="partners-title">
      <div className="wrap">
        <h2 id="partners-title" className="text-center font-display text-[1.6rem] leading-tight md:text-[2rem]">{content.title}</h2>
        <p className="mx-auto mt-2 max-w-[60ch] text-center text-slate">{content.note}</p>
      </div>
      <div className="mt-8">
        <PartnerCarousel partners={list} label={content.title} />
      </div>
      <p className="wrap mt-2 text-center text-xs text-slate">Logos are trademarks of their respective owners.</p>
    </section>
  )
}

// B. Loan services
function Services({ content, onEnquire }) {
  return (
    <section id="services" className="py-20 md:py-28" aria-labelledby="services-title">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTitle id="services-title">{content.title}</SectionTitle>
            <p className="mt-3 max-w-[56ch] text-lg text-slate">{content.intro}</p>
          </div>
          <TextLink to="/loans" className="shrink-0">All loan services</TextLink>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((s) => {
            const loan = loanById[s.loanId]
            if (!loan) return null
            return (
              <li key={s.loanId} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-float)]">
                <Link to={`/loans/${loan.slug}`} className="group block" tabIndex={-1} aria-hidden>
                  <Photo
                    photo={photos[loan.photo]}
                    ratio={16 / 10}
                    widths={[480, 720]}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    imgClassName="group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[1.5rem] leading-tight">{loan.name}</h3>
                  <p className="mt-2 text-slate">{s.description}</p>
                  <ul className="mt-4 space-y-1.5 text-[0.97rem]">
                    {s.useCases.map((u) => (
                      <li key={u} className="flex items-start gap-2">
                        <Check aria-hidden className="mt-1 size-4 shrink-0 text-lapis" />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                    <Button size="sm" onClick={() => onEnquire(s.loanId)} aria-label={`Enquire now about a ${loan.name.toLowerCase()}`}>
                      Enquire Now
                    </Button>
                    <TextLink to={`/loans/${loan.slug}`}>
                      Learn More<span className="sr-only"> about {loan.name.toLowerCase()}s</span>
                    </TextLink>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// C. About
function About({ content }) {
  return (
    <section className="bg-mist py-20 md:py-28" aria-labelledby="about-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="order-last mx-auto w-full max-w-md lg:order-first lg:col-span-5 lg:max-w-none">
          <Photo photo={photos.familyHome} ratio={4 / 5} sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-3xl" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <SectionTitle id="about-title">{content.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-lg text-slate">
            {content.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <TextLink to={content.link.href} className="mt-8">{content.link.label}</TextLink>
        </div>
      </div>
    </section>
  )
}

// D. Why choose us
function WhyChooseUs({ content }) {
  return (
    <section className="py-20 md:py-28" aria-labelledby="why-title">
      <div className="wrap">
        <SectionTitle id="why-title">{content.title}</SectionTitle>
        <ul className="mt-12 grid gap-x-12 gap-y-2 md:grid-cols-2">
          {content.items.map((it) => {
            const Icon = ICONS[it.icon] ?? Check
            return (
              <li key={it.title} className="flex gap-4 border-t border-line py-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky text-lapis">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1 text-slate">{it.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// E. Process
function Process({ content }) {
  return (
    <section className="bg-mist py-20 md:py-28" aria-labelledby="process-title">
      <div className="wrap">
        <SectionTitle id="process-title">{content.title}</SectionTitle>
        <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          {content.steps.map((s, i) => (
            <li key={s.title}>
              <div className="flex items-center gap-3">
                <span className="figure grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white">{i + 1}</span>
                {i < content.steps.length - 1 && <span className="hidden h-px flex-1 bg-line-strong md:block" aria-hidden />}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate">{s.body}</p>
            </li>
          ))}
        </ol>
        <Note className="mt-12 max-w-[80ch]">{content.note}</Note>
        <TextLink to="/how-it-works" className="mt-6">See the process in detail</TextLink>
      </div>
    </section>
  )
}

// F. Who we help
function WhoWeHelp({ content }) {
  return (
    <section className="py-20 md:py-28" aria-labelledby="who-title">
      <div className="wrap">
        <SectionTitle id="who-title">{content.title}</SectionTitle>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((it) => {
            const Icon = ICONS[it.icon] ?? UserRound
            return (
              <li key={it.title} className="rounded-2xl border border-line p-6">
                <Icon aria-hidden className="size-6 text-lapis" />
                <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
                <p className="mt-1.5 text-slate">{it.body}</p>
                <p className="mt-4 flex flex-wrap gap-2">
                  {it.loans.map((id) => loanById[id] && (
                    <Link
                      key={id}
                      to={`/loans/${loanById[id].slug}`}
                      className="press inline-flex min-h-11 items-center rounded-full bg-sky px-3.5 text-sm text-ink hover:bg-[#dde6fa]"
                    >
                      {loanById[id].name}
                    </Link>
                  ))}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// Brief links to the separate tools (no embedded functionality)
function Tools({ content }) {
  return (
    <section className="border-t border-line py-14 md:py-16" aria-labelledby="tools-title">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:items-center">
        <h2 id="tools-title" className="font-display text-[1.6rem] leading-tight md:text-[2rem] lg:col-span-4">{content.title}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {content.items.map((t) => (
            <li key={t.href}>
              <Link to={t.href} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-line p-5 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[var(--shadow-float)]">
                <span>
                  <span className="block font-semibold">{t.title}</span>
                  <span className="mt-0.5 block text-sm text-slate">{t.body}</span>
                </span>
                <ArrowRight aria-hidden className="size-5 shrink-0 text-lapis transition-transform duration-300 group-hover:translate-x-1" />
                <span className="sr-only">{t.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// G. Consultation enquiry
function Enquiry({ content, preset }) {
  const contacts = [
    site.whatsappHref && { icon: MessageCircle, label: content.whatsappLabel, value: 'WhatsApp', href: site.whatsappHref },
    { icon: Phone, label: 'Call', value: site.phoneDisplay, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: 'Hours', value: site.hours },
  ].filter(Boolean)
  return (
    <section id="enquiry" className="bg-sky py-20 md:py-28" aria-labelledby="enquiry-title">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
        <div className="lg:col-span-4">
          <SectionTitle id="enquiry-title">{content.title}</SectionTitle>
          <p className="mt-5 text-lg text-slate">{content.intro}</p>
        </div>
        <div id="enquiry-form" className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-[var(--shadow-float)] md:p-10 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
          <EnquiryForm variant="compact" preset={preset} source="homepage" />
        </div>
        <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2">
          <ul className="divide-y divide-line-strong border-y border-line-strong">
            {contacts.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <Icon aria-hidden className="size-5 shrink-0 text-lapis" />
                  <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="shrink-0 text-sm text-slate sm:text-base">{label}</span>
                    <span className="min-w-0 font-medium text-ink [overflow-wrap:anywhere] sm:text-right">{value}</span>
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex min-h-14 items-center gap-4 py-3 transition-colors hover:text-lapis" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
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

// H. FAQs
function Faqs({ content }) {
  return (
    <section className="py-20 md:py-28" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTitle id="faq-title">{content.title}</SectionTitle>
          <TextLink to={content.link.href} className="mt-6">{content.link.label}</TextLink>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={content.items} />
        </div>
      </div>
    </section>
  )
}

export default function Home({ content: override }) {
  const content = getHomeContent(override)
  useTitle(content.seo.title, content.seo.description)
  const [preset, setPreset] = useState(null)

  // "Enquire Now": pre-select the loan, bring the form into view, focus the first field
  const enquire = useCallback((loanId) => {
    setPreset({ loan: loanId, nonce: Date.now() })
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    window.setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), smooth ? 600 : 0)
  }, [])

  return (
    <>
      <Hero hero={content.hero} />
      <Partners content={content.partners} />
      <Services content={content.services} onEnquire={enquire} />
      <About content={content.about} />
      <WhyChooseUs content={content.whyChooseUs} />
      <Process content={content.process} />
      <WhoWeHelp content={content.whoWeHelp} />
      <Tools content={content.tools} />
      <Enquiry content={content.enquiry} preset={preset} />
      <Faqs content={content.faqs} />
    </>
  )
}
