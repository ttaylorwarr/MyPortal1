import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getWeekStart, getWeekDays, toDateInputValue, formatWeekRange } from "@/lib/week";
import ScheduleCalendar from "@/app/components/ScheduleCalendar";
import ShiftForm from "./ShiftForm";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; saved?: string; deleted?: string }>;
}) {
  const [, { week, saved, deleted }] = await Promise.all([requireAdmin(), searchParams]);

  const weekOffset = week ? Number(week) : 0;
  const weekStart = getWeekStart(new Date(), Number.isFinite(weekOffset) ? weekOffset : 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const days = getWeekDays(weekStart);

  const [shifts, staff] = await Promise.all([
    prisma.shift.findMany({
      where: { date: { gte: weekStart, lt: weekEnd } },
      include: { user: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "MANAGER", "EMPLOYEE"] } },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  const currentPath = `/admin/schedule${weekOffset ? `?week=${weekOffset}` : ""}`;
  const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Schedule — {formatWeekRange(weekStart)}</h2>
        <div className="flex gap-2 text-sm font-medium">
          <a
            href={`/admin/schedule?week=${weekOffset - 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            &larr; Prev week
          </a>
          <a
            href="/admin/schedule"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            This week
          </a>
          <a
            href={`/admin/schedule?week=${weekOffset + 1}`}
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

      <div className="mt-6">
        <ScheduleCalendar days={days} shifts={shifts} showNames editable returnTo={currentPath} />
      </div>
    </div>
  );
}
