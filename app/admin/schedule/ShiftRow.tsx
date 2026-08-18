"use client";

import { useActionState, useState } from "react";
import { editShiftAction, deleteShiftAction, type ScheduleFormState } from "@/app/actions/schedule";
import { formatTimeString } from "@/lib/format";
import { toDateInputValue } from "@/lib/week";

type Shift = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
};

export default function ShiftRow({ shift, returnTo }: { shift: Shift; returnTo: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    editShiftAction,
    undefined
  );

  const listDateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (editing) {
    return (
      <li className="bg-blue-50/40 px-4 py-2.5 text-sm">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="shiftId" value={shift.id} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <div>
            <label className="block text-xs font-semibold text-slate-600">Day</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={toDateInputValue(shift.date)}
              className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Start</label>
            <input
              type="time"
              name="startTime"
              required
              defaultValue={shift.startTime}
              className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">End</label>
            <input
              type="time"
              name="endTime"
              required
              defaultValue={shift.endTime}
              className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          {state?.error && (
            <p className="w-full text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
      <div className="flex items-center gap-3">
        <span className="font-medium text-slate-900">{listDateFmt.format(shift.date)}</span>
        <span className="text-slate-600">
          {formatTimeString(shift.startTime)}–{formatTimeString(shift.endTime)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-blue-700 hover:underline"
        >
          Edit
        </button>
        <form action={deleteShiftAction}>
          <input type="hidden" name="shiftId" value={shift.id} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
            Remove
          </button>
        </form>
      </div>
    </li>
  );
}
