import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { enquiryEndpoint } from './dev/enquiry-endpoint.js'

export default defineConfig({
  // enquiryEndpoint is development-only (apply: 'serve'); production builds
  // post to the real Laravel route.
  plugins: [react(), tailwindcss(), enquiryEndpoint(import.meta.dirname)],
  server: { port: 5173 },
})
