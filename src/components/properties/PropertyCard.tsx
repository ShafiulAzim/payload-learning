import Image from 'next/image'
import Link from 'next/link'

type PropertyCardMedia = {
  id?: number | string
  alt?: string | null
  url?: string | null
}

export type PropertyCardData = {
  id: number | string
  name: string
  status: 'for-sale' | 'for-rent'
  type?: string | null
  price: number | string
  location: string
  cover: number | string | PropertyCardMedia
}

type PropertyCardProps = {
  property: PropertyCardData
}

export function PropertyCard({ property }: PropertyCardProps) {
  const cover = typeof property.cover === 'object' ? property.cover : null
  const price =
    typeof property.price === 'number'
      ? `৳ ${property.price.toLocaleString('en-US')}`
      : property.price

  return (
    <Link
      href={`/properties/${encodeURIComponent(String(property.id))}`}
      aria-label={`View ${property.name}`}
      className="group flex h-full flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b78a3d]"
    >
      <div className="relative aspect-[4/2.45] overflow-hidden bg-slate-100">
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={cover.alt || property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-sm bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0b2237] shadow-sm">
          {property.status === 'for-sale' ? 'For sale' : 'For rent'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg text-[#0b2237] transition group-hover:text-[#b47f28]">
          {property.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500">⌖ {property.location}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-sm font-semibold text-[#b47f28]">{price}</p>
          {property.type ? (
            <span className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
              {property.type}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
