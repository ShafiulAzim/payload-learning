import type { Property } from '@/payload-types'

export type PropertyImage = { id: string; url: string; alt: string }
export type PropertyFact = {
  label: string
  value: string
  icon: 'bed' | 'bath' | 'area' | 'parking'
}

export type PropertyDetailsView = {
  id: string
  name: string
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
