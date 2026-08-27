# Technical Payload CMS Documentation Design

## Purpose

Build a public, repository-backed documentation site at `/docs` that teaches developers how Payload CMS 3.88.0 is configured, queried, extended, and integrated in this application. The documentation must be technically precise while remaining approachable to a developer who is new to Payload.

Payload is the subject. Next.js appears only at Payload integration boundaries: mounting Admin and API routes, initializing Payload in server code, rendering Payload blocks and globals, and sending mutations through Server Actions or route handlers.

The documentation is not a CMS feature. Its content is stored as Markdown, versioned with the application, and rendered without reading from Payload or PostgreSQL.

## Goals

- Explain Payload architecture through this repository's real source code.
- Document every Payload route, collection, global, field group, block, access rule, hook, query, mutation, adapter, and important Payload-facing helper currently present.
- Trace data from configuration through generated types, Local API operations, transformations, and consumers.
- Explain frontend code only where it reads, transforms, renders, or mutates Payload data.
- Teach developers how to extend and debug Payload safely through concrete recipes.
- Keep documentation public, reviewable in Git, and independent of database availability.

## Non-goals

- Editing documentation through Payload Admin.
- Storing documentation, navigation, or indexes in PostgreSQL.
- Teaching general Next.js concepts unrelated to Payload integration.
- Providing a visual-component or styling reference for components that do not consume Payload data.
- Reproducing the complete official Payload documentation.
- Executing arbitrary React code or raw HTML from documentation.
- Adding authentication or full-text search during this phase.

## Audience and Writing Standard

The primary reader understands TypeScript and React fundamentals but may be new to Payload CMS. Next.js integration behavior is defined where necessary, without turning the guide into a Next.js tutorial.

Each conceptual document must:

1. Define the Payload concept precisely.
2. Identify the exact configuration or code path that uses it.
3. Link to relevant repository paths.
4. Trace execution in ordered steps.
5. Include short, exact code excerpts when useful.
6. State input, output, generated type, relationship, and access boundaries.
7. Include a "How it connects" section naming upstream and downstream dependencies.
8. Explain security, validation, relationship depth, transaction, or rendering implications where relevant.
9. End with a practical Payload extension recipe or debugging checklist.

Beginner-friendly means defining terms and exposing hidden framework behavior. It does not mean removing technical detail.

## Payload-first Information Architecture

Documentation source files live under `docs/content/`. A typed navigation manifest defines labels, grouping, order, and previous/next relationships. Markdown filenames and directories define public slugs.

### 1. Payload Foundations

- What Payload provides in this application
- Config-first architecture and boot sequence
- Repository map of Payload-owned and Payload-facing code
- Local API, REST API, GraphQL API, and Admin UI responsibilities
- PostgreSQL, environment variables, startup, and generated artifacts

### 2. Configuration and Schema

- `buildConfig` and every top-level option used in `payload.config.ts`
- PostgreSQL adapter, Lexical editor, Sharp, email adapter, and import map
- Collection and Global configuration anatomy
- Every field type used by this project
- Relationships, uploads, rich text, groups, arrays, and blocks
- Access control, hooks, validation, defaults, indexes, and uniqueness
- Generated `src/payload-types.ts` and schema-change workflow

### 3. Collections and Globals

- Pages and its layout blocks
- Users authentication
- Media uploads
- Properties
- Bookings and submission lifecycle
- Blog Categories
- Blogs
- Site Settings global
- All cross-collection relationships and populated shapes

Each schema page documents its slug, admin behavior, access configuration, fields, validation, hooks, relationships, generated TypeScript shape, API behavior, and current consumers.

### 4. Payload Operations

- Initializing Payload with `getPayload({ config })`
- Local API `find`, `findByID`, and `create` operations used by the project
- `Where` construction and operators
- Relationship `depth`, field `select`, sorting, pagination, and result metadata
- Trusted server operations versus `overrideAccess: false`
- Validation errors, empty results, and operational failures
- REST and GraphQL equivalents for Local API concepts
- Request context and transaction considerations

### 5. Blocks and Page Builder

- Block config objects and generated union types
- The Pages `layout` field
- `RenderBlocks` dispatch behavior
- Config/render component pairing for every block
- Relationship population needed by blocks
- Complete lifecycle for adding a new block

### 6. Payload Integration Walkthroughs

