---
title: Block reference
description: Every page-builder block, generated interface, field, and relationship.
---

## Registered blocks

| blockType | interfaceName | Config | Renderer |
| --- | --- | --- | --- |
| `hero-with-search` | `HeroWithSearchBlock` | `src/blocks/heros/config.ts` | `HeroWithSearch.tsx` |
| `trust-features` | `TrustFeaturesBlock` | `src/blocks/trust-features/config.ts` | `TrustFeatures.tsx` |
| `featured-properties` | `FeaturedPropertiesBlock` | `src/blocks/featured-properties/config.ts` | `FeaturedProperties.tsx` |
| `about-intro` | `AboutIntroBlock` | `src/blocks/about-intro/config.ts` | `AboutIntro.tsx` |
| `stats-bar` | `StatsBarBlock` | `src/blocks/stats-bar/config.ts` | `StatsBar.tsx` |
| `core-values` | `CoreValuesBlock` | `src/blocks/core-values/config.ts` | `CoreValues.tsx` |

## Hero With Search

Stores eyebrow, required title, description, CTA group, a nested search group, and required Media background image. Search includes configurable action, labels, location placeholder, type/price arrays, and button label. Defaults reuse property search option constants.

## Trust Features and Core Values

Both use required arrays with row limits and constrained icon selects. Trust Features accepts one to four items. Core Values accepts two to six items plus eyebrow and required heading.

## Featured Properties

Stores text and CTA settings plus a required `hasMany` relationship to Properties. `filterOptions` shows only featured records in Admin. Runtime data still depends on relationship depth and access.

## About Intro and Stats Bar

About Intro stores text paragraphs, a required Media image, and CTA group. Stats Bar stores two to four value/label/icon items.

## Validation boundary

Payload validates required fields, options, and row counts before persistence. React renderers should still handle optional and unpopulated relationship states because query depth and existing data can affect runtime shape.

## How it connects

All configs are registered by Pages and all renderers by `RenderBlocks`; missing either registration breaks the end-to-end block lifecycle.
