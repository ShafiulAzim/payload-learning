# Booking Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure public property-booking form that stores validated requests in Payload/PostgreSQL and reports success or errors in the frontend.

**Architecture:** A private Payload `bookings` collection owns persisted requests and workflow status. The server-rendered page loads property choices, while a client form submits to a Next.js server action that validates input, verifies the property, handles idempotency, and creates the booking through Payload's Local API.

**Tech Stack:** Payload CMS 3.88, PostgreSQL adapter, Next.js 16 App Router and server actions, React 19, TypeScript, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-08-21-booking-page-design.md`

## Global Constraints

- Store booking records in Payload/PostgreSQL; do not send email.
- Visitors must not have direct REST or GraphQL access to booking records.
- Show a success modal only after persistence succeeds; otherwise show field or global errors.
- Require a property selected from the Payload properties collection and preselect `?property=<id>` when valid.
- Do not add test files, commits, or pushes.
- Verify with formatting, generated Payload types, TypeScript, diff checks, and a production build.

---

### Task 1: Private bookings collection

**Files:**

- Create: `src/collections/Bookings.ts`
- Modify: `src/payload.config.ts`
- Generated: `src/payload-types.ts`

**Interfaces:**

- Produces: Payload collection slug `bookings` and generated `Booking` type.
- Consumes: relationship to collection slug `properties`.

- [ ] Create `Bookings` with admin-only access functions and fields `reference`, `submissionToken`, `fullName`, `email`, `phone`, `property`, `interestType`, `preferredDate`, `preferredTime`, `message`, and `status`.
- [ ] Add a `beforeValidate` hook that supplies `BK-XXXXXXXX` and UUID values when trusted creation does not provide them.
- [ ] Make `reference` and `submissionToken` unique/indexed and make `status` indexed with default `new`.
- [ ] Register `Bookings` in `payload.config.ts`.
- [ ] Run `pnpm generate:types` and confirm `Booking` is generated.

### Task 2: Server-side booking validation and persistence

**Files:**

- Create: `src/app/(frontend)/book-a-call/actions.ts`

**Interfaces:**

- Produces: `BookingActionState`, `initialBookingState`, and `submitBooking(previousState, formData)`.
- Consumes: Payload collections `properties` and `bookings`.

- [ ] Define a serializable action state with `success`, optional `reference`, `message`, and keyed field errors.
- [ ] Normalize and validate all form values, maximum lengths, email shape, phone shape, allowed interest/time values, required property ID, and non-past date.
- [ ] Reject a populated `website` honeypot with the same generic error used for unsafe requests.
- [ ] Find the selected property using `findByID`; return a property field error when it is missing.
- [ ] Check `submissionToken` before creation and return the existing booking reference for an idempotent retry.
- [ ] Create the booking with `overrideAccess: true`; catch internal errors, log server-side context without form secrets, and return a generic retry message.
- [ ] On a unique-token race, query by token and return success for the existing record.

### Task 3: Accessible interactive booking form

**Files:**

- Create: `src/components/booking/BookingForm.tsx`
- Create: `src/components/booking/BookingSuccessModal.tsx`

**Interfaces:**

- `BookingForm({ properties, selectedPropertyID, submissionToken })` consumes minimal `{ id, name, location }` choices.
- `BookingSuccessModal({ reference, onClose })` renders the accessible success state.
- Consumes: `submitBooking` and `initialBookingState` from the server action.

- [ ] Build controlled form submission with React `useActionState`, disabled/pending button state, hidden honeypot, and hidden idempotency token.
- [ ] Render required inputs for full name, email, phone, property, interest type, preferred date, and preferred time plus optional message.
- [ ] Preselect only a property ID present in the supplied choices.
- [ ] Render field errors beside fields and the action's global message in an `aria-live` region.
- [ ] Open the modal when `success` becomes true, reset the form after closing, rotate the submission UUID, and replace the URL with `/book-a-call`.
- [ ] Implement modal focus placement, Escape handling, focus restoration, backdrop, explicit close button, and success reference display.

### Task 4: Booking page and site navigation

**Files:**

- Create: `src/app/(frontend)/book-a-call/page.tsx`
- Modify: `src/components/SiteHeader.tsx`

**Interfaces:**

- Consumes: `BookingForm` and Payload property records.
- Produces: public `/book-a-call` route supporting `?property=<id>`.

- [ ] Fetch property choices with the Local API using only `id`, `name`, and `location`, sorted by name.
- [ ] Validate the query property against fetched choices before passing the preselection.
- [ ] Render metadata, shared header, responsive two-column design, benefit list, and white form panel.
- [ ] Render a safe unavailable state if property loading fails or there are no properties.
- [ ] Change `SiteHeader`'s default call-to-action URL to `/book-a-call`.

### Task 5: Verification

**Files:**

- Verify all files above and generated `src/payload-types.ts`.

**Interfaces:**

- Produces: evidence that the feature compiles and the route is included in production output.

- [ ] Run Prettier on all created and modified source files.
- [ ] Run `pnpm generate:types` and inspect the generated `Booking` interface.
- [ ] Run `pnpm exec tsc --noEmit` and require exit code 0.
- [ ] Run `git diff --check` and require no whitespace errors.
- [ ] Run `pnpm build` and require `/book-a-call`, `/properties`, and `/properties/[id]` in the route manifest.
- [ ] Inspect `git status --short` and confirm no test files, commits, or push operations were introduced.
