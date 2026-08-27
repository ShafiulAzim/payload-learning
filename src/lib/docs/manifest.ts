import type { DocsGroup, DocsItem } from './types'

export const docsGroups = [
  {
    title: 'Start here',
    items: [
      {
        title: 'Payload CMS in this project',
        description: 'A technical learning path through this repository’s Payload architecture.',
        slug: [],
        file: 'index.md',
      },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'Architecture', description: 'How Payload fits into the application.', slug: ['foundations', 'architecture'], file: 'foundations/architecture.md' },
      { title: 'Config and startup', description: 'How Payload is configured and initialized.', slug: ['foundations', 'config-and-startup'], file: 'foundations/config-and-startup.md' },
      { title: 'APIs and Admin', description: 'The Admin, Local, REST, and GraphQL interfaces.', slug: ['foundations', 'apis-and-admin'], file: 'foundations/apis-and-admin.md' },
    ],
  },
  {
    title: 'Schema',
    items: [
      { title: 'Configuration', description: 'The top-level Payload configuration.', slug: ['schema', 'configuration'], file: 'schema/configuration.md' },
      { title: 'Fields and validation', description: 'Fields and constraints used by the schemas.', slug: ['schema', 'fields-and-validation'], file: 'schema/fields-and-validation.md' },
      { title: 'Relationships and depth', description: 'IDs, populated documents, and query depth.', slug: ['schema', 'relationships-and-depth'], file: 'schema/relationships-and-depth.md' },
      { title: 'Generated types', description: 'How Payload schema becomes TypeScript.', slug: ['schema', 'generated-types'], file: 'schema/generated-types.md' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { title: 'Pages', description: 'CMS-managed pages and layout blocks.', slug: ['collections', 'pages'], file: 'collections/pages.md' },
      { title: 'Users', description: 'Payload authentication users.', slug: ['collections', 'users'], file: 'collections/users.md' },
      { title: 'Media', description: 'Public uploads and media relationships.', slug: ['collections', 'media'], file: 'collections/media.md' },
      { title: 'Properties', description: 'The complete property schema.', slug: ['collections', 'properties'], file: 'collections/properties.md' },
      { title: 'Bookings', description: 'Booking records, hooks, and access.', slug: ['collections', 'bookings'], file: 'collections/bookings.md' },
      { title: 'Blog categories', description: 'Category schema and automatic slugs.', slug: ['collections', 'blog-categories'], file: 'collections/blog-categories.md' },
      { title: 'Blogs', description: 'Publishing, relationships, and public access.', slug: ['collections', 'blogs'], file: 'collections/blogs.md' },
    ],
  },
  {
    title: 'Globals and blocks',
    items: [
      { title: 'Site settings', description: 'The shared Site Settings Global.', slug: ['globals', 'site-settings'], file: 'globals/site-settings.md' },
      { title: 'Page builder', description: 'How block configuration reaches React.', slug: ['blocks', 'page-builder'], file: 'blocks/page-builder.md' },
      { title: 'Block reference', description: 'Every registered block and field.', slug: ['blocks', 'block-reference'], file: 'blocks/block-reference.md' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Local API', description: 'Calling Payload directly in server code.', slug: ['operations', 'local-api'], file: 'operations/local-api.md' },
      { title: 'Access control', description: 'Access functions and overrideAccess.', slug: ['operations', 'access-control'], file: 'operations/access-control.md' },
      { title: 'Queries', description: 'Filtering, sorting, depth, and pagination.', slug: ['operations', 'queries'], file: 'operations/queries.md' },
      { title: 'Mutations and hooks', description: 'Creating records and lifecycle hooks.', slug: ['operations', 'mutations-and-hooks'], file: 'operations/mutations-and-hooks.md' },
    ],
  },
  {
    title: 'Integration walkthroughs',
    items: [
      { title: 'Pages and blocks', description: 'From Pages query to block rendering.', slug: ['integrations', 'pages-and-blocks'], file: 'integrations/pages-and-blocks.md' },
      { title: 'Properties', description: 'Property list and detail data flows.', slug: ['integrations', 'properties'], file: 'integrations/properties.md' },
      { title: 'Blog', description: 'Categories, listings, and articles.', slug: ['integrations', 'blog'], file: 'integrations/blog.md' },
      { title: 'Bookings', description: 'Validated booking creation and idempotency.', slug: ['integrations', 'bookings'], file: 'integrations/bookings.md' },
      { title: 'Site settings', description: 'Global data through shared consumers.', slug: ['integrations', 'site-settings'], file: 'integrations/site-settings.md' },
      { title: 'Admin, REST, and GraphQL', description: 'How Payload endpoints are mounted.', slug: ['integrations', 'admin-rest-graphql'], file: 'integrations/admin-rest-graphql.md' },
    ],
  },
  {
    title: 'Recipes and reference',
    items: [
      { title: 'Extending Payload', description: 'Safe schema and API extension recipes.', slug: ['recipes', 'extending-payload'], file: 'recipes/extending-payload.md' },
      { title: 'Debugging', description: 'Diagnose common Payload failures.', slug: ['recipes', 'debugging'], file: 'recipes/debugging.md' },
      { title: 'Schema map', description: 'Collections, Globals, and relationships.', slug: ['reference', 'schema-map'], file: 'reference/schema-map.md' },
      { title: 'Commands and glossary', description: 'Commands and Payload terminology.', slug: ['reference', 'commands-and-glossary'], file: 'reference/commands-and-glossary.md' },
    ],
  },
] as const satisfies readonly DocsGroup[]

export function getAllDocsItems(): DocsItem[] {
  return docsGroups.flatMap((group) => [...group.items])
}

export function docsHref(item: DocsItem): string {
  return item.slug.length ? `/docs/${item.slug.join('/')}` : '/docs'
}

export function getDocsItem(slug: readonly string[]): DocsItem | null {
  const key = slug.join('/')
  return getAllDocsItems().find((item) => item.slug.join('/') === key) || null
}
