---
title: Site Settings integration
description: Trace a Payload Global through mapping, fallback data, and shared consumers.
---

## Global query

`src/globals/getSiteSettings.ts` initializes Payload and calls:

```ts
await payload.findGlobal({ slug: 'site-settings', depth: 1 })
```

Depth 1 populates the optional logo Media relationship. The helper narrows the union before reading URL and alt text.

## Transformation

Generated `SiteSetting` is mapped to application-owned `SiteGlobals`. Nested arrays are rebuilt with only fields the site chrome needs. Missing individual values fall back to defaults.

## Failure behavior

Initialization or query errors are caught. The helper logs only an error message and returns a complete static fallback, allowing public pages—including `/docs`—to remain renderable when settings cannot load.

## Consumer flow

```text
SiteSettings Global -> getSiteSettings -> frontend layout -> GlobalsProvider
                    -> SiteChrome -> Header and Footer
```

Visibility rules control whether the header/footer appear for exact paths or path prefixes.

## How it connects

The Global schema is in [Site Settings](/docs/globals/site-settings). Media population follows [Relationships and depth](/docs/schema/relationships-and-depth).
