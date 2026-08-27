import type { DocsPage } from '@/lib/docs/types'

import { DocsArticle } from './DocsArticle'
import { DocsSidebar } from './DocsSidebar'

export function DocsShell({ page }: { page: DocsPage }) {
  return (
    <section className="docs-page">
      <a className="docs-skip-link" href="#docs-content">
        Skip to documentation
      </a>
      <div className="docs-mobile-nav">
        <details>
          <summary>Browse documentation</summary>
          <DocsSidebar currentSlug={page.slug} />
        </details>
      </div>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <DocsSidebar currentSlug={page.slug} />
        </aside>
        <DocsArticle page={page} />
      </div>
    </section>
  )
}
