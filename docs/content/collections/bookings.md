---
title: Bookings collection
description: Protected booking records, idempotency fields, hooks, and statuses.
---

## Purpose and registration

`src/collections/Bookings.ts` declares `slug: 'bookings'`. The collection stores consultation requests and uses `reference` as the Admin title.

## Access

Create, read, update, and delete all require `Boolean(req.user)`. Public browsers therefore cannot call the collection REST endpoint directly. The Server Action validates public input and performs an intentional trusted Local API operation with `overrideAccess: true`.

## Identity and idempotency

`reference` and `submissionToken` are required, unique, and indexed. A `beforeValidate` hook supplies missing values with `randomUUID`. The submission token is hidden in Admin and lets the action recognize repeated submissions.

## Booking data

Required contact fields are `fullName`, `email`, and `phone`. `property` relates to Properties. `interestType`, `preferredDate`, and `preferredTime` are required constrained values. `message` is optional with `maxLength: 1000`.

Status defaults to `new` and can move through contacted, confirmed, completed, or cancelled. The collection defines the available states but does not enforce a transition state machine.

## Hook order

The hook runs before Payload field validation. Application code currently supplies reference and token explicitly, while the hook protects other creation paths.

## How it connects

[Booking integration](/docs/integrations/bookings) traces validation, duplicate detection, property lookup, `payload.create`, and error recovery.
