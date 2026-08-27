---
title: Blog Categories collection
description: Public categories with authenticated writes and unique automatic slugs.
---

## Purpose and registration

`src/collections/BlogCategories.ts` declares `slug: 'blog-categories'`. Names and slugs are required, unique, and indexed.

## Access

Reads are public. Create, update, and delete require `req.user`, allowing the public blog to list categories while restricting content management to authenticated users.

## Automatic slug hook

The `beforeValidate` hook calls `slugify` and `uniqueSlug`. It generates a slug for new documents and continues automatic generation while the previous slug matches the previous automatic value. A customized slug is preserved.

`req.payload` supplies the Local API used to check uniqueness. `currentID` prevents an update from conflicting with itself.

## Relationship consumers

Blogs has a required, indexed relationship to this collection. The blog listing first finds categories, resolves the requested category slug to an ID, then filters Blogs by that ID.

## How it connects

[Blog integration](/docs/integrations/blog) traces category resolution. [Mutations and hooks](/docs/operations/mutations-and-hooks) explains the hook lifecycle.
