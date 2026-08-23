import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us | Homespire',
  description: 'Learn about Homespire Real Estate, our experience, and the values that guide us.',
}

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    pagination: false,
    limit: 1,
    where: { slug: { equals: 'about' } },
  })
  const page = result.docs[0]

  return (
    <>
      {page ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <section className="grid min-h-screen place-items-center bg-[#f8f7f4] px-5 pb-16 pt-32 text-center text-[#0b2237]">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
              About Homespire
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Our story is being prepared</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Create a Pages record with the slug “about” in Payload Admin and add the About Intro,
              Statistics Bar, and Core Values blocks.
            </p>
            <a
              href="/"
              className="mt-7 inline-flex bg-[#b78a3d] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#9f742f]"
            >
              Return home
            </a>
          </div>
        </section>
      )}
    </>
  )
}
