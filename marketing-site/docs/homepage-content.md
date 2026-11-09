# Homepage: content and backend handover

The homepage (`src/pages/Home.jsx`) renders only from data. Nothing customer-facing is written into the layout. This note covers what the Laravel + Filament app needs to supply when the prototype is ported to Inertia.

## Where each piece of content comes from

| Homepage section | Prototype source | Laravel / Filament (planned) |
|---|---|---|
| Hero headline, description, lender note, CTA text and links | `src/content/home.js` → `hero` | Homepage content (Filament page or `page_sections` rows, key `home.hero`) |
| Lenders we work with | `src/data/partners.js` | Lender list with logo upload, order, publish toggle (reuse the planned Banks/Lenders resource with a `show_on_homepage` flag) |
| Loan services (names, slugs, photos) | `src/data/loans.js` | Loan categories resource (already required) |
| Loan services (homepage description, use cases, featured, order) | `home.js` → `services.items` | Fields on the loan category: `home_description`, `home_use_cases[]`, `is_featured`, `sort` |
| About, Why choose us, Process, Who we help, Tools | `home.js` | `page_sections` rows (or a Filament settings page) with repeaters; each item has `published` |
| FAQs | `home.js` → `faqs.items` | FAQ resource with `placement = home` and `published` |
| Phone, WhatsApp, email, address, hours, consultation fee | `src/data/site.js` | Filament → Settings (single source; never repeat in page content) |

**How to swap in the backend:** `Home` accepts an optional `content` prop and merges it over the defaults in `getHomeContent()`. In Laravel, `HomeController` returns `Inertia::render('Home', ['content' => …])` with the same shape as `homeContent`. Unpublished items are filtered out on the client too, but the controller should already exclude them.

**Business facts still to confirm** (they show as placeholders until then):
- Phone number and WhatsApp link (`phoneHref`, `whatsappHref`)
- Office address and legal name
- `consultationIsFree`: set to `true` only if consultations are genuinely free. The buttons then read "Get Free Consultation"; until then they read "Request a Consultation".
- `consultationFeeNote`: the "Do you charge for a consultation?" FAQ stays hidden until this is filled in.

## Enquiry API contract

The client is `src/lib/api.js`. The success screen appears only after the server confirms the enquiry was saved.

`POST /api/enquiries` (JSON)

| Field | Required | Rules |
|---|---|---|
| `name` | yes | 2 to 80 characters |
| `mobile` | yes | `^[6-9]\d{9}$` (the client strips +91 and leading 0) |
| `loan_type` | yes | one of `home, personal, business, lap, vehicle, transfer` |
| `city` | yes | 2 to 60 characters |
| `amount` | no | positive number |
| `message` | no | up to 1,000 characters |
| `consent` | yes | must be `true`. Store it with a timestamp and the privacy policy version |
| `source_page`, `source`, `context` | no | attribution and comparison context |
| `website` | honeypot | if filled, return 201 but do not store |
| `tenure_months`, `credit_score_band`, `employment_type`, `contact_method` | no | sent by the Contact page form only |

Headers: `Idempotency-Key` (one per form fill; return the original reference with **409** on repeats) and `X-XSRF-TOKEN` (Sanctum/Inertia).

Responses:
- **201** `{ reference }`: saved
- **409** `{ reference }`: duplicate submission of the same form
- **422** Laravel validation errors (field messages appear under the matching inputs)
- **429** rate-limited

Save the lead **before** sending staff or WhatsApp notifications, so a failed notification never loses an enquiry. Flag possible duplicates by mobile number for staff review rather than rejecting them.

OTP verification is not built yet. When it is, insert a verify step before `submitEnquiry`, keeping the same response shapes.

## Local development

`npm run dev` serves a stand-in for this endpoint (`dev/enquiry-endpoint.js`). It applies the same rules, stores to `.dev-data/enquiries.json` (git-ignored, since it holds personal data) and is excluded from production builds. Create `.dev-data/fail` to make it return 500 for testing the error path.
