export const propertyTypeOptions = [
  { label: 'All types', value: '' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Land', value: 'land' },
  { label: 'Commercial', value: 'commercial' },
] as const

export const propertyPriceOptions = [
  { label: 'Any price', value: '' },
  { label: 'Up to ৳500,000', value: '500000' },
  { label: 'Up to ৳1,000,000', value: '1000000' },
  { label: 'Up to ৳2,500,000', value: '2500000' },
  { label: 'Up to ৳5,000,000', value: '5000000' },
] as const

export type PropertySearchFilters = {
  location?: string
  type?: string
  price?: string
}

export const isPropertyType = (value: string) =>
  propertyTypeOptions.some((option) => option.value !== '' && option.value === value)
