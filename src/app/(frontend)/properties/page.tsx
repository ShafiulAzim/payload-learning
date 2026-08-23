import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload, type Where } from 'payload'

import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertiesPagination } from '@/components/properties/PropertiesPagination'
import { PropertiesPerPage } from '@/components/properties/PropertiesPerPage'
import { isPropertyType, type PropertySearchFilters } from '@/lib/properties/search'
import config from '@/payload.config'

type Props = {
  searchParams: Promise<{
    page?: string | string[]
    perPage?: string | string[]
    location?: string | string[]
    type?: string | string[]
    price?: string | string[]
  }>
}

const allowedPageSizes = [6, 9, 12, 18]
const defaultPageSize = 9

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Properties | Homespire',
  description: 'Explore all properties available from Homespire Real Estate.',
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function positiveInteger(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(firstValue(value))
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

function pageHref(page: number, perPage: number, filters: PropertySearchFilters) {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) })
  if (filters.location) params.set('location', filters.location)
  if (filters.type) params.set('type', filters.type)
  if (filters.price) params.set('price', filters.price)
  return `/properties?${params.toString()}`
}

export default async function PropertiesPage({ searchParams }: Props) {
  const query = await searchParams
  const page = positiveInteger(query.page, 1)
  const requestedPageSize = positiveInteger(query.perPage, defaultPageSize)
  const perPage = allowedPageSizes.includes(requestedPageSize) ? requestedPageSize : defaultPageSize
  const rawLocation = firstValue(query.location)?.trim().slice(0, 100) || ''
  const rawType = firstValue(query.type)?.trim() || ''
  const rawPrice = firstValue(query.price)?.trim() || ''
  const maximumPrice = positiveInteger(rawPrice, 0)
  const filters: PropertySearchFilters = {
    location: rawLocation || undefined,
    type: isPropertyType(rawType) ? rawType : undefined,
    price: maximumPrice ? String(maximumPrice) : undefined,
  }
  const conditions: Where[] = []

  if (filters.location) conditions.push({ location: { like: filters.location } })
  if (filters.type) conditions.push({ type: { equals: filters.type } })
  if (maximumPrice) conditions.push({ price: { less_than_equal: maximumPrice } })

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'properties',
    depth: 1,
    page,
    limit: perPage,
    sort: '-createdAt',
    where: conditions.length ? { and: conditions } : undefined,
  })

  if (result.totalPages > 0 && page > result.totalPages) {
    redirect(pageHref(result.totalPages, perPage, filters))
  }

  const firstResult = result.totalDocs === 0 ? 0 : (page - 1) * perPage + 1
  const lastResult = Math.min(page * perPage, result.totalDocs)
  const hasFilters = Boolean(filters.location || filters.type || filters.price)

  return (
    <>
      <section className="relative overflow-hidden bg-[#082238] px-5 pb-20 pt-36 text-center text-white sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(183,138,61,0.18),transparent_32%)]" />
        <div className="relative mx-auto max-w-[1376px]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d0a45b]">
            Find your next home
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Properties</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Browse our complete collection of homes, apartments, villas, land, and commercial
            spaces.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-5 pb-16 text-[#0b2237] sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-[1376px]">
          <div className="relative z-10 -translate-y-1/2">
            <PropertyFilters filters={filters} perPage={perPage} />
          </div>

          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {result.totalDocs > 0
                ? `Showing ${firstResult}–${lastResult} of ${result.totalDocs} properties`
                : hasFilters
                  ? 'No properties match your search'
                  : 'No properties available'}
            </p>
            <PropertiesPerPage value={perPage} />
          </div>

          {result.docs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <h2 className="font-serif text-2xl">No properties found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try changing or clearing your search filters.
              </p>
            </div>
          )}

          <PropertiesPagination
            page={page}
            totalPages={result.totalPages}
            perPage={perPage}
            filters={filters}
          />
        </div>
      </section>
    </>
  )
}
