import type { Block } from 'payload'

export const FeaturedProperties: Block = {
  slug: 'featured-properties',
  interfaceName: 'FeaturedPropertiesBlock',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Featured properties' },
    { name: 'title', type: 'text', required: true },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'View all properties' },
        { name: 'href', type: 'text', defaultValue: '/properties' },
      ],
    },
    {
      name: 'properties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 8,
      filterOptions: {
        featured: {
          equals: true,
        },
      },
      admin: {
        description: 'Select from properties marked as featured for the home page.',
      },
    },
  ],
}
