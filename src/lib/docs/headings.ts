import type { DocsHeading } from './types'

export function headingID(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractHeadings(markdown: string): DocsHeading[] {
  const counts = new Map<string, number>()
  const headings: DocsHeading[] = []
  let insideFence = false

  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      insideFence = !insideFence
      continue
    }
    if (insideFence) continue

    const match = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const text = match[2].replace(/[`*_~]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim()
    const base = headingID(text) || 'section'
    const count = (counts.get(base) || 0) + 1
    counts.set(base, count)
    headings.push({ depth: match[1].length as 2 | 3, id: count === 1 ? base : `${base}-${count}`, text })
  }

  return headings
}
