# Payload Technical Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/docs` site that renders Payload-focused Markdown and teaches this repository's Payload configuration, schemas, operations, integrations, and extension workflows.

**Architecture:** A typed, allow-listed manifest maps URL slugs to Markdown files in `docs/content`. A server-only loader validates frontmatter and reads those files, while a single optional catch-all Server Component renders them through controlled Markdown components and responsive documentation navigation. Documentation content never queries Payload or PostgreSQL; it describes Payload by tracing the checked-in schemas and Local API consumers.

**Tech Stack:** Payload CMS 3.88.0, Next.js 16.3.0 App Router, React 19.2.6, TypeScript 5.7, Tailwind CSS 4, `react-markdown`, `remark-gfm`, `gray-matter`, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-27-technical-payload-nextjs-docs-design.md`

## Global Constraints

- Payload is the documentation subject; Next.js is covered only at Payload mounting and consumption boundaries.
- Documentation content is committed Markdown under `docs/content` and never stored in or loaded from Payload/PostgreSQL.
- `/docs` is public and does not require authentication.
- Raw HTML in Markdown is disabled.
- URL slugs are allow-listed by the typed manifest before any filesystem path is resolved.
- Code examples use Payload 3.88.0 and this repository's exact names and paths.
- Do not edit generated Payload route files or `src/payload-types.ts`.
- Do not create Git commits; the user explicitly requested an uncommitted implementation.

## File Map

### Create

- `src/lib/docs/types.ts` — documentation, navigation, heading, and pager types.
- `src/lib/docs/manifest.ts` — single ordered source of truth for public docs slugs and labels.
- `src/lib/docs/headings.ts` — deterministic heading extraction and slug generation.
- `src/lib/docs/loadDocsPage.ts` — server-only, allow-listed Markdown/frontmatter loader.
- `src/components/docs/DocsShell.tsx` — desktop/mobile documentation layout.
- `src/components/docs/DocsSidebar.tsx` — grouped navigation and current-page state.
- `src/components/docs/DocsArticle.tsx` — article header, Markdown rendering, TOC, and pager composition.
- `src/components/docs/MarkdownComponents.tsx` — controlled semantic Markdown renderers.
- `src/app/(frontend)/docs/[[...slug]]/page.tsx` — public catch-all route and metadata.
- `docs/content/index.md` — Payload learning path and documentation conventions.
- `docs/content/foundations/architecture.md`
- `docs/content/foundations/config-and-startup.md`
- `docs/content/foundations/apis-and-admin.md`
- `docs/content/schema/configuration.md`
- `docs/content/schema/fields-and-validation.md`
- `docs/content/schema/relationships-and-depth.md`
- `docs/content/schema/generated-types.md`
- `docs/content/collections/pages.md`
- `docs/content/collections/users.md`
- `docs/content/collections/media.md`
- `docs/content/collections/properties.md`
- `docs/content/collections/bookings.md`
- `docs/content/collections/blog-categories.md`
- `docs/content/collections/blogs.md`
- `docs/content/globals/site-settings.md`
- `docs/content/blocks/page-builder.md`
- `docs/content/blocks/block-reference.md`
- `docs/content/operations/local-api.md`
- `docs/content/operations/access-control.md`
- `docs/content/operations/queries.md`
- `docs/content/operations/mutations-and-hooks.md`
- `docs/content/integrations/pages-and-blocks.md`
- `docs/content/integrations/properties.md`
- `docs/content/integrations/blog.md`
- `docs/content/integrations/bookings.md`
- `docs/content/integrations/site-settings.md`
- `docs/content/integrations/admin-rest-graphql.md`
- `docs/content/recipes/extending-payload.md`
- `docs/content/recipes/debugging.md`
- `docs/content/reference/schema-map.md`
- `docs/content/reference/commands-and-glossary.md`
- `tests/int/docs-loader.int.spec.ts` — loader, manifest, frontmatter, heading, and link integrity.
- `tests/int/docs-renderer.int.spec.tsx` — representative Markdown rendering.
- `tests/e2e/docs.e2e.spec.ts` — public route, navigation, 404, and responsive behavior.

### Modify

- `package.json` and `pnpm-lock.yaml` — Markdown dependencies.
- `src/app/global.css` — documentation typography, code, table, anchor, and responsive navigation styles.
- `tests/e2e/frontend.e2e.spec.ts` only if its route expectations need `/docs` coverage shared with the new spec; otherwise leave it unchanged.

## Interfaces Shared Across Tasks

```ts
export type DocsItem = {
  title: string
  description: string
  slug: readonly string[]
  file: string
}

