---
title: Media collection
description: Payload uploads and the media relationships used across the project.
---

## Purpose and registration

`src/collections/Media.ts` declares `slug: 'media'` and `upload: true`. Payload adds upload metadata such as filename, MIME type, dimensions, and URL to the generated `Media` type.

## Custom fields and access

The required `alt` text field supplies accessible descriptions. `access.read: () => true` makes media documents publicly readable. Create, update, and delete use Payload defaults and authenticated Admin workflows.

## Relationships

Media is referenced by:

- Property `cover`, `gallery.image`, and `listing.image`;
- Blog `featuredImage`;
- Site Settings `logo`;
- Hero and About Intro block images.

An upload relationship can be an ID or populated `Media` object. Consumers must narrow before reading `.url` or `.alt`.

## Image processing

The root config supplies `sharp`, enabling Payload's image processing. This collection currently uses the simple `upload: true` form and does not declare custom image sizes.

## How it connects

[Relationships and depth](/docs/schema/relationships-and-depth) explains population. Property and blog integration pages show real narrowing boundaries.
