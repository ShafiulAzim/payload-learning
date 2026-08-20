import { FavoriteButton } from './FavoriteButton'
import type { PropertyDetailsView, PropertyFact } from './types'

function FactIcon({ icon }: { icon: PropertyFact['icon'] }) {
  const paths = {
    bed: 'M3 18v-8m18 8v-6a2 2 0 0 0-2-2H7a4 4 0 0 0-4 4v4m0-2h18M7 10V7h4a2 2 0 0 1 2 2v1',
    bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Zm3 0V6a2 2 0 0 1 4 0',
    area: 'M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5',
    parking: 'M7 20V4h6a5 5 0 0 1 0 10H7m0-5h6',
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d={paths[icon]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PropertySummary({ property }: { property: PropertyDetailsView }) {
  return (
    <section className="flex flex-col justify-center bg-white p-6 lg:p-10">
      <span className="w-fit bg-[#f5f1e9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">
        {property.statusLabel}
      </span>
      <h1 className="mt-4 font-serif text-3xl leading-tight lg:text-4xl">{property.name}</h1>
      <p className="mt-2 text-sm text-slate-500">⌖ {property.location}</p>
      <p className="mt-3 text-xl font-semibold text-[#b47f28]">{property.priceLabel}</p>
      {property.summary ? (
        <p className="mt-5 text-sm leading-6 text-slate-600">{property.summary}</p>
      ) : null}
      {property.facts.length ? (
        <div className="my-7 grid grid-cols-2 gap-4 border-y border-slate-200 py-5 sm:grid-cols-4">
          {property.facts.map((fact) => (
            <div key={fact.label} className="text-center">
              <FactIcon icon={fact.icon} />
              <strong className="mt-1 block text-sm">{fact.value}</strong>
              <span className="text-[10px] text-slate-500">{fact.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="grid gap-3">
        <a
          href={property.bookingHref}
          className="inline-flex items-center justify-center bg-[#bd8b34] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#a87829]"
        >
          Book a viewing
        </a>
        <FavoriteButton propertyId={property.id} />
      </div>
    </section>
  )
}
