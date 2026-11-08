// A bank's logo on a calm white tile, so logos with their own colour blocks
// (HDFC, IDFC FIRST, Bank of Maharashtra) sit evenly beside plain wordmarks.
const sizes = {
  sm: 'h-9 w-[4.5rem] p-1.5',
  md: 'h-14 w-28 p-2.5',
  lg: 'h-20 w-full p-4',
}

export default function BankLogo({ lender, size = 'md', className = '' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white ${sizes[size]} ${className}`}>
      <img
        src={lender.logo}
        alt={`${lender.name} logo`}
        loading="lazy"
        decoding="async"
        className={`block min-h-0 min-w-0 object-contain ${lender.logoMarkOnly ? 'h-[85%] w-auto' : 'h-full w-full'}`}
      />
    </span>
  )
}
