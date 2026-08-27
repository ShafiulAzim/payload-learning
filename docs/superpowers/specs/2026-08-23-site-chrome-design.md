# Site Header and Footer Global Design

## Goal

Move all shared header and footer content into one Payload Global and render both components from the frontend root layout. Fetch the Global exactly once per layout render with Payload's Local API `findGlobal`, while allowing administrators to hide either component on configured routes.

## Payload Global

Add a singleton Global with slug `site-settings`. It contains:

- brand name, tagline, and optional logo relationship to Media;
- header navigation links;
- header CTA label and href;
- footer description;
- footer navigation groups and links;
- contact email, phone, and address;
- social links;
- copyright text;
- route visibility rules.

Each visibility rule contains a pathname, match mode (`exact` or `starts-with`), `hideHeader`, and `hideFooter`. Exact matching affects one route. Starts-with matching affects a route and its descendants, so `/properties` can also control `/properties/<id>`. When multiple rules match, the most specific pathname wins. Routes without a matching rule always show both the header and footer. A component is hidden only when the matching rule explicitly enables its corresponding hide flag.

## Data Flow

The server-rendered frontend layout initializes Payload and calls:

```ts
payload.findGlobal({
  slug: 'site-settings',
  depth: 1,
})
```

This is the only site-settings fetch. The returned object is passed to a client `SiteChrome` component that uses `usePathname()` to resolve visibility rules. `SiteChrome` renders `SiteHeader`, the page content, and `SiteFooter` without making another API request.

Safe default settings are normalized server-side when the Global is empty or temporarily unavailable. Public pages remain usable and the layout does not crash.

## Header

Move and refactor `SiteHeader` under `src/components/globals` to receive its brand, links, CTA, and optional logo as props. It keeps the existing mobile menu behavior and uses `usePathname()` to set `aria-current` and active styling. All page-level header instances are removed because the root layout owns the single header.

## Footer

Create a reusable `SiteFooter` matching the Homespire navy, white, and gold visual system. It renders brand content, grouped navigation, contact details, social links, and copyright only when configured. External social links open safely with `rel="noreferrer"`; email and phone values use appropriate links.

## Route Visibility

`SiteChrome` normalizes trailing slashes before matching. Exact rules require equality. Starts-with rules match equality or a slash-delimited child path, preventing `/properties` from accidentally matching `/properties-old`.

The visibility decision affects only presentation; page data and global data are not refetched when navigating. Header and footer always render by default and are hidden only by an explicit matching route rule.

## Integration

- Register `SiteSettings` in `payload.config.ts` under `globals`.
- Regenerate `payload-types.ts`.
- Update `src/app/(frontend)/layout.tsx` to fetch the Global once with `findGlobal`.
- Add `GlobalsProvider`, `SiteChrome`, and `SiteFooter` under `src/components/globals`.
- Refactor `SiteHeader` to use Global-derived props.
- Remove page-level `SiteHeader` imports and JSX from home, about, properties, property details, and book-a-call routes/components.

## Verification

Do not add test files, commit, or push. Run Payload type generation, formatting, TypeScript validation, existing integration tests, diff validation, and a production build. Confirm all public routes compile with only the root-layout header/footer ownership.
