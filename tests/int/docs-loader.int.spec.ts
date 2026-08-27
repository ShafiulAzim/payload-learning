import { describe, expect, it } from 'vitest'

import { extractHeadings } from '@/lib/docs/headings'
import { loadDocsPage } from '@/lib/docs/loadDocsPage'
import { getAllDocsItems, getDocsItem } from '@/lib/docs/manifest'

describe('documentation manifest', () => {
  it('maps the empty slug to the introduction', () => {
    expect(getDocsItem([])?.file).toBe('index.md')
  })

  it('has unique public slugs and source files', () => {
    const items = getAllDocsItems()

    expect(new Set(items.map((item) => item.slug.join('/'))).size).toBe(items.length)
    expect(new Set(items.map((item) => item.file)).size).toBe(items.length)
  })

  it('rejects unknown and traversal-like slugs', async () => {
    await expect(loadDocsPage(['missing'])).resolves.toBeNull()
    await expect(loadDocsPage(['..', 'package.json'])).resolves.toBeNull()
  })
})

describe('documentation loader', () => {
  it('loads validated frontmatter and pager state', async () => {
    const page = await loadDocsPage([])

    expect(page?.frontmatter.title).toBe('Payload CMS in this project')
    expect(page?.previous).toBeNull()
    expect(page?.next?.slug.length).toBeGreaterThan(0)
  })

  it('extracts stable duplicate-safe heading ids', () => {
    expect(extractHeadings('## Local API\n### Depth\n## Local API')).toEqual([
      { depth: 2, id: 'local-api', text: 'Local API' },
      { depth: 3, id: 'depth', text: 'Depth' },
      { depth: 2, id: 'local-api-2', text: 'Local API' },
    ])
  })

  it('documents Payload foundations with repository-specific details', async () => {
    const requiredCoverage = [
      [['foundations', 'architecture'], ['payload.config.ts', 'Local API', 'PostgreSQL']],
      [['foundations', 'config-and-startup'], ['buildConfig', 'postgresAdapter', 'getPayload']],
      [['foundations', 'apis-and-admin'], ['REST_GET', 'GRAPHQL_POST', 'RootLayout']],
      [['schema', 'configuration'], ['collections', 'globals', 'editor', 'sharp']],
      [['schema', 'fields-and-validation'], ['required', 'unique', 'index', 'beforeValidate']],
      [['schema', 'relationships-and-depth'], ['relationTo', 'depth', 'Media']],
      [['schema', 'generated-types'], ['generate:types', 'payload-types.ts', 'interfaceName']],
    ] as const

    for (const [slug, tokens] of requiredCoverage) {
      const page = await loadDocsPage(slug)
      expect(page).not.toBeNull()
      for (const token of tokens) expect(page?.content).toContain(token)
    }
  })

  it('documents every registered collection and Global', async () => {
    const schemas = [
      [['collections', 'pages'], 'src/collections/Pages.ts', "slug: 'pages'"],
      [['collections', 'users'], 'src/collections/Users.ts', "slug: 'users'"],
      [['collections', 'media'], 'src/collections/Media.ts', "slug: 'media'"],
      [['collections', 'properties'], 'src/collections/Properties.ts', "slug: 'properties'"],
      [['collections', 'bookings'], 'src/collections/Bookings.ts', "slug: 'bookings'"],
      [
        ['collections', 'blog-categories'],
        'src/collections/BlogCategories.ts',
        "slug: 'blog-categories'",
      ],
      [['collections', 'blogs'], 'src/collections/Blogs.ts', "slug: 'blogs'"],
      [['globals', 'site-settings'], 'src/globals/SiteSettings.ts', "slug: 'site-settings'"],
    ] as const

    for (const [slug, source, payloadSlug] of schemas) {
      const page = await loadDocsPage(slug)
      expect(page?.content).toContain(source)
      expect(page?.content).toContain(payloadSlug)
    }
  })

  it('covers every Payload operation used by the integrations', async () => {
    const integrationItems = getAllDocsItems().filter((item) =>
      ['operations', 'integrations'].includes(item.slug[0] || ''),
    )
    const pages = await Promise.all(integrationItems.map((item) => loadDocsPage(item.slug)))
    const corpus = pages.map((page) => page?.content || '').join('\n')
    const payloadTokens = [
      'getPayload({ config })',
      "collection: 'pages'",
      "collection: 'properties'",
      "collection: 'blogs'",
      "collection: 'blog-categories'",
      "collection: 'bookings'",
      "slug: 'site-settings'",
      'payload.find(',
      'payload.findByID(',
      'payload.findGlobal(',
      'payload.create(',
      'overrideAccess: false',
      'overrideAccess: true',
      'depth:',
      'pagination: false',
      'select:',
      'where:',
    ]

    for (const token of payloadTokens) expect(corpus).toContain(token)
  })

  it('has valid internal documentation links', async () => {
    const items = getAllDocsItems()
    const validPaths = new Set(
      items.map((item) => (item.slug.length ? `/docs/${item.slug.join('/')}` : '/docs')),
    )

    for (const item of items) {
      const page = await loadDocsPage(item.slug)
      expect(page).not.toBeNull()
      const links = [...(page?.content.matchAll(/\[[^\]]+\]\((\/docs[^)]*)\)/g) || [])]
      for (const link of links) {
        const [pathname, fragment] = link[1].split('#')
        expect(validPaths.has(pathname)).toBe(true)
        if (fragment && pathname === (item.slug.length ? `/docs/${item.slug.join('/')}` : '/docs')) {
          expect(page?.headings.some((heading) => heading.id === fragment)).toBe(true)
        }
      }
    }
  })
})
