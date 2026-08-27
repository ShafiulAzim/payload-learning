# Site Header and Footer Global Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fetch one Payload `site-settings` Global in the frontend layout and use it to render configurable shared header/footer components with explicit per-route hide rules.

**Architecture:** The server layout calls Payload Local API `findGlobal` exactly once and normalizes the result into a serializable site-settings view. A client-safe `GlobalsProvider` exposes the normalized public values, and `SiteChrome` uses `usePathname()` to apply exact or child-route hide rules and wraps all page content with the shared header and footer.

**Tech Stack:** Payload CMS 3.88, Next.js 16 App Router, React 19, TypeScript, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-08-23-site-chrome-design.md`

## Global Constraints

- Header and footer show by default.
- Only an explicit matching `hideHeader` or `hideFooter` rule can hide them.
- Fetch `site-settings` once with `payload.findGlobal({ slug: 'site-settings', depth: 1 })` in the frontend layout.
- Do not add test files, commits, or pushes.

---

### Task 1: Site Settings Payload Global

**Files:**

- Create: `src/globals/SiteSettings.ts`
- Create: `src/globals/fields/header.ts`
- Create: `src/globals/fields/footer.ts`
- Create: `src/globals/fields/visibilityRules.ts`
- Modify: `src/payload.config.ts`
- Generated: `src/payload-types.ts`

**Interfaces:**

- Produces Global slug `site-settings` and generated `SiteSetting` type.

- [ ] Define brand, logo, header navigation, CTA, footer content, contact, social, copyright, and route rules.
- [ ] Configure route rules with pathname, match mode, `hideHeader`, and `hideFooter`, all hide flags defaulting false.
- [ ] Register the Global and regenerate Payload types.

### Task 2: Normalize Global data once

**Files:**

- Create: `src/globals/getSiteSettings.ts`
- Create: `src/components/globals/types.ts`

**Interfaces:**

- Produces `SiteSettingsView` and `getSiteSettings(): Promise<SiteSettingsView>`.

- [ ] Define serializable header/footer/link/rule view types.
- [ ] Call `findGlobal` once, map populated Media safely, and provide fallback settings on missing data or fetch failure.

### Task 3: Configurable header and footer

**Files:**

- Modify: `src/components/globals/SiteHeader.tsx`
- Create: `src/components/globals/SiteFooter.tsx`

**Interfaces:**

- `SiteHeader({ settings })` consumes normalized header settings.
- `SiteFooter({ settings })` consumes normalized footer settings.

- [ ] Refactor the header to render global brand, logo, links, CTA, mobile menu, and pathname-based active state.
- [ ] Build the responsive footer with brand, grouped links, contact details, social links, and copyright.

### Task 4: Single layout ownership and visibility

**Files:**

- Create: `src/components/globals/SiteChrome.tsx`
- Create: `src/components/globals/GlobalsProvider.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: page/components currently rendering `SiteHeader`.

**Interfaces:**

- `SiteChrome({ settings, children })` applies normalized route rules.

- [ ] Match rules by normalized pathname, prefer the most specific match, and require explicit hide flags.
- [ ] Fetch settings once in the root frontend layout and wrap children with SiteChrome.
- [ ] Remove every page-level SiteHeader import and render to prevent duplicates.

### Task 5: Verification

**Files:**

- Verify all files above and generated Payload types.

- [ ] Format source files and regenerate Payload types.
- [ ] Run TypeScript and diff validation.
- [ ] Update only stale existing assertions caused by the intentional shared-layout refactor.
- [ ] Run existing integration tests and production build.
- [ ] Confirm all public routes compile and leave changes uncommitted.
