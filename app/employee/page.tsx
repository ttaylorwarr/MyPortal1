import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getWeekStart, getWeekDays, formatWeekRange } from "@/lib/week";
import ScheduleCalendar from "@/app/components/ScheduleCalendar";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const [me, { week }] = await Promise.all([requireEmployeeArea(), searchParams]);

  const weekOffset = week ? Number(week) : 0;
  const weekStart = getWeekStart(new Date(), Number.isFinite(weekOffset) ? weekOffset : 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const days = getWeekDays(weekStart);

  const isManager = me.role === "ADMIN" || me.role === "MANAGER";

  const shifts = await prisma.shift.findMany({
    where: {
      date: { gte: weekStart, lt: weekEnd },
      ...(isManager ? {} : { userId: me.id }),
    },
    include: { user: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

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

      <p className="mt-2 text-sm text-slate-500">
        View only. {me.role === "ADMIN" ? "Add or edit shifts from the Admin menu." : "Ask an admin to add or change a shift."}
      </p>

      <div className="mt-6">
        <ScheduleCalendar days={days} shifts={shifts} showNames={isManager} />
      </div>
    </div>
  );
}
