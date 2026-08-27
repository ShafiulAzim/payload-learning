---
title: Booking integration
description: Trace public form input through validation and trusted Payload creation.
---

## Read phase

The booking page initializes Payload and calls `payload.find({ collection: 'properties', pagination: false, limit: 500, select: { id: true, name: true, location: true, cover: true } })`. Failure produces an unavailable state instead of crashing the form page.

## Mutation boundary

`BookingForm` is interactive browser code. It sends `FormData` to `src/app/(frontend)/book-a-call/actions.ts`, a server-only action. Secret configuration and privileged Payload access never enter the browser bundle.

## Validation sequence

The action rejects the honeypot, normalizes bounded strings, validates email/phone/property/options/date/message, and requires a version-4 UUID submission token. It then initializes `getPayload({ config })`.

## Idempotent Payload operations

1. `payload.find({ collection: 'bookings', overrideAccess: true, pagination: false, where: { submissionToken: { equals: submissionToken } } })` checks an existing request.
2. `payload.findByID({ collection: 'properties', id: propertyID, depth: 0, overrideAccess: true })` verifies the relationship target.
3. `payload.create({ collection: 'bookings', overrideAccess: true, data: ... })` creates the record.
4. A failure triggers another token lookup to recover from a uniqueness race.

## Security reasoning

Bookings collection creation requires a user, but this trusted action deliberately bypasses access after explicit validation. A public REST create remains denied. `overrideAccess: true` is authority and must stay on the server.

## Email behavior

Nodemailer is configured globally, but no booking hook currently sends an email. Persistence success means a Booking document was saved, not that a notification was delivered.