export type DocsGroup = {
  title: string
  items: readonly DocsItem[]
}

export type DocsHeading = {
  depth: 2 | 3
  id: string
  text: string
}

export type DocsPage = {
  frontmatter: { title: string; description: string }
  slug: string[]
  content: string
  headings: DocsHeading[]
  item: DocsItem
  previous: DocsItem | null
  next: DocsItem | null
}

export function getDocsItem(slug: readonly string[]): DocsItem | null
export function getAllDocsItems(): DocsItem[]
export async function loadDocsPage(slug: readonly string[]): Promise<DocsPage | null>
export function extractHeadings(markdown: string): DocsHeading[]
```

---

### Task 1: Install the Markdown runtime and build the secure content model

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/docs/types.ts`
- Create: `src/lib/docs/manifest.ts`
- Create: `src/lib/docs/headings.ts`
- Create: `src/lib/docs/loadDocsPage.ts`
- Create: `tests/int/docs-loader.int.spec.ts`
- Create: `docs/content/index.md`

**Interfaces:**
- Produces all interfaces listed in “Interfaces Shared Across Tasks.”
- The manifest uses repository-relative content paths such as `index.md` and `collections/pages.md`.
- `loadDocsPage([])` resolves `docs/content/index.md`.

- [ ] **Step 1: Add runtime dependencies**

Run:

```bash
pnpm add react-markdown remark-gfm gray-matter
```

Expected: `package.json` and `pnpm-lock.yaml` include compatible current versions and installation exits successfully.

- [ ] **Step 2: Write failing loader and manifest tests**

Create `tests/int/docs-loader.int.spec.ts` with tests that establish the public contract:

```ts
import { describe, expect, it } from 'vitest'

import { getAllDocsItems, getDocsItem } from '@/lib/docs/manifest'
import { extractHeadings } from '@/lib/docs/headings'
import { loadDocsPage } from '@/lib/docs/loadDocsPage'

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
})
```

