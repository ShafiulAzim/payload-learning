---
title: Properties integration
description: Trace list filters, pagination, detail lookup, relationships, and view-model conversion.
---

## Listing query

`src/app/(frontend)/properties/page.tsx` validates `page`, `perPage`, location, type, and price before building Payload `Where[]` conditions.

```ts
await payload.find({
  collection: 'properties',
  depth: 1,
  page,
  limit: perPage,
  sort: '-createdAt',
  where: conditions.length ? { and: conditions } : undefined,
})
```

Public collection reads allow REST access, while this call is trusted server code. The result metadata drives counts and pagination. Requests beyond `totalPages` redirect to the final valid page.

## Detail lookup

`src/lib/properties/getPropertyByID.ts` converts the route value to a positive safe integer, then calls `payload.findByID({ collection: 'properties', id: propertyID, depth: 2 })`. Invalid and missing values return `null`.

## View-model boundary

`toPropertyView` converts the generated Property—including Media relationship unions and nested arrays—into the stable `PropertyView` expected by detail components. This isolates UI code from raw Payload population shapes.

## Booking selection

The booking page performs a selected-field query with `select:` for id, name, location, and cover. It maps records to small options and uses populated cover media only for the visual.

## How it connects

Properties is also related from Bookings and Featured Properties. Relationship depth determines whether those consumers receive IDs or full documents.
