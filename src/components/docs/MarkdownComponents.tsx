import type { Components } from 'react-markdown'

import { headingID } from '@/lib/docs/headings'

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(textFromChildren).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return textFromChildren((children as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }
  return ''
}

export function createMarkdownComponents(): Components {
  const counts = new Map<string, number>()
  const idFor = (children: React.ReactNode) => {
    const base = headingID(textFromChildren(children)) || 'section'
    const count = (counts.get(base) || 0) + 1
    counts.set(base, count)
    return count === 1 ? base : `${base}-${count}`
  }

  return {
    h2: ({ children }) => <h2 id={idFor(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={idFor(children)}>{children}</h3>,
    a: ({ href = '', children, ...props }) => {
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          {...props}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
    pre: ({ children }) => <pre className="docs-code-block">{children}</pre>,
    table: ({ children }) => (
      <div className="docs-table-wrap">
        <table>{children}</table>
      </div>
    ),
  }
}