- [ ] **Step 3: Run the focused tests and verify failure**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/docs-loader.int.spec.ts
```

Expected: FAIL because `@/lib/docs/*` does not exist.

- [ ] **Step 4: Implement types and deterministic heading extraction**

Create `types.ts` from the shared interface block. Implement `extractHeadings` so it:

- recognizes only Markdown `##` and `###` ATX headings outside fenced code blocks;
- removes Markdown emphasis, links, and inline-code markers from display text;
- lowercases and hyphenates IDs;
- removes punctuation;
- assigns `-2`, `-3`, and later suffixes for duplicate IDs.

- [ ] **Step 5: Create the complete typed manifest**

Create `docsGroups satisfies readonly DocsGroup[]` in `manifest.ts`. Include every content file listed in the File Map in the exact curriculum order. Implement `getAllDocsItems()` by flattening groups and `getDocsItem()` by comparing `slug.join('/')`.

The introduction item must be:

```ts
{
  title: 'Payload CMS in this project',
  description: 'A technical learning path through this repository’s Payload architecture.',
  slug: [],
  file: 'index.md',
}
```

- [ ] **Step 6: Implement the server-only loader**

Start `loadDocsPage.ts` with `import 'server-only'`. Resolve the content root from `process.cwd()` and the manifest-selected `item.file`; never resolve a filename from raw slug text. Parse with `gray-matter`, require non-empty string `title` and `description`, extract headings, and derive previous/next from the flattened manifest.

Throw a descriptive error containing the manifest filename for missing files or invalid frontmatter. Return `null` only when the slug is not allow-listed.

- [ ] **Step 7: Add the introduction Markdown**

Create `docs/content/index.md` with valid frontmatter and these required sections:

- What Payload owns in this application
- Payload versus the surrounding application
- The four Payload interfaces: Admin, Local API, REST, GraphQL
- Learning path
- How to read code references
- How it connects

Include the real versions, `src/payload.config.ts` as the entry point, and a warning that `src/payload-types.ts` and generated `(payload)` route files are not manually edited.

- [ ] **Step 8: Run focused tests**

Run the Step 3 command.

Expected: PASS.

---

### Task 2: Render public documentation with accessible navigation

**Files:**
- Create: `src/components/docs/DocsSidebar.tsx`
- Create: `src/components/docs/DocsShell.tsx`
- Create: `src/components/docs/MarkdownComponents.tsx`
- Create: `src/components/docs/DocsArticle.tsx`
- Create: `src/app/(frontend)/docs/[[...slug]]/page.tsx`
- Create: `tests/int/docs-renderer.int.spec.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Consumes `DocsPage`, `DocsItem`, `docsGroups`, and `loadDocsPage` from Task 1.
- Produces a public optional catch-all route with `params: Promise<{ slug?: string[] }>`.

- [ ] **Step 1: Write failing renderer tests**

Test controlled rendering rather than snapshotting the full page:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DocsArticle } from '@/components/docs/DocsArticle'

describe('DocsArticle', () => {
  it('renders Payload prose, code, tables, heading anchors, TOC, and pager', () => {
    render(<DocsArticle page={fixturePage} />)
    expect(screen.getByRole('heading', { name: 'Local API' })).toHaveAttribute('id', 'local-api')
    expect(screen.getByRole('link', { name: 'Local API' })).toHaveAttribute('href', '#local-api')
    expect(screen.getByText("payload.find({ collection: 'properties' })")).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute('href', '/docs/operations/queries')
  })
})
```

Define `fixturePage` inline with a Markdown string containing one heading, fenced code, and a GFM table.

- [ ] **Step 2: Run renderer tests and verify failure**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/docs-renderer.int.spec.tsx
```

Expected: FAIL because the docs components do not exist.

- [ ] **Step 3: Implement controlled Markdown components**

Use `react-markdown` with `remarkGfm` and no raw-HTML plugin. Map `h2`/`h3` to deterministic IDs consistent with `extractHeadings`; map external links to safe `target="_blank" rel="noreferrer"`; retain normal same-tab behavior for repository and `/docs` links; wrap tables and preformatted code in horizontally scrollable containers.

- [ ] **Step 4: Implement article composition**

`DocsArticle` renders:

- breadcrumbs from the active manifest item;
- frontmatter title and description;
- Markdown inside `<article>`;
- a TOC from `page.headings`;
- previous and next links using the exact manifest URLs;
- a stable `<main id="docs-content">` target for a skip link.

- [ ] **Step 5: Implement desktop and mobile navigation**

`DocsSidebar` receives the current slug and maps `docsGroups`. Apply `aria-current="page"` to the current item. `DocsShell` contains a semantic skip link, desktop `aside`, mobile `<details>` navigation, and the article/TOC grid. Avoid client state unless native `<details>` proves insufficient in browser testing.

- [ ] **Step 6: Implement the route and metadata**

In `page.tsx`:

```tsx
type Props = { params: Promise<{ slug?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = await loadDocsPage(slug)
  if (!page) return {}
  return { title: `${page.frontmatter.title} | Payload Docs`, description: page.frontmatter.description }
}

export default async function DocsPage({ params }: Props) {
  const { slug = [] } = await params
  const page = await loadDocsPage(slug)
  if (!page) notFound()
  return <DocsShell page={page} />
}
```

Add `generateStaticParams()` only if the installed Next.js 16 docs confirm the optional catch-all root parameter representation used by this project and the build verifies it.

- [ ] **Step 7: Add docs styles**

Append scoped `.docs-*` and `.docs-prose` rules to `src/app/global.css`. Cover desktop three-column layout, sticky sidebar/TOC, mobile `<details>`, 65–75 character article measure, heading scroll margin, focus-visible outlines, code/table overflow, inline code, blockquotes, tables, and reduced-motion behavior. Do not change unrelated site styles.

- [ ] **Step 8: Run renderer and loader tests**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/docs-loader.int.spec.ts tests/int/docs-renderer.int.spec.tsx
```

Expected: PASS.

---

### Task 3: Document Payload foundations, configuration, fields, relationships, and generated types

**Files:**
- Create the foundation and schema Markdown files listed in the File Map.
- Modify: `tests/int/docs-loader.int.spec.ts`

**Interfaces:**
- Every file must match its Task 1 manifest entry and frontmatter title.
- Internal links use public `/docs/...` URLs; code references use repository-relative paths in backticks.

- [ ] **Step 1: Add a failing technical coverage test**

Extend the loader test to load these slugs and assert required repository-specific tokens:

```ts
const requiredCoverage = [
  [['foundations', 'architecture'], ['payload.config.ts', 'Local API', 'PostgreSQL']],
  [['foundations', 'config-and-startup'], ['buildConfig', 'postgresAdapter', 'getPayload']],
  [['foundations', 'apis-and-admin'], ['REST_GET', 'GRAPHQL_POST', 'RootLayout']],
  [['schema', 'configuration'], ['collections', 'globals', 'editor', 'sharp']],
  [['schema', 'fields-and-validation'], ['required', 'unique', 'index', 'beforeValidate']],
  [['schema', 'relationships-and-depth'], ['relationTo', 'depth', 'Media']],
  [['schema', 'generated-types'], ['generate:types', 'payload-types.ts', 'interfaceName']],
] as const
```

For each entry, assert the page loads and every required token exists in `page.content`.

- [ ] **Step 2: Run the coverage test and verify failure**

Run the Task 1 focused command.

Expected: FAIL with missing Markdown files.

- [ ] **Step 3: Write Payload foundations**

Create the three foundation documents. They must describe:

- the exact `buildConfig` boot chain;
- `postgresAdapter`, `lexicalEditor`, `sharp`, `nodemailerAdapter`, `secret`, and environment-variable roles;
- `getPayload({ config })` as an in-process API without an HTTP hop;
- generated Admin/REST/GraphQL route exports and why those generated files are not edited;
- the relationship among Admin UI, Local API, REST, GraphQL, config, and PostgreSQL.

- [ ] **Step 4: Write configuration, fields, and relationships**

Use real examples from `Properties`, `Blogs`, `Bookings`, `SiteSettings`, and block configs. Include tables for every field type currently used: `text`, `textarea`, `email`, `number`, `checkbox`, `select`, `date`, `richText`, `upload`, `relationship`, `array`, `group`, `tabs`, and `blocks`.

Explain `required`, `unique`, `index`, `min`, `maxLength`, `minRows`, `maxRows`, `defaultValue`, `filterOptions`, `admin`, hooks, and access without claiming behavior absent from the repository.

- [ ] **Step 5: Write generated-type lifecycle**

Explain config `interfaceName`, `pnpm generate:types`, import usage from `@/payload-types`, relationship union shapes, why generated files are not edited, and the symptoms/remedy for stale types. Include the exact schema-to-type flow from the spec.

- [ ] **Step 6: Run loader, integrity, and renderer tests**

Expected: PASS for all Task 1 and Task 2 tests.

---

### Task 4: Document every collection, Global, and block

**Files:**
- Create all files under `docs/content/collections/`, `docs/content/globals/`, and `docs/content/blocks/` listed in the File Map.
- Modify: `tests/int/docs-loader.int.spec.ts`

**Interfaces:**
- Each schema page follows: Purpose → Registration → Access → Fields → Hooks → Relationships → Generated shape → API behavior → Consumers → How it connects → Debugging.

- [ ] **Step 1: Add failing schema coverage assertions**

Add a data table pairing each manifest slug with its source token and Payload slug:

```ts
const schemas = [
  [['collections', 'pages'], 'src/collections/Pages.ts', "slug: 'pages'"],
  [['collections', 'users'], 'src/collections/Users.ts', "slug: 'users'"],
  [['collections', 'media'], 'src/collections/Media.ts', "slug: 'media'"],
  [['collections', 'properties'], 'src/collections/Properties.ts', "slug: 'properties'"],
  [['collections', 'bookings'], 'src/collections/Bookings.ts', "slug: 'bookings'"],
  [['collections', 'blog-categories'], 'src/collections/BlogCategories.ts', "slug: 'blog-categories'"],
  [['collections', 'blogs'], 'src/collections/Blogs.ts', "slug: 'blogs'"],
  [['globals', 'site-settings'], 'src/globals/SiteSettings.ts', "slug: 'site-settings'"],
] as const
```

Assert every loaded page contains both source path and slug token.

- [ ] **Step 2: Run tests and verify missing-content failure**

Run the loader test.

- [ ] **Step 3: Write collection and Global pages from checked-in config**

Document every field and real behavior, including:

- Pages block registration and `defaultPopulate`;
- Users `auth: true` and automatically supplied email/auth fields;
- Media public reads and upload behavior;
- Properties field groups, uploads, arrays, and public reads;
- Bookings admin-only collection access, generated reference/submission token hook, relationship, and status lifecycle;
- Blog Category authenticated writes, public reads, and `uniqueSlug` hook;
- Blogs public published/date constraint versus authenticated reads, slug hook, category/media relationships, rich text, and SEO group;
- Site Settings tabs, field factories, public read/authenticated update, media relationship, and fallback consumer behavior.

Call out the intentional server-side `overrideAccess: true` booking creation despite collection `create` access requiring a user.

- [ ] **Step 4: Write the page-builder architecture page**

Trace `Pages.layout` → generated block union → query → `RenderBlocks` lookup → spread props → concrete component. Explain unknown block behavior, stable keys, relationship population, and the current `React.ComponentType<any>` tradeoff accurately.

- [ ] **Step 5: Write the complete block reference**

Cover all six blocks: `hero-with-search`, `trust-features`, `featured-properties`, `about-intro`, `stats-bar`, and `core-values`. For each, list config source, render source, interface name, fields, defaults, validations, relationships, and consumer behavior.

- [ ] **Step 6: Run all documentation integration tests**

Expected: PASS.

---

### Task 5: Document Local API operations, access, real integrations, and extension recipes

**Files:**
- Create all files under `docs/content/operations/`, `docs/content/integrations/`, `docs/content/recipes/`, and `docs/content/reference/` listed in the File Map.
- Modify: `tests/int/docs-loader.int.spec.ts`

**Interfaces:**
- Operation pages teach Payload primitives.
- Integration pages prove those primitives through checked-in call sites.
- Recipes contain ordered edits, type generation, validation, and verification.

- [ ] **Step 1: Add failing operation/call-site coverage**

Assert the rendered corpus contains every checked-in Payload operation signature and critical option:

```ts
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
```

Load all operation and integration pages, join their content, and assert every token appears.

- [ ] **Step 2: Run tests and verify failure**

Run the loader test.

- [ ] **Step 3: Write operations and security pages**

Explain Local API initialization, `find`, `findByID`, `findGlobal`, `create`, `Where`, `and`, `equals`, `like`, `less_than_equal`, pagination metadata, sorting, `select`, and `depth` using this repository's calls.

The access page must state precisely:

- Local API overrides access by default;
- `overrideAccess: false` enforces configured access;
- the blogs queries intentionally request public-access enforcement;
- booking creation intentionally uses trusted-server override after explicit application validation;
- passing a user without `overrideAccess: false` does not enforce that user's access.

- [ ] **Step 4: Write mutation and hook coverage**

Trace booking input validation, honeypot, UUID token, idempotency lookup, property existence check, create operation, unique constraint race recovery, collection `beforeValidate`, and safe error output. Separately explain category/blog `beforeValidate` slug generation and `req.payload` use.

Do not claim an email-sending booking hook exists: the current repository configures a Nodemailer adapter but the shown booking collection does not send mail.

- [ ] **Step 5: Write each integration walkthrough**

For pages/blocks, properties, blog, bookings, Site Settings, and Admin/REST/GraphQL, include:

- source file graph;
- exact query/mutation parameters;
- access mode;
- returned Payload type and relationship depth;
- transformations;
- consumer boundary;
- empty/error behavior;
- “How it connects” summary.

Explain React Server/Client or Next.js route behavior only when it changes how a Payload call executes or where data crosses a serialization/mutation boundary.

- [ ] **Step 6: Write extension and debugging recipes**

Each extension recipe must include exact steps, files, a minimal typed code example, `pnpm generate:types` when schemas change, and verification. Cover collection, Global, field, relationship, block, access, hook, trusted query, user-scoped query, Server Action mutation, REST/GraphQL use, and custom Local API route.

The debugging guide must cover database connection, missing secret, stale generated types, relationship returned as ID, access unexpectedly bypassed/denied, invalid field data, missing block mapping, upload/media narrowing, unique conflicts, and generated Admin import-map issues.

- [ ] **Step 7: Write schema map and command/glossary reference**

Include a compact relationship table, endpoint table, Local API operation table, source-path map, environment-variable names without values, commands from `package.json`, and Payload terminology used throughout the guide.

- [ ] **Step 8: Add link-integrity validation and run tests**

Extend `docs-loader.int.spec.ts` to extract Markdown links beginning `/docs`, strip fragments, and assert their pathname exists in the manifest. For fragment links targeting the same loaded page, assert the fragment exists in `page.headings`.

Run both documentation integration specs.

Expected: PASS with every manifest page present and linked correctly.

---

### Task 6: Add browser coverage and verify the complete feature

**Files:**
- Create: `tests/e2e/docs.e2e.spec.ts`
- Modify implementation/content files only if verification reveals defects.

**Interfaces:**
- Consumes the complete public docs feature.
- Produces end-to-end evidence for public access, navigation, responsiveness, and 404 behavior.

- [ ] **Step 1: Write end-to-end tests**

Create tests that:

```ts
test('serves public Payload documentation', async ({ page }) => {
  await page.goto('/docs')
  await expect(page.getByRole('heading', { level: 1, name: 'Payload CMS in this project' })).toBeVisible()
  await page.getByRole('link', { name: 'Local API' }).first().click()
  await expect(page).toHaveURL('/docs/operations/local-api')
  await expect(page.getByText('overrideAccess')).toBeVisible()
})

test('returns 404 for an unknown docs slug', async ({ page }) => {
  const response = await page.goto('/docs/not-in-the-manifest')
  expect(response?.status()).toBe(404)
})

test('exposes navigation on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/docs/collections/properties')
  await page.getByText('Browse documentation').click()
  await expect(page.getByRole('link', { name: 'Bookings' })).toBeVisible()
})
```

Use actual accessible labels chosen in Task 2; do not select by CSS class.

- [ ] **Step 2: Start the application and run focused E2E tests**

Run the existing approved development command in one terminal and then:

```bash
pnpm exec playwright test tests/e2e/docs.e2e.spec.ts --config=playwright.config.ts
```

Expected: PASS. If database-backed global site chrome makes the route start noisy, verify the existing `getSiteSettings` fallback keeps `/docs` usable; do not add a documentation database dependency.

- [ ] **Step 3: Run lint and integration tests**

Run:

```bash
pnpm lint
pnpm run test:int
```

Expected: both exit 0.

- [ ] **Step 4: Run the complete relevant E2E suite**

Run:

```bash
pnpm run test:e2e
```

Expected: all existing and new tests pass.

- [ ] **Step 5: Run the production build**

Run:

```bash
pnpm build
```

Expected: build exits 0 and lists the public documentation route without attempting to source documentation from Payload.

- [ ] **Step 6: Perform visual and accessibility inspection**

Inspect `/docs`, `/docs/collections/properties`, `/docs/operations/access-control`, and `/docs/integrations/bookings` at 390×844 and a desktop viewport. Verify sidebar/mobile navigation, heading anchors, TOC, focus visibility, code/table overflow, long paths, previous/next links, and no horizontal page overflow.

- [ ] **Step 7: Verify scope and working tree**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intended documentation feature files plus the user's pre-existing changes appear. Do not commit.

