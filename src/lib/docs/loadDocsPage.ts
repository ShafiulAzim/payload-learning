import { readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

import { extractHeadings } from './headings'
import { getAllDocsItems, getDocsItem } from './manifest'
import type { DocsFrontmatter, DocsPage } from './types'

function validateFrontmatter(value: Record<string, unknown>, file: string): DocsFrontmatter {
  if (typeof value.title !== 'string' || !value.title.trim()) {
    throw new Error(`Documentation file ${file} requires a non-empty title`)
  }
  if (typeof value.description !== 'string' || !value.description.trim()) {
    throw new Error(`Documentation file ${file} requires a non-empty description`)
  }
  return { title: value.title.trim(), description: value.description.trim() }
}

export async function loadDocsPage(slug: readonly string[]): Promise<DocsPage | null> {
  const item = getDocsItem(slug)
  if (!item) return null

  const filename = path.join(process.cwd(), 'docs', 'content', item.file)
  let source: string
  try {
    source = await readFile(filename, 'utf8')
  } catch {
    throw new Error(`Documentation file is missing: ${item.file}`)
  }

  const parsed = matter(source)
  const items = getAllDocsItems()
  const index = items.findIndex((candidate) => candidate.file === item.file)

  return {
    frontmatter: validateFrontmatter(parsed.data, item.file),
    slug: [...item.slug],
    content: parsed.content.trim(),
    headings: extractHeadings(parsed.content),
    item,
    previous: items[index - 1] || null,
    next: items[index + 1] || null,
  }
}
