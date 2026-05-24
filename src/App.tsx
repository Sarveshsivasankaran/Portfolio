import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeSection from './components/MarqueeSection'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Wins from './components/Wins'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <MarqueeSection />
        <Projects />
        <Wins />
        <Events />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
