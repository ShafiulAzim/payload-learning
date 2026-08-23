export type GlobalLink = {
  label: string
  href: string
}

export type GlobalBrand = {
  name: string
  tagline?: string
  logo?: { url: string; alt: string }
}

export type HeaderSettings = {
  links: GlobalLink[]
  cta: GlobalLink
}

export type FooterSettings = {
  description?: string
  linkGroups: Array<{ title: string; links: GlobalLink[] }>
  contact: { email?: string; phone?: string; address?: string }
  socialLinks: GlobalLink[]
  copyright: string
}

export type VisibilityRule = {
  pathname: string
  match: 'exact' | 'starts-with'
  hideHeader: boolean
  hideFooter: boolean
}

export type SiteGlobals = {
  brand: GlobalBrand
  header: HeaderSettings
  footer: FooterSettings
  visibilityRules: VisibilityRule[]
}
