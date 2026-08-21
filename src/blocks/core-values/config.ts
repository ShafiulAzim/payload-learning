import type { Block } from 'payload'

export const CoreValues: Block = {
  slug: 'core-values',
  interfaceName: 'CoreValuesBlock',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'What guides us' },
    { name: 'heading', type: 'text', required: true, defaultValue: 'Our Core Values' },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Home', value: 'home' },
            { label: 'Excellence', value: 'excellence' },
            { label: 'Heart', value: 'heart' },
            { label: 'Person', value: 'person' },
            { label: 'Shield', value: 'shield' },
            { label: 'Handshake', value: 'handshake' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
