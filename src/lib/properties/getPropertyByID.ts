import type { BasePayload } from 'payload'

import type { Property } from '@/payload-types'

export async function getPropertyByID(payload: BasePayload, id: string): Promise<Property | null> {
  const propertyID = Number(id)

  if (!Number.isSafeInteger(propertyID) || propertyID <= 0) return null

  try {
    return await payload.findByID({
      collection: 'properties',
      id: propertyID,
      depth: 2,
    })
  } catch {
    return null
  }
}
