# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Marketing site prototype: standalone Vite + React + Tailwind CSS + React Router (user-confirmed), with mock lender data. Pages and components are structured to be ported into the planned production stack: Laravel + Inertia.js + React + Tailwind, Filament admin, MySQL.

## Users

- **Prospective borrowers in India** looking at home, personal, business, property, vehicle and balance-transfer loans. Most browse on mobile, often weighing a large commitment, and want to understand the real cost before talking to anyone.
- **Company staff** follow up on enquiries (served by Filament, out of scope for the marketing surface).

## Product Purpose

Excellence Finance is an independent loan advisory and brokerage business, not a bank. The site explains its services, helps visitors compare indicative lender offers on total cost of borrowing (not just the headline rate), provides an EMI calculator, and captures enquiries for staff follow-up. Success means qualified enquiries that arrive with context (loan type, amount, tenure, offer considered).

## Positioning

Compares lenders on the whole cost: rate, processing and other fees, GST, upfront charges, total interest and total repayment, with sources and last-verified dates shown. Advice-led and transparent; it never promises approval, rates or timelines.

## Capabilities and Constraints

- Loan categories (configurable): Home Loan, Personal Loan, Business Loan, Loan Against Property, Vehicle Loan, Balance Transfer.
- Comparison inputs: loan type, amount, tenure, lender selection, self-reported credit-score band including "I don't know my score", plus optional eligibility details.
- Missing data shows as "Not available / Confirm with lender"; nothing is guessed.
- EMI calculator: standard reducing-balance formula, handles zero interest, INR formatting, inputs carried into the enquiry.
- Lead form: required name, Indian mobile, loan category, city, consent. No PAN, Aadhaar or document uploads.
- Disclaimers sit next to estimates, not only in the footer.

## Brand Commitments

- Name: Excellence Finance (trading name; legal name to be confirmed).
- Requested by the user: luxury minimalism, white and blue base, warm brass accent, purposeful animation.

## Evidence on Hand

- Brand logo supplied by the user: `marketing-site/brand/logo-original.jpg` (web versions generated into `marketing-site/public/brand/`).
- Comparison data (`marketing-site/src/data/lenders.js`, every figure with its source link): HDFC Bank, Bank of Baroda, PNB, Bank of Maharashtra and IDFC FIRST Bank, read from each bank's official site on 8 Nov 2026; ICICI Bank, Kotak Mahindra Bank, Indian Bank, Central Bank of India, Indian Overseas Bank, UCO Bank, IDBI Bank, YES BANK, Tata Capital Housing Finance, Bajaj Housing Finance, L&T Finance, Piramal Finance and SMFG India Home Finance, read from each lender's official site on 10 Nov 2026. Many of the newer lenders publish only a starting rate or a range, and several publish no fee figures; those fees show as "Confirm" and never count as zero. ICICI's rates expire on 30 Nov 2026 and drop out automatically after that. Bank of India is not in the comparison yet: its site blocked automated reading, so its rates need to be entered by hand. Staff must re-verify before launch and on a schedule.
- Lenders the business works with, confirmed by the owner on 9 Nov 2026 (`marketing-site/src/data/partners.js`): PNB, ICICI Bank, Bank of Baroda, HDFC Bank, Tata Capital Housing Finance, IDFC FIRST Bank, Bank of India, Indian Bank, Central Bank of India, Indian Overseas Bank, UCO Bank, Bank of Maharashtra, L&T Finance, Kotak Mahindra Bank, YES BANK, IDBI Bank, Bajaj Housing Finance, Piramal Finance, SMFG India Home Finance. SBI was removed from the site at the owner's request (9 Nov 2026).
- No reviews, statistics, accreditations, address or phone number yet. Whether consultations are free is unconfirmed (`site.consultationIsFree`). Contact details are placeholders.

## Product Principles

1. Show the whole cost, every time.
2. Advise, never promise.
3. Every number cites where it came from and when it was checked.
4. Ask only for what a first conversation needs.

## Accessibility & Inclusion

Keyboard access, visible labels and errors, touch-friendly controls, and usable on slow mobile connections.
