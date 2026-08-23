'use client'

import { createContext, useContext } from 'react'

import type { SiteGlobals } from './types'

const GlobalsContext = createContext<SiteGlobals | null>(null)

export function GlobalsProvider({
  value,
  children,
}: {
  value: SiteGlobals
  children: React.ReactNode
}) {
  return <GlobalsContext.Provider value={value}>{children}</GlobalsContext.Provider>
}

export function useGlobals() {
  const context = useContext(GlobalsContext)
  if (!context) throw new Error('useGlobals must be used inside GlobalsProvider')
  return context
}
