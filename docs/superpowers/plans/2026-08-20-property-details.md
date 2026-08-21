# Property Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CMS-managed property details page at `/properties/[slug]` that matches the supplied real-estate design, supports galleries and tabs, persists visitor favorites locally, and links to booking with the property preselected.

**Architecture:** Replace the unused `products` collection with a structured `properties` collection. The dynamic Next.js route owns Payload data fetching and maps generated collection data into an explicit presentation model consumed by focused server and client components. Browser-only gallery, tab, and favorite state remains isolated from Payload Admin authentication.

**Tech Stack:** Payload CMS 3.88, Next.js 16 App Router, React 19, TypeScript 5.7, Tailwind CSS 4, Vitest 4, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-20-property-details-design.md`

## Global Constraints

- Preserve the existing Pages block architecture and shared `SiteHeader`.
- Replace `products`; no existing product data needs migration.
- Public URL is `/properties/[slug]` and unknown slugs return `notFound()`.
- Visitors never authenticate through Payload Admin.
- Favorites use versioned browser-local storage under `homespire:favorites:v1`.
- Booking URL is `/book-a-call?property=<encoded-slug>`.
- Do not add an icon dependency; use small inline SVG components.
- Avoid long nested Payload field names that can exceed PostgreSQL's 63-character identifier limit.
- Do not create commits automatically; the user explicitly declined commits for this work.

---

## File Map

- `src/collections/Properties.ts`: Payload property schema and public-read access.
- `src/payload.config.ts`: register `Properties` instead of `Products`.
- `src/collections/Products.ts`: remove after registration is replaced.
- `src/components/property-details/types.ts`: presentation-only types shared by server and client components.
- `src/components/property-details/toPropertyView.ts`: convert generated Payload data and media relationships into stable component props.
- `src/components/property-details/PropertyGallery.tsx`: interactive primary image and thumbnails.
- `src/components/property-details/FavoriteButton.tsx`: resilient versioned local-storage favorite state.
- `src/components/property-details/PropertySummary.tsx`: listing identity, price, facts, and action controls.
- `src/components/property-details/PropertyDetailsTabs.tsx`: accessible overview/features/amenities/location tabs.
- `src/components/property-details/ListingAgentCard.tsx`: optional listing identity panel.
- `src/components/property-details/PropertyDetailsPage.tsx`: complete responsive page composition.
- `src/lib/properties/getPropertyBySlug.ts`: one-property Payload query boundary.
- `src/app/(frontend)/properties/[slug]/page.tsx`: route, metadata, 404 handling, and page composition.
- `tests/int/properties-collection.int.spec.ts`: schema contract.
- `tests/int/property-view.int.spec.ts`: relationship normalization and optional data behavior.
- `tests/int/property-details.int.spec.tsx`: rendering and browser interaction tests.
- `tests/int/property-query.int.spec.ts`: exact query and missing record behavior.

---

### Task 1: Replace Products with the Properties collection

**Files:**
- Create: `src/collections/Properties.ts`
- Modify: `src/payload.config.ts`
- Delete: `src/collections/Products.ts`
- Test: `tests/int/properties-collection.int.spec.ts`
- Generated: `src/payload-types.ts`

**Interfaces:**
- Produces: Payload collection slug `properties` and generated `Property` interface.
- Consumes: existing public `media` upload collection and global Lexical editor.

- [ ] **Step 1: Write the failing collection contract test**

```ts
import { describe, expect, it } from 'vitest'
import { Properties } from '@/collections/Properties'

