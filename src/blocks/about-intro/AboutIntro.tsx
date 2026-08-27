import Image from 'next/image'

import type { Media } from '@/payload-types'

type AboutIntroProps = {
  eyebrow?: string | null
  heading: string
  body: Array<{ text: string; id?: string | null }>
  image: number | Media
  cta?: { label?: string | null; href?: string | null } | null
  blockType?: 'about-intro'
}

export function AboutIntro({ eyebrow, heading, body, image, cta }: AboutIntroProps) {
  const media = typeof image === 'object' ? image : null

  return (
    <section className="bg-[#f8f7f4] px-5 pb-14 pt-32 text-[#0b2237] sm:px-8 lg:px-12 lg:pb-20 lg:pt-36">
      <div className="mx-auto grid max-w-[1376px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="py-4 lg:py-12">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <div className="mt-6 grid max-w-xl gap-4 text-sm leading-6 text-slate-600">
            {body.map((paragraph, index) => (
              <p key={paragraph.id || index}>{paragraph.text}</p>
            ))}
          </div>
          {cta?.label ? (
            <a
              href={cta.href || '#values'}
              className="mt-7 inline-flex items-center bg-[#b78a3d] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#9f742f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b78a3d]"
            >
              {cta.label}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </a>
          ) : null}
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-sm bg-slate-200 sm:min-h-[480px] lg:min-h-[590px]">
          {media?.url ? (
            <Image
              src={media.url}
              alt={media.alt || heading}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-100 to-slate-300 text-xs uppercase tracking-[0.15em] text-slate-500">
              About Homespire
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
