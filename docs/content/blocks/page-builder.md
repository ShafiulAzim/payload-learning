---
title: Payload page builder
description: How a blocks field connects Payload Admin data to React rendering.
---

## Schema registration

`src/collections/Pages.ts` defines `layout` as a required `blocks` field. Its `blocks` array imports six Payload `Block` configs. Payload Admin uses those configs to create editors; the database stores ordered block data with `blockType` discriminators.

## Generated union

Each config supplies `interfaceName`, so `pnpm generate:types` produces named block interfaces. The generated Page layout becomes an array union. Fields and relationship values follow the block config exactly.

## Query and dispatch

Page server code queries `collection: 'pages'` and passes `page.layout` to `src/blocks/RenderBlocks.tsx`. `blockComponents` maps each `blockType` string to its React implementation.

```text
Pages.layout -> blockType -> blockComponents[blockType] -> <Component {...block} />
```

Unknown block types currently return `null`. Keys prefer Payload block IDs and fall back to block type plus array index. The registry uses `React.ComponentType<any>`, a practical but weaker type boundary that makes keeping config and component props aligned important.

## Adding a block

Define a Payload Block config, add a render component, register config in `Pages.layout.blocks`, register the component in `RenderBlocks`, regenerate types, create content in Admin, and test the rendered path.

## How it connects

[Block reference](/docs/blocks/block-reference) lists every config/render pair. [Pages and blocks integration](/docs/integrations/pages-and-blocks) traces the query.
