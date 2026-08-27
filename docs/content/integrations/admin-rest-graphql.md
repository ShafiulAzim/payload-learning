---
title: Admin, REST, and GraphQL integration
description: How generated Payload handlers mount the CMS interfaces.
---

## Payload layout

`src/app/(payload)/layout.tsx` imports `RootLayout`, the generated `importMap`, Payload CSS, and `handleServerFunctions`. The server function forwards Admin requests with the same config/import map used to render the Admin application.

## Admin route

The optional catch-all Admin page under `admin/[[...segments]]` delegates screens to `@payloadcms/next`. `admin.user` selects the Users auth collection. These generated files can be overwritten and should not contain custom business logic.

## REST handlers

`src/app/(payload)/api/[...slug]/route.ts` binds `REST_GET`, POST, PATCH, PUT, DELETE, and OPTIONS to `@payload-config`. Payload converts the path, request, authentication state, and body into collection or Global operations.

## GraphQL handlers

`GRAPHQL_POST` mounts `/api/graphql`; `GRAPHQL_PLAYGROUND_GET` mounts the playground route. Both derive schema and resolvers from the same registered config.

## Custom Local API route

`src/app/my-route/route.ts` calls `getPayload({ config })` and returns custom JSON. It demonstrates that a custom HTTP contract can use the Local API, although its current response is only an example message.

## How it connects

Generated REST and GraphQL routes expose Payload's standard contracts. A custom route owns its HTTP shape and must choose access behavior explicitly for every Local API operation.
