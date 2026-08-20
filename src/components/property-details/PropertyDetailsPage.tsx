import { SiteHeader } from '@/components/SiteHeader'

import { ListingAgentCard } from './ListingAgentCard'
import { PropertyDetailsTabs } from './PropertyDetailsTabs'
import { PropertyGallery } from './PropertyGallery'
import { PropertySummary } from './PropertySummary'
import type { PropertyDetailsView } from './types'

export function PropertyDetailsPage({ property }: { property: PropertyDetailsView }) {
  return (
    <>
      <SiteHeader />
      <div className="bg-[#082238] px-5 pb-5 pt-28 text-white sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-[1376px] text-[11px] text-white/75">
          <a href="/">Home</a>
          <span className="mx-2">›</span>
          <a href="/properties">Properties</a>
          <span className="mx-2">›</span>
          <span>{property.name}</span>
        </nav>
      </div>
      <main className="bg-[#fbfaf8] text-[#0b2237]">
        <section className="mx-auto grid max-w-[1376px] lg:grid-cols-[1.35fr_1fr]">
          <PropertyGallery images={property.images} propertyName={property.name} />
          <PropertySummary property={property} />
        </section>
        <section className="mx-auto grid max-w-[1376px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-12">
          <PropertyDetailsTabs
            description={property.description}
            summary={property.summary}
            features={property.features}
            amenities={property.amenities}
            location={property.location}
          />
          <ListingAgentCard listing={property.listing} />
        </section>
      </main>
    </>
  )
}
