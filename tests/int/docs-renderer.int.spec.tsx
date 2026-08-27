import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DocsArticle } from '@/components/docs/DocsArticle'
import type { DocsPage } from '@/lib/docs/types'

const item = {
  title: 'Local API',
  description: 'Calling Payload directly in server code.',
  slug: ['operations', 'local-api'],
  file: 'operations/local-api.md',
} as const

const fixturePage: DocsPage = {
  frontmatter: { title: item.title, description: item.description },
  slug: [...item.slug],
  content: [
    '## Local API',
    '',
    "```ts\npayload.find({ collection: 'properties' })\n```",
    '',
    '| Option | Meaning |',
    '| --- | --- |',
    '| depth | Relationship population |',
  ].join('\n'),
  headings: [{ depth: 2, id: 'local-api', text: 'Local API' }],
  item,
  previous: null,
  next: {
    title: 'Queries',
    description: 'Filtering and pagination.',
    slug: ['operations', 'queries'],
    file: 'operations/queries.md',
  },
}

describe('DocsArticle', () => {
  it('renders Payload prose, code, tables, heading anchors, TOC, and pager', () => {
    render(<DocsArticle page={fixturePage} />)

    expect(screen.getByRole('heading', { name: 'Local API', level: 2 }).getAttribute('id')).toBe(
      'local-api',
    )
    expect(screen.getByRole('link', { name: 'Local API' }).getAttribute('href')).toBe('#local-api')
    expect(screen.getByText("payload.find({ collection: 'properties' })")).toBeTruthy()
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByRole('link', { name: /next: queries/i }).getAttribute('href')).toBe(
      '/docs/operations/queries',
    )
  })
})
