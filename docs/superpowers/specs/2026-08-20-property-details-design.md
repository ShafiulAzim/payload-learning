# Property Details Design

## Goal

Build a CMS-managed real-estate property details page matching the supplied design at `/properties/[slug]`, with reusable structured property data, browser-local favorites, and a booking link that preselects the property.

## Architecture

Replace the unused `products` collection with a `properties` collection. Each property is a structured Payload record and uses a unique slug as its public route identifier. A dynamic Next.js server route queries Payload for one property and composes the page from focused property-detail components.

The page keeps server-rendered content separate from browser-only interactions. Gallery selection, tabs, and favorites are client components. Favorites use versioned `localStorage`; visitors never authenticate through Payload Admin. Booking navigates to `/book-a-call?property=<slug>` so the future booking page can preselect the property.

## Content Model

The `properties` collection contains:

- name, unique slug, listing status, property type, featured flag
- price, location, short summary, and rich-text description
- cover image and repeatable gallery images
- bedrooms, bathrooms, area, and parking values
- repeatable features and amenities
- listing company or agent name, verification label, and optional image
- SEO title and SEO description

The collection is publicly readable. Admin editing uses the property name as its title and exposes useful default columns including status, price, location, and update date.

## Route and Rendering

`/properties/[slug]` queries the `properties` collection by exact slug with populated media. A missing property returns Next.js `notFound()`. The route renders the shared site header followed by breadcrumbs, gallery, property summary, specification icons, action controls, tabbed details, and listing-agent card.

Optional sections are omitted when empty. Missing images render neutral placeholders with accessible labels. Price formatting is consistent and listing status is displayed as “For sale” or “For rent.”

## Components

- `PropertyGallery`: primary image, thumbnails, photo count, and responsive layout.
- `PropertySummary`: status, name, location, formatted price, specifications, and actions.
- `FavoriteButton`: versioned local-storage persistence keyed by property ID.
- `PropertyDetailsTabs`: overview, features, amenities, and location panels.
- `ListingAgentCard`: listing identity and verification information.
- `PropertyDetailsPage`: server-rendered composition boundary.

Each component consumes explicit props and does not query Payload independently. This keeps data fetching in the route and makes presentation behavior directly testable.

## Interaction Behavior

Selecting a gallery thumbnail changes the primary image. Tabs expose one active panel at a time with accessible button and panel relationships. The favorite button reads the stored ID list after hydration, toggles the current property, and writes the updated list. Invalid or non-array stored data is discarded and reset safely.

“Book a Viewing” navigates to `/book-a-call?property=<slug>`. The future booking page is outside this implementation; this phase establishes the URL contract only.

## Error Handling

- Unknown slug: render the application 404 page.
- Empty optional data: omit the affected section without leaving blank layout regions.
- Missing media: render a neutral placeholder.
- Invalid local favorite data: reset to an empty versioned list.
- Unavailable local storage: keep the favorite control usable for the current session without crashing the page.

## Testing and Verification

Tests cover property content rendering, omitted optional sections, gallery selection, accessible tabs, favorite persistence and invalid-data recovery, booking URL construction, and missing-property query behavior. Final verification runs the focused tests, Payload type generation, TypeScript, formatting checks, and the production Next.js build.

## Scope Boundaries

This phase does not build the properties listing page, booking form, visitor accounts, server-synced favorites, maps, payments, or inquiry email delivery. It only provides the property details page and stable contracts those future features can consume.
