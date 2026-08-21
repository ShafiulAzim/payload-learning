import { randomUUID } from 'crypto'
import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

const appointmentTimes = [
  ['09:00', '9:00 AM'],
  ['09:30', '9:30 AM'],
  ['10:00', '10:00 AM'],
  ['10:30', '10:30 AM'],
  ['11:00', '11:00 AM'],
  ['11:30', '11:30 AM'],
  ['12:00', '12:00 PM'],
  ['12:30', '12:30 PM'],
  ['13:00', '1:00 PM'],
  ['13:30', '1:30 PM'],
  ['14:00', '2:00 PM'],
  ['14:30', '2:30 PM'],
  ['15:00', '3:00 PM'],
  ['15:30', '3:30 PM'],
  ['16:00', '4:00 PM'],
  ['16:30', '4:30 PM'],
  ['17:00', '5:00 PM'],
].map(([value, label]) => ({ label, value }))

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'fullName', 'property', 'preferredDate', 'status', 'createdAt'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        return {
          ...data,
          reference: data.reference || `BK-${randomUUID().slice(0, 8).toUpperCase()}`,
          submissionToken: data.submissionToken || randomUUID(),
        }
      },
    ],
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true },
    {
      name: 'submissionToken',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    { name: 'fullName', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true, maxLength: 32 },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      index: true,
    },
    {
      name: 'interestType',
      type: 'select',
      required: true,
      options: [
        { label: 'Buying', value: 'buying' },
        { label: 'Renting', value: 'renting' },
        { label: 'Selling', value: 'selling' },
        { label: 'Investment', value: 'investment' },
      ],
    },
    {
      name: 'preferredDate',
      type: 'date',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    { name: 'preferredTime', type: 'select', required: true, options: appointmentTimes },
    { name: 'message', type: 'textarea', maxLength: 1000 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
}
