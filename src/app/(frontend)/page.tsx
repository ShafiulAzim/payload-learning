import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function Page({ params: paramPromise }: Args) {
  const { slug = 'home' } = await paramPromise
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    pagination: false,
    page: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs[0]
  if (!page) notFound()

  return (
    <>
      <SiteHeader />
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
