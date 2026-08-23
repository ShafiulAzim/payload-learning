import type { Payload, Where } from 'payload'

export type SlugCollection = 'blog-categories' | 'blogs'

export function slugify(value: string) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'article'
}

export async function uniqueSlug({
  payload,
  collection,
  value,
  currentID,
}: {
  payload: Payload
  collection: SlugCollection
  value: string
  currentID?: number | string
}) {
  const base = slugify(value)
  const where: Where = currentID
    ? { and: [{ slug: { like: base } }, { id: { not_equals: currentID } }] }
    : { slug: { like: base } }
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    select: { slug: true },
    where,
  })
  const used = new Set(result.docs.map((document) => document.slug))

  if (!used.has(base)) return base

  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}
