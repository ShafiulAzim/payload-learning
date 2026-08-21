export const interestTypes = ['buying', 'renting', 'selling', 'investment'] as const
export const appointmentTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
] as const

export type BookingField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'property'
  | 'interestType'
  | 'preferredDate'
  | 'preferredTime'
  | 'message'

export type BookingActionState = {
  success: boolean
  reference?: string
  message?: string
  fieldErrors?: Partial<Record<BookingField, string>>
}

export type BookingPropertyOption = {
  id: number
  name: string
  location: string
}
