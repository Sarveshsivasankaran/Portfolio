import { test, expect } from '@playwright/test'
import path from 'path'

test('capture hero section for link preview', async ({ page }) => {
  // Set viewport to standard Open Graph dimensions (1200 x 630)
  await page.setViewportSize({ width: 1200, height: 630 })

  // Ensure system entry is bypassed so the hero is rendered immediately
  await page.addInitScript(() => {
    sessionStorage.setItem('hasEnteredSystem', 'true')
    localStorage.setItem('siteMuted', 'true')
  })

  // Navigate to root
  await page.goto('/')

  // Wait for hero section to be attached and visible
  const hero = page.locator('#hero')
  await expect(hero).toBeVisible({ timeout: 15000 })

  // Wait for images inside hero to load
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('#hero img')) as HTMLImageElement[]
    return images.every(img => img.complete && img.naturalWidth > 0)
  }, { timeout: 10000 }).catch(() => {})

  // Style tweaks for crystal-clear social preview rendering
  await page.evaluate(() => {
    // Hide navbar for clean hero presentation without top-bar crowding
    const navbar = document.querySelector('.navbar') as HTMLElement
    if (navbar) navbar.style.display = 'none'

    // Hide sound button if present so top-right is just clean
    const soundBtn = document.querySelector('button[aria-label*="Music"]') as HTMLElement
    if (soundBtn) soundBtn.style.display = 'none'

    // Hide bounce arrow at the bottom
    const heroEl = document.querySelector('#hero')
    if (heroEl) {
      const allDivs = heroEl.querySelectorAll('div')
      allDivs.forEach(div => {
        if (div.style.bottom === '32px' || div.style.animation?.includes('bounce')) {
          div.style.display = 'none'
        }
      })
    }

    // Set sharp, glitch-free name: Sarvesh Sivasankaran
    const h1 = document.querySelector('.hero-text-pane h1') as HTMLElement
    if (h1) {
      h1.innerHTML = `
        <div style="display: flex; flex-direction: column; position: relative; z-index: 2; min-height: 120px; justify-content: center;">
          <span style="font-weight: 700; color: #ffffff; letter-spacing: -0.01em; line-height: 1.0;">Sarvesh</span>
          <span style="font-weight: 700; font-size: 1.15em; background: linear-gradient(to right, #a855f7, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1;">Sivasankaran</span>
        </div>
      `
    }

    // Clean, crisp typewriter subtitle
    const twContainer = document.querySelector('.hero-text-pane > div:nth-child(2)') as HTMLElement
    if (twContainer) {
      twContainer.innerHTML = `
        <span style="font-family: 'Share Tech Mono', monospace; font-size: 22px; color: var(--teal); letter-spacing: 0.05em;">
          Full Stack Developer<span style="color: var(--gate); font-weight: bold; margin-left: 2px;">_</span>
        </span>
      `
    }
  })

  // Wait a moment for font rendering and styles
  await page.waitForTimeout(600)

  const pngPath = path.resolve(process.cwd(), 'public/og-image.png')
  const jpgPath = path.resolve(process.cwd(), 'public/og-image.jpg')

  // Capture PNG
  await page.screenshot({
    path: pngPath,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  })

  // Capture optimized JPG (great for WhatsApp / mobile crawlers)
  await page.screenshot({
    path: jpgPath,
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  })

  console.log('Saved both og-image.png and og-image.jpg with crisp typography')
})
