---
title: Access control
description: Collection access rules and the Local API overrideAccess boundary.
---

## Collection access functions

Payload calls `access` functions with a request containing `req.user`. A boolean permits or denies the operation. Collection reads may instead return a `Where` constraint for row-level filtering.

This project uses three patterns:

- `read: () => true` for public Media, Properties, and Blog Categories;
- `Boolean(req.user)` for authenticated writes and all Booking collection operations;
- a published-and-due `Where` constraint for anonymous Blog reads.

## Local API overrides access by default

```ts
await payload.find({
  collection: 'blogs',
  overrideAccess: false,
  where: { slug: { equals: slug } },
})
```

Without `overrideAccess: false`, Local API calls run as trusted server operations even if a `user` is supplied. Passing a user alone does not enforce that user's permissions.

## Deliberate trusted override

The booking Server Action uses `overrideAccess: true` for lookup, property verification, and creation. This bypasses the Bookings authenticated-create rule intentionally, after application-level validation, because the browser must never receive direct privileged collection access.

## API differences

REST and GraphQL requests normally evaluate access from the authenticated request. Local API code must choose explicitly whether it is a system action or user-scoped action.

## Debugging checklist

Check the collection access function, whether `req.user` exists, whether the Local API call sets `overrideAccess`, and whether a returned `Where` constraint filters the expected rows.
