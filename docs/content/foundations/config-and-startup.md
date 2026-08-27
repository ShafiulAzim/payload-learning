---
title: Config and startup
description: How payload.config.ts becomes a running Payload instance.
---

## Configuration entry point

`src/payload.config.ts` exports `buildConfig({...})`. Payload reads this object to construct schemas, adapters, APIs, authentication, Admin UI metadata, and generated TypeScript definitions.

```ts
export default buildConfig({
  collections: [Pages, Users, Media, Properties, Bookings, BlogCategories, Blogs],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
})
```

## Adapters and services

- `postgresAdapter` connects Payload operations to PostgreSQL through `DATABASE_URL`.
- `lexicalEditor()` defines the rich-text representation used by `richText` fields.
- `sharp` processes uploaded images.
- `emailAdapters` builds a Nodemailer adapter from `MAIL_SMTP_HOST`, `MAIL_SMTP_PORT`, `MAIL_SMTP_USER`, and `MAIL_SMTP_PASS`.
- `PAYLOAD_SECRET` signs authentication data and must be set securely outside source control.

## Initialization in application code

Server code imports config and calls `getPayload({ config })`. Payload resolves the config, connects the adapter, and returns the Local API. Repeated calls use Payload's initialization lifecycle rather than defining another CMS.

## Generated output

`typescript.outputFile` points to `src/payload-types.ts`. `admin.importMap.baseDir` tells Payload where Admin component imports are rooted. Generated route and import-map files may be rewritten by Payload and must not be edited manually.

## How it connects

The config imports every schema described under [Collections](/docs/collections/pages) and [Site settings](/docs/globals/site-settings). The resulting instance is used by [Local API](/docs/operations/local-api) calls.
