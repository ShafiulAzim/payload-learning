---
title: Relationships and depth
description: How relationship and upload fields move between IDs and populated documents.
---

## Relationship declarations

A relationship names its target with `relationTo`. For example, Bookings declares `property` with `relationTo: 'properties'`; Blogs relate to `blog-categories`; upload fields relate to the `media` collection.

Uploads are specialized relationships. A `cover` value can therefore be a numeric ID or a populated `Media` object, depending on query depth.

## The depth option

`depth: 0` returns relationship IDs. Higher depth values ask Payload to populate related documents recursively. This repository uses depth 1 for cards and settings, and depth 2 for detail pages.

```ts
await payload.findByID({ collection: 'properties', id, depth: 2 })
```

Generated types reflect both states, so consumers narrow values:

```ts
const media = typeof property.cover === 'object' ? property.cover : null
```

## hasMany relationships

The Featured Properties block uses a `hasMany` relationship. Its value is an array containing IDs, populated Properties, or both if data is partially populated. `filterOptions` limits Admin choices to records where `featured` equals true; it does not replace runtime authorization.

## Query cost

More depth returns richer objects but performs more relationship work and transfers larger values. Choose the shallowest depth the consumer can safely use and use `select` when only a few fields are required.

## How it connects

[Generated types](/docs/schema/generated-types) explains the unions. [Properties integration](/docs/integrations/properties) shows a depth-2 transformation boundary.
