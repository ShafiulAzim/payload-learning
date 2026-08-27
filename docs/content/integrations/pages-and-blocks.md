---
title: Pages and blocks integration
description: Trace a Pages document from Local API lookup to block rendering.
---

## Source graph

```text
src/collections/Pages.ts
 -> src/app/(frontend)/page.tsx or about/page.tsx
 -> src/blocks/RenderBlocks.tsx
 -> src/blocks/<block>/<Component>.tsx
```

## Query

The home page initializes `getPayload({ config })` and calls `payload.find({ collection: 'pages', pagination: false, limit: 1, where: { slug: { equals: slug } } })`. The About page uses the same collection with `depth: 2`.

These are trusted Local API queries. Pages currently defines no explicit read access rule or draft filter.

## Data boundary

The result `docs[0]` is a generated Page. Missing home content calls `notFound()`. Missing About content renders an instructional fallback. A present record passes `page.layout` to `RenderBlocks`.

## Dispatch

`RenderBlocks` reads each block's `blockType`, chooses the matching registered component, spreads the stored block fields as props, and skips unknown block types.

## How it connects

The Admin block editor is defined by Payload configs; the frontend registry is a separate map. Adding a block requires updating both maps and regenerating types.
