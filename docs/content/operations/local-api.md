---
title: Local API
description: Initialize Payload and perform typed operations without an HTTP request.
---

## Initialize Payload

Server code imports the same config used by Admin and API routes:

```ts
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })
```

This returns Payload's in-process Local API. It avoids HTTP parsing and serialization while preserving Payload validation, hooks, adapters, and typed collection names.

## Read operations

```ts
const result = await payload.find({
  collection: 'properties',
  depth: 1,
  page: 1,
  limit: 9,
  sort: '-createdAt',
  where: { featured: { equals: true } },
})
```

`payload.findByID()` returns one document or throws when it cannot find a valid record. `payload.findGlobal()` loads a singleton Global by `slug: 'site-settings'`.

## Write operations

`payload.create()` validates fields, runs collection hooks, writes through the PostgreSQL adapter, and returns the created generated type.

## Security default

The Local API uses `overrideAccess: true` by default. That is appropriate only for trusted server operations. Use `overrideAccess: false` to enforce collection access, particularly for published Blogs or operations performed for a user.

## How it connects

[Queries](/docs/operations/queries) explains options. [Access control](/docs/operations/access-control) explains the security boundary.
