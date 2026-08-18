import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { FeaturedProperties } from '@/blocks/featured-properties/FeaturedProperties'
import { HeroWithSearch } from '@/blocks/heros/HeroWithSearch'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { TrustFeatures } from '@/blocks/trust-features/TrustFeatures'
import { SiteHeader } from '@/components/SiteHeader'

afterEach(cleanup)

describe('home page components', () => {
  it('renders known Payload blocks in content order and skips unknown blocks', () => {
    render(
      <RenderBlocks
        blocks={[
          { blockType: 'hero-with-search', title: 'First block' },
          { blockType: 'unknown-block', id: 'unknown' },
          {
            blockType: 'trust-features',
            items: [{ id: 'trust', icon: 'home', title: 'Second block', description: 'Trusted.' }],
          },
        ]}
      />,
    )

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headings).toEqual(['First block', 'Second block'])
  })

  it('renders the standalone site navigation and call to action', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Properties' }).getAttribute('href')).toBe(
      '#properties',
    )
    expect(screen.getByRole('link', { name: /book a call/i })).toBeTruthy()
  })

  it('renders hero content and property search controls', () => {
    render(
      <HeroWithSearch
        blockType="hero-with-search"
        eyebrow="Find your dream home"
        title="Discover spaces that inspire you"
        description="A home selected around your ambitions."
        cta={{ label: 'Explore properties', href: '#properties' }}
        backgroundImage={{ id: 1, alt: 'Modern house', url: '/house.jpg' }}
        search={{
          action: '/find-a-home',
          locationLabel: 'Neighbourhood',
          locationPlaceholder: 'Choose an area',
          typeLabel: 'Home style',
          types: [
            { id: 'all', label: 'Every style', value: '' },
            { id: 'townhouse', label: 'Townhouse', value: 'townhouse' },
          ],
          priceLabel: 'Budget',
          prices: [
            { id: 'any', label: 'Every budget', value: '' },
            { id: 'premium', label: '$1m and above', value: '1000000-plus' },
          ],
          buttonLabel: 'Find my home',
        }}
      />,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'Discover spaces that inspire you' }),
    ).toBeTruthy()
    expect(screen.getByLabelText('Neighbourhood')).toHaveProperty('placeholder', 'Choose an area')
    expect(screen.getByLabelText('Home style')).toHaveProperty('value', '')
    expect(screen.getByRole('option', { name: 'Townhouse' })).toBeTruthy()
    expect(screen.getByLabelText('Budget')).toHaveProperty('value', '')
    expect(screen.getByRole('option', { name: '$1m and above' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Find my home' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Find my home' }).closest('form')?.getAttribute('action'),
    ).toBe('/find-a-home')
  })

  it('renders every trust feature supplied by Payload', () => {
    render(
      <TrustFeatures
        blockType="trust-features"
        items={[
          {
            id: 'one',
            icon: 'home',
            title: 'Wide range',
            description: 'Homes for every lifestyle.',
          },
          {
            id: 'two',
            icon: 'shield',
            title: 'Secure',
            description: 'A transparent buying experience.',
          },
        ]}
      />,
    )

    expect(screen.getByText('Wide range')).toBeTruthy()
    expect(screen.getByText('Secure')).toBeTruthy()
  })

  it('renders featured property cards with status and price', () => {
    render(
      <FeaturedProperties
        blockType="featured-properties"
        eyebrow="Featured properties"
        title="Explore our best properties"
        cta={{ label: 'View all properties', href: '/properties' }}
        properties={[
          {
            id: 'property-one',
            image: { id: 2, alt: 'Modern family home', url: '/property.jpg' },
            status: 'for-sale',
            name: 'Modern Family Home',
            location: 'San Francisco, CA',
            price: '$1,250,000',
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Explore our best properties' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Modern Family Home' })).toBeTruthy()
    expect(screen.getByText('For sale')).toBeTruthy()
    expect(screen.getByText('$1,250,000')).toBeTruthy()
  })
})
