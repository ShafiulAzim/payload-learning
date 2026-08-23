'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { blogPageSizes } from './types'

export function BlogsPerPage({ value }: { value: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <label className="flex items-center gap-3 text-xs text-slate-500">
      <span>Show</span>
      <select
        value={value}
        aria-label="Blog posts per page"
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('perPage', event.target.value)
          params.set('page', '1')
          router.push(`${pathname}?${params.toString()}`)
        }}
        className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#0b2237] outline-none focus:border-[#b78a3d]"
      >
        {blogPageSizes.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </label>
  )
}