- Home and About page block queries
- Property listing query, filters, and pagination
- Property lookup and view-model transformation
- Blog, category, article, and recent-post queries
- Booking form and Payload create lifecycle
- Site Settings through the global loader, provider, header, and footer
- Payload Admin route and import map
- REST, GraphQL, and GraphQL Playground mounting
- `/my-route` as a Local API integration example

Every walkthrough begins with the Payload schema or operation. It then maps the integration entry point, query inputs, access behavior, returned generated type, transformation boundary, consumer, empty state, and failure behavior. Layout and styling details not related to Payload data are excluded.

### 7. Payload-facing Code Reference

- Block configuration/render pairs
- Collection and Global field-by-field reference
- Query and transformation helpers
- Property, blog, booking, and global-setting consumers
- Server Action and route-handler mutation boundaries
- Adapters and generated artifacts

### 8. Payload Developer Recipes

- Add a collection or Global and regenerate types
- Add a field and safely consume it
- Add a relationship and choose query depth
- Add a page-builder block
- Add access control, validation, or a hook
- Query Payload from trusted server code
- Query on behalf of a user without bypassing access control
- Add a Payload-backed Server Action mutation
- Add a custom route handler using the Local API
- Expose and test data through REST or GraphQL
- Diagnose schema, query, access, relationship, and generated-type failures
- Add or update a documentation page

### 9. Reference

- Payload schema map
- Collection relationship map
- Payload endpoint map
- Local API operation reference
- Payload-to-consumer data-flow map
- Commands, testing guide, and glossary

## Documentation Routing

The public docs UI uses one optional catch-all route:

```text
src/app/(frontend)/docs/[[...slug]]/page.tsx
```

It serves `/docs` and nested URLs such as `/docs/payload/local-api`. The Server Component validates the requested slug against the navigation manifest, reads the corresponding Markdown file, and renders it. Unknown or malformed slugs call `notFound()`.

Metadata comes from Markdown frontmatter. The route does not query Payload or require database access. These routing mechanics are implementation infrastructure, not a major documentation topic.

## Markdown Contract

Each Markdown file starts with validated frontmatter:

```yaml
---
title: Local API queries
description: How server code queries Payload without an HTTP round trip.
---
```

Content supports headings, paragraphs, links, lists, blockquotes, fenced code, inline code, tables, task lists, and horizontal rules. `react-markdown`, `remark-gfm`, and a small frontmatter parser render the content. Raw HTML remains disabled.

Mermaid fences may express Payload data flows. They must degrade to readable code blocks unless a small, tested client renderer is deliberately included. Diagram rendering must not block the core docs.

## Secure Content Loading

A server-only module owns filesystem access and returns this boundary:

```ts
type DocsFrontmatter = {
  title: string
  description: string
}

type DocsPage = {
  frontmatter: DocsFrontmatter
  slug: string[]
  content: string
}
```

Only slugs present in the manifest can reach the loader. Unchecked URL segments must never be concatenated into filesystem paths. Missing files, duplicate slugs, invalid frontmatter, and broken internal links are developer errors caught by tests. Public failures return a 404 without filesystem details.

## Documentation UI

Focused components provide grouped desktop navigation, accessible mobile navigation, breadcrumbs, Markdown rendering, a second- and third-level table of contents, previous/next navigation, and controlled Markdown elements.

The UI follows the existing visual language but prioritizes technical readability: constrained line length, high contrast, persistent navigation, scrollable code and tables, visible focus states, semantic landmarks, linkable headings, and `aria-current` state.

## Payload Flows to Teach

### Initialization

```text
payload.config.ts
  -> buildConfig
  -> PostgreSQL / Lexical / Sharp / email configuration
  -> getPayload({ config })
  -> initialized Local API
```

### Schema-to-type lifecycle

```text
Collection / Global / block config
  -> Payload schema
  -> pnpm generate:types
  -> src/payload-types.ts
  -> typed Local API result
  -> transformation or consumer
```

Generated types are output, not hand-edited source. The docs explain when regeneration is required and how stale types appear.

### CMS-managed page

```text
Pages collection layout field
  -> Local API page query
  -> generated Page type
  -> RenderBlocks
  -> matching block component
  -> rendered page
```

### Relationships

The docs map relationships among Pages, Media, Properties, Bookings, Blog Categories, Blogs, Users, and Site Settings. They explain ID-only versus populated values, `depth`, nullability, and narrowing before rendering.

### Property listing

```text
Validated filter input
  -> Payload Where[]
  -> properties Local API query
  -> paginated result metadata
  -> typed card consumer
```

### Property detail

