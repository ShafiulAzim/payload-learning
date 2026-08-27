---
title: Blogs collection
description: Published-content access, relationships, rich text, SEO, and slug hooks.
---

## Purpose and registration

`src/collections/Blogs.ts` declares `slug: 'blogs'`. The Admin list shows title, category, status, publication date, and update date.

## Public versus authenticated reads

Authenticated users receive `true` from read access. Anonymous requests receive a `Where` constraint requiring `status` equal to `published` and `publishedAt` less than or equal to the current time. Create, update, and delete require authentication.

This row-level constraint is applied only when the calling API enforces access. Public-facing Local API calls use `overrideAccess: false` deliberately.

## Fields and relationships

Title, slug, category, excerpt, featured image, rich-text content, status, and publication date are required. Category relates to `blog-categories`; featured image uploads to `media`. Status defaults to draft. The SEO group limits title to 70 and description to 170 characters.

## Slug generation

A `beforeValidate` hook uses `uniqueSlug` for new or still-automatic slugs while preserving manual customization. Slug is required, unique, and indexed for fast article lookup.

## Consumers

The listing queries categories at depth 0 and posts at depth 1. `getBlogBySlug` uses depth 2 and access enforcement. Article pages also query recent posts.

## How it connects

[Blog integration](/docs/integrations/blog) traces each query and transformation.
