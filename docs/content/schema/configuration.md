---
title: Payload configuration
description: A technical map of the top-level buildConfig options used here.
---

## The buildConfig contract

`buildConfig` accepts the complete Payload application definition. This project uses these important keys:

| Key | Current value and responsibility |
| --- | --- |
| `admin` | Uses `users`, configures the import map and page live-preview URL |
| `collections` | Registers seven database-backed document types |
| `globals` | Registers the singleton Site Settings document |
| `editor` | Uses the Lexical rich-text editor |
| `secret` | Signs security-sensitive Payload state |
| `typescript` | Writes generated types to `src/payload-types.ts` |
| `db` | Connects the `postgresAdapter` |
| `email` | Supplies the Nodemailer adapter |
| `sharp` | Enables image processing for uploads |
| `plugins` | Currently an empty array |

## Registration is behavior

Exporting a collection file is insufficient. A config becomes active only when it appears in `collections`, `globals`, or another registered config location. Registration makes its Admin views, database schema, APIs, and generated types available.

## Import aliases

Application modules normally import the source config as `@/payload.config`. Generated Payload integration files use `@payload-config`, which is configured by the project toolchain.

## How it connects

Collection config is detailed in [Fields and validation](/docs/schema/fields-and-validation). Runtime initialization is detailed in [Config and startup](/docs/foundations/config-and-startup).
