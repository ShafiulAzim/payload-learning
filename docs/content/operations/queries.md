---
title: Payload queries
description: Filtering, sorting, selecting, populating, and paginating Local API results.
---

## Find result shape

`payload.find()` returns `docs` plus pagination metadata such as `totalDocs`, `totalPages`, `page`, and navigation state. Set `pagination: false` when the caller needs a plain unpaginated result and supplies an appropriate limit.

## Where operators used here

```ts
const where = {
  and: [
    { location: { like: location } },
    { type: { equals: type } },
    { price: { less_than_equal: maximumPrice } },
  ],
}
```

The blog uses `equals`, `not_equals`, and `less_than_equal`. Slug helpers query exact slug values. Conditions must use Payload field names and values accepted by the schema.

## Depth and selection

`depth: 0` keeps relationships as IDs. Higher depth populates related documents. `select:` reduces document fields; the booking page selects property ID, name, location, and cover rather than requesting every rich field.

## Sorting and pagination

Prefix a field with `-` for descending order, such as `sort: '-publishedAt'`. Set `page` and `limit` for listings. This project validates URL values before passing them to Payload and redirects requests beyond the final page.

## Failure and empty results

An empty `find` result is successful and contains an empty `docs` array. `findByID` missing-record behavior is normalized to `null` by `getPropertyByID`. Do not confuse “no documents” with database initialization failure.

## How it connects

[Properties integration](/docs/integrations/properties) and [Blog integration](/docs/integrations/blog) show real query construction.
