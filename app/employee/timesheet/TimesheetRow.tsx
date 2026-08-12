"use client";

import { useActionState, useState } from "react";
import { editTimeEntryAction, approveTimeEntryAction, type TimesheetFormState } from "@/app/actions/timesheet";
import { formatDateTime, formatDuration, toDateTimeLocalValue } from "@/lib/format";

type Entry = {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  needsApproval: boolean;
  userName?: string;
};

export default function TimesheetRow({
  entry,
  canApprove,
}: {
  entry: Entry;
  canApprove: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState<TimesheetFormState, FormData>(
    editTimeEntryAction,
    undefined
  );

  if (editing) {
    return (
      <tr className="border-b border-slate-100 last:border-0 bg-blue-50/40">
        <td className="px-4 py-3" colSpan={canApprove ? 5 : 4}>
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="entryId" value={entry.id} />
            <div>
              <label className="block text-xs font-semibold text-slate-600">Clock in</label>
              <input
                type="datetime-local"
                name="clockIn"
                required
                defaultValue={toDateTimeLocalValue(entry.clockIn)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Clock out</label>
              <input
                type="datetime-local"
                name="clockOut"
                defaultValue={entry.clockOut ? toDateTimeLocalValue(entry.clockOut) : ""}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      {entry.userName && <td className="px-4 py-3 text-slate-900">{entry.userName}</td>}
      <td className="px-4 py-3 text-slate-600">{formatDateTime(entry.clockIn)}</td>
      <td className="px-4 py-3 text-slate-600">
        {entry.clockOut ? formatDateTime(entry.clockOut) : "—"}
      </td>
      <td className="px-4 py-3 text-slate-600">
        {formatDuration((entry.clockOut ?? new Date()).getTime() - entry.clockIn.getTime())}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {entry.needsApproval ? (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              Pending approval
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              Approved
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Edit
          </button>
          {canApprove && entry.needsApproval && (
            <form action={approveTimeEntryAction}>
              <input type="hidden" name="entryId" value={entry.id} />
              <button type="submit" className="text-xs font-semibold text-green-700 hover:underline">
                Approve
              </button>
            </form>
          )}
        </div>
      </td>
    </tr>
  );
}
