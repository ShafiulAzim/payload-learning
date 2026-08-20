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

  if (property.bedrooms != null) {
    facts.push({ label: 'Bedrooms', value: String(property.bedrooms), icon: 'bed' })
  }
  if (property.bathrooms != null) {
    facts.push({ label: 'Bathrooms', value: String(property.bathrooms), icon: 'bath' })
  }
  if (property.area != null) {
    facts.push({
      label: 'Area',
      value: `${property.area.toLocaleString('en-US')} sqft`,
      icon: 'area',
    })
  }
  if (property.parking != null) {
    facts.push({ label: 'Parking', value: String(property.parking), icon: 'parking' })
  }

  const listingImage = toImage(property.listing?.image)

  return {
    id: String(property.id),
    name: property.name,
    location: property.location,
    statusLabel: property.status === 'for-rent' ? 'For rent' : 'For sale',
    priceLabel: `৳ ${property.price.toLocaleString('en-US')}`,
    summary: property.summary || undefined,
    description: property.description,
    images: cover ? [cover, ...gallery] : gallery,
    facts,
    features: (property.features || []).map(({ label }) => label),
    amenities: (property.amenities || []).map(({ label }) => label),
    listing: property.listing?.name
      ? {
          name: property.listing.name,
          verified: Boolean(property.listing.verified),
          image: listingImage,
        }
      : undefined,
    bookingHref: `/book-a-call?property=${encodeURIComponent(String(property.id))}`,
  }
}
