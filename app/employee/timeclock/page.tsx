import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime, formatDuration } from "@/lib/format";
import { clockInAction, clockOutAction } from "@/app/actions/timeclock";

export default async function TimeClockPage() {
  const me = await requireEmployeeArea();

  const [openEntry, recentEntries] = await Promise.all([
    prisma.timeClockEntry.findFirst({ where: { userId: me.id, clockOut: null } }),
    prisma.timeClockEntry.findMany({
      where: { userId: me.id },
      orderBy: { clockIn: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Time Clock</h2>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {openEntry ? (
          <>
            <p className="text-sm text-slate-600">
              Clocked in since <span className="font-semibold">{formatDateTime(openEntry.clockIn)}</span>
            </p>
            <form action={clockOutAction} className="mt-3">
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Clock out
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">You&apos;re not clocked in.</p>
            <form action={clockInAction} className="mt-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clock in
              </button>
            </form>
          </>
        )}
      </div>

      <h3 className="mt-8 text-sm font-semibold text-slate-900">Recent entries</h3>
      <div className="mt-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Clock in</th>
              <th className="px-4 py-3">Clock out</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-600">{formatDateTime(entry.clockIn)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {entry.clockOut ? formatDateTime(entry.clockOut) : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDuration((entry.clockOut ?? new Date()).getTime() - entry.clockIn.getTime())}
                </td>
                <td className="px-4 py-3">
                  {entry.needsApproval ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      Pending approval
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Approved
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {recentEntries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
