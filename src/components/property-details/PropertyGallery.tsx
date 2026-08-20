'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { PropertyImage } from './types'

export function PropertyGallery({
  images,
  propertyName,
}: {
  images: PropertyImage[]
  propertyName: string
}) {
  const [selected, setSelected] = useState(0)
  const active = images[selected]

  if (!active) {
    return (
      <div
        role="img"
        aria-label={`No image available for ${propertyName}`}
        className="flex min-h-[360px] items-center justify-center bg-slate-200 text-sm text-slate-500"
      >
        No image available
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-[1fr_150px]">
      <div className="relative min-h-[390px] overflow-hidden bg-slate-100 lg:min-h-[520px]">
        <Image
          src={active.url}
          alt={active.alt || propertyName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto sm:grid sm:max-h-[520px] sm:grid-cols-1 sm:overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            aria-label={`View ${image.alt || propertyName}`}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className={`relative h-24 min-w-32 overflow-hidden ring-inset sm:h-32 sm:min-w-0 ${index === selected ? 'ring-2 ring-[#c79a49]' : ''}`}
          >
            <Image src={image.url} alt="" fill sizes="150px" className="object-cover" />
          </button>
        ))}
        <span className="flex h-12 min-w-32 items-center justify-center bg-[#09243a]/90 text-xs font-semibold text-white sm:min-w-0">
          {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
        </span>
      </div>
    </div>
  )
}
