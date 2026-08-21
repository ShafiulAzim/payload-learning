'use client'

import { useActionState, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

import { submitBooking } from '@/app/(frontend)/book-a-call/actions'
import type {
  BookingActionState,
  BookingField,
  BookingPropertyOption,
} from '@/app/(frontend)/book-a-call/types'

import { BookingSuccessModal } from './BookingSuccessModal'

type BookingFormProps = {
  properties: BookingPropertyOption[]
  selectedPropertyID?: number
  submissionToken: string
  minDate: string
}

const initialState: BookingActionState = { success: false }
const timeOptions = [
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
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full bg-[#b78a3d] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#9f742f] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Saving booking…' : 'Book a call'}
    </button>
  )
}

function FieldError({ field, state }: { field: BookingField; state: BookingActionState }) {
  const error = state.fieldErrors?.[field]
  return error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null
}

function FormSession({
  properties,
  selectedPropertyID,
  submissionToken,
  minDate,
  onComplete,
}: BookingFormProps & { onComplete: () => void }) {
  const [state, formAction] = useActionState(submitBooking, initialState)
  const inputClass =
    'mt-1.5 w-full rounded-sm border border-slate-200 bg-white px-3 py-3 text-sm text-[#0b2237] outline-none transition placeholder:text-slate-400 focus:border-[#b78a3d]'
  const labelClass = 'block text-[11px] font-semibold text-[#0b2237]'

  return (
    <>
      <form action={formAction} className="grid gap-5" noValidate>
        <input type="hidden" name="submissionToken" value={submissionToken} />
        <div
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Full name <span className="text-[#b78a3d]">*</span>
            <input
              name="fullName"
              autoComplete="name"
              maxLength={120}
              className={inputClass}
              placeholder="Enter your full name"
              required
            />
            <FieldError field="fullName" state={state} />
          </label>
          <label className={labelClass}>
            Email <span className="text-[#b78a3d]">*</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className={inputClass}
              placeholder="Enter your email"
              required
            />
            <FieldError field="email" state={state} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Phone number <span className="text-[#b78a3d]">*</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={32}
              className={inputClass}
              placeholder="Enter your phone number"
              required
            />
            <FieldError field="phone" state={state} />
          </label>
          <label className={labelClass}>
            Property <span className="text-[#b78a3d]">*</span>
            <select
              name="property"
              defaultValue={selectedPropertyID ? String(selectedPropertyID) : ''}
              className={inputClass}
              required
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} — {property.location}
                </option>
              ))}
            </select>
            <FieldError field="property" state={state} />
          </label>
        </div>

        <fieldset>
          <legend className={labelClass}>
            I&apos;m interested in <span className="text-[#b78a3d]">*</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
            {['buying', 'renting', 'selling', 'investment'].map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm capitalize text-slate-600"
              >
                <input
                  type="radio"
                  name="interestType"
                  value={value}
                  className="accent-[#b78a3d]"
                  required
                />
                {value}
              </label>
            ))}
          </div>
          <FieldError field="interestType" state={state} />
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Preferred date <span className="text-[#b78a3d]">*</span>
            <input name="preferredDate" type="date" min={minDate} className={inputClass} required />
            <FieldError field="preferredDate" state={state} />
          </label>
          <label className={labelClass}>
            Preferred time <span className="text-[#b78a3d]">*</span>
            <select name="preferredTime" defaultValue="" className={inputClass} required>
              <option value="">Select time</option>
              {timeOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError field="preferredTime" state={state} />
          </label>
        </div>

        <label className={labelClass}>
          Message <span className="font-normal text-slate-400">(optional)</span>
          <textarea
            name="message"
            rows={4}
            maxLength={1000}
            className={inputClass}
            placeholder="Tell us anything that will help us prepare"
          />
          <FieldError field="message" state={state} />
        </label>

        {state.message && !state.success ? (
          <p
            role="alert"
            aria-live="polite"
            className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.message}
          </p>
        ) : null}
        <SubmitButton />
      </form>

      {state.success && state.reference ? (
        <BookingSuccessModal reference={state.reference} onClose={onComplete} />
      ) : null}
    </>
  )
}

export function BookingForm(props: BookingFormProps) {
  const router = useRouter()
  const [submissionToken, setSubmissionToken] = useState(props.submissionToken)
  const handleComplete = useCallback(() => {
    setSubmissionToken(crypto.randomUUID())
    router.replace('/book-a-call', { scroll: false })
  }, [router])

  return (
    <FormSession
      key={submissionToken}
      {...props}
      submissionToken={submissionToken}
      onComplete={handleComplete}
    />
  )
}
