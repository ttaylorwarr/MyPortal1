"use client";

import { useActionState, useState } from "react";
import { updateBookingAction, type EditBookingFormState } from "@/app/actions/booking";
import { formatDate, formatPrice } from "@/lib/format";
import { toDateInputValue } from "@/lib/week";

type Booking = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  keyCode: string;
  maxGuests: number;
  guestName: string;
  guestEmail: string;
  propertyTitle: string;
};

export default function BookingRow({ booking, returnTo }: { booking: Booking; returnTo: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState<EditBookingFormState, FormData>(
    updateBookingAction,
    undefined
  );

  if (editing) {
    return (
      <tr className="border-b border-slate-100 last:border-0 bg-blue-50/40">
        <td className="px-4 py-3" colSpan={5}>
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <div>
              <label className="block text-xs font-semibold text-slate-600">Check-in</label>
              <input
                type="date"
                name="checkIn"
                required
                defaultValue={toDateInputValue(booking.checkIn)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Check-out</label>
              <input
                type="date"
                name="checkOut"
                required
                defaultValue={toDateInputValue(booking.checkOut)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Guests</label>
              <input
                type="number"
                name="guests"
                min={1}
                max={booking.maxGuests}
                required
                defaultValue={booking.guests}
                className="mt-1 w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            {state?.error && (
              <p className="w-full text-sm text-red-600" role="alert">
                {state.error}
              </p>
            )}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">{booking.guestName}</p>
        <p className="text-xs text-slate-500">{booking.guestEmail}</p>
      </td>
      <td className="px-4 py-3 text-slate-600">{booking.propertyTitle}</td>
      <td className="px-4 py-3 text-slate-600">
        {formatDate(booking.checkIn)} &rarr; {formatDate(booking.checkOut)} &middot; {booking.guests}{" "}
        guest{booking.guests === 1 ? "" : "s"}
      </td>
      <td className="px-4 py-3 text-slate-600">{formatPrice(booking.totalPrice)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-600">{booking.keyCode}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
