import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocsShell } from '@/components/docs/DocsShell'
import { getAllDocsItems } from '@/lib/docs/manifest'
import { loadDocsPage } from '@/lib/docs/loadDocsPage'

type Props = { params: Promise<{ slug?: string[] }> }

export function generateStaticParams() {
  return getAllDocsItems().map((item) => ({ slug: [...item.slug] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const page = await loadDocsPage(slug)
  if (!page) return {}

  return {
    title: `${page.frontmatter.title} | Payload Docs`,
    description: page.frontmatter.description,
  }
}

export default async function DocsPage({ params }: Props) {
  const { slug = [] } = await params
  const page = await loadDocsPage(slug)
  if (!page) notFound()

  return <DocsShell page={page} />
}
