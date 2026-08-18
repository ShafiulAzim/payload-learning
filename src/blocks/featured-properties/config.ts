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
      type: 'array',
      minRows: 1,
      maxRows: 8,
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            { label: 'For sale', value: 'for-sale' },
            { label: 'For rent', value: 'for-rent' },
          ],
        },
        { name: 'name', type: 'text', required: true },
        { name: 'location', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
      ],
    },
  ],
}
