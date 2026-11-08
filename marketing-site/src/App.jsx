import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Loans from './pages/Loans'
import LoanDetail from './pages/LoanDetail'
import Compare from './pages/Compare'
import EmiCalculator from './pages/EmiCalculator'
import About from './pages/About'
import Process from './pages/Process'
import Faqs from './pages/Faqs'
import Contact from './pages/Contact'
import EnquiryConfirmed from './pages/EnquiryConfirmed'
import { Privacy, Terms, Disclaimer } from './pages/Legal'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="loans" element={<Loans />} />
        <Route path="loans/:slug" element={<LoanDetail />} />
        <Route path="compare" element={<Compare />} />
        <Route path="emi-calculator" element={<EmiCalculator />} />
        <Route path="about" element={<About />} />
        <Route path="how-it-works" element={<Process />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="enquiry/confirmed" element={<EnquiryConfirmed />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
