'use client'

import { useEffect, useRef } from 'react'

type BookingSuccessModalProps = {
  reference: string
  onClose: () => void
}

export function BookingSuccessModal({ reference, onClose }: BookingSuccessModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#061827]/70 p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-success-title"
        aria-describedby="booking-success-description"
        className="relative w-full max-w-md rounded-xl bg-white px-7 py-10 text-center text-[#0b2237] shadow-2xl sm:px-10"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close booking confirmation"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-xl text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[#b78a3d] text-3xl text-[#b78a3d]"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2 id="booking-success-title" className="mt-6 font-serif text-3xl">
          Booking received
        </h2>
        <p id="booking-success-description" className="mt-3 text-sm leading-6 text-slate-600">
          Thank you. Our property team will contact you soon to confirm your appointment.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-400">
          Reference <strong className="text-[#0b2237]">{reference}</strong>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 bg-[#b78a3d] px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#9f742f]"
        >
          Close
        </button>
      </div>
    </div>
  )
}
