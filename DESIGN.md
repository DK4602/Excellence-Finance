# Design: Excellence Finance marketing site

Calm, minimal and readable, for an independent loan adviser. One idea leads every page: show the whole cost of a loan, not just the rate. Photographs of real people and homes keep it welcoming. The home page pairs a family photograph with a live calculator ("A home loan of ₹50 lakh over 20 years") that reads back the EMI, total interest and total repayment.

## Colour (tokens in `marketing-site/src/index.css`, `@theme`)

| Token | Hex | Role |
|---|---|---|
| porcelain | #FFFFFF | Page ground |
| mist | #F5F7FB | Quiet panels, form wells, alternating sections |
| sky | #E9EFFC | Closing band, editable-value chips, carried-context notes |
| ink | #13235C | Brand navy from the logo: text, primary buttons, step markers, footer |
| cyan | #1FA9CC | Brand cyan from the logo's arrow: small status dots only |
| lapis | #2443B8 | Links, icons, focus, active states, button hover |
| brass | #C0913A | Fees in charts, nav underline (decorative only) |
| brass-ink | #7E6230 | Brass text that must be read (badges, notes) |
| slate | #4A556D | Secondary text (7:1 on white) |

Chart series (validated with the dataviz checker): principal #2B4FC7, interest #7E9BEA, fees #C0913A. Every chart has value labels and a legend; the EMI schedule also has a table view.

## Logo

- The supplied logo (`marketing-site/brand/logo-original.jpg`) is processed by `marketing-site/brand/process-logo.mjs` into a transparent lockup (`public/brand/logo.png`), the arrow mark alone (`public/brand/logo-mark.png`), and favicons. Re-run the script if the logo changes.
- Header: lockup at 44px tall on phones, 56px from tablet up. Footer: the lockup sits on a white rounded plate, because its navy lettering disappears on the navy footer. A white-on-navy version of the logo from the designer would remove the need for the plate.

## Bank logos

- Files live in `marketing-site/public/banks/`. HDFC Bank, IDFC FIRST Bank and Bank of Maharashtra come from the banks' own websites, and so does Bank of Baroda's 2026 logo. PNB's is a Wikimedia Commons vector that matches its site. SBI's official file could not be downloaded, so its keyhole symbol comes from a Commons vector. Raw downloads are kept in `marketing-site/brand/banks-raw/`.
- Always shown at their own colours on a white tile with a 1px border (the `BankLogo` component), never recoloured, cropped or animated beyond a 2px card lift.
- Wherever logos appear together, a trademark and no-partnership line sits beside them.

## Type

- **Literata** (variable, optical size): headings and the wordmark, weight 560, tracking -0.022em. A book serif made for screens, with sturdy strokes.
- **Figtree** (variable): body text, UI and data. Base size 17px, line height 1.6.
- **`figure` utility**: Figtree 650 with tabular lining numerals, for every money figure.
- Both fonts include the ₹ glyph (checked against the font files).
- Rules: no italic or colour accent on a single word in a heading, no all-caps labels, no eyebrow labels above headings.

## Photography

- Stand-in photographs from Unsplash (free licence) are listed in `marketing-site/src/data/photos.js`. Replace them with the company's own photographs before launch.
- Every photo goes through the `Photo` component: responsive `srcset`, lazy loading (except the hero), face-aware cropping, a short fade-in, and a 1.03 zoom inside its frame when its card is hovered.
- Each photo has descriptive alt text and no caption. The footer carries one credit line.

## Shape and space

- Photos and large panels use a 24px radius, cards 16–20px, inputs 12px; buttons and chips are pills.
- Elevation comes from either a border or a soft offset shadow, never both.
- Content sits inside `.wrap` (max 1280px, gutters of 20/40/56px). Sections use 80–112px of vertical rhythm.
- Section layouts vary on purpose: photo beside a list, a full-width data card, a card grid, a step row. On phones, the heading always comes before the photo.

## Motion (tokens: `--ease-out-strong` cubic-bezier(0.23,1,0.32,1), `--ease-in-out-strong`, `--ease-drawer`)

- **Hero entrance, once:** the headline, copy and buttons rise in a short stagger while the photograph opens from its bottom edge (a clip-path reveal).
- **The one scroll moment:** the cost-anatomy card on home. Its stacked bar draws in and the ₹ total counts up once in view.
- **Responsive motion:** figures tween when inputs change, comparison rows re-sort with a layout animation, and accordions and fee panels expand by height.
- **Micro-interactions:** buttons press to 0.97 over 160ms, links draw an underline, arrows nudge, cards lift 2px and photos zoom slightly on hover.
- **Reduced motion:** movement is removed, the photo fades in instead of opening, and nothing stays hidden.
