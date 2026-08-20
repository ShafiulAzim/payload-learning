'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState } from 'react'

import type { Property } from '@/payload-types'

type Tab = 'overview' | 'features' | 'amenities' | 'location'

export function PropertyDetailsTabs({
  description,
  summary,
  features,
  amenities,
  location,
}: {
  description: Property['description'] | null
  summary?: string
  features: string[]
  amenities: string[]
  location: string
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(features.length ? [{ id: 'features' as const, label: 'Features' }] : []),
    ...(amenities.length ? [{ id: 'amenities' as const, label: 'Amenities' }] : []),
    { id: 'location', label: 'Location' },
  ]
  const [active, setActive] = useState<Tab>('overview')

  return (
    <section>
      <div
        role="tablist"
        aria-label="Property details"
        className="flex gap-6 overflow-x-auto border-b border-slate-200"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`border-b-2 px-1 pb-3 text-xs font-medium ${active === tab.id ? 'border-[#c79a49] text-[#b47f28]' : 'border-transparent'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id={`panel-${active}`} role="tabpanel" className="py-7 text-sm leading-7 text-slate-600">
        {active === 'overview' ? (
          <>
            {summary ? <p className="mb-5">{summary}</p> : null}
            {description ? <RichText data={description} /> : null}
          </>
        ) : null}
        {active === 'features' ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        ) : null}
        {active === 'amenities' ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {amenities.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        ) : null}
        {active === 'location' ? <p>{location}</p> : null}
      </div>
    </section>
  )
}
