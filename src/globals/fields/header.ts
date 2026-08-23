import type { Field } from 'payload'

export const headerField: Field = {
  name: 'header',
  type: 'group',
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Properties', href: '/properties' },
        { label: 'Blog', href: '/blog' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Book a call' },
        { name: 'href', type: 'text', required: true, defaultValue: '/book-a-call' },
      ],
    },
  ],
}
