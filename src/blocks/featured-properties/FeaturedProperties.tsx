import type { Property } from '@/payload-types'

import { PropertyCard, type PropertyCardData } from '@/components/properties/PropertyCard'

type LegacyProperty = {
  id?: string | null
  image: PropertyCardData['cover']
  status: 'for-sale' | 'for-rent'
  name: string
  location: string
  price: string
}

type FeaturedPropertiesProps = {
  eyebrow?: string | null
  title: string
  cta?: { label?: string | null; href?: string | null } | null
  properties: Array<number | Property | LegacyProperty>
  blockType?: 'featured-properties'
}

function normalizeProperty(property: number | Property | LegacyProperty): PropertyCardData | null {
  if (typeof property === 'number') return null
  if ('cover' in property) return property

  return {
    id: property.id || property.name,
    name: property.name,
    status: property.status,
    price: property.price,
    location: property.location,
    cover: property.image,
  }
}

export function FeaturedProperties({ eyebrow, title, cta, properties }: FeaturedPropertiesProps) {
  const cards = properties.flatMap((property) => {
    const card = normalizeProperty(property)
    return card ? [card] : []
  })

  return (
    <section
      id="properties"
      className="bg-white px-5 py-14 text-[#0b2237] sm:px-8 lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1376px] gap-10 lg:grid-cols-[270px_1fr]">
        <header>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-4xl leading-tight lg:text-5xl">{title}</h2>
          {cta?.label ? (
            <a
              href={cta.href || '/properties'}
              className="mt-6 inline-flex border border-[#b78a3d] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-[#b78a3d] hover:text-white"
            >
              {cta.label}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </a>
          ) : null}
        </header>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
