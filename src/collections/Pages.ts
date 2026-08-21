import { AboutIntro } from '@/blocks/about-intro/config'
import { CoreValues } from '@/blocks/core-values/config'
import { FeaturedProperties } from '@/blocks/featured-properties/config'
import { HeroWithSearch } from '@/blocks/heros/config'
import { StatsBar } from '@/blocks/stats-bar/config'
import { TrustFeatures } from '@/blocks/trust-features/config'
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroWithSearch, TrustFeatures, FeaturedProperties, AboutIntro, StatsBar, CoreValues],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
