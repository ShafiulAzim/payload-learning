import React from 'react'

import { GlobalsProvider } from '@/components/globals/GlobalsProvider'
import { SiteChrome } from '@/components/globals/SiteChrome'
import { getSiteSettings } from '@/globals/getSiteSettings'

import '../global.css'

export const metadata = {
  description: 'Find your next property with Homespire Real Estate.',
  title: 'Homespire Real Estate',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const globals = await getSiteSettings()

  return (
    <html lang="en" className="h-screen bg-[#f8f8f8]">
      <body>
        <GlobalsProvider value={globals}>
          <SiteChrome>{children}</SiteChrome>
        </GlobalsProvider>
      </body>
    </html>
  )
}
