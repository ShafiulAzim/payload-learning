# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Payload-managed `/about` page using three reusable responsive blocks matching the supplied Homespire design.

**Architecture:** The Pages collection composes `about-intro`, `stats-bar`, and `core-values` blocks. A dedicated server-rendered route loads the Pages record with slug `about`, and the existing block dispatcher renders the configured layout.

**Tech Stack:** Payload CMS 3.88, Next.js 16 App Router, React 19, TypeScript, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-08-21-about-page-design.md`

## Global Constraints

- Keep visible About content editable through Payload Admin with fixed block structures.
- Reuse the shared SiteHeader and RenderBlocks architecture.
- Do not add test files, commits, or pushes.
- Verify with type generation, formatting, TypeScript, relevant existing tests, diff checks, and production build.

---

### Task 1: About Intro block

**Files:**

- Create: `src/blocks/about-intro/config.ts`
- Create: `src/blocks/about-intro/AboutIntro.tsx`

**Interfaces:**

- Produces block slug `about-intro` with `eyebrow`, `heading`, `body`, `image`, and `cta` fields.
- Consumes populated Payload `Media` relationships.

- [ ] Define the block configuration with required heading/body/image and optional eyebrow/CTA.
- [ ] Render responsive text, CTA, and image columns with safe media narrowing and placeholder state.

### Task 2: Statistics and Core Values blocks

**Files:**

- Create: `src/blocks/stats-bar/config.ts`
- Create: `src/blocks/stats-bar/StatsBar.tsx`
- Create: `src/blocks/core-values/config.ts`
- Create: `src/blocks/core-values/CoreValues.tsx`

**Interfaces:**

- Produces block slugs `stats-bar` and `core-values`.
- Uses constrained icon values rendered by local SVG icon functions.

- [ ] Define the statistics array with two-to-four value, label, and icon records.
- [ ] Render a responsive navy statistics band with separators.
- [ ] Define the values section with heading fields and two-to-six icon/title/description records.
- [ ] Render a responsive values grid with accessible heading hierarchy.

### Task 3: Register block architecture

**Files:**

- Modify: `src/collections/Pages.ts`
- Modify: `src/blocks/RenderBlocks.tsx`
- Generated: `src/payload-types.ts`

**Interfaces:**

- Consumes the three block configs and render components.
- Produces generated About block interfaces.

- [ ] Register all three configs in the Pages layout field.
- [ ] Map all three renderers in RenderBlocks.
- [ ] Generate Payload types and confirm the block interfaces exist.

### Task 4: About route and active navigation

**Files:**

- Create: `src/app/(frontend)/about/page.tsx`
- Modify: `src/components/SiteHeader.tsx`

**Interfaces:**

- Produces `/about` route.
- Adds optional `activeHref?: string` to SiteHeader.

- [ ] Fetch the Pages record where `slug` equals `about`, using sufficient depth for Media.
- [ ] Render SiteHeader and RenderBlocks when found.
- [ ] Render the shared header plus a safe setup state when missing.
- [ ] Add active-link styling to SiteHeader and pass `activeHref="/about"` from the route.

### Task 5: Verification

**Files:**

- Verify all source files above and `src/payload-types.ts`.

**Interfaces:**

- Produces fresh evidence for completion.

- [ ] Format all modified source files.
- [ ] Run `pnpm generate:types`.
- [ ] Run `pnpm exec tsc --noEmit` and `git diff --check`.
- [ ] Run the existing integration suite without creating new tests.
- [ ] Run `pnpm build` and confirm `/about` appears in the route manifest.
- [ ] Inspect working-tree status and leave all changes uncommitted.
