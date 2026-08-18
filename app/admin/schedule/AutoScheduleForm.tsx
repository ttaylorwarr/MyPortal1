"use client";

import { useState, useActionState } from "react";
import { autoScheduleWeekAction, type ScheduleFormState } from "@/app/actions/schedule";

type StaffOption = { id: string; firstName: string; lastName: string };
type WeekOption = { value: string; label: string };

export default function AutoScheduleForm({
  staff,
  weeks,
  returnTo,
}: {
  staff: StaffOption[];
  weeks: WeekOption[];
  returnTo: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    autoScheduleWeekAction,
    undefined
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        ⚡ Auto-schedule 40h week
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">
        Fills Monday–Friday with 8-hour shifts for one person (40 hours total). Days that
        already have a shift for them are skipped.
      </p>
      <form action={formAction} className="mt-3 flex flex-wrap items-end gap-3">
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label htmlFor="autoUserId" className="block text-xs font-semibold text-slate-600">
            Person
          </label>
          <select
            id="autoUserId"
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
          <label htmlFor="weekStart" className="block text-xs font-semibold text-slate-600">
            Week
          </label>
          <select
            id="weekStart"
            name="weekStart"
            required
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {weeks.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="autoStartTime" className="block text-xs font-semibold text-slate-600">
            Start each day
          </label>
          <input
            id="autoStartTime"
            name="startTime"
            type="time"
            required
            defaultValue="09:00"
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Scheduling…" : "Auto-schedule"}
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
