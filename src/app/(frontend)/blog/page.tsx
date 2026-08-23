import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { BlogCard } from '@/components/blog/BlogCard'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { BlogsPerPage } from '@/components/blog/BlogsPerPage'
import { blogPageSizes, toBlogCard } from '@/components/blog/types'
import config from '@/payload.config'

type Props = {
  searchParams: Promise<{
    page?: string | string[]
    perPage?: string | string[]
    category?: string | string[]
  }>
}

const defaultPageSize = 9

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Blog | Homespire',
  description: 'Real estate insights, buying guides, market trends, and property advice.',
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function positiveInteger(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(firstValue(value))
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

function listingHref(category: string | undefined, perPage: number) {
  const params = new URLSearchParams({ page: '1', perPage: String(perPage) })
  if (category) params.set('category', category)
  return `/blog?${params.toString()}`
}

export default async function BlogPage({ searchParams }: Props) {
  const query = await searchParams
  const page = positiveInteger(query.page, 1)
  const requestedPageSize = positiveInteger(query.perPage, defaultPageSize)
  const perPage = blogPageSizes.includes(requestedPageSize) ? requestedPageSize : defaultPageSize
  const categorySlug = firstValue(query.category)?.trim() || undefined
  const payload = await getPayload({ config })
  const categoryResult = await payload.find({
    collection: 'blog-categories',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    sort: 'name',
  })
  const selectedCategory = categorySlug
    ? categoryResult.docs.find((category) => category.slug === categorySlug)
    : undefined
  const blogResult = await payload.find({
    collection: 'blogs',
    depth: 1,
    page,
    limit: perPage,
    overrideAccess: false,
    sort: '-publishedAt',
    where: categorySlug
      ? selectedCategory
        ? { category: { equals: selectedCategory.id } }
        : { id: { equals: -1 } }
      : undefined,
  })

  if (blogResult.totalPages > 0 && page > blogResult.totalPages) {
    const params = new URLSearchParams({
      page: String(blogResult.totalPages),
      perPage: String(perPage),
    })
    if (categorySlug) params.set('category', categorySlug)
    redirect(`/blog?${params.toString()}`)
  }

  const firstPost = blogResult.totalDocs === 0 ? 0 : (page - 1) * perPage + 1
  const lastPost = Math.min(page * perPage, blogResult.totalDocs)

  return (
    <>
      <section className="relative overflow-hidden bg-[#082238] px-5 pb-20 pt-36 text-center text-white sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(183,138,61,0.18),transparent_34%)]" />
        <div className="relative mx-auto max-w-[1376px]">
          <h1 className="font-serif text-4xl sm:text-5xl">Our Blog</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Insights, tips, and inspiration for your real estate journey.
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
            Home <span className="mx-2">›</span> Blog
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-5 pb-16 text-[#0b2237] sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-[1376px]">
          <nav
            aria-label="Blog categories"
            className="relative z-10 -translate-y-1/2 overflow-x-auto rounded-full bg-white px-4 py-3 shadow-lg"
          >
            <div className="flex min-w-max items-center justify-center gap-2">
              <Link
                href={listingHref(undefined, perPage)}
                aria-current={!categorySlug ? 'page' : undefined}
                className={`rounded-full px-5 py-2 text-[11px] font-semibold transition ${!categorySlug ? 'bg-[#b78a3d] text-white' : 'text-slate-500 hover:text-[#b78a3d]'}`}
              >
                All
              </Link>
              {categoryResult.docs.map((category) => (
                <Link
                  key={category.id}
                  href={listingHref(category.slug, perPage)}
                  aria-current={category.slug === categorySlug ? 'page' : undefined}
                  className={`rounded-full px-5 py-2 text-[11px] font-semibold transition ${category.slug === categorySlug ? 'bg-[#b78a3d] text-white' : 'text-slate-500 hover:text-[#b78a3d]'}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {blogResult.totalDocs
                ? `Showing ${firstPost}–${lastPost} of ${blogResult.totalDocs} articles`
                : categorySlug
                  ? 'No articles found in this category'
                  : 'No articles published yet'}
            </p>
            <BlogsPerPage value={perPage} />
          </div>

          {blogResult.docs.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogResult.docs.map((blog) => (
                <BlogCard key={blog.id} blog={toBlogCard(blog)} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <h2 className="font-serif text-2xl">No articles found</h2>
              <p className="mt-2 text-sm text-slate-500">Published articles will appear here.</p>
            </div>
          )}

          <BlogPagination
            page={page}
            totalPages={blogResult.totalPages}
            perPage={perPage}
            category={categorySlug}
          />
        </div>
      </section>
    </>
  )
}
