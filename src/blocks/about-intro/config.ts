import type { Block } from 'payload'

export const AboutIntro: Block = {
  slug: 'about-intro',
  interfaceName: 'AboutIntroBlock',
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'About us' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'body',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'More about us' },
        { name: 'href', type: 'text', defaultValue: '#values' },
      ],
    },
  ],
}
