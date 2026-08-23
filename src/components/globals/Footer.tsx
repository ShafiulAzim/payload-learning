'use client'

import Image from 'next/image'

import { useGlobals } from './GlobalsProvider'

const externalLinkProps = (href: string) =>
  href.startsWith('http') ? { target: '_blank' as const, rel: 'noreferrer' } : {}

export function Footer() {
  const { brand, footer } = useGlobals()
  const hasContact = footer.contact.email || footer.contact.phone || footer.contact.address

  return (
    <footer className="bg-[#071d31] px-5 pb-7 pt-14 text-white sm:px-8 lg:px-12 lg:pt-16">
      <div className="mx-auto max-w-[1376px]">
        <div className="grid gap-10 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <a
              href="/"
              className="inline-flex items-center gap-3"
              aria-label={`${brand.name} home`}
            >
              {brand.logo ? (
                <Image
                  src={brand.logo.url}
                  alt={brand.logo.alt}
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              ) : (
                <svg
                  aria-hidden="true"
                  className="h-10 w-10 text-[#c89a4c]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 22.5 24 6l19 16.5M9 19v23h11V29h8v13h11V19" />
                  <path d="M14 15v27" />
                </svg>
              )}
              <span>
                <strong className="block text-lg tracking-[0.25em]">{brand.name}</strong>
                {brand.tagline ? (
                  <span className="block text-[8px] tracking-[0.45em] text-slate-400">
                    {brand.tagline}
                  </span>
                ) : null}
              </span>
            </a>
            {footer.description ? (
              <p className="mt-5 text-sm leading-6 text-slate-300">{footer.description}</p>
            ) : null}
            {footer.socialLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {footer.socialLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    {...externalLinkProps(link.href)}
                    className="rounded border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-slate-300 hover:border-[#c89a4c] hover:text-[#c89a4c]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {footer.linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c89a4c]">
                {group.title}
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-slate-300">
                {group.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      {...externalLinkProps(link.href)}
                      className="hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasContact ? (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c89a4c]">
                Contact
              </h2>
              <address className="mt-4 grid gap-3 text-sm not-italic leading-6 text-slate-300">
                {footer.contact.address ? <span>{footer.contact.address}</span> : null}
                {footer.contact.email ? (
                  <a href={`mailto:${footer.contact.email}`} className="hover:text-white">
                    {footer.contact.email}
                  </a>
                ) : null}
                {footer.contact.phone ? (
                  <a
                    href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}
                    className="hover:text-white"
                  >
                    {footer.contact.phone}
                  </a>
                ) : null}
              </address>
            </div>
          ) : null}
        </div>
        <p className="pt-7 text-center text-xs text-slate-400">{footer.copyright}</p>
      </div>
    </footer>
  )
}
