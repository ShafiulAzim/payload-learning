import { getPayload } from 'payload'

import type { Media, SiteSetting } from '@/payload-types'
import config from '@/payload.config'

import type { SiteGlobals } from '@/components/globals/types'

const fallbackSettings: SiteGlobals = {
  brand: { name: 'HOMESPIRE', tagline: 'REAL ESTATE' },
  header: {
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Properties', href: '/properties' },
      { label: 'Blog', href: '/blog' },
    ],
    cta: { label: 'Book a call', href: '/book-a-call' },
  },
  footer: {
    description: 'Helping you find a place you will love to call home.',
    linkGroups: [
      {
        title: 'Explore',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Properties', href: '/properties' },
          { label: 'Book a call', href: '/book-a-call' },
        ],
      },
    ],
    contact: {},
    socialLinks: [],
    copyright: '© Homespire Real Estate. All rights reserved.',
  },
  visibilityRules: [],
}

const populatedMedia = (value: SiteSetting['logo']): value is Media =>
  typeof value === 'object' && value !== null

export async function getSiteSettings(): Promise<SiteGlobals> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    const logo =
      populatedMedia(settings.logo) && settings.logo.url
        ? { url: settings.logo.url, alt: settings.logo.alt || settings.siteName }
        : undefined

    return {
      brand: {
        name: settings.siteName || fallbackSettings.brand.name,
        tagline: settings.tagline || undefined,
        logo,
      },
      header: {
        links: settings.header?.links?.length
          ? settings.header.links.map(({ label, href }) => ({ label, href }))
          : fallbackSettings.header.links,
        cta: {
          label: settings.header?.cta?.label || fallbackSettings.header.cta.label,
          href: settings.header?.cta?.href || fallbackSettings.header.cta.href,
        },
      },
      footer: {
        description: settings.footer?.description || undefined,
        linkGroups: (settings.footer?.linkGroups || []).map((group) => ({
          title: group.title,
          links: group.links.map(({ label, href }) => ({ label, href })),
        })),
        contact: {
          email: settings.footer?.contact?.email || undefined,
          phone: settings.footer?.contact?.phone || undefined,
          address: settings.footer?.contact?.address || undefined,
        },
        socialLinks: (settings.footer?.socialLinks || []).map(({ label, href }) => ({
          label,
          href,
        })),
        copyright: settings.footer?.copyright || fallbackSettings.footer.copyright,
      },
      visibilityRules: (settings.visibilityRules || []).map((rule) => ({
        pathname: rule.pathname,
        match: rule.match,
        hideHeader: Boolean(rule.hideHeader),
        hideFooter: Boolean(rule.hideFooter),
      })),
    }
  } catch (error) {
    console.error('Unable to load site settings', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return fallbackSettings
  }
}
