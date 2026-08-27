---
title: Generated Payload types
description: How collection, Global, and block config becomes TypeScript.
---

## Generation lifecycle

```text
Payload config -> pnpm generate:types -> src/payload-types.ts -> typed consumers
```

`src/payload.config.ts` sets `typescript.outputFile`. Run `pnpm generate:types` after changing a collection, Global, field, relationship, or block.

## What Payload generates

Payload generates document interfaces such as `Property`, `Blog`, `Media`, and `SiteSetting`. Block `interfaceName` values such as `HeroWithSearchBlock` give block shapes stable, readable names.

Relationship properties are unions because `depth` controls population. Optional fields also include `null` or `undefined` according to schema behavior. This is why helpers such as `toPropertyView` narrow data before UI consumption.

## Never edit the output

`src/payload-types.ts` is generated output. Manual edits disappear the next time types are generated and can disagree with the database schema.

## Stale-type symptoms

If a new field is missing from autocomplete or a removed field still type-checks, regenerate types and restart the TypeScript process. If runtime schema is also stale, restart Payload and review whether the PostgreSQL schema update completed.

## How it connects

Schema sources are documented under [Collections](/docs/collections/pages), [Site settings](/docs/globals/site-settings), and [Block reference](/docs/blocks/block-reference).
