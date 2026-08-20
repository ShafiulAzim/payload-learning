import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { PropertyDetailsPage } from '@/components/property-details/PropertyDetailsPage'
import { toPropertyView } from '@/components/property-details/toPropertyView'
import { getPropertyByID } from '@/lib/properties/getPropertyByID'
import config from '@/payload.config'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const payload = await getPayload({ config })
  const property = await getPropertyByID(payload, id)

  if (!property) return {}

  return {
    title: property.seo?.title || property.name,
    description: property.seo?.description || property.summary || undefined,
  }
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload({ config })
  const property = await getPropertyByID(payload, id)

  if (!property) notFound()

  return <PropertyDetailsPage property={toPropertyView(property)} />
}
