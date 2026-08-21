'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type PropertiesPerPageProps = {
  value: number
}

const options = [6, 9, 12, 18]

export function PropertiesPerPage({ value }: PropertiesPerPageProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <label className="flex items-center gap-3 text-xs text-slate-500">
      <span>Show</span>
      <select
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('perPage', event.target.value)
          params.set('page', '1')
          router.push(`${pathname}?${params.toString()}`)
        }}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#0b2237] outline-none focus:border-[#b78a3d]"
        aria-label="Properties per page"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </label>
  )
}
