import { FeaturedProperties } from './featured-properties/FeaturedProperties'
import { HeroWithSearch } from './heros/HeroWithSearch'
import { TrustFeatures } from './trust-features/TrustFeatures'

type BlockRecord = { blockType: string; id?: string | null }
type BlockComponent = React.ComponentType<any>

const blockComponents: Record<string, BlockComponent> = {
  'hero-with-search': HeroWithSearch,
  'trust-features': TrustFeatures,
  'featured-properties': FeaturedProperties,
}

export function RenderBlocks<T extends BlockRecord>({ blocks }: { blocks?: T[] | null }) {
  if (!blocks?.length) return null

  return blocks.map((block, index) => {
    const Component = blockComponents[block.blockType]
    if (!Component) return null
    return <Component key={block.id || `${block.blockType}-${index}`} {...block} />
  })
}
