import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getWeekStart, getWeekDays, toDateInputValue, formatWeekRange } from "@/lib/week";
import { deleteShiftAction } from "@/app/actions/schedule";
import ShiftForm from "./ShiftForm";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; saved?: string; deleted?: string }>;
}) {
  const [me, { week, saved, deleted }] = await Promise.all([requireEmployeeArea(), searchParams]);

  const weekOffset = week ? Number(week) : 0;
  const weekStart = getWeekStart(new Date(), Number.isFinite(weekOffset) ? weekOffset : 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const days = getWeekDays(weekStart);

  const isManager = me.role === "ADMIN" || me.role === "MANAGER";

  const [shifts, staff] = await Promise.all([
    prisma.shift.findMany({
      where: {
        date: { gte: weekStart, lt: weekEnd },
        ...(isManager ? {} : { userId: me.id }),
      },
      include: { user: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    isManager
      ? prisma.user.findMany({
          where: { role: { in: ["ADMIN", "MANAGER", "EMPLOYEE"] } },
          orderBy: { firstName: "asc" },
          select: { id: true, firstName: true, lastName: true },
        })
      : Promise.resolve(null),
  ]);

  const currentPath = `/employee${weekOffset ? `?week=${weekOffset}` : ""}`;
  const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Schedule — {formatWeekRange(weekStart)}</h2>
        <div className="flex gap-2 text-sm font-medium">
          <a
            href={`/employee?week=${weekOffset - 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            &larr; Prev week
          </a>
          <a
            href="/employee"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            This week
          </a>
          <a
            href={`/employee?week=${weekOffset + 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Next week &rarr;
          </a>
        </div>
      </div>

      {saved && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Shift added.
        </div>
      )}
      {deleted && (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Shift removed.
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ShiftForm
          weekDays={days.map((d) => ({ value: toDateInputValue(d), label: dayFmt.format(d) }))}
          staff={staff}
          returnTo={currentPath}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => {
          const key = toDateInputValue(day);
          const dayShifts = shifts.filter((s) => toDateInputValue(s.date) === key);
          return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">{dayFmt.format(day)}</h3>
              {dayShifts.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">No shifts</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {dayShifts.map((shift) => {
                    const canDelete = isManager || shift.userId === me.id;
                    return (
                      <li
                        key={shift.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span>
                          <span className="font-medium text-slate-900">
                            {shift.startTime}–{shift.endTime}
                          </span>
                          {isManager && (
                            <span className="ml-2 text-slate-600">
                              {shift.user.firstName} {shift.user.lastName}
                            </span>
                          )}
                        </span>
                        {canDelete && (
                          <form action={deleteShiftAction}>
                            <input type="hidden" name="shiftId" value={shift.id} />
                            <input type="hidden" name="returnTo" value={currentPath} />
                            <button
                              type="submit"
                              className="text-xs font-semibold text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </form>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
