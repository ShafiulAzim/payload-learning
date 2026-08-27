import Link from 'next/link'

import { docsGroups, docsHref } from '@/lib/docs/manifest'

export function DocsSidebar({ currentSlug }: { currentSlug: readonly string[] }) {
  const current = currentSlug.join('/')

  return (
    <nav aria-label="Documentation" className="docs-sidebar-nav">
      {docsGroups.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => {
              const active = item.slug.join('/') === current
              return (
                <li key={item.file}>
                  <Link href={docsHref(item)} aria-current={active ? 'page' : undefined}>
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}
