import { cache } from 'react'
import { getPayload } from 'payload'

import type { Blog } from '@/payload-types'
import config from '@/payload.config'

export const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blogs',
    depth: 2,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
})