```text
Property ID
  -> getPropertyByID
  -> populated Property document
  -> toPropertyView
  -> property-detail consumers
```

### Blog

The guide distinguishes category lookup, filtered blog query, `toBlogCard`, article lookup, recent-post query, relationship population, and metadata consumption.

### Booking mutation

The guide traces property selection, Client Component input, Server Action boundary, validation, submission-token behavior, `payload.create`, collection hooks, email behavior, and visible success or error state.

### Site Settings Global

The guide traces Global configuration through `getSiteSettings`, the provider boundary, and Header/Footer consumers.

### Payload application routes

The guide explains how `@payloadcms/next` supplies Admin and API handlers, what the Payload layout initializes, how the import map connects Admin modules, and how generated REST/GraphQL routes differ from a custom Local API route. Next.js route mechanics are explained only enough to understand Payload mounting.

## Accuracy and Security Rules

- Describe the checked-in Payload implementation, including limitations and fallbacks.
- Follow Payload 3.88 project guidance and checked-in configuration.
- Consult Next.js 16.3 documentation only for Payload integration boundaries.
- Label examples that intentionally differ from production code.
- Distinguish trusted Local API calls from calls performed on behalf of a user.
- Explain that Local API access is overridden by default and when `overrideAccess: false` is required.
- Never expose secrets, credentials, or local environment-file contents.
- Keep code excerpts short and identify their source path.
- Treat `src/payload-types.ts` as generated output.

## Dependencies

Add only `react-markdown`, `remark-gfm`, and a small frontmatter parser such as `gray-matter`. No Payload schema, migration, database table, search service, MDX runtime, or client-side content fetch is introduced.

## Error Handling

- Unknown docs slug: Next.js not-found response.
- Missing file or invalid manifest: clear development/build failure plus integrity-test failure.
- Invalid frontmatter: identify the file and invalid field without exposing content publicly.
- Unsupported Markdown: render safely as text where possible.
- Broken internal docs link: integrity-test failure.
- Payload examples: document actual empty-result, validation, access, and operational failure behavior.

## Testing and Verification

### Documentation integrity

- Every manifest entry resolves to one Markdown file.
- Every file has valid title and description frontmatter.
- No duplicate slugs exist.
- Unknown and path-traversal-like slugs cannot reach the filesystem.
- Internal docs links resolve.
- Heading IDs are stable and unique.
- Previous/next ordering matches the manifest.
- Representative Markdown renders correctly.

### Technical content coverage

- Every registered collection and Global has a schema page.
- Every registered block has a config-to-render walkthrough.
- Every checked-in Local API call appears in an operation or integration page.
- Every Payload-mounted Admin/API route is described.
- Every relationship and Payload-facing transformation is mapped.
- Each recipe uses this project's exact naming and commands.

### End-to-end and build

- `/docs` loads publicly without authentication.
- Nested docs render title, navigation, table of contents, and pager.
- Unknown docs return 404.
- Mobile navigation works by keyboard and pointer.
- Existing frontend and Payload Admin smoke tests remain green.
- Lint, integration tests, relevant end-to-end tests, and production build pass.
- Rendered docs receive desktop and mobile visual inspection.
- The docs content path does not call Payload or require `DATABASE_URL`.

## File Responsibilities

```text
docs/content/                         Payload-focused Markdown source
src/app/(frontend)/docs/              Public documentation route
src/components/docs/                  Documentation presentation components
src/lib/docs/                         Manifest, types, secure loader, heading utilities
tests/int/docs.int.spec.tsx           Integrity and renderer integration tests
tests/e2e/docs.e2e.spec.ts            Public-route and navigation tests
```

No Payload collection, Global, field, hook, or migration is added for documentation.

## Completion Criteria

The feature is complete when:

1. `/docs` and all manifest-backed pages are publicly readable from Markdown.
2. Documentation content never queries Payload or PostgreSQL.
3. Every current Payload schema, block, operation, route, relationship, mutation, and Payload-facing helper is covered.
4. A developer can trace each Payload-backed feature from schema through query or mutation to its consumer.
5. A developer can explain Admin, REST, GraphQL, Local API, generated types, blocks, globals, uploads, adapters, and PostgreSQL in this repository.
6. Next.js content is limited to Payload mounting and consumption boundaries.
7. Tested recipes cover adding a block, collection, Global, field, relationship, access rule, hook, mutation, and Payload-backed endpoint.
8. Navigation is responsive and accessible, and all integrity, rendering, end-to-end, lint, and build checks pass.

