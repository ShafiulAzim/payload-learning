import type { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: { read: () => true },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'price', 'location', 'updatedAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'For sale', value: 'for-sale' },
        { label: 'For rent', value: 'for-rent' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'House', value: 'house' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Villa', value: 'villa' },
        { label: 'Land', value: 'land' },
        { label: 'Commercial', value: 'commercial' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'location', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'richText', required: true },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      maxRows: 20,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'bedrooms', type: 'number', min: 0 },
    { name: 'bathrooms', type: 'number', min: 0 },
    { name: 'area', type: 'number', min: 0, admin: { description: 'Square feet' } },
    { name: 'parking', type: 'number', min: 0 },
    { name: 'features', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'amenities', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    {
      name: 'listing',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'verified', type: 'checkbox', defaultValue: false },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
