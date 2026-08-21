import { AboutIntro } from './about-intro/AboutIntro'
import { CoreValues } from './core-values/CoreValues'
import { FeaturedProperties } from './featured-properties/FeaturedProperties'
import { HeroWithSearch } from './heros/HeroWithSearch'
import { StatsBar } from './stats-bar/StatsBar'
import { TrustFeatures } from './trust-features/TrustFeatures'

type BlockRecord = { blockType: string; id?: string | null }
type BlockComponent = React.ComponentType<any>

const blockComponents: Record<string, BlockComponent> = {
  'hero-with-search': HeroWithSearch,
  'trust-features': TrustFeatures,
  'featured-properties': FeaturedProperties,
  'about-intro': AboutIntro,
  'stats-bar': StatsBar,
  'core-values': CoreValues,
}

export function RenderBlocks<T extends BlockRecord>({ blocks }: { blocks?: T[] | null }) {
  if (!blocks?.length) return null

  return blocks.map((block, index) => {
    const Component = blockComponents[block.blockType]
    if (!Component) return null
    return <Component key={block.id || `${block.blockType}-${index}`} {...block} />
  })
}
