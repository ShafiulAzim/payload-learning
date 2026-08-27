---
title: APIs and Admin
description: The Admin UI, Local API, REST API, and GraphQL API in this repository.
---

## Admin UI

`src/app/(payload)/layout.tsx` uses Payload's `RootLayout`, generated `importMap`, and `handleServerFunctions`. `admin.user: Users.slug` makes the `users` auth collection the Admin identity source.

The files under `src/app/(payload)` are generated integration boundaries. Their comments say not to edit them because Payload can rewrite them.

## REST API

`src/app/(payload)/api/[...slug]/route.ts` exports `REST_GET`, `REST_POST`, `REST_PATCH`, `REST_PUT`, `REST_DELETE`, and OPTIONS handlers with the same config. This creates collection endpoints such as `GET /api/properties` and Global endpoints such as `GET /api/globals/site-settings`.

## GraphQL API

`src/app/(payload)/api/graphql/route.ts` exports `GRAPHQL_POST`. `src/app/(payload)/api/graphql-playground/route.ts` exports the development `GRAPHQL_PLAYGROUND_GET` handler.

## Local API

The Local API uses `getPayload({ config })` and calls methods such as `find`, `findByID`, `findGlobal`, and `create` without HTTP serialization. It is the main interface used by this application's server code.

## Choosing an interface

| Interface | Use it when |
| --- | --- |
| Admin | A trusted editor manages content |
| Local API | Server code runs inside this application |
| REST | Another HTTP client needs conventional endpoints |
| GraphQL | A client needs field-driven HTTP queries |

## How it connects

All interfaces use the schemas registered in `payload.config.ts`. Access differs by interface, so read [Access control](/docs/operations/access-control) before treating Local API calls like REST requests.
