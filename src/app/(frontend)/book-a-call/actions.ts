'use server'

import { randomUUID } from 'crypto'
import { getPayload } from 'payload'

import config from '@/payload.config'

import { appointmentTimes, type BookingActionState, interestTypes } from './types'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+()\d\s.-]{7,32}$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function valueOf(formData: FormData, field: string, maxLength: number) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim().slice(0, maxLength + 1) : ''
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export async function submitBooking(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  if (valueOf(formData, 'website', 200)) {
    return { success: false, message: 'Unable to submit your request. Please try again.' }
  }

  const fullName = valueOf(formData, 'fullName', 120)
  const email = valueOf(formData, 'email', 254).toLowerCase()
  const phone = valueOf(formData, 'phone', 32)
  const propertyValue = valueOf(formData, 'property', 20)
  const interestType = valueOf(formData, 'interestType', 20)
  const preferredDate = valueOf(formData, 'preferredDate', 10)
  const preferredTime = valueOf(formData, 'preferredTime', 5)
  const message = valueOf(formData, 'message', 1000)
  const submissionToken = valueOf(formData, 'submissionToken', 36)
  const propertyID = Number(propertyValue)
  const fieldErrors: NonNullable<BookingActionState['fieldErrors']> = {}

  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = 'Enter your full name.'
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }
  if (!phonePattern.test(phone)) {
    fieldErrors.phone = 'Enter a valid phone number.'
  }
  if (!Number.isSafeInteger(propertyID) || propertyID <= 0) {
    fieldErrors.property = 'Select a property.'
  }
  if (!interestTypes.includes(interestType as (typeof interestTypes)[number])) {
    fieldErrors.interestType = 'Select what you are interested in.'
  }
  const today = new Date().toISOString().slice(0, 10)
  if (!isValidDate(preferredDate) || preferredDate < today) {
    fieldErrors.preferredDate = 'Choose today or a future date.'
  }
  if (!appointmentTimes.includes(preferredTime as (typeof appointmentTimes)[number])) {
    fieldErrors.preferredTime = 'Select a preferred time.'
  }
  if (message.length > 1000) {
    fieldErrors.message = 'Keep your message under 1,000 characters.'
  }
  if (!uuidPattern.test(submissionToken)) {
    return { success: false, message: 'Your form session expired. Refresh and try again.' }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors, message: 'Please correct the highlighted fields.' }
  }

  const payload = await getPayload({ config })
  const findExisting = async () => {
    const existing = await payload.find({
      collection: 'bookings',
      overrideAccess: true,
      pagination: false,
      limit: 1,
      where: { submissionToken: { equals: submissionToken } },
    })
    return existing.docs[0] || null
  }

  try {
    const existing = await findExisting()
    if (existing) return { success: true, reference: existing.reference }

    try {
      await payload.findByID({
        collection: 'properties',
        id: propertyID,
        depth: 0,
        overrideAccess: true,
      })
    } catch {
      return {
        success: false,
        fieldErrors: { property: 'This property is no longer available.' },
        message: 'Please select another property.',
      }
    }

    const booking = await payload.create({
      collection: 'bookings',
      overrideAccess: true,
      data: {
        reference: 'BK-' + randomUUID().slice(0, 8).toUpperCase(),
        fullName,
        email,
        phone,
        property: propertyID,
        interestType: interestType as (typeof interestTypes)[number],
        preferredDate: `${preferredDate}T00:00:00.000Z`,
        preferredTime: preferredTime as (typeof appointmentTimes)[number],
        message: message || undefined,
        submissionToken,
        status: 'new',
      },
    })

    return { success: true, reference: booking.reference }
  } catch (error) {
    try {
      const existing = await findExisting()
      if (existing) return { success: true, reference: existing.reference }
    } catch {
      // The generic failure below safely covers lookup and database errors.
    }

    console.error('Booking submission failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return {
      success: false,
      message: 'We could not save your booking. Please try again in a moment.',
    }
  }
}
