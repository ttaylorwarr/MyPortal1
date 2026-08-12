"use client";

import { useActionState } from "react";
import { createShiftAction, type ScheduleFormState } from "@/app/actions/schedule";

type StaffOption = { id: string; firstName: string; lastName: string };

export default function ShiftForm({
  weekDays,
  staff,
  returnTo,
}: {
  weekDays: { value: string; label: string }[];
  staff: StaffOption[] | null;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    createShiftAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="returnTo" value={returnTo} />

      {staff && (
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
      )}

      <div>
        <label htmlFor="date" className="block text-xs font-semibold text-slate-600">
          Day
        </label>
        <select
          id="date"
          name="date"
          required
          className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {weekDays.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
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

      {state?.error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
