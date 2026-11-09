// DEVELOPMENT ONLY. A stand-in for the Laravel POST /api/enquiries route so
// the enquiry journey can be tested before the backend exists. It is wired in
// vite.config.js with apply: 'serve', so it never ships in a production build.
// It mirrors the contract in src/lib/api.js and stores to .dev-data/.
//
// To test the failure path, create the file .dev-data/fail (any content):
// every request then gets a 500 until the file is removed.
import fs from 'node:fs'
import path from 'node:path'

const LOAN_TYPES = ['home', 'personal', 'business', 'lap', 'vehicle', 'transfer']
const MOBILE = /^[6-9]\d{9}$/

function validate(b) {
  const errors = {}
  const name = String(b.name ?? '').trim()
  const city = String(b.city ?? '').trim()
  if (name.length < 2 || name.length > 80) errors.name = ['Enter your full name (2 to 80 characters).']
  if (!MOBILE.test(String(b.mobile ?? ''))) errors.mobile = ['Enter a valid 10-digit Indian mobile number.']
  if (!LOAN_TYPES.includes(b.loan_type)) errors.loan_type = ['Choose a loan type.']
  if (city.length < 2 || city.length > 60) errors.city = ['Enter your city or town.']
  if (b.amount != null && b.amount !== '' && !(Number(b.amount) > 0 && Number(b.amount) <= 1e10)) errors.amount = ['Enter a valid amount.']
  if (String(b.message ?? '').length > 1000) errors.message = ['Keep your message under 1,000 characters.']
  if (b.consent !== true) errors.consent = ['Consent is required to contact you.']
  return errors
}

export function enquiryEndpoint(root) {
  const dir = path.join(root, '.dev-data')
  const file = path.join(dir, 'enquiries.json')
  const hits = new Map() // ip -> timestamps, for a simple rate limit

  return {
    name: 'dev-enquiry-endpoint',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/enquiries', (req, res) => {
        const send = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return send(405, { message: 'Method not allowed' })

        let raw = ''
        req.on('data', (c) => (raw += c))
        req.on('end', () => {
          fs.mkdirSync(dir, { recursive: true })
          if (fs.existsSync(path.join(dir, 'fail'))) return send(500, { message: 'Simulated server error' })

          const ip = req.socket.remoteAddress || 'local'
          const now = Date.now()
          const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000)
          if (recent.length >= 6) return send(429, { message: 'Too many requests' })
          hits.set(ip, [...recent, now])

          let body
          try {
            body = JSON.parse(raw || '{}')
          } catch {
            return send(400, { message: 'Invalid JSON' })
          }

          const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []
          const key = req.headers['idempotency-key']
          const existing = key && list.find((e) => e.idempotency_key === key)
          if (existing) return send(409, { reference: existing.reference })

          // Honeypot filled: accept silently but do not store, as Laravel would
          if (body.website) return send(201, { reference: 'EF-' + now.toString(36).toUpperCase().slice(-6) })

          const errors = validate(body)
          if (Object.keys(errors).length) return send(422, { message: 'The given data was invalid.', errors })

          const reference = 'EF-' + now.toString(36).toUpperCase().slice(-6)
          const possibleDuplicate = list.some((e) => e.mobile === body.mobile)
          list.push({ reference, idempotency_key: key, created_at: new Date(now).toISOString(), possible_duplicate: possibleDuplicate, ...body })
          fs.writeFileSync(file, JSON.stringify(list, null, 2))
          send(201, { reference })
        })
      })
    },
  }
}
