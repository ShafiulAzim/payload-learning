import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { docsHref } from '@/lib/docs/manifest'
import type { DocsPage } from '@/lib/docs/types'

import { createMarkdownComponents } from './MarkdownComponents'

export function DocsArticle({ page }: { page: DocsPage }) {
  return (
    <>
      <main id="docs-content" className="docs-main" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="docs-breadcrumbs">
          <Link href="/docs">Docs</Link>
          {page.slug.length ? <span aria-hidden="true">/</span> : null}
          {page.slug.length ? <span>{page.frontmatter.title}</span> : null}
        </nav>

        <article className="docs-article">
          <header className="docs-article-header">
            <p>Payload CMS technical guide</p>
            <h1>{page.frontmatter.title}</h1>
            <p>{page.frontmatter.description}</p>
          </header>
          <div className="docs-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents()}>
              {page.content}
            </ReactMarkdown>
          </div>
        </article>

        <nav aria-label="Documentation pages" className="docs-pager">
          <div>
            {page.previous ? (
              <Link href={docsHref(page.previous)}>Previous: {page.previous.title}</Link>
            ) : null}
          </div>
          <div>
            {page.next ? <Link href={docsHref(page.next)}>Next: {page.next.title}</Link> : null}
          </div>
        </nav>
      </main>

      <aside className="docs-toc" aria-label="On this page">
        <p>On this page</p>
        <ol>
          {page.headings.map((heading) => (
            <li key={heading.id} data-depth={heading.depth}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </aside>
    </>
  )
}
