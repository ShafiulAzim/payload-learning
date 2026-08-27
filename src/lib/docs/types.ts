export type DocsFrontmatter = {
  title: string
  description: string
}

export type DocsItem = {
  title: string
  description: string
  slug: readonly string[]
  file: string
}

export type DocsGroup = {
  title: string
  items: readonly DocsItem[]
}

export type DocsHeading = {
  depth: 2 | 3
  id: string
  text: string
}

export type DocsPage = {
  frontmatter: DocsFrontmatter
  slug: string[]
  content: string
  headings: DocsHeading[]
  item: DocsItem
  previous: DocsItem | null
  next: DocsItem | null
}
