// Enquiry submission to the Laravel backend.
//
// Contract (POST /api/enquiries, JSON):
//   request:  { name, mobile, loan_type, city, amount?, message?, consent,
//               source_page, context?, website (honeypot) }
//   headers:  Idempotency-Key (one per form fill), X-XSRF-TOKEN when present
//   201/200:  { reference }
//   422:      { message, errors: { field: [msg] } }   (Laravel validation)
//   409:      duplicate submission already recorded → { reference }
//   429:      too many requests
// Success is reported only when the server confirms the enquiry was saved.

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || '/api/enquiries'

function xsrfToken() {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

export class EnquiryError extends Error {
  constructor(kind, message, fieldErrors = {}) {
    super(message)
    this.kind = kind // 'validation' | 'rate-limit' | 'server' | 'network'
    this.fieldErrors = fieldErrors
  }
}

export async function submitEnquiry(payload, idempotencyKey) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Idempotency-Key': idempotencyKey,
  }
  const token = xsrfToken()
  if (token) headers['X-XSRF-TOKEN'] = token

  let res
  try {
    res = await fetch(ENDPOINT, { method: 'POST', headers, credentials: 'same-origin', body: JSON.stringify(payload) })
  } catch {
    throw new EnquiryError('network', 'We could not reach our server. Check your connection and try again.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // non-JSON response, handled below
  }

  if ((res.ok || res.status === 409) && data?.reference) return { reference: data.reference }

  if (res.status === 422) {
    const fieldErrors = Object.fromEntries(Object.entries(data?.errors ?? {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)]))
    throw new EnquiryError('validation', data?.message || 'Please check the highlighted fields.', fieldErrors)
  }
  if (res.status === 429) {
    throw new EnquiryError('rate-limit', 'Too many attempts. Please wait a few minutes and try again.')
  }
  throw new EnquiryError('server', 'Your enquiry was not sent because of a problem on our side. Please try again, or contact us by phone or email.')
}

export function newIdempotencyKey() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
