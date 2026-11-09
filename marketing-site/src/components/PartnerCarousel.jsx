import { useReducedMotion } from 'motion/react'

// A bare logo: no card, just the mark at a consistent optical size
function Logo({ partner }) {
  return (
    <div className="logo-tile flex h-16 w-36 shrink-0 items-center justify-center md:h-20 md:w-44">
      {partner.logo && !partner.markOnly ? (
        <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" className="logo-tile__art block max-h-11 w-full object-contain md:max-h-14" />
      ) : partner.logo ? (
        <span className="flex items-center gap-2.5">
          <img src={partner.logo} alt="" loading="lazy" decoding="async" className="logo-tile__art block h-10 w-auto object-contain md:h-12" />
          <span className="logo-tile__art text-sm leading-tight font-semibold text-ink">{partner.name}</span>
        </span>
      ) : (
        <span className="logo-tile__art text-center text-[0.95rem] leading-tight font-semibold text-ink">{partner.name}</span>
      )}
    </div>
  )
}

function Row({ items, reverse, label }) {
  return (
    <div className="marquee" style={{ '--marquee-duration': `${items.length * 4.5}s` }}>
      <div className={`marquee__track ${reverse ? 'marquee__track--reverse' : ''}`}>
        <ul className="flex gap-10 pr-10 md:gap-14 md:pr-14" aria-label={label}>
          {items.map((p) => (
            <li key={p.id}><Logo partner={p} /></li>
          ))}
        </ul>
        {/* Second copy makes the loop seamless; hidden from assistive tech */}
        <ul className="flex gap-10 pr-10 md:gap-14 md:pr-14" aria-hidden="true">
          {items.map((p) => (
            <li key={p.id}><Logo partner={p} /></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Two logo rows drifting in opposite directions. Each row pauses while the
// pointer is over it or a keyboard user focuses inside it. Under reduced
// motion the logos sit in a static wrapped grid instead.
export default function PartnerCarousel({ partners, label }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <ul className="wrap flex flex-wrap justify-center gap-x-10 gap-y-6" aria-label={label}>
        {partners.map((p) => (
          <li key={p.id}><Logo partner={p} /></li>
        ))}
      </ul>
    )
  }

  const half = Math.ceil(partners.length / 2)
  return (
    <div className="space-y-4 md:space-y-6">
      <Row items={partners.slice(0, half)} label={`${label}, part 1`} />
      <Row items={partners.slice(half)} reverse label={`${label}, part 2`} />
    </div>
  )
}
