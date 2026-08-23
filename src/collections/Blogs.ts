import type { CollectionConfig, Where } from 'payload'

import { slugify, uniqueSlug } from '@/lib/slug/slugify'

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: ({ req }) =>
      req.user
        ? true
        : ({
            and: [
              { status: { equals: 'published' } },
              { publishedAt: { less_than_equal: new Date().toISOString() } },
            ],
          } as Where),
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data?.title) return data
        const previousAutomaticSlug = originalDoc?.title ? slugify(originalDoc.title) : null
        const shouldGenerate =
          !data.slug || !originalDoc || originalDoc.slug === previousAutomaticSlug

        if (!shouldGenerate) return data
        return {
          ...data,
          slug: await uniqueSlug({
            payload: req.payload,
            collection: 'blogs',
            value: data.title,
            currentID: originalDoc?.id,
          }),
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 180 },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Generated automatically from the title. You may customize it.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'blog-categories',
      required: true,
      index: true,
    },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 320 },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      index: true,
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', maxLength: 70 },
        { name: 'description', type: 'textarea', maxLength: 170 },
      ],
    },
  ],
}
