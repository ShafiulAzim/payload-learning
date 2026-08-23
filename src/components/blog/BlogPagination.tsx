import Link from 'next/link'

type BlogPaginationProps = {
  page: number
  totalPages: number
  perPage: number
  category?: string
}

type PageItem = number | 'ellipsis'

function pageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((item) => item > 0 && item <= totalPages)
    .sort((left, right) => left - right)
  return pages.flatMap((item, index) =>
    index > 0 && item - pages[index - 1] > 1 ? ['ellipsis' as const, item] : [item],
  )
}

function pageHref(page: number, perPage: number, category?: string) {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) })
  if (category) params.set('category', category)
  return `/blog?${params.toString()}`
}

export function BlogPagination({ page, totalPages, perPage, category }: BlogPaginationProps) {
  if (totalPages <= 1) return null
  const linkClass =
    'inline-flex h-10 min-w-10 items-center justify-center border border-slate-200 bg-white px-3 text-sm font-semibold text-[#0b2237] transition hover:border-[#b78a3d] hover:text-[#b78a3d]'

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex flex-wrap justify-center gap-2">
      {page > 1 ? (
        <Link
          href={pageHref(page - 1, perPage, category)}
          className={linkClass}
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span aria-disabled="true" className={`${linkClass} cursor-not-allowed opacity-40`}>
          ←
        </span>
      )}
      {pageItems(page, totalPages).map((item, index) =>
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
            href={pageHref(item, perPage, category)}
            aria-current={item === page ? 'page' : undefined}
            className={`${linkClass} ${item === page ? 'border-[#b78a3d] bg-[#b78a3d] text-white hover:text-white' : ''}`}
          >
            {item}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link
          href={pageHref(page + 1, perPage, category)}
          className={linkClass}
          aria-label="Next page"
        >
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
