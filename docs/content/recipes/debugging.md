---
title: Debugging Payload
description: Diagnose configuration, database, access, relationship, type, block, and upload failures.
---

## Payload will not initialize

Check `DATABASE_URL`, whether PostgreSQL is reachable, and whether `PAYLOAD_SECRET` exists. SMTP transport verification may also log separately; distinguish email connectivity from database initialization.

## Types disagree with config

Run `pnpm generate:types` and restart the TypeScript server. Never patch `src/payload-types.ts`. Confirm the changed schema is actually registered in `payload.config.ts`.

## Relationship is an ID

Inspect query `depth:`. At depth 0 an upload/relationship is normally an ID. Increase depth only as needed, or perform a separate query. Always narrow the generated union.

## Access is ignored or denied

For Local API calls, inspect `overrideAccess`. The default bypasses access. Set `overrideAccess: false` for public/user-scoped rules. For HTTP calls, confirm authentication and the collection's access return value or `Where` constraint.

## Validation or unique failure

Compare data with required fields, select options, length/row limits, and relationship IDs. Unique values can race; use database uniqueness and recover explicitly where idempotency matters.

## Block does not render

Confirm config registration in Pages, stored `blockType`, generated types, the `RenderBlocks` component map, and relationship depth. Unknown mappings intentionally render nothing.

## Media has no URL

Confirm upload success, public read access, population depth, and `typeof value === 'object'` narrowing before reading Media fields.

## Admin module error

Regenerate the Payload import map with `pnpm generate:importmap`. Do not hand-edit generated Admin route files.
