'use client'

import { usePathname } from 'next/navigation'

import { Footer } from './Footer'
import { Header } from './Header'
import { useGlobals } from './GlobalsProvider'

const normalizePath = (value: string) => {
  if (!value) return '/'
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash !== '/' ? withLeadingSlash.replace(/\/+$/, '') : '/'
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname())
  const { visibilityRules } = useGlobals()
  const rule = visibilityRules
    .filter((candidate) => {
      const rulePath = normalizePath(candidate.pathname)
      return candidate.match === 'exact'
        ? pathname === rulePath
        : rulePath === '/' || pathname === rulePath || pathname.startsWith(rulePath + '/')
    })
    .sort(
      (left, right) => normalizePath(right.pathname).length - normalizePath(left.pathname).length,
    )[0]

  return (
    <>
      {!rule?.hideHeader ? <Header /> : null}
      <main>{children}</main>
      {!rule?.hideFooter ? <Footer /> : null}
    </>
  )
}
