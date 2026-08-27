# About Page Design

## Goal

Create a responsive `/about` page matching the supplied Homespire design while keeping all visible content editable through Payload Admin. The page uses fixed, reusable section structures so editors can change content without breaking the layout.

## Page Architecture

The existing `pages` collection remains the page-composition source. An About page is represented by a Pages record with `slug: "about"`; its `layout` contains the About blocks. The public `/about` route fetches that record through Payload's Local API and renders it with the existing `RenderBlocks` dispatcher.

If the About record does not exist, the route renders a clear setup state with the shared header instead of throwing an application error. Once the record exists, its configured blocks render in admin-defined order.

## Reusable Blocks

### About Intro

The `about-intro` block contains:

- eyebrow;
- heading;
- one or more body paragraphs;
- primary image relationship to Media;
- image alt text supplied by Media;
- CTA label and href.

Its frontend uses a responsive two-column layout with text and CTA on the left and the property/lifestyle image on the right. On mobile, content stacks with text first.

### Statistics Bar

The `stats-bar` block contains an array of two to four statistics. Each statistic has a short value, label, and an icon selected from a constrained set. The frontend renders a navy band with gold line icons and responsive separators.

Values remain text rather than numeric fields so editors can use formats such as `15+`, `500+`, and `1,200+`.

### Core Values

The `core-values` block contains an optional eyebrow, required heading, and two to six value items. Each item has an icon selected from a constrained set, title, and description. The frontend renders a centered heading followed by a responsive value-card grid.

## Payload Integration

All three block configurations live beside their TSX renderers under `src/blocks`. They are registered in `Pages.ts` and mapped in `RenderBlocks.tsx`. Regenerating Payload types adds the corresponding block interfaces to `payload-types.ts`.

No new collection or database table is required beyond Payload's normal block tables created for the Pages layout. Editors create or update the `about` Pages record in Payload Admin.

## Navigation

The shared header continues to link About to `/about`. The header accepts an optional active path or active label so `/about` can visually mark About as the current navigation item without duplicating the navigation component.

## Styling and Accessibility

The design follows the supplied screenshot: warm white background, navy typography, gold accents, serif display headings, a large architectural image, dark statistics strip, and spacious value grid. Tailwind utilities provide responsive behavior.

Heading order remains logical, images use Media alt text, icons are decorative, CTAs have visible focus styles, and text contrast meets normal content requirements.

## Error and Empty States

- Missing page record: show a setup message and link back home.
- Missing optional block content: omit only that optional element.
- Unpopulated image relationship: show a neutral image placeholder without throwing.
- Unknown layout block: preserve the existing `RenderBlocks` behavior and skip it safely.

## Verification

No new test files, commits, or pushes will be created. Verification includes Payload type generation, Prettier formatting, TypeScript checking, `git diff --check`, existing relevant integration tests, and a production build whose route manifest includes `/about`.
