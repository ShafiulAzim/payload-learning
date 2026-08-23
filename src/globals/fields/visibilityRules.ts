import type { Field } from 'payload'

export const visibilityRulesField: Field = {
  name: 'visibilityRules',
  type: 'array',
  maxRows: 50,
  admin: {
    description: 'Header and footer show by default. Add a rule only when a route should hide one.',
  },
  fields: [
    {
      name: 'pathname',
      type: 'text',
      required: true,
      admin: { description: 'Start with /, for example /book-a-call or /properties.' },
    },
    {
      name: 'match',
      type: 'select',
      required: true,
      defaultValue: 'exact',
      options: [
        { label: 'Exact path only', value: 'exact' },
        { label: 'Path and child routes', value: 'starts-with' },
      ],
    },
    { name: 'hideHeader', type: 'checkbox', defaultValue: false },
    { name: 'hideFooter', type: 'checkbox', defaultValue: false },
  ],
}
