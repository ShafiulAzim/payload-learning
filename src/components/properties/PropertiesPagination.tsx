import Link from 'next/link'

type PropertiesPaginationProps = {
  page: number
  totalPages: number
  perPage: number
}

type PageItem = number | 'ellipsis'

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const validPages = [...pages]
    .filter((item) => item > 0 && item <= totalPages)
    .sort((a, b) => a - b)
  const items: PageItem[] = []

  validPages.forEach((item, index) => {
    if (index > 0 && item - validPages[index - 1] > 1) items.push('ellipsis')
    items.push(item)
  })

  return items
}

const hrefFor = (page: number, perPage: number) => `/properties?page=${page}&perPage=${perPage}`

export function PropertiesPagination({ page, totalPages, perPage }: PropertiesPaginationProps) {
  if (totalPages <= 1) return null

  const linkClass =
    'inline-flex h-10 min-w-10 items-center justify-center rounded border border-slate-200 bg-white px-3 text-sm font-semibold text-[#0b2237] transition hover:border-[#b78a3d] hover:text-[#b78a3d]'

  return (
    <nav aria-label="Properties pagination" className="mt-12 flex flex-wrap justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1, perPage)} className={linkClass} aria-label="Previous page">
          ←
        </Link>
      ) : (
        <span aria-disabled="true" className={`${linkClass} cursor-not-allowed opacity-40`}>
          ←
        </span>
      )}

      {getPageItems(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-10 min-w-8 items-center justify-center text-slate-400"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item, perPage)}
            aria-current={item === page ? 'page' : undefined}
            className={`${linkClass} ${item === page ? 'border-[#b78a3d] bg-[#b78a3d] text-white hover:text-white' : ''}`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1, perPage)} className={linkClass} aria-label="Next page">
          →
        </Link>
      ) : (
        <span aria-disabled="true" className={`${linkClass} cursor-not-allowed opacity-40`}>
          →
        </span>
      )}
    </nav>
  )
}
