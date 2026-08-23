import Image from 'next/image'
import Link from 'next/link'

import type { BlogCardData, BlogCategoryOption } from './types'
import { formatBlogDate } from './types'

export function BlogSidebar({
  categories,
  recentPosts,
}: {
  categories: BlogCategoryOption[]
  recentPosts: BlogCardData[]
}) {
  return (
    <aside className="grid content-start gap-9 border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <section>
        <h2 className="font-serif text-xl text-[#0b2237]">Categories</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className="hover:text-[#b78a3d]"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {recentPosts.length ? (
        <section>
          <h2 className="font-serif text-xl text-[#0b2237]">Recent Posts</h2>
          <div className="mt-4 grid gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${encodeURIComponent(post.slug)}`}
                className="group grid grid-cols-[76px_1fr] gap-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {post.image ? (
                    <Image
                      src={post.image.url}
                      alt={post.image.alt}
                      fill
                      sizes="76px"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="line-clamp-2 font-serif text-sm leading-snug text-[#0b2237] group-hover:text-[#b78a3d]">
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.publishedAt}
                    className="mt-1 block text-[9px] uppercase tracking-wide text-slate-400"
                  >
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  )
}
