import { Mail, MessageCircle, Phone } from 'lucide-react'
import Photo from './Photo'
import { Button } from './ui'
import { photos } from '../data/photos'
import { site } from '../data/site'

// Shared closing call-to-action used at the end of inner pages.
export function Close() {
  const contacts = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Business number to be added', href: site.whatsappHref },
    { icon: Phone, label: 'Call', value: site.phoneDisplay, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ]
  return (
    <section className="bg-sky py-20 md:py-28" aria-labelledby="close-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="order-last mx-auto w-full max-w-md lg:order-first lg:col-span-5 lg:max-w-none">
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
