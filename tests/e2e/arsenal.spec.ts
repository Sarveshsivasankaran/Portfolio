import { test, expect } from '@playwright/test'

test('Arsenal stays centered and its skills are accessible across layouts', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/api/github', route => route.fulfill({ json: [{
    id: 1, name: 'python-api', description: 'Python API', language: 'Python',
    topics: ['python'], stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/example/python-api', homepage: null,
    updated_at: '2026-09-14T00:00:00Z', pushed_at: '2026-09-14T00:00:00Z',
  }] }))
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/tests/e2e/harness.html?view=skills')
  await expect(page.getByText('Connected to GitHub', { exact: true })).toBeVisible()
  await expect(page.locator('.arsenal-universe')).toHaveAttribute('data-ready', 'true')
  await page.locator('.arsenal-scene').scrollIntoViewIfNeeded()
  await expect(page.locator('.arsenal-universe')).toHaveAttribute('data-moving', 'true')
  const centered = () => page.evaluate(() => {
    const image = document.querySelector('.arsenal-character-image')!.getBoundingClientRect()
    const scene = document.querySelector('.arsenal-scene')!.getBoundingClientRect()
    return Math.abs(image.x + image.width / 2 - scene.x - scene.width / 2)
  })
  await expect.poll(centered).toBeLessThan(2)
  await page.getByRole('button', { name: 'Pause arsenal motion' }).click()
  await expect(page.locator('.arsenal-universe')).toHaveAttribute('data-moving', 'false')
  await expect.poll(centered).toBeLessThan(2)
  await page.locator('.arsenal-scene').screenshot({ path: 'test-results/arsenal-desktop.png' })
  await page.getByRole('button', { name: 'Explore React', exact: true }).click()
  await expect(page.locator('.arsenal-skill-detail h3')).toHaveText('React')
  await page.getByRole('button', { name: 'Language', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Explore React', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Explore Python', exact: true })).toBeVisible()
  await page.getByLabel('Filter skill experience').selectOption('Vibe Coded')
  await expect(page.locator('.arsenal-tile')).toHaveCount(1)
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await page.getByLabel('Filter skill experience').selectOption('All')
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    await expect.poll(centered).toBeLessThan(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 390) await page.locator('.arsenal-scene').screenshot({ path: 'test-results/arsenal-mobile.png' })
    await page.getByRole('button', { name: 'Explore Git', exact: true }).click()
    await expect(page.locator('.arsenal-skill-detail h3')).toHaveText('Git')
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Resume arsenal motion' })).toBeDisabled()
  expect(await page.locator('.arsenal-energy span').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  expect(errors).toEqual([])
})
