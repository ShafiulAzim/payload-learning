---
title: Properties collection
description: Property content, uploads, nested fields, and public query behavior.
---

## Purpose and registration

`src/collections/Properties.ts` declares `slug: 'properties'`. It is registered in `payload.config.ts`, uses `name` as the Admin title, and exposes public reads with `access.read: () => true`.

## Core fields

`name`, `status`, `type`, `price`, `location`, `description`, and `cover` are required. Price is a number with `min: 0`. Status accepts `for-sale` or `for-rent`; type accepts house, apartment, villa, land, or commercial.

## Structured fields

- `gallery` is an array of up to 20 required Media uploads.
- `features` and `amenities` are arrays of required labels.
- `listing` groups agent name, verified flag, and optional Media image.
- `seo` groups optional title and description.
- bedrooms, bathrooms, area, and parking are optional non-negative numbers.

## API and relationships

Property reads are public through REST and access-enforced APIs. Server listing queries build `Where[]` conditions for location, type, and maximum price. Detail queries use `findByID` with `depth: 2` so media can be transformed.

Featured Properties blocks use a `hasMany` relationship filtered in Admin to records whose `featured` checkbox is true.

## Consumers

`src/app/(frontend)/properties/page.tsx`, `src/lib/properties/getPropertyByID.ts`, the booking page, and Featured Properties consume this collection.

## How it connects

[Properties integration](/docs/integrations/properties) traces list and detail queries. [Queries](/docs/operations/queries) explains the filter operators.
