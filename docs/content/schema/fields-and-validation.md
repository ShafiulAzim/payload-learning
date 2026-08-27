---
title: Fields and validation
description: Field types, constraints, defaults, and hooks used by this project.
---

## Field types in use

| Type | Examples |
| --- | --- |
| `text`, `textarea`, `email` | Titles, summaries, contact data |
| `number`, `checkbox`, `select`, `date` | Price, flags, statuses, publication dates |
| `richText` | Property descriptions and blog content |
| `upload`, `relationship` | Media, property, and category references |
| `array`, `group`, `tabs`, `blocks` | Repeating items, nested objects, Admin organization, page layouts |

## Constraints

`required` rejects missing data. `unique` creates a uniqueness guarantee, while `index` optimizes lookups. Text fields use `maxLength`; number fields use `min`; arrays use `minRows` and `maxRows`. `defaultValue` fills absent input but does not replace application validation.

The booking fields combine schema constraints with stricter Server Action checks. Database validation remains the last line of defense, not the only line.

## Hooks

`beforeValidate` runs before Payload validates incoming data. `Bookings` fills `reference` and `submissionToken`. `Blogs` and `BlogCategories` call `uniqueSlug` through `req.payload` before slug uniqueness is checked.

Hooks must return the updated `data`. Nested Payload operations should pass request context when transaction participation is required.

## Admin configuration

`admin` properties change the editing experience, not the stored field type. Examples include sidebar placement, descriptions, default columns, hidden fields, collapsed blocks, and date picker appearance.

## How it connects

See each [collection page](/docs/collections/pages) for exact constraints and [Mutations and hooks](/docs/operations/mutations-and-hooks) for runtime order.
