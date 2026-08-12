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
  const dayNameFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const todayKey = toDateInputValue(new Date());

  const palette = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-rose-100 text-rose-800 border-rose-200",
  ];
  const colorFor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) % palette.length;
    return palette[hash];
  };

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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid min-w-[770px] grid-cols-7">
          {days.map((day) => {
            const key = toDateInputValue(day);
            const isToday = key === todayKey;
            return (
              <div
                key={key}
                className={`border-b border-l border-slate-200 px-2 py-3 text-center first:border-l-0 ${
                  isToday ? "bg-blue-50" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {dayNameFmt.format(day)}
                </p>
                <p className={`text-sm font-bold ${isToday ? "text-blue-700" : "text-slate-900"}`}>
                  {day.getDate()}
                </p>
              </div>
            );
          })}

          {days.map((day) => {
            const key = toDateInputValue(day);
            const isToday = key === todayKey;
            const dayShifts = shifts.filter((s) => toDateInputValue(s.date) === key);
            return (
              <div
                key={key}
                className={`min-h-[140px] space-y-1.5 border-l border-slate-200 p-2 first:border-l-0 ${
                  isToday ? "bg-blue-50/50" : ""
                }`}
              >
                {dayShifts.map((shift) => {
                  const canDelete = isManager || shift.userId === me.id;
                  return (
                    <div
                      key={shift.id}
                      className={`group rounded-lg border px-2 py-1.5 text-xs leading-tight ${colorFor(shift.userId)}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold">
                          {shift.startTime}–{shift.endTime}
                        </span>
                        {canDelete && (
                          <form action={deleteShiftAction}>
                            <input type="hidden" name="shiftId" value={shift.id} />
                            <input type="hidden" name="returnTo" value={currentPath} />
                            <button
                              type="submit"
                              aria-label="Remove shift"
                              className="leading-none opacity-60 hover:opacity-100"
                            >
                              ✕
                            </button>
                          </form>
                        )}
                      </div>
                      {isManager && (
                        <p className="mt-0.5 truncate">
                          {shift.user.firstName} {shift.user.lastName}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
