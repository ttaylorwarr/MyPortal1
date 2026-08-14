import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMonthStart, getMonthGridWeeks, formatMonthLabel } from "@/lib/month";
import { businessNow } from "@/lib/now";
import ScheduleCalendar from "@/app/components/ScheduleCalendar";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const [me, { month }] = await Promise.all([requireEmployeeArea(), searchParams]);

  const monthOffset = month ? Number(month) : 0;
  const monthStart = getMonthStart(businessNow(), Number.isFinite(monthOffset) ? monthOffset : 0);
  const weeks = getMonthGridWeeks(monthStart);
  const rangeStart = weeks[0][0];
  const rangeEnd = new Date(weeks[weeks.length - 1][6]);
  rangeEnd.setDate(rangeEnd.getDate() + 1);

  const isManager = me.role === "ADMIN" || me.role === "MANAGER";

  const shifts = await prisma.shift.findMany({
    where: {
      date: { gte: rangeStart, lt: rangeEnd },
      ...(isManager ? {} : { userId: me.id }),
    },
    include: { user: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Schedule — {formatMonthLabel(monthStart)}</h2>
        <div className="flex gap-2 text-sm font-medium">
          <a
            href={`/employee?month=${monthOffset - 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            &larr; Prev
          </a>
          <a
            href="/employee"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            This month
          </a>
          <a
            href={`/employee?month=${monthOffset + 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Next &rarr;
          </a>
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        View only. {me.role === "ADMIN" ? "Add or edit shifts from the Admin menu." : "Ask an admin to add or change a shift."}
      </p>

      <div className="mt-6">
        <ScheduleCalendar
          weeks={weeks}
          monthIndex={monthStart.getMonth()}
          shifts={shifts}
          showNames={isManager}
        />
      </div>
    </div>
  );
}
