type StatIcon = 'key' | 'building' | 'clients' | 'award'

type StatsBarProps = {
  items: Array<{ value: string; label: string; icon: StatIcon; id?: string | null }>
  blockType?: 'stats-bar'
}

function Icon({ name }: { name: StatIcon }) {
  const paths = {
    key: 'M15 7a5 5 0 1 1-2 4l-8 8H2v-3l8-8a5 5 0 0 1 5-1Zm-8 8 2 2',
    building: 'M4 21V7l8-4 8 4v14M8 9h1m3 0h1m3 0h1M8 13h1m3 0h1m3 0h1M9 21v-4h6v4',
    clients:
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-1-7.26a4 4 0 0 1 0 7.75',
    award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-4 0-1 7 5-3 5 3-1-7',
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10"
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

export function StatsBar({ items }: StatsBarProps) {
  return (
    <section
      className="bg-[#082238] px-5 text-white sm:px-8 lg:px-12"
      aria-label="Company statistics"
    >
      <div className="mx-auto grid max-w-[1376px] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.id || `${item.label}-${index}`}
            className="flex items-center justify-center gap-5 border-white/15 px-6 py-8 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0 lg:py-10"
          >
            <span className="text-[#c89a4c]">
              <Icon name={item.icon} />
            </span>
            <div>
              <strong className="font-serif text-3xl font-normal sm:text-4xl">{item.value}</strong>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.1em] text-slate-300">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