describe('Properties collection', () => {
  it('exposes structured public property records', () => {
    expect(Properties.slug).toBe('properties')
    expect(Properties.admin?.useAsTitle).toBe('name')
    expect(Properties.access?.read?.({ req: {} } as never)).toBe(true)

    const fieldNames = Properties.fields.map((field) => ('name' in field ? field.name : null))
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'name', 'slug', 'status', 'type', 'featured', 'price', 'location', 'summary',
        'description', 'cover', 'gallery', 'bedrooms', 'bathrooms', 'area', 'parking',
        'features', 'amenities', 'listing', 'seo',
      ]),
    )
  })
})
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/properties-collection.int.spec.ts`

Expected: FAIL because `@/collections/Properties` does not exist.

- [ ] **Step 3: Implement the collection schema**

Create `src/collections/Properties.ts` with this structure:

```ts
import type { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: { read: () => true },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'price', 'location', 'updatedAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'status', type: 'select', required: true, options: [
      { label: 'For sale', value: 'for-sale' },
      { label: 'For rent', value: 'for-rent' },
    ] },
    { name: 'type', type: 'select', required: true, options: [
      { label: 'House', value: 'house' }, { label: 'Apartment', value: 'apartment' },
      { label: 'Villa', value: 'villa' }, { label: 'Land', value: 'land' },
      { label: 'Commercial', value: 'commercial' },
    ] },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'location', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'richText', required: true },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'array', maxRows: 20, fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
    ] },
    { name: 'bedrooms', type: 'number', min: 0 },
    { name: 'bathrooms', type: 'number', min: 0 },
    { name: 'area', type: 'number', min: 0, admin: { description: 'Square feet' } },
    { name: 'parking', type: 'number', min: 0 },
    { name: 'features', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'amenities', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'listing', type: 'group', fields: [
      { name: 'name', type: 'text' }, { name: 'verified', type: 'checkbox', defaultValue: false },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ] },
    { name: 'seo', type: 'group', fields: [
      { name: 'title', type: 'text' }, { name: 'description', type: 'textarea' },
    ] },
  ],
}
```

- [ ] **Step 4: Register Properties and remove Products**

In `src/payload.config.ts`, replace the `Products` import and collection entry with `Properties`. Delete `src/collections/Products.ts` only after `rg -n "Products|products" src` confirms no remaining consumer besides generated types.

- [ ] **Step 5: Verify schema and regenerate generated types**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/properties-collection.int.spec.ts && pnpm generate:types && pnpm exec tsc --noEmit`

Expected: test PASS, generated `Property` interface exists, TypeScript exits 0.

---

### Task 2: Build the property presentation model

**Files:**
- Create: `src/components/property-details/types.ts`
- Create: `src/components/property-details/toPropertyView.ts`
- Test: `tests/int/property-view.int.spec.ts`

**Interfaces:**
- Consumes: generated `Property` and `Media` from `@/payload-types`.
- Produces: `PropertyDetailsView`, `PropertyImage`, `PropertyFact`, and `toPropertyView(property)`.

- [ ] **Step 1: Write the failing normalization tests**

```ts
import { describe, expect, it } from 'vitest'
import { toPropertyView } from '@/components/property-details/toPropertyView'

const lexicalDescription = { root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 } }

describe('toPropertyView', () => {
  it('normalizes media, facts, labels, booking URL, and price', () => {
    const view = toPropertyView({
      id: 7, name: 'Modern Family Home', slug: 'modern-family-home', status: 'for-sale',
      type: 'house', featured: true, price: 18500000, location: 'Banani, Dhaka',
      description: lexicalDescription, cover: { id: 1, alt: 'Front exterior', url: '/front.jpg' },
      gallery: [{ id: 'g1', image: { id: 2, alt: 'Living room', url: '/living.jpg' } }],
      bedrooms: 4, bathrooms: 3, area: 2800, parking: 2,
      features: [{ id: 'f1', label: 'Natural light' }], amenities: [{ id: 'a1', label: 'Pool' }],
      listing: { name: 'Homespire Real Estate', verified: true },
    } as never)

    expect(view.statusLabel).toBe('For sale')
    expect(view.priceLabel).toBe('৳ 18,500,000')
    expect(view.images.map((image) => image.url)).toEqual(['/front.jpg', '/living.jpg'])
    expect(view.facts.map((fact) => fact.value)).toEqual(['4', '3', '2,800 sqft', '2'])
    expect(view.bookingHref).toBe('/book-a-call?property=modern-family-home')
  })

  it('drops unpopulated media and absent optional facts', () => {
    const view = toPropertyView({
      id: 8, name: 'Land', slug: 'land', status: 'for-sale', type: 'land',
      featured: false, price: 0, location: 'Dhaka', description: lexicalDescription,
      cover: 1, gallery: [{ id: 'g1', image: 2 }],
    } as never)
    expect(view.images).toEqual([])
    expect(view.facts).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test and confirm the missing adapter failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-view.int.spec.ts`

