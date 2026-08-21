import type { Block } from 'payload'

export const StatsBar: Block = {
  slug: 'stats-bar',
  interfaceName: 'StatsBarBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Key', value: 'key' },
            { label: 'Building', value: 'building' },
            { label: 'Clients', value: 'clients' },
            { label: 'Award', value: 'award' },
          ],
        },
      ],
    },
  ],
}
