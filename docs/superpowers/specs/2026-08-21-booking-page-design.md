# Booking Page Design

## Goal

Create a production-ready public booking flow at `/book-a-call`. Visitors select a property and preferred appointment details, and valid submissions are stored in PostgreSQL through Payload. The frontend shows a success modal only after persistence succeeds and otherwise shows useful validation or submission errors. No email is sent.

## User Flow

The shared header links to `/book-a-call`. A property-details page links to `/book-a-call?property=<id>`, which preselects that property when the ID is valid. Visitors may change the selected property before submitting.

The form collects:

- full name;
- email address;
- phone number;
- property selection;
- interest type: buying, renting, selling, or investment;
- preferred date;
- preferred time;
- optional message.

All visible required fields are validated before submission and again on the server. While submitting, the button is disabled to prevent accidental duplicate clicks. After Payload confirms creation, the page opens an accessible success modal. A failed request preserves the entered values and displays field-level or global errors.

## Architecture

The page is server rendered. It fetches a minimal list of available properties through Payload's Local API and passes them to a client form component. The client component owns form interaction, pending state, error rendering, and the success modal.

A Next.js server action accepts the form submission. It normalizes and validates all untrusted values, rejects the hidden honeypot field when populated, verifies that the selected property exists, and creates the booking through Payload's Local API. The public browser never receives direct create access to the bookings collection.

The action returns a small serializable result containing success state and field errors. Internal database or Payload errors are logged on the server but are represented to visitors by a generic retry message.

## Payload Collection

Add a `bookings` collection with these fields:

- `reference`: unique, indexed, server-generated human-readable identifier;
- `fullName`: required text;
- `email`: required email;
- `phone`: required text;
- `property`: required relationship to `properties`;
- `interestType`: required select;
- `preferredDate`: required date stored with date-only admin presentation;
- `preferredTime`: required text or constrained select value;
- `message`: optional textarea;
- `submissionToken`: unique, indexed, server-generated idempotency token;
- `status`: indexed select with `new`, `contacted`, `confirmed`, `completed`, and `cancelled`; defaults to `new`;
- Payload's automatic `createdAt` and `updatedAt` timestamps.

Collection access is admin-only for read, create, update, and delete through REST/GraphQL. The trusted server action uses Payload Local API with explicit access override to create a record after validation. The admin list uses the booking reference as its title and shows reference, customer, property, preferred date, status, and creation time.

## Validation and Abuse Protection

Validation rules are shared conceptually between client presentation and the server authority. The server enforces reasonable maximum lengths, normalized email, valid interest values, a valid property ID, and a date that is not in the past. It rejects malformed or unexpected values rather than coercing them silently.

A visually hidden honeypot field catches basic automated submissions. Duplicate button clicks are prevented in the client. A deterministic submission token is included with the request and stored with a uniqueness constraint so retries cannot create duplicate records. Database uniqueness is the final concurrency-safe guard.

No sensitive implementation details or raw database errors are returned to the browser. Payload Admin authentication remains separate from the visitor flow.

## UI

The page follows the supplied Book a Call design: a light two-column composition, supporting benefits on the left, and a clean white form panel on the right. It reuses the Homespire typography, navy, white, and gold palette and adapts to a single-column mobile layout.

The property dropdown shows property name and location. When `?property=<id>` matches an available property, that option is selected. Invalid or deleted IDs are ignored and the visitor must choose a valid option.

The success modal traps focus, has an explicit close control, supports Escape, and announces success to assistive technology. Closing it resets the form and removes the selected property query parameter by replacing the current URL with `/book-a-call`.

## Error Handling

- Invalid fields render next to their inputs.
- An invalid property ID produces a property-field error.
- A duplicate submission returns the already-successful state rather than creating a second booking.
- Payload/database failure produces a global retry message while preserving form values.
- If the property list cannot be loaded, the page renders a safe unavailable state instead of a nonfunctional form.

## Integration Changes

- Register `Bookings` in `payload.config.ts`.
- Add `/book-a-call/page.tsx`, its server action, and focused booking UI components.
- Change the shared header call-to-action default from a telephone URL to `/book-a-call`.
- Preserve the existing property-details contract `/book-a-call?property=<id>`.
- Regenerate Payload TypeScript types after adding the collection.

## Verification

No new test files will be written, following the project instruction. Verification will include Payload type generation, formatting, TypeScript checking, diff validation, and a full production build. The built route manifest must contain `/book-a-call`, `/properties`, and `/properties/[id]`.
