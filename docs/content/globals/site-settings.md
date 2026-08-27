---
title: Site Settings Global
description: Singleton branding, navigation, footer, and visibility configuration.
---

## Purpose and registration

`src/globals/SiteSettings.ts` declares `slug: 'site-settings'`. Unlike a collection, a Global represents one singleton document and is loaded with `payload.findGlobal()`.

## Access

Reads are public; updates require `Boolean(req.user)`. Public application code can enforce this read rule with `overrideAccess: false`, although the current trusted loader uses the Local API default.

## Tabs and field factories

The top-level `tabs` field organizes General, Header, Footer, and Page Visibility in Admin. General stores `siteName`, tagline, and a Media logo. The other tabs import reusable `Field` objects from `src/globals/fields/header.ts`, `footer.ts`, and `visibilityRules.ts`.

Header contains navigation arrays and a CTA group. Footer contains description, nested link groups, contact, social links, and copyright. Visibility rules are route patterns controlling header/footer display.

## Consumer transformation

`src/globals/getSiteSettings.ts` requests depth 1, narrows `settings.logo` to a populated Media object, and maps the generated `SiteSetting` shape to `SiteGlobals`. If initialization or querying fails, it logs a safe message and returns static fallback settings.

## How it connects

[Site Settings integration](/docs/integrations/site-settings) traces the Global through `GlobalsProvider`, `SiteChrome`, Header, and Footer.
