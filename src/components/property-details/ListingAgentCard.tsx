import Image from 'next/image'

import type { PropertyDetailsView } from './types'

export function ListingAgentCard({ listing }: { listing?: PropertyDetailsView['listing'] }) {
  if (!listing) return null
  return (
    <aside className="h-fit border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Listed by</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden bg-[#c79a49] text-white">
          {listing.image ? (
            <Image
              src={listing.image.url}
              alt={listing.image.alt || listing.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span aria-hidden="true" className="text-2xl">
              ⌂
            </span>
          )}
        </div>
        <div>
          <h2 className="font-serif text-base">{listing.name}</h2>
          {listing.verified ? (
            <p className="mt-1 text-xs text-slate-500">✓ Verified agent</p>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
