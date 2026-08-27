# Blog Design

## Goal

Create a production-ready Payload-managed blog with category filtering, paginated cards, automatic SEO-friendly slugs, and rich article detail pages matching the supplied Homespire design.

## Collections

### Blog Categories

The `blog-categories` collection stores a required name and unique indexed slug. A collection hook generates the slug from the name when it is missing and regenerates it when the name changes unless an editor has explicitly customized the slug. Public read access is allowed because category names appear on public pages; mutations remain authenticated through Payload Admin.

### Blogs

The `blogs` collection stores:

- title;
- unique indexed slug generated from title;
- category relationship to `blog-categories`;
- excerpt;
- featured image relationship to Media;
- Lexical rich-text content;
- publication status (`draft` or `published`);
- published date;
- featured flag;
- SEO title and description;
- automatic timestamps.

Public read access returns only records whose status is `published` and whose publication date is not in the future. Authenticated Payload Admin users may read drafts and scheduled posts. Create, update, and delete operations remain authenticated.

Slug generation normalizes Unicode text, lowercases it, converts word separators to hyphens, and removes unsupported characters. A `beforeValidate` hook supplies the slug. The database uniqueness constraint is the final collision guard; when a generated slug already exists, the hook appends a short stable suffix.

## Blog Listing

The server-rendered `/blog` route accepts:

- `page`, default `1`;
- `category`, using the category slug;
- `perPage`, constrained to supported values and defaulting to `9`.

It queries only published posts, sorted by descending publication date. The page renders the shared navy Homespire hero, category filter links, a responsive three-column grid of reusable Blog Cards, a per-page selector, result count, and numbered pagination. Pagination preserves the active category and page size.

Invalid page numbers redirect to the final valid page. An unknown category renders a clear empty result rather than exposing an error. Each card displays image, date, category, title, excerpt, and a Read More link.

## Blog Detail

The dynamic `/blog/[slug]` route queries one publicly visible post by slug. Missing, draft, or future-dated posts return Next.js `notFound()`.

The page renders breadcrumbs, featured image, publication date, category, title, and Lexical rich-text content. A sidebar lists all categories and the five most recent published posts excluding the current article. Metadata uses SEO fields with title/excerpt fallbacks.

Rich text is rendered with Payload's Lexical React converter rather than unsafe HTML injection.

## Components and Data Helpers

- `BlogCard`: reusable listing/recent-post presentation.
- `BlogPagination`: category-aware numbered navigation.
- `BlogsPerPage`: client dropdown preserving filters and resetting page to one.
- `BlogArticle`: focused article renderer.
- `getBlogBySlug`: Local API helper enforcing public visibility.
- shared slug utility/hooks for categories and blogs.

## Styling and Accessibility

The listing and detail pages follow the supplied designs: navy hero areas, warm-white content background, serif headings, gold accents, white cards, category tabs, and a compact sidebar. Cards remain fully keyboard accessible, images use Media alt text, pagination uses `aria-current`, and article headings retain a logical hierarchy.

## Global Layout Integration

Header and footer continue to come from the frontend layout's single `site-settings` Global fetch. The Blog navigation link becomes active automatically through the pathname-aware Header. Blog routes may be hidden from header or footer only through explicit Site Settings visibility rules.

## Verification

Do not add test files, commit, or push. Verification includes Payload type generation, formatting, TypeScript and diff checks, the existing integration suite, and a production build whose route manifest includes `/blog` and `/blog/[slug]`.
