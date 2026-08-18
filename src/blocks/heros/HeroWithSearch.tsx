import Image from 'next/image'

type MediaValue = { id: number | string; alt?: string | null; url?: string | null }
type SearchOption = { id?: string | null; label: string; value?: string | null }
type Search = {
  action?: string | null
  locationLabel?: string | null
  locationPlaceholder?: string | null
  typeLabel?: string | null
  types?: SearchOption[] | null
  priceLabel?: string | null
  prices?: SearchOption[] | null
  buttonLabel?: string | null
}
type HeroWithSearchProps = {
  eyebrow?: string | null
  title: string
  description?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  backgroundImage?: MediaValue | number | string | null
  search?: Search | null
  blockType?: 'hero-with-search'
}

export function HeroWithSearch({
  eyebrow,
  title,
  description,
  cta,
  backgroundImage,
  search,
}: HeroWithSearchProps) {
  const media = typeof backgroundImage === 'object' ? backgroundImage : null
  const propertyTypes = search?.types?.length ? search.types : []
  const priceRanges = search?.prices?.length ? search.prices : []
  return (
    <section className="relative isolate min-h-[670px] overflow-visible bg-[#09243a] text-white lg:min-h-[720px]">
      {media?.url ? (
        <Image
          src={media.url}
          alt={media.alt || ''}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061d2f]/95 via-[#061d2f]/60 to-[#061d2f]/15" />
      <div className="mx-auto flex min-h-[670px] max-w-[1440px] items-center px-5 pb-36 pt-32 sm:px-8 lg:min-h-[720px] lg:px-12 lg:pb-32 lg:pt-40 xl:px-16">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#d6a54b] sm:text-sm">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-5xl leading-[1.04] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              {description}
            </p>
          ) : null}
          {cta?.label ? (
            <a
              href={cta.href || '#properties'}
              className="mt-7 inline-flex items-center gap-3 bg-[#c99a43] px-7 py-4 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#b88934]"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
      <form
        action={search?.action || '/properties'}
        className="absolute inset-x-5 bottom-0 z-10 grid translate-y-1/2 overflow-hidden rounded-xl bg-white p-4 text-[#0a2135] shadow-[0_14px_35px_rgba(6,29,47,0.18)] sm:inset-x-8 md:grid-cols-[1fr_1fr_1fr_auto] md:p-5 lg:inset-x-12 xl:inset-x-[max(4rem,calc((100%-1312px)/2))]"
      >
        <label className="flex flex-col gap-1 border-b border-slate-200 px-3 py-2 md:border-b-0 md:border-r md:px-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em]">
            {search?.locationLabel || 'Location'}
          </span>
          <input
            name="location"
            className="min-w-0 bg-transparent text-sm text-slate-600 outline-none"
            placeholder={search?.locationPlaceholder || 'Enter location'}
          />
        </label>
        <label className="flex flex-col gap-1 border-b border-slate-200 px-3 py-2 md:border-b-0 md:border-r md:px-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em]">
            {search?.typeLabel || 'Property type'}
          </span>
          <select
            name="type"
            className="min-w-0 bg-transparent text-sm text-slate-500 outline-none"
          >
            {propertyTypes.map((option) => (
              <option
                key={option.id || `${option.label}-${option.value}`}
                value={option.value || ''}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 px-3 py-2 md:px-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em]">
            {search?.priceLabel || 'Price range'}
          </span>
          <select
            name="price"
            className="min-w-0 bg-transparent text-sm text-slate-500 outline-none"
          >
            {priceRanges.map((option) => (
              <option
                key={option.id || `${option.label}-${option.value}`}
                value={option.value || ''}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="mt-3 bg-[#09243a] px-7 py-4 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#123b59] md:mt-0"
        >
          {search?.buttonLabel || 'Search properties'}
        </button>
      </form>
    </section>
  )
}
