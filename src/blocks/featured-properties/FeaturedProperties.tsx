import Image from 'next/image'

type MediaValue = { id: number | string; alt?: string | null; url?: string | null }
type Property = {
  id?: string | null
  image: MediaValue | number | string
  status: 'for-sale' | 'for-rent'
  name: string
  location: string
  price: string
}
type FeaturedPropertiesProps = {
  eyebrow?: string | null
  title: string
  cta?: { label?: string | null; href?: string | null } | null
  properties: Property[]
  blockType?: 'featured-properties'
}

export function FeaturedProperties({ eyebrow, title, cta, properties }: FeaturedPropertiesProps) {
  return (
    <section
      id="properties"
      className="bg-white px-5 py-14 text-[#0b2237] sm:px-8 lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1376px] gap-10 lg:grid-cols-[270px_1fr]">
        <header>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-4xl leading-tight lg:text-5xl">{title}</h2>
          {cta?.label ? (
            <a
              href={cta.href || '/properties'}
              className="mt-6 inline-flex border border-[#b78a3d] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-[#b78a3d] hover:text-white"
            >
              {cta.label}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </a>
          ) : null}
        </header>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {properties.map((property) => {
            const image = typeof property.image === 'object' ? property.image : null
            return (
              <article
                key={property.id || property.name}
                className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/2.45] bg-slate-100">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || property.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover"
                    />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-sm bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide">
                    {property.status === 'for-sale' ? 'For sale' : 'For rent'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base">{property.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">⌖ {property.location}</p>
                  <p className="mt-2 text-sm font-semibold text-[#b47f28]">{property.price}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
