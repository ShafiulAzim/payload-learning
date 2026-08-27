---
title: Blog integration
description: Trace public access enforcement, category filters, listings, and article queries.
---

## Category and listing flow

The listing first calls `payload.find({ collection: 'blog-categories', depth: 0, pagination: false, overrideAccess: false })`. It resolves a requested category slug to a category ID.

It then calls `payload.find({ collection: 'blogs', depth: 1, page, limit: perPage, overrideAccess: false, sort: '-publishedAt', where: ... })`. An unknown category produces an impossible ID condition instead of exposing unrelated posts.

`overrideAccess: false` is essential: anonymous Blog access adds status `published` and publication-date constraints.

## Card boundary

`toBlogCard` maps generated Blog records and populated Media/category relationships into a smaller card shape used by the listing and sidebar.

## Article query

`src/lib/blog/getBlogBySlug.ts` wraps a query in React `cache`, uses `pagination: false`, `limit: 1`, `depth: 2`, and `where: { slug: { equals: slug } }`. It returns the first document or null.

The article page separately queries all categories and five recent Blogs with `where: { id: { not_equals: blog.id } }`. Both public queries enforce access.

## How it connects

Blog Category and Media relationships are populated according to depth. Generated types require consumers to handle IDs and objects safely.