Expected: FAIL because `toPropertyView` does not exist.

- [ ] **Step 3: Define stable presentation types**

Create `types.ts` exporting:

```ts
import type { Property } from '@/payload-types'

export type PropertyImage = { id: string; url: string; alt: string }
export type PropertyFact = { label: string; value: string; icon: 'bed' | 'bath' | 'area' | 'parking' }
export type PropertyDetailsView = {
  id: string
  name: string
  slug: string
  location: string
  statusLabel: 'For sale' | 'For rent'
  priceLabel: string
  summary?: string
  description: Property['description']
  images: PropertyImage[]
  facts: PropertyFact[]
  features: string[]
  amenities: string[]
  listing?: { name: string; verified: boolean; image?: PropertyImage }
  bookingHref: string
}
```

- [ ] **Step 4: Implement `toPropertyView`**

Use explicit relationship guards instead of casting IDs as media:

```ts
import type { Media, Property } from '@/payload-types'
import type { PropertyDetailsView, PropertyFact, PropertyImage } from './types'

const isMedia = (value: Media | number | null | undefined): value is Media =>
  typeof value === 'object' && value !== null

const toImage = (media: Media | number | null | undefined): PropertyImage | undefined =>
  isMedia(media) && media.url
    ? { id: String(media.id), url: media.url, alt: media.alt || '' }
    : undefined

export function toPropertyView(property: Property): PropertyDetailsView {
  const cover = toImage(property.cover)
  const gallery = (property.gallery || []).flatMap(({ image }) => {
    const normalized = toImage(image)
    return normalized ? [normalized] : []
  })
  const facts: PropertyFact[] = []
  if (property.bedrooms != null) facts.push({ label: 'Bedrooms', value: String(property.bedrooms), icon: 'bed' })
  if (property.bathrooms != null) facts.push({ label: 'Bathrooms', value: String(property.bathrooms), icon: 'bath' })
  if (property.area != null) facts.push({ label: 'Sqft', value: `${property.area.toLocaleString('en-US')} sqft`, icon: 'area' })
  if (property.parking != null) facts.push({ label: 'Parking', value: String(property.parking), icon: 'parking' })
  const listingImage = toImage(property.listing?.image)

  return {
    id: String(property.id), name: property.name, slug: property.slug, location: property.location,
    statusLabel: property.status === 'for-rent' ? 'For rent' : 'For sale',
    priceLabel: `৳ ${property.price.toLocaleString('en-US')}`, summary: property.summary || undefined,
    description: property.description, images: cover ? [cover, ...gallery] : gallery, facts,
    features: (property.features || []).map(({ label }) => label),
    amenities: (property.amenities || []).map(({ label }) => label),
    listing: property.listing?.name ? {
      name: property.listing.name, verified: Boolean(property.listing.verified), image: listingImage,
    } : undefined,
    bookingHref: `/book-a-call?property=${encodeURIComponent(property.slug)}`,
  }
}
```

