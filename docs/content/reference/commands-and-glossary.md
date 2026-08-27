---
title: Commands and glossary
description: Project commands, environment names, API endpoints, and Payload terminology.
---

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js and Payload development runtime |
| `pnpm build` | Create a production build |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate Payload Admin imports |
| `pnpm lint` | Run ESLint |
| `pnpm run test:int` | Run Vitest integration tests |
| `pnpm run test:e2e` | Run Playwright tests |

## Environment variable names

Payload uses `DATABASE_URL`, `PAYLOAD_SECRET`, `MAIL_SMTP_HOST`, `MAIL_SMTP_PORT`, `MAIL_SMTP_USER`, and `MAIL_SMTP_PASS`. Store values outside Git and never place secrets in documentation.

## Endpoint map

| Endpoint | Interface |
| --- | --- |
| `/admin` | Payload Admin UI |
| `/api/{collection}` | REST collection operations |
| `/api/globals/{slug}` | REST Global operations |
| `/api/graphql` | GraphQL |
| `/api/graphql-playground` | GraphQL Playground |

## Glossary

**Collection:** Repeating documents with a shared schema. **Global:** One singleton document. **Field:** A typed schema value. **Block:** A discriminated reusable field layout. **Local API:** In-process server methods. **Access:** Authorization function or row constraint. **Hook:** Lifecycle function around operations. **Depth:** Relationship population level. **Adapter:** Integration for database or email behavior. **Generated type:** TypeScript output derived from Payload config.

## How it connects

Start at [Payload architecture](/docs/foundations/architecture) when a term needs its full repository context.
