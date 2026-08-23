import type { GlobalConfig } from 'payload'

import { footerField } from './fields/footer'
import { headerField } from './fields/header'
import { visibilityRulesField } from './fields/visibilityRules'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'HOMESPIRE' },
            { name: 'tagline', type: 'text', defaultValue: 'REAL ESTATE' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
          ],
        },
        { label: 'Header', fields: [headerField] },
        { label: 'Footer', fields: [footerField] },
        { label: 'Page Visibility', fields: [visibilityRulesField] },
      ],
    },
  ],
}
