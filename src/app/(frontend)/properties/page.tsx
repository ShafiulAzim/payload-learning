import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertiesPagination } from '@/components/properties/PropertiesPagination'
import { PropertiesPerPage } from '@/components/properties/PropertiesPerPage'
import { SiteHeader } from '@/components/SiteHeader'
import config from '@/payload.config'

type Props = {
  searchParams: Promise<{ page?: string | string[]; perPage?: string | string[] }>
}

const allowedPageSizes = [6, 9, 12, 18]
const defaultPageSize = 9

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Properties | Homespire',
  description: 'Explore all properties available from Homespire Real Estate.',
}

function parsePositiveInteger(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

export default async function PropertiesPage({ searchParams }: Props) {
  const query = await searchParams
  const page = parsePositiveInteger(query.page, 1)
  const requestedPageSize = parsePositiveInteger(query.perPage, defaultPageSize)
  const perPage = allowedPageSizes.includes(requestedPageSize) ? requestedPageSize : defaultPageSize
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'properties',
    depth: 1,
    page,
    limit: perPage,
    sort: '-createdAt',
  })

  if (result.totalPages > 0 && page > result.totalPages) {
    redirect(`/properties?page=${result.totalPages}&perPage=${perPage}`)
  }

  const firstResult = result.totalDocs === 0 ? 0 : (page - 1) * perPage + 1
  const lastResult = Math.min(page * perPage, result.totalDocs)

  return (
    <>
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Properties', href: '/properties' },
          { label: 'Blog', href: '/blog' },
        ]}
      />

      <section className="relative overflow-hidden bg-[#082238] px-5 pb-16 pt-36 text-center text-white sm:px-8 lg:px-12 lg:pb-20 lg:pt-40">
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

      <section className="bg-[#f8f8f6] px-5 py-12 text-[#0b2237] sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1376px]">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {result.totalDocs > 0
                ? `Showing ${firstResult}–${lastResult} of ${result.totalDocs} properties`
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
              <p className="mt-2 text-sm text-slate-500">New property listings will appear here.</p>
            </div>
          )}

          <PropertiesPagination page={page} totalPages={result.totalPages} perPage={perPage} />
        </div>
      </section>
    </>
  )
}
