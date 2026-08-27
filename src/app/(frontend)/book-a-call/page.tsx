import { randomUUID } from 'crypto'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'

import { BookingForm } from '@/components/booking/BookingForm'
import config from '@/payload.config'

type Props = {
  searchParams: Promise<{ property?: string | string[] }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book a Call | Homespire',
  description: 'Book a consultation with the Homespire property team.',
}

const benefits = [
  ['Quick response', 'We respond within 24 hours.'],
  ['Expert guidance', 'Get advice from our property experts.'],
  ['Free consultation', 'No obligations—just helpful guidance.'],
]

export default async function BookACallPage({ searchParams }: Props) {
  const query = await searchParams
  const requestedProperty = Array.isArray(query.property) ? query.property[0] : query.property
  let propertyResult

  try {
    const payload = await getPayload({ config })
    propertyResult = await payload.find({
      collection: 'properties',
      depth: 1,
      pagination: false,
      limit: 500,
      sort: 'name',
      select: { id: true, name: true, location: true, cover: true },
    })
  } catch (error) {
    console.error('Unable to load booking properties', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }

  const properties = (propertyResult?.docs || []).map((property) => ({
    id: property.id,
    name: property.name,
    location: property.location,
  }))
  const requestedID = Number(requestedProperty)
  const selectedPropertyID = properties.some((property) => property.id === requestedID)
    ? requestedID
    : undefined
  const selectedRecord = propertyResult?.docs.find((property) => property.id === selectedPropertyID)
  const fallbackRecord = propertyResult?.docs[0]
  const visualMediaValue = selectedRecord?.cover || fallbackRecord?.cover
  const visualMedia = typeof visualMediaValue === 'object' ? visualMediaValue : null
  const minDate = new Date().toISOString().slice(0, 10)

  return (
    <>
      <section className="min-h-screen bg-[#f7f5f1] px-5 pb-14 pt-32 text-[#0b2237] sm:px-8 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="mx-auto grid max-w-[1376px] overflow-hidden rounded-xl bg-white shadow-[0_18px_60px_rgba(8,34,56,0.12)] lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative overflow-hidden bg-[#f1eee7] p-7 sm:p-10 lg:min-h-[700px] lg:p-12">
            {visualMedia?.url ? (
              <Image
                src={visualMedia.url}
                alt={visualMedia.alt || 'Homespire property interior'}
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover opacity-20"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7f4ed]/95 via-[#f7f4ed]/90 to-[#e8dfcd]/75" />
            <div className="relative flex h-full flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
                Book a call
              </p>
              <h1 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
                Let&apos;s Find Your Next Property
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
                Tell us what you&apos;re looking for and one of our property experts will get in
                touch with you.
              </p>

              <div className="mt-9 grid gap-6">
                {benefits.map(([title, description], index) => (
                  <div key={title} className="flex gap-4">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c9a25d] text-sm font-semibold text-[#b78a3d]"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold">{title}</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b78a3d]">
                Appointment details
              </p>
              <h2 className="mt-2 font-serif text-3xl">How can we help?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Complete the form and we&apos;ll take care of the rest.
              </p>
            </div>

            {properties.length > 0 ? (
              <BookingForm
                properties={properties}
                selectedPropertyID={selectedPropertyID}
                submissionToken={randomUUID()}
                minDate={minDate}
              />
            ) : (
              <div
                className="rounded border border-amber-200 bg-amber-50 px-5 py-6 text-sm leading-6 text-amber-900"
                role="alert"
              >
                Booking is temporarily unavailable because no properties could be loaded. Please try
                again later.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
