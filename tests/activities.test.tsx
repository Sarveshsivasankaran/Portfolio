import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ActivityImages from '../src/components/ActivityImages'
import { isLinkedInUrl, toActivity } from '../src/lib/linkedinPosts'
import { validateActivity } from '../src/lib/activityAdmin'
import type { LinkedInPostInput, LinkedInPostRow } from '../src/lib/database.types'

vi.mock('../src/lib/supabase', () => ({ supabase: null }))
afterEach(cleanup)
const input: LinkedInPostInput = { title: 'Project launch', description: 'Built a project.', linkedin_url: 'https://www.linkedin.com/posts/project', published_at: '2026-09-13T10:00:00Z' }

describe('Activity validation', () => {
  it.each(['https://www.linkedin.com/posts/hello', 'https://www.linkedin.com/feed/update/urn:li:activity:123/', 'https://linkedin.com/pulse/article', 'https://in.linkedin.com/posts/hello'])('accepts legitimate LinkedIn URL %s', url => expect(isLinkedInUrl(url)).toBe(true))
  it.each(['javascript:alert(1)', 'http://linkedin.com/posts/a', 'https://linkedin.com.evil.test/posts/a', 'https://linkedin.com@evil.test/posts/a', 'https://evil.test@linkedin.com/posts/a', 'https://linkedin.com/'])('rejects unsafe URL %s', url => expect(isLinkedInUrl(url)).toBe(false))
  it('rejects empty titles, invalid dates, excessive images and unsupported uploads', () => {
    expect(() => validateActivity({ ...input, title: ' ' })).toThrow('Title')
    expect(() => validateActivity({ ...input, published_at: 'nope' })).toThrow('date')
    expect(() => validateActivity({ ...input, images: Array(13).fill('https://example.test/a.webp') })).toThrow('12')
    expect(() => validateActivity(input, [new File(['<svg/>'], 'bad.svg', { type: 'image/svg+xml' })])).toThrow('WebP')
    expect(() => validateActivity(input, [new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' })])).toThrow('5 MB')
  })
  it('maps category and multiple safe images to the existing card type', () => {
    const row = { ...input, id: 'uuid', category: 'Hackathon', images: ['https://example.test/1.webp', 'javascript:bad', 'https://example.test/1.webp'], featured: true } as LinkedInPostRow
    expect(toActivity(row)).toMatchObject({ id: 'uuid', title: input.title, type: 'project', category: 'Hackathon', featured: true, images: ['https://example.test/1.webp'] })
  })
})

describe('Image collage', () => {
  it.each([0, 1, 2, 3, 4, 7])('renders %i images within four tiles', count => {
    const images = Array.from({ length: count }, (_, i) => `https://example.test/${i}.webp`)
    const { container } = render(<ActivityImages images={images} title="Activity" label="Project" color="#06b6d4" active />)
    expect(container.querySelectorAll('img')).toHaveLength(Math.min(count, 4))
    if (!count) expect(screen.getByRole('img').getAttribute('aria-label')).toContain('illustration')
    if (count > 4) expect(screen.getByText('+3')).toBeTruthy()
  })
  it('replaces a failed image with the fallback and displays an updated URL', () => {
    const props = { title: 'Activity', label: 'Project', color: '#06b6d4', active: true }
    const { container, rerender } = render(<ActivityImages {...props} images={['https://example.test/broken.webp']} />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('[ INTEL RECORD LOG ]')).toBeTruthy()
    rerender(<ActivityImages {...props} images={['https://example.test/new.webp']} />)
    expect(container.querySelector('img')?.src).toContain('new.webp')
  })
})
