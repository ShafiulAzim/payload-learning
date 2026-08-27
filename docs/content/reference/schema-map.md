---
title: Payload schema map
description: Registered collections, Globals, relationships, and main consumers.
---

## Registered schemas

| Kind | Slug | Source | Access summary |
| --- | --- | --- | --- |
| Collection | `pages` | `src/collections/Pages.ts` | Payload defaults |
| Auth collection | `users` | `src/collections/Users.ts` | Payload auth |
| Upload collection | `media` | `src/collections/Media.ts` | Public read |
| Collection | `properties` | `src/collections/Properties.ts` | Public read |
| Collection | `bookings` | `src/collections/Bookings.ts` | Authenticated operations |
| Collection | `blog-categories` | `src/collections/BlogCategories.ts` | Public read, authenticated writes |
| Collection | `blogs` | `src/collections/Blogs.ts` | Published public read, authenticated writes |
| Global | `site-settings` | `src/globals/SiteSettings.ts` | Public read, authenticated update |

## Relationship map

```text
Pages.layout -> six block unions
Hero / About Intro -> Media
Featured Properties -> Properties -> Media
Bookings -> Properties
Blogs -> Blog Categories
Blogs -> Media
Site Settings -> Media
```

## Main data flows

| Source | Operation | Consumer |
| --- | --- | --- |
| Pages | `payload.find()` by slug | `RenderBlocks` |
| Properties | filtered `payload.find()` | listing cards |
| Properties | `payload.findByID()` | `toPropertyView` |
| Blogs/Categories | access-enforced `payload.find()` | blog listing/article |
| Bookings | trusted `payload.create()` | Server Action result |
| Site Settings | `payload.findGlobal()` | `SiteGlobals` and chrome |

## How it connects

Use this map to choose a detailed [collection](/docs/collections/pages), [operation](/docs/operations/local-api), or [integration](/docs/integrations/pages-and-blocks) page.
