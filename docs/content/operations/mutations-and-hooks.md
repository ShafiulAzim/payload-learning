---
title: Mutations and hooks
description: Payload create validation, collection hooks, unique slugs, and idempotent booking writes.
---

## Create lifecycle

```text
application validation -> payload.create() -> beforeValidate -> field validation -> PostgreSQL write
```

The booking action calls:

```ts
await payload.create({
  collection: 'bookings',
  overrideAccess: true,
  data: { fullName, email, property: propertyID, submissionToken, status: 'new' },
})
```

Payload validates collection fields even when access is overridden. `overrideAccess` changes authorization, not schema validation or hooks.

## Booking hook and idempotency

Bookings `beforeValidate` supplies missing reference and submission token. The Server Action checks for the token before creation and again after an error, covering repeated requests and a uniqueness race.

It also checks a honeypot, validates lengths/formats/options/date, verifies the related Property with `payload.findByID()`, and returns safe field or generic errors.

## Slug hooks

Blogs and Blog Categories use `beforeValidate` plus `req.payload` to call `uniqueSlug`. The hook preserves a manually customized slug while continuing to update an automatically derived slug.

## Transactions

When a hook performs nested writes that must be atomic with the outer operation, pass the current `req` to the nested Payload operation. The current slug hook performs a read for uniqueness; the repository has no multi-document mutation hook.

## Email boundary

The root config registers Nodemailer, but the current Booking collection has no email-sending hook. Do not assume a saved booking sends mail until such a hook or explicit send operation is added.
