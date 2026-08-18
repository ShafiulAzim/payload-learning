'use client'

import { useState } from 'react'

type NavItem = { label: string; href: string }
type SiteHeaderProps = { links?: NavItem[]; callHref?: string }
const defaultLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Properties', href: '#properties' },
  { label: 'Blog', href: '/blog' },
]

export function SiteHeader({
  links = defaultLinks,
  callHref = 'tel:+10000000000',
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1376px] items-center justify-between rounded-b-xl bg-white px-5 py-4 text-[#071d31] shadow-sm sm:px-8 lg:px-10">
        <a href="/" aria-label="Homespire home" className="flex items-center gap-3">
          <svg
            aria-hidden="true"
            className="h-10 w-10 text-[#b78a3d]"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M5 22.5 24 6l19 16.5M9 19v23h11V29h8v13h11V19" />
            <path d="M14 15v27" />
          </svg>
          <span>
            <span className="block text-lg font-bold tracking-[0.34em] sm:text-xl">HOMESPIRE</span>
            <span className="block text-[8px] tracking-[0.55em] text-slate-500 sm:text-[9px]">
              REAL ESTATE
            </span>
          </span>
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="primary-menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="rounded p-2 lg:hidden"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
        <nav
          id="primary-menu"
          aria-label="Primary navigation"
          className={`${open ? 'flex' : 'hidden'} absolute left-4 right-4 top-[82px] flex-col gap-5 rounded-xl bg-white p-6 shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-9 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.08em] hover:text-[#b78a3d]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={callHref}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#09243a] px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-white"
          >
            <span aria-hidden="true">☎</span> Book a call
          </a>
        </nav>
      </div>
    </header>
  )
}
