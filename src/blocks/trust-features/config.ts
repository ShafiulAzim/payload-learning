import type { Block } from 'payload'

export const TrustFeatures: Block = {
  slug: 'trust-features',
  interfaceName: 'TrustFeaturesBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      required: true,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'home',
          options: [
            { label: 'Home', value: 'home' },
            { label: 'Award', value: 'award' },
            { label: 'Handshake', value: 'handshake' },
            { label: 'Shield', value: 'shield' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
