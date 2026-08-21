type ValueIcon = 'home' | 'excellence' | 'heart' | 'person' | 'shield' | 'handshake'

type CoreValuesProps = {
  eyebrow?: string | null
  heading: string
  items: Array<{ icon: ValueIcon; title: string; description: string; id?: string | null }>
  blockType?: 'core-values'
}

function Icon({ name }: { name: ValueIcon }) {
  const paths = {
    home: 'M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z',
    excellence:
      'm12 3 2.4 4.86L20 8.67l-4 3.9.94 5.5L12 15.5l-4.94 2.57.94-5.5-4-3.9 5.6-.81L12 3Z',
    heart:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z',
    person: 'M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4',
    handshake: 'm8 12 3 3a2 2 0 0 0 3 0l5-5M3 8l4-3 4 2m10 1-4-3-5 3-2-1-4 4-3-3',
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  )
}

export function CoreValues({ eyebrow, heading, items }: CoreValuesProps) {
  return (
    <section id="values" className="bg-white px-5 py-14 text-[#0b2237] sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1376px]">
        <header className="text-center">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b78a3d]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{heading}</h2>
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.id || `${item.title}-${index}`}
              className="border border-slate-200 bg-[#fbfaf7] px-6 py-7 text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center text-[#b78a3d]">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
