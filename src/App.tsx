import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeSection from './components/MarqueeSection'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Wins from './components/Wins'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  // Global scroll-driven section entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each content section as it scrolls into view
      const sections = ['#skills', '#marquee-banner', '#projects', '#wins', '#events', '#contact']
      
      sections.forEach((selector) => {
        const el = document.querySelector(selector)
        if (!el) return

        gsap.fromTo(el,
          { 
            opacity: 0, 
            y: 60,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 50%',
              toggleActions: 'restart none none reset',
            }
          }
        )
      })

      // Smooth parallax depth effect on all sections during scroll
      const parallaxSections = document.querySelectorAll('section[id]')
      parallaxSections.forEach((section) => {
        const id = section.getAttribute('id')
        if (id === 'hero') return // Hero already has its own parallax

        // Create a subtle vertical parallax shift as each section scrolls through viewport
        gsap.fromTo(section.querySelector('.section-label, .section-heading') || section,
          { y: 30 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top center',
              scrub: 0.8,
            }
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

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