- [ ] **Step 5: Run the adapter tests and TypeScript**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-view.int.spec.ts && pnpm exec tsc --noEmit`

Expected: both tests PASS and TypeScript exits 0.

---

### Task 3: Implement gallery and local favorites

**Files:**
- Create: `src/components/property-details/PropertyGallery.tsx`
- Create: `src/components/property-details/FavoriteButton.tsx`
- Test: `tests/int/property-details.int.spec.tsx`

**Interfaces:**
- Consumes: `PropertyImage[]` and string property ID.
- Produces: `PropertyGallery({ images, propertyName })` and `FavoriteButton({ propertyId })`.

- [ ] **Step 1: Write failing interaction tests**

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FavoriteButton } from '@/components/property-details/FavoriteButton'
import { PropertyGallery } from '@/components/property-details/PropertyGallery'

afterEach(cleanup)
beforeEach(() => localStorage.clear())

describe('property interactions', () => {
  it('selects a gallery image from its thumbnail', () => {
    render(<PropertyGallery propertyName="Modern Home" images={[
      { id: '1', url: '/front.jpg', alt: 'Front' },
      { id: '2', url: '/living.jpg', alt: 'Living room' },
    ]} />)
    fireEvent.click(screen.getByRole('button', { name: 'View Living room' }))
    expect(screen.getByRole('img', { name: 'Living room' }).getAttribute('src')).toContain('living.jpg')
    expect(screen.getByText('2 Photos')).toBeTruthy()
  })

  it('persists and removes a local favorite', () => {
    render(<FavoriteButton propertyId="7" />)
    fireEvent.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(JSON.parse(localStorage.getItem('homespire:favorites:v1') || '[]')).toEqual(['7'])
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Remove from favorites' }))
    expect(JSON.parse(localStorage.getItem('homespire:favorites:v1') || '[]')).toEqual([])
  })

  it('recovers from corrupt favorite data', () => {
    localStorage.setItem('homespire:favorites:v1', '{bad')
    render(<FavoriteButton propertyId="7" />)
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests and confirm both components are missing**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-details.int.spec.tsx`

Expected: FAIL resolving `PropertyGallery` or `FavoriteButton`.

- [ ] **Step 3: Implement the gallery client component**

Use `'use client'`, `useState(0)`, `next/image`, accessible thumbnail buttons, a neutral `aspect-[4/3]` placeholder when `images.length === 0`, and the supplied two-column desktop gallery layout. The primary image `alt` must come from the selected item; thumbnail buttons use `aria-label={`View ${image.alt || propertyName}`}`.

- [ ] **Step 4: Implement resilient favorite persistence**

Use `'use client'`, `useEffect`, and `useState`. Read `homespire:favorites:v1` after hydration, accept only arrays of strings, catch storage and JSON failures, and update the button immediately. On toggle, compute a new string array and attempt `localStorage.setItem`; retain the in-memory state even if storage throws. Render an inline heart SVG plus accessible labels “Add to favorites” and “Remove from favorites.”

- [ ] **Step 5: Verify interaction tests**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-details.int.spec.tsx`

Expected: 3 tests PASS with no React warnings.

---

### Task 4: Build the responsive property detail composition

**Files:**
- Create: `src/components/property-details/PropertySummary.tsx`
- Create: `src/components/property-details/PropertyDetailsTabs.tsx`
- Create: `src/components/property-details/ListingAgentCard.tsx`
- Create: `src/components/property-details/PropertyDetailsPage.tsx`
- Modify: `tests/int/property-details.int.spec.tsx`

**Interfaces:**
- Consumes: `PropertyDetailsView` from Task 2 and interactive components from Task 3.
- Produces: `PropertyDetailsPage({ property }: { property: PropertyDetailsView })`.

- [ ] **Step 1: Add a failing complete-page rendering test**

```tsx
import { PropertyDetailsPage } from '@/components/property-details/PropertyDetailsPage'

