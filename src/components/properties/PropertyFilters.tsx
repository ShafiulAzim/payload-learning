import Link from 'next/link'

import {
  propertyPriceOptions,
  type PropertySearchFilters,
  propertyTypeOptions,
} from '@/lib/properties/search'

export function PropertyFilters({
  filters,
  perPage,
}: {
  filters: PropertySearchFilters
  perPage: number
}) {
  const hasFilters = Boolean(filters.location || filters.type || filters.price)
  const fieldClass =
    'w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400'

  return (
    <form
      action="/properties"
      method="get"
      className="grid overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-[0_12px_35px_rgba(6,29,47,0.1)] md:grid-cols-[1fr_1fr_1fr_auto] md:p-5"
    >
      <input type="hidden" name="perPage" value={perPage} />
      <label className="flex flex-col gap-1 border-b border-slate-200 px-3 py-2 md:border-b-0 md:border-r md:px-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">Location</span>
        <input
          name="location"
          defaultValue={filters.location}
          maxLength={100}
          className={fieldClass}
          placeholder="Enter location"
        />
      </label>
      <label className="flex flex-col gap-1 border-b border-slate-200 px-3 py-2 md:border-b-0 md:border-r md:px-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">Property type</span>
        <select name="type" defaultValue={filters.type || ''} className={fieldClass}>
          {propertyTypeOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 px-3 py-2 md:px-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">Maximum price</span>
        <select name="price" defaultValue={filters.price || ''} className={fieldClass}>
          {propertyPriceOptions.map((option) => (
            <option key={option.value || 'any'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 flex gap-2 md:mt-0">
        <button
          type="submit"
          className="bg-[#09243a] px-7 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#123b59]"
        >
          Search
        </button>
        {hasFilters ? (
          <Link
            href={`/properties?perPage=${perPage}`}
            className="inline-flex items-center justify-center border border-slate-200 px-4 text-xs font-semibold text-slate-500 hover:border-[#b78a3d] hover:text-[#b78a3d]"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  )
}
