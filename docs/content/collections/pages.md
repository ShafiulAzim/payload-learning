---
title: Pages collection
description: CMS-managed pages composed from registered layout blocks.
---

## Purpose and registration

`src/collections/Pages.ts` exports the collection with `slug: 'pages'`. `src/payload.config.ts` registers it, which creates database storage, Admin screens, generated types, and API endpoints.

## Fields

| Field | Type | Behavior |
| --- | --- | --- |
| `title` | text | Required editor-facing name |
| `slug` | text | Required lookup key used by page queries |
| `layout` | blocks | Required ordered list of six registered block types |
| `publishedAt` | date | Optional sidebar metadata |

`defaultPopulate` selects `title` and `slug` when another Payload operation populates a Pages relationship.

## Layout blocks

The layout permits Hero With Search, Trust Features, Featured Properties, About Intro, Stats Bar, and Core Values. Payload stores a `blockType` discriminator with each entry, and generated types form a union around those discriminators.

## Access and publication

This collection has no explicit `access` configuration and no Payload drafts configuration. The frontend query is trusted Local API code and retrieves by slug. `publishedAt` is not currently an enforced publication rule.

## Consumers

`src/app/(frontend)/page.tsx` queries slug `home`; `src/app/(frontend)/about/page.tsx` queries slug `about`. Both pass `page.layout` to `RenderBlocks`.

## How it connects

Read [Page builder](/docs/blocks/page-builder) for dispatch behavior and [Pages and blocks integration](/docs/integrations/pages-and-blocks) for the full query flow.
