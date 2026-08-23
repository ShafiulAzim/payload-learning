import type { Block } from 'payload'

import { propertyPriceOptions, propertyTypeOptions } from '@/lib/properties/search'

export const HeroWithSearch: Block = {
  slug: 'hero-with-search',
  interfaceName: 'HeroWithSearchBlock',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Find your dream home' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Explore properties' },
        { name: 'href', type: 'text', defaultValue: '#properties' },
      ],
    },
    {
      name: 'search',
      type: 'group',
      label: 'Property search form',
      fields: [
        { name: 'action', type: 'text', required: true, defaultValue: '/properties' },
        { name: 'locationLabel', type: 'text', required: true, defaultValue: 'Location' },
        {
          name: 'locationPlaceholder',
          type: 'text',
          required: true,
          defaultValue: 'Enter location',
        },
        {
          name: 'typeLabel',
          type: 'text',
          required: true,
          defaultValue: 'Property type',
        },
        {
          name: 'types',
          type: 'array',
          required: true,
          minRows: 1,
          defaultValue: propertyTypeOptions.map((option) => ({ ...option })),
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text' },
          ],
        },
        {
          name: 'priceLabel',
          type: 'text',
          required: true,
          defaultValue: 'Price range',
        },
        {
          name: 'prices',
          type: 'array',
          required: true,
          minRows: 1,
          defaultValue: propertyPriceOptions.map((option) => ({ ...option })),
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text' },
          ],
        },
        {
          name: 'buttonLabel',
          type: 'text',
          required: true,
          defaultValue: 'Search properties',
        },
      ],
    },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
  ],
}
