import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import EnquiryForm from '../components/EnquiryForm'
import { PageHead } from '../components/ui'
import { site } from '../data/site'
import { useTitle } from '../lib/useTitle'

export default function Contact() {
  useTitle('Contact', 'Start an enquiry with an Excellence Finance adviser by form, WhatsApp, phone or email.')
  const rows = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Business number to be added', href: site.whatsappHref },
    { icon: Phone, label: 'Phone', value: site.phoneDisplay, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: 'Hours', value: site.hours },
    { icon: MapPin, label: 'Service area', value: `${site.area}. ${site.office}.` },
  ]
  return (
    <>
      <PageHead title="Start an enquiry">
        Four details are enough to begin. An adviser will contact you to talk it through. No documents, PAN or Aadhaar needed at this stage.
      </PageHead>
      <section className="wrap grid gap-12 pb-24 md:pb-32 lg:grid-cols-12">
        <div className="relative rounded-[20px] border border-line p-6 shadow-[var(--shadow-float)] md:p-10 lg:col-span-8">
          <EnquiryForm />
        </div>
        <aside className="lg:col-span-4">
          <h2 className="font-display text-[1.75rem]">Other ways to reach us</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4 py-5">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-lapis" />
                <div className="min-w-0">
                  <p className="text-sm text-slate">{label}</p>
                  {href ? (
                    <a href={href} className="link-draw font-medium">{value}</a>
                  ) : (
                    <p className="font-medium [overflow-wrap:anywhere]">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  )
}
