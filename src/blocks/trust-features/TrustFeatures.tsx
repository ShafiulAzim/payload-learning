type TrustItem = {
  id?: string | null
  icon: 'home' | 'award' | 'handshake' | 'shield'
  title: string
  description: string
}
type TrustFeaturesProps = { items: TrustItem[]; blockType?: 'trust-features' }

function FeatureIcon({ name }: { name: TrustItem['icon'] }) {
  const paths = {
    home: <path d="M4 11.5 12 4l8 7.5V21h-6v-6h-4v6H4z" />,
    award: (
      <path d="M12 3 14 5l3-.3.3 3L20 10l-2 2 .3 3-3 .3L12 18l-2-2.7-3-.3.3-3-2-2 2.7-2.3.3-3 3 .3L12 3Zm-4 14-1 5 5-2 5 2-1-5" />
    ),
    handshake: (
      <path d="m3 12 4-4 4 2 2-1 3 3m-9-1 5 5m-3-6 6 6m-4-8 6 6m-2 2 2 2 4-4-7-7-3 1-3-2-5 5" />
    ),
    shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-12 w-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

export function TrustFeatures({ items }: TrustFeaturesProps) {
  return (
    <section
      aria-label="Why choose us"
      className="bg-[#fbfaf8] px-5 pb-8 pt-24 text-[#0b2237] sm:px-8 lg:px-12 lg:pb-9 lg:pt-20"
    >
      <div className="mx-auto grid max-w-[1376px] gap-7 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.id || item.title}
            className={`flex gap-5 xl:px-7 ${index > 0 ? 'xl:border-l xl:border-slate-200' : ''}`}
          >
            <div className="shrink-0 text-[#b78a3d]">
              <FeatureIcon name={item.icon} />
            </div>
            <div>
              <h2 className="font-serif text-base">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
