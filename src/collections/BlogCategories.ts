import type { CollectionConfig } from 'payload'

import { slugify, uniqueSlug } from '@/lib/slug/slugify'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data?.name) return data
        const previousAutomaticSlug = originalDoc?.name ? slugify(originalDoc.name) : null
        const shouldGenerate =
          !data.slug || !originalDoc || originalDoc.slug === previousAutomaticSlug

        if (!shouldGenerate) return data
        return {
          ...data,
          slug: await uniqueSlug({
            payload: req.payload,
            collection: 'blog-categories',
            value: data.name,
            currentID: originalDoc?.id,
          }),
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, index: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Generated automatically from the category name. You may customize it.',
      },
    },
  ],
}
