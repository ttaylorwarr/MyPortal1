import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import TimesheetRow from "./TimesheetRow";

export default async function TimesheetPage() {
  const me = await requireEmployeeArea();
  const isManager = me.role === "ADMIN" || me.role === "MANAGER";

  const entries = await prisma.timeClockEntry.findMany({
    where: isManager ? {} : { userId: me.id },
    include: { user: true },
    orderBy: { clockIn: "desc" },
    take: 100,
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Timesheet</h2>
      <p className="mt-1 text-sm text-slate-500">
        {isManager
          ? "Edits by you are auto-approved. Employee edits need your approval."
          : "Editing a past entry marks it pending until an admin or manager approves it."}
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {isManager && <th className="px-4 py-3">Employee</th>}
              <th className="px-4 py-3">Clock in</th>
              <th className="px-4 py-3">Clock out</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <TimesheetRow
                key={entry.id}
                canApprove={isManager}
                entry={{
                  id: entry.id,
                  clockIn: entry.clockIn,
                  clockOut: entry.clockOut,
                  needsApproval: entry.needsApproval,
                  userName: isManager ? `${entry.user.firstName} ${entry.user.lastName}` : undefined,
                }}
              />
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={isManager ? 5 : 4} className="px-4 py-8 text-center text-slate-500">
                  No time entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
