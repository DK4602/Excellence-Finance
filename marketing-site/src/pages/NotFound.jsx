import { Button } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <section className="wrap grid min-h-[60svh] place-items-center py-20 text-center">
      <div>
        <h1 className="font-display text-[3rem] md:text-[4.5rem]">This page isn’t here.</h1>
        <p className="mt-4 text-lg text-slate">The link may be old. Try the loans list, or start from the home page.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/loans" variant="secondary">See loans</Button>
          <Button to="/">Go home</Button>
        </div>
      </div>
    </section>
  )
}
