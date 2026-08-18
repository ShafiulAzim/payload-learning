import type { Block } from 'payload'

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
          defaultValue: [
            { label: 'All types', value: '' },
            { label: 'House', value: 'house' },
            { label: 'Apartment', value: 'apartment' },
            { label: 'Villa', value: 'villa' },
          ],
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
          defaultValue: [
            { label: 'Any price', value: '' },
            { label: 'Up to $500,000', value: '500000' },
            { label: 'Up to $1,000,000', value: '1000000' },
            { label: 'Up to $2,500,000', value: '2500000' },
          ],
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
