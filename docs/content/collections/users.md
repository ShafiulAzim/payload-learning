---
title: Users collection
description: The authentication collection used by Payload Admin.
---

## Purpose and registration

`src/collections/Users.ts` declares `slug: 'users'`, sets `auth: true`, and uses email as the Admin title. Payload adds authentication fields and operations even though the local `fields` array is empty.

## Authentication behavior

With `auth: true`, Payload supplies email/password authentication, sessions/tokens, login operations, and the document fields required by its auth system. These generated auth fields should not be redeclared casually.

`src/payload.config.ts` sets `admin.user: Users.slug`, so only documents from this collection can authenticate to the Admin UI.

## Access implications

Several schemas use `Boolean(req.user)` to permit authenticated writes. In this application, `req.user` is normally a Users document established by Payload authentication.

The collection does not currently define roles. Authentication means “logged in”; it does not distinguish editor and administrator privileges.

## API behavior

Payload generates auth-specific REST and Local API operations in addition to normal collection operations. Do not expose credentials in documentation, fixtures, or browser code.

## How it connects

[Access control](/docs/operations/access-control) explains how `req.user` affects Blogs, Blog Categories, Bookings, and Site Settings.
