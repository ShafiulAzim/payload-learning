---
title: Payload architecture
description: How configuration, APIs, PostgreSQL, and consumers fit together.
---

## Payload's role

Payload is the application's schema and data layer. `src/payload.config.ts` registers collections, the `site-settings` Global, PostgreSQL, Lexical rich text, image processing, email transport, authentication, and generated types.

```text
payload.config.ts -> Payload runtime -> PostgreSQL
                  -> Admin UI
                  -> Local API
                  -> REST and GraphQL
```

The frontend does not define a second data model. It imports the same config and calls the Local API, so collection rules and generated types stay connected to the CMS.

## The Local API boundary

Server code calls `getPayload({ config })` and receives an initialized Payload instance. Calls such as `payload.find()` execute in the same Node.js process; they do not send an HTTP request to `/api`.

This distinction matters for access control. Local API operations default to trusted-server access. Use `overrideAccess: false` when an operation must obey collection access rules.

## Content and consumers

Collections and Globals are upstream. Queries retrieve their generated TypeScript shapes. Transformation helpers narrow populated relationships or create view models. React components are downstream consumers; they do not change schema behavior.

## How it connects

[Config and startup](/docs/foundations/config-and-startup) explains initialization. [APIs and Admin](/docs/foundations/apis-and-admin) compares all four Payload interfaces. [Schema map](/docs/reference/schema-map) shows the registered data model.
