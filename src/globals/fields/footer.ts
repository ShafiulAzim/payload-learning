import type { Field } from 'payload'

export const footerField: Field = {
  name: 'footer',
  type: 'group',
  fields: [
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Helping you find a place you will love to call home.',
      maxLength: 320,
    },
    {
      name: 'linkGroups',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea', maxLength: 240 },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© Homespire Real Estate. All rights reserved.',
    },
  ],
}
