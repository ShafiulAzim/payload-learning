import Image from 'next/image'
import Link from 'next/link'

import { formatBlogDate, type BlogCardData } from './types'

export function BlogCard({ blog }: { blog: BlogCardData }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/blog/${encodeURIComponent(blog.slug)}`}
        className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
        aria-label={`Read ${blog.title}`}
      >
        {blog.image ? (
          <Image
            src={blog.image.url}
            alt={blog.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-slate-400">
          <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>
          <span aria-hidden="true">•</span>
          <span className="text-[#b78a3d]">{blog.category.name}</span>
        </div>
        <h2 className="mt-3 font-serif text-xl leading-snug text-[#0b2237] transition group-hover:text-[#b47f28]">
          <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>{blog.title}</Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{blog.excerpt}</p>
        <Link
          href={`/blog/${encodeURIComponent(blog.slug)}`}
          className="mt-auto pt-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0b2237] hover:text-[#b78a3d]"
        >
          Read more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
