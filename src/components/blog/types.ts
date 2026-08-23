import type { Blog, BlogCategory, Media } from '@/payload-types'

export const blogPageSizes = [6, 9, 12, 18]

export type BlogCategoryOption = {
  id: number
  name: string
  slug: string
}

export type BlogCardData = {
  id: number
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  category: BlogCategoryOption
  image?: { url: string; alt: string }
}

const populatedCategory = (value: number | BlogCategory): value is BlogCategory =>
  typeof value === 'object' && value !== null

const populatedMedia = (value: number | Media): value is Media =>
  typeof value === 'object' && value !== null

export function toBlogCard(blog: Blog): BlogCardData {
  const category = populatedCategory(blog.category)
    ? { id: blog.category.id, name: blog.category.name, slug: blog.category.slug }
    : { id: blog.category, name: 'Insights', slug: '' }
  const media = populatedMedia(blog.featuredImage) ? blog.featuredImage : null

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    publishedAt: blog.publishedAt,
    category,
    image: media?.url ? { url: media.url, alt: media.alt || blog.title } : undefined,
  }
}

export const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
