import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { Blog, BlogCategory, Media } from '@/payload-types'

import { formatBlogDate } from './types'

const isCategory = (value: number | BlogCategory): value is BlogCategory =>
  typeof value === 'object' && value !== null

const isMedia = (value: number | Media): value is Media =>
  typeof value === 'object' && value !== null

export function BlogArticle({ blog }: { blog: Blog }) {
  const category = isCategory(blog.category) ? blog.category : null
  const image = isMedia(blog.featuredImage) ? blog.featuredImage : null

  return (
    <article>
      <header className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-slate-400">
          <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>
          {category ? (
            <>
              <span aria-hidden="true">•</span>
              <a
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className="text-[#b78a3d] hover:underline"
              >
                {category.name}
              </a>
            </>
          ) : null}
        </div>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[#0b2237] sm:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">{blog.excerpt}</p>
      </header>

      <div className="relative mt-8 aspect-[16/8.3] overflow-hidden bg-slate-100">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || blog.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <RichText
        data={blog.content}
        className="mt-9 max-w-none text-[15px] leading-7 text-slate-700 [&_a]:text-[#b47f28] [&_a]:underline [&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-[#b78a3d] [&_blockquote]:bg-[#f8f5ef] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-[#0b2237] [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-[#0b2237] [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-[#0b2237] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </article>
  )
}
