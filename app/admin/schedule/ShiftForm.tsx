"use client";

import { useState, useActionState } from "react";
import { createShiftAction, type ScheduleFormState } from "@/app/actions/schedule";

type StaffOption = { id: string; firstName: string; lastName: string };

export default function ShiftForm({
  staff,
  minDate,
  maxDate,
  returnTo,
}: {
  staff: StaffOption[];
  minDate: string;
  maxDate: string;
  returnTo: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    createShiftAction,
    undefined
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        + Add shift
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label htmlFor="userId" className="block text-xs font-semibold text-slate-600">
            Person
          </label>
          <select
            id="userId"
            name="userId"
            required
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {staff.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-xs font-semibold text-slate-600">
            Day
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={minDate}
            max={maxDate}
            defaultValue={minDate}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-xs font-semibold text-slate-600">
            Start
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            defaultValue="09:00"
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-xs font-semibold text-slate-600">
            End
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            defaultValue="17:00"
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add shift"}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
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
    </div>
  );
}
