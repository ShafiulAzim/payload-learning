import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { BlogArticle } from '@/components/blog/BlogArticle'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { toBlogCard } from '@/components/blog/types'
import { getBlogBySlug } from '@/lib/blog/getBlogBySlug'
import config from '@/payload.config'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return {}

  return {
    title: blog.seo?.title || `${blog.title} | Homespire`,
    description: blog.seo?.description || blog.excerpt,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  const payload = await getPayload({ config })
  const [categoryResult, recentResult] = await Promise.all([
    payload.find({
      collection: 'blog-categories',
      depth: 0,
      limit: 100,
      pagination: false,
      overrideAccess: false,
      sort: 'name',
    }),
    payload.find({
      collection: 'blogs',
      depth: 1,
      limit: 5,
      overrideAccess: false,
      sort: '-publishedAt',
      where: { id: { not_equals: blog.id } },
    }),
  ])
  const categories = categoryResult.docs.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }))

  return (
    <>
      <section className="bg-[#082238] px-5 pb-6 pt-32 text-white sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-[1376px] truncate text-[10px] text-white/70"
        >
          <a href="/">Home</a>
          <span className="mx-2">›</span>
          <a href="/blog">Blog</a>
          <span className="mx-2">›</span>
          <span>{blog.title}</span>
        </nav>
      </section>
      <section className="bg-[#fbfaf8] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-[1376px] gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">
          <BlogArticle blog={blog} />
          <BlogSidebar categories={categories} recentPosts={recentResult.docs.map(toBlogCard)} />
        </div>
      </section>
    </>
  )
}
