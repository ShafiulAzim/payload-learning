---
title: Payload CMS in this project
description: A technical learning path through this repository's Payload architecture.
---

## What Payload owns

Payload CMS 3.88.0 provides this application with its content schema, PostgreSQL data layer, Admin UI, authentication, uploads, Local API, REST API, and GraphQL API. The central entry point is `src/payload.config.ts`.

## Payload and the surrounding application

Payload defines and validates data. Server-side application code initializes Payload with `getPayload({ config })`, performs typed operations, and passes results to focused consumers. Next.js is the host runtime, but Payload owns the content model and data behavior documented here.

## Four ways to work with Payload

| Interface | Purpose | Main entry point |
| --- | --- | --- |
| Admin UI | Authenticated content editing | `/admin` |
| Local API | In-process server operations | `getPayload({ config })` |
| REST API | HTTP collection and Global endpoints | `/api/*` |
| GraphQL API | Typed HTTP queries and mutations | `/api/graphql` |

## Learning path

Start with [Architecture](/docs/foundations/architecture), then study configuration and schema before moving into collections, Globals, blocks, and Local API operations. Integration walkthroughs trace the repository's real features end to end.

## Generated files

Do not manually edit `src/payload-types.ts` or generated files under `src/app/(payload)`. Update Payload configuration and run `pnpm generate:types` or the relevant Payload generator instead.

## How it connects

`src/payload.config.ts` registers collections and Globals. Payload turns that configuration into database behavior, APIs, the Admin UI, and generated TypeScript types. Application code imports the same config to initialize the Local API.
