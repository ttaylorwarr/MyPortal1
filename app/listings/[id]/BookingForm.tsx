"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createBookingAction, type BookingFormState } from "@/app/actions/booking";
import { formatPrice } from "@/lib/format";

type BookingFormProps = {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
  isLoggedIn: boolean;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm({
  propertyId,
  pricePerNight,
  maxGuests,
  isLoggedIn,
}: BookingFormProps) {
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    createBookingAction,
    undefined
  );
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const total = nights * pricePerNight;

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-bold text-slate-900">
          {formatPrice(pricePerNight)} <span className="text-sm font-normal text-slate-500">/ night</span>
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Log in to book this stay and get your digital key.
        </p>
        <Link
          href={`/login?next=/listings/${propertyId}`}
          className="mt-4 block w-full rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Log in to book
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="propertyId" value={propertyId} />
      <p className="text-lg font-bold text-slate-900">
        {formatPrice(pricePerNight)} <span className="text-sm font-normal text-slate-500">/ night</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="checkIn" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Check-in
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            min={todayISO()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="checkOut" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Check-out
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            required
            min={checkIn || todayISO()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="guests" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Guests
        </label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={1}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <p className="mt-1 text-xs text-slate-500">Sleeps up to {maxGuests} guests.</p>
      </div>

      {nights > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
          <span className="text-slate-600">
            {formatPrice(pricePerNight)} × {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span className="font-bold text-slate-900">{formatPrice(total)}</span>
        </div>
      )}

      {state?.error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? "Booking…" : "Book now & get key"}
      </button>
    </form>
  );
}
