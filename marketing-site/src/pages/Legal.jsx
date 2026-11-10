import { PageHead } from '../components/ui'
import { site } from '../data/site'
import { useTitle } from '../lib/useTitle'

function LegalPage({ title, intro, sections }) {
  useTitle(title)
  return (
    <>
      <PageHead title={title}>{intro}</PageHead>
      <article className="wrap pb-28">
        <p className="mb-12 inline-flex rounded-full bg-brass-pale px-4 py-1.5 text-sm text-brass-ink">Draft for legal review. Not yet final.</p>
        <div className="max-w-[70ch] space-y-12">
          {sections.map(([h, body]) => (
            <section key={h}>
              <h2 className="font-display text-[1.75rem]">{h}</h2>
              <div className="mt-3 space-y-4 text-slate">{Array.isArray(body) ? body.map((b) => <p key={b}>{b}</p>) : <p>{body}</p>}</div>
            </section>
          ))}
        </div>
      </article>
    </>
  )
}

export function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="What we collect when you use this website, why, who we share it with, and how to ask us to change or delete it."
      sections={[
        ['What we collect', 'When you send an enquiry: your name, mobile number, city, loan type, and any optional details you choose to add, such as amount, tenure, credit-score range or employment type. We also record the page you enquired from and, where you consent, campaign information such as UTM parameters.'],
        ['What we do not collect', 'We do not ask for or accept PAN, Aadhaar, bank statements, salary slips or other documents through this website, and we do not access your credit report.'],
        ['Why we use it', 'To respond to your enquiry, discuss suitable loan options, and help with an application if you ask us to.'],
        ['Who we share it with', 'Only with lenders you choose to apply to, and with service providers that help us operate (for example, email or messaging providers), under appropriate safeguards. We do not sell your data.'],
        ['How long we keep it', 'Enquiry records are retained for a defined period after our last contact, then deleted or anonymised. The exact period will be stated here once finalised.'],
        ['Your rights', `You can ask to see, correct or delete your information, or withdraw consent to be contacted, by writing to ${site.email}.`],
      ]}
    />
  )
}

export function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      intro="The terms that apply when you use this website and its calculators and comparison tools."
      sections={[
        ['Our role', `${site.name} is a loan advisory and brokerage service. We are not a bank or lender and do not approve or disburse loans.`],
        ['Calculators and comparisons', ['The EMI calculator and lender comparison give estimates based on the information you enter and on lender data we have recorded, with the source and verification date shown.', 'They are not quotations or offers of credit. Actual rates, fees and EMIs are set by the lender after assessing your application.']],
        ['Acceptable use', 'Do not submit false information, attempt to disrupt the website, or use automated means to send enquiries or extract data.'],
        ['Changes', 'We may update these terms. The version published on this page applies from the date shown.'],
      ]}
    />
  )
}

export function Disclaimer() {
  return (
    <LegalPage
      title="Financial disclaimer"
      intro="How to read the rates, fees and estimates shown on this website."
      sections={[
        ['Indicative only', 'All rates, fees, EMIs and totals shown are indicative. They are subject to each lender’s policy, its assessment of your application, and changes the lender makes after our last verification.'],
        ['No guarantee', 'We do not guarantee approval, any particular rate, loan amount, or processing timeline.'],
        ['Bank names and published rates', 'Rates and fees for HDFC Bank, Bank of Baroda, Punjab National Bank, Bank of Maharashtra and IDFC FIRST Bank are taken from each bank’s own website, with a link to the source and the date we checked it. Bank names and logos are trademarks of their respective owners and are used only to identify whose published terms are shown. Their appearance does not imply any partnership with, or endorsement by, the bank.'],
        ['How estimates are made', 'Where a bank publishes rates by credit-score band, we use the band you select. Where it publishes only a range, we place your band within that range (higher scores nearer the bottom) and say so next to the rate. Where it publishes only a starting rate, we make no estimate and show the starting-rate EMI as a best case. Fees published as “up to” an amount are estimated at that maximum.'],
        ['Credit score', 'Any credit-score range you select is self-reported and used only to look up the bank’s published bands. A credit score alone does not determine an offer.'],
        ['Missing information', 'Where we do not have verified data for a fee or term, we say “Not available / Confirm with lender” rather than estimate it.'],
        ['Advice', 'Information on this website is general. Speak to an adviser before making a decision about a loan.'],
      ]}
    />
  )
}
