'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'homespire:favorites:v1'

function readFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) && parsed.every((value) => typeof value === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => setFavorites(readFavorites()), [])
  const active = favorites.includes(propertyId)

  const toggle = () => {
    const next = active ? favorites.filter((id) => id !== propertyId) : [...favorites, propertyId]
    setFavorites(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // In-memory state remains usable when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      onClick={toggle}
      className="inline-flex w-full items-center justify-center gap-2 border border-[#c79a49] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#0b2237] transition hover:bg-[#f7efe1]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${active ? 'fill-[#c79a49]' : 'fill-none'}`}
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
      {active ? 'Saved to favorites' : 'Add to favorites'}
    </button>
  )
}