it('renders property identity, booking action, facts, details, and listing agent', () => {
  render(<PropertyDetailsPage property={{
    id: '7', name: 'Modern Family Home', slug: 'modern-family-home', location: 'Banani, Dhaka',
    statusLabel: 'For sale', priceLabel: '৳ 18,500,000', summary: 'A calm modern residence.',
    description: { root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 } } as never,
    images: [{ id: '1', url: '/front.jpg', alt: 'Front exterior' }],
    facts: [{ label: 'Bedrooms', value: '4', icon: 'bed' }],
    features: ['Natural light'], amenities: ['Pool'],
    listing: { name: 'Homespire Real Estate', verified: true },
    bookingHref: '/book-a-call?property=modern-family-home',
  }} />)
  expect(screen.getByRole('heading', { name: 'Modern Family Home' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Book a viewing' }).getAttribute('href')).toBe('/book-a-call?property=modern-family-home')
  expect(screen.getByText('4')).toBeTruthy()
  expect(screen.getByText('Homespire Real Estate')).toBeTruthy()
})
```

- [ ] **Step 2: Add a failing accessible-tabs test**

```tsx
it('switches to a populated features tab', () => {
  render(<PropertyDetailsTabs description={null} summary="Overview" features={['Natural light']} amenities={[]} location="Dhaka" />)
  fireEvent.click(screen.getByRole('tab', { name: 'Features' }))
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Natural light')
})
```

If jest-dom matchers are not installed, assert `screen.getByRole('tabpanel').textContent` contains the literal instead of using `toHaveTextContent`.

- [ ] **Step 3: Run tests and confirm missing composition failures**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-details.int.spec.tsx`

Expected: FAIL resolving the new modules.

- [ ] **Step 4: Implement summary, tabs, and listing card**

`PropertySummary` renders the badge, serif `h1`, location, gold price, fact grid, booking anchor, and `FavoriteButton`. `PropertyDetailsTabs` is a client component using WAI-ARIA `tablist`, `tab`, and `tabpanel` roles; omit Features or Amenities tabs when their arrays are empty. Render Lexical description using `RichText` from `@payloadcms/richtext-lexical/react` only when description is present. `ListingAgentCard` returns `null` without listing data and shows the verification label only when true.

- [ ] **Step 5: Implement full page composition and styling**

`PropertyDetailsPage` renders:

```tsx
<>
  <SiteHeader />
  <div className="bg-[#082238] pb-5 pt-24 text-white">{/* breadcrumbs */}</div>
  <main className="bg-[#fbfaf8] text-[#0b2237]">
    <section className="mx-auto grid max-w-[1376px] lg:grid-cols-[1.35fr_1fr]">
      <PropertyGallery ... />
      <PropertySummary ... />
    </section>
    <section className="mx-auto grid max-w-[1376px] gap-8 px-5 py-10 lg:grid-cols-[1fr_320px]">
      <PropertyDetailsTabs ... />
      <ListingAgentCard ... />
    </section>
  </main>
</>
```

Keep mobile sections stacked, thumbnails horizontally scrollable, desktop gallery beside the summary, and action buttons full-width below `md`.

- [ ] **Step 6: Verify all property component tests**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-details.int.spec.tsx`

Expected: all gallery, favorites, tabs, and composition tests PASS.

---

### Task 5: Add the Payload query boundary and dynamic route

**Files:**
- Create: `src/lib/properties/getPropertyBySlug.ts`
- Create: `src/app/(frontend)/properties/[slug]/page.tsx`
- Test: `tests/int/property-query.int.spec.ts`

**Interfaces:**
- Consumes: Payload `BasePayload`, generated `Property`, `toPropertyView`, and `PropertyDetailsPage`.
- Produces: `getPropertyBySlug(payload, slug): Promise<Property | null>` and public page route.

- [ ] **Step 1: Write the failing query-contract test**

```ts
import { describe, expect, it, vi } from 'vitest'
import { getPropertyBySlug } from '@/lib/properties/getPropertyBySlug'

describe('getPropertyBySlug', () => {
  it('queries one property by exact slug with populated media', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [{ id: 7, slug: 'modern-family-home' }] })
    const result = await getPropertyBySlug({ find } as never, 'modern-family-home')
    expect(find).toHaveBeenCalledWith({
      collection: 'properties', depth: 2, limit: 1, pagination: false,
      where: { slug: { equals: 'modern-family-home' } },
    })
    expect(result).toEqual({ id: 7, slug: 'modern-family-home' })
  })

  it('returns null when no property matches', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    expect(await getPropertyBySlug({ find } as never, 'missing')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test and confirm the missing-loader failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-query.int.spec.ts`

Expected: FAIL because `getPropertyBySlug` does not exist.

- [ ] **Step 3: Implement the exact query boundary**

```ts
import type { BasePayload } from 'payload'
import type { Property } from '@/payload-types'

export async function getPropertyBySlug(payload: BasePayload, slug: string): Promise<Property | null> {
  const result = await payload.find({
    collection: 'properties', depth: 2, limit: 1, pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] || null
}
```

- [ ] **Step 4: Implement route rendering and metadata**

Create `src/app/(frontend)/properties/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PropertyDetailsPage } from '@/components/property-details/PropertyDetailsPage'
import { toPropertyView } from '@/components/property-details/toPropertyView'
import { getPropertyBySlug } from '@/lib/properties/getPropertyBySlug'

type Props = { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(await getPayload({ config }), slug)
  if (!property) return {}
  return { title: property.seo?.title || property.name, description: property.seo?.description || property.summary || undefined }
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const property = await getPropertyBySlug(await getPayload({ config }), slug)
  if (!property) notFound()
  return <PropertyDetailsPage property={toPropertyView(property)} />
}
```

- [ ] **Step 5: Verify query tests and compile the route**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/property-query.int.spec.ts && pnpm exec tsc --noEmit`

Expected: both query tests PASS and TypeScript exits 0.

---

### Task 6: Full verification and CMS handoff

**Files:**
- Verify: all files changed in Tasks 1–5
- Generated: `src/payload-types.ts`

**Interfaces:**
- Consumes: completed collection, model, components, query, and route.
- Produces: verified property-details feature ready for admin content entry.

- [ ] **Step 1: Format only changed files**

Run:

```bash
pnpm exec prettier --write \
  src/collections/Properties.ts src/payload.config.ts \
  src/components/property-details src/lib/properties \
  'src/app/(frontend)/properties/[slug]/page.tsx' \
  tests/int/properties-collection.int.spec.ts \
  tests/int/property-view.int.spec.ts \
  tests/int/property-details.int.spec.tsx \
  tests/int/property-query.int.spec.ts
```

- [ ] **Step 2: Regenerate Payload types after formatting**

Run: `pnpm generate:types`

Expected: `src/payload-types.ts` contains `Property` and `properties` collection keys.

- [ ] **Step 3: Run focused and full integration tests**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/properties-collection.int.spec.ts tests/int/property-view.int.spec.ts tests/int/property-details.int.spec.tsx tests/int/property-query.int.spec.ts`

Then run: `pnpm run test:int`

Expected: all tests PASS with zero failures.

- [ ] **Step 4: Run compiler, diff, and production checks**

Run: `pnpm exec tsc --noEmit && git diff --check && pnpm build`

Expected: all commands exit 0. If `pnpm lint` is attempted and still fails before linting because `@eslint/eslintrc` is undeclared, report that existing toolchain issue separately rather than changing dependencies in this feature.

- [ ] **Step 5: Verify the rendered route with real admin content**

Create one property in Payload Admin with slug `modern-family-home`, cover and gallery images, facts, description, features, amenities, and listing identity. Open `/properties/modern-family-home` and verify at desktop and mobile widths:

- selected gallery image changes from a thumbnail click;
- booking link is `/book-a-call?property=modern-family-home`;
- favorite state survives a reload and toggles off;
- empty optional tabs/cards leave no blank layout;
- `/properties/not-a-real-property` renders the application 404 page.

- [ ] **Step 6: Report schema synchronization expectations**

On the first development restart, Payload may request confirmation to remove the old `products` table and create `properties` tables. Confirm the exact proposed tables before accepting; do not delete unrelated tables. Note in the handoff that existing product records were explicitly declared disposable during design.
