import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react'
import { nav, site } from '../data/site'
import { loans } from '../data/loans'
import { Button } from './ui'

export function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`inline-flex shrink-0 items-center ${light ? 'rounded-2xl bg-white px-4 py-3' : ''}`}
      aria-label={`${site.name} home`}
    >
      <img
        src="/brand/logo.png"
        alt={site.name}
        width={698}
        height={247}
        className={light ? 'h-14 w-auto' : 'h-11 w-auto md:h-14'}
      />
    </Link>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-[border-color,box-shadow] duration-300 ${
        scrolled ? 'border-b border-line shadow-[0_8px_24px_-20px_rgb(19_35_92/0.35)]' : 'border-b border-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative py-2 transition-colors duration-200 hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-brass after:transition-transform after:duration-300 after:ease-[var(--ease-out-strong)] ${
                      isActive ? 'text-ink after:scale-x-100' : 'text-slate after:scale-x-0 hover:after:scale-x-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button to="/contact" size="sm">Start an enquiry</Button>
          </div>
          <button
            type="button"
            className="press grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-white md:top-20 lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <nav aria-label="Mobile" className="wrap py-8">
              <ul className="space-y-1">
                {[{ label: 'Home', to: '/' }, ...nav, { label: 'Contact', to: '/contact' }].map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        `flex min-h-14 items-center border-b border-line font-display text-[1.6rem] ${isActive ? 'text-lapis' : 'text-ink'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <Button to="/contact" className="mt-8 w-full">Start an enquiry</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-white/70">{site.role}</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Mail className="size-4 text-brass" aria-hidden />{site.email}</li>
            <li className="flex items-center gap-3"><Phone className="size-4 text-brass" aria-hidden />{site.phoneDisplay}</li>
            <li className="flex items-center gap-3"><MessageCircle className="size-4 text-brass" aria-hidden />WhatsApp on the verified business number</li>
          </ul>
        </div>
        <FooterCol title="Loans" links={loans.map((l) => ({ label: l.name, to: `/loans/${l.slug}` }))} />
        <FooterCol
          title="Tools"
          links={[
            { label: 'Compare lenders', to: '/compare' },
            { label: 'EMI calculator', to: '/emi-calculator' },
            { label: 'How it works', to: '/how-it-works' },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: 'About', to: '/about' },
            { label: 'FAQs', to: '/faqs' },
            { label: 'Contact', to: '/contact' },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: 'Privacy policy', to: '/privacy' },
            { label: 'Terms of use', to: '/terms' },
            { label: 'Financial disclaimer', to: '/disclaimer' },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-xs leading-relaxed text-white/60 md:flex-row md:justify-between">
          <p className="max-w-[90ch]">
            Excellence Finance is a loan advisory and brokerage service, not a bank or lender. Rates, fees and EMIs shown are indicative and subject to each lender’s policy and assessment. Approval is not guaranteed.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} {site.name}. Photographs from Unsplash.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div className="md:col-span-2">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <ul className="mt-4 space-y-1 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="inline-flex min-h-9 items-center text-white/70 transition-colors duration-200 hover:text-white">
              <span className="link-draw">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
