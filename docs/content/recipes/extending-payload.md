---
title: Extending Payload
description: Tested workflows for adding schemas, fields, blocks, access, hooks, and API consumers.
---

## Add a collection or Global

1. Create a typed `CollectionConfig` or `GlobalConfig` with a stable slug.
2. Define access before exposing sensitive fields.
3. Register it in `src/payload.config.ts` under `collections` or `globals`.
4. Run `pnpm generate:types`.
5. Verify Admin, Local API, and any intended REST/GraphQL behavior.

## Add a field or relationship

Add the field to source config, select `relationTo` for relationships, decide required/default/index constraints, regenerate types, then update every typed consumer. Choose query `depth` deliberately and narrow ID/object unions.

## Add a block

Create a `Block` config with `slug` and `interfaceName`; add it to Pages `layout.blocks`; create its render component; register its `blockType` in `RenderBlocks`; run `pnpm generate:types`; add Admin content; test config and rendering.

## Add access or a hook

Access functions return booleans or read constraints. Hooks receive `req`; use `req.payload`, return changed data, and pass `req` to nested writes that must share a transaction. Test authenticated, anonymous, Local API override, and failure cases.

## Query safely

Trusted system code may use the Local API default. User-scoped code must pass both `user` and `overrideAccess: false`. Use `select`, shallow `depth`, bounded limits, and validated `where:` inputs.

## Add a mutation

Keep privileged `payload.create()` calls on the server. Validate untrusted input, verify related records, choose access mode deliberately, handle Payload validation/unique failures, and return safe errors.

## REST, GraphQL, and custom routes

Registered schemas automatically reach standard REST/GraphQL endpoints. For custom contracts, add a route handler, call `getPayload({ config })`, define authentication/access behavior, validate the request, and test status/body without leaking internal errors.
