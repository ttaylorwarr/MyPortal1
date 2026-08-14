import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toDateInputValue } from "@/lib/week";
import { getMonthStart, formatMonthLabel } from "@/lib/month";
import { businessNow } from "@/lib/now";
import ShiftForm from "./ShiftForm";
import ShiftList from "./ShiftList";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; saved?: string; deleted?: string }>;
}) {
  const [, { month, saved, deleted }] = await Promise.all([requireAdmin(), searchParams]);

  const monthOffset = month ? Number(month) : 0;
  const monthStart = getMonthStart(businessNow(), Number.isFinite(monthOffset) ? monthOffset : 0);
  const nextMonthStart = getMonthStart(businessNow(), (Number.isFinite(monthOffset) ? monthOffset : 0) + 1);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

  const [shifts, staff] = await Promise.all([
    prisma.shift.findMany({
      where: { date: { gte: monthStart, lt: nextMonthStart } },
      include: { user: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "MANAGER", "EMPLOYEE"] } },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  const currentPath = `/admin/schedule${monthOffset ? `?month=${monthOffset}` : ""}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">
          Manager Schedule — {formatMonthLabel(monthStart)}
        </h2>
        <div className="flex gap-2 text-sm font-medium">
          <a
            href={`/admin/schedule?month=${monthOffset - 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            &larr; Prev
          </a>
          <a
            href="/admin/schedule"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            This month
          </a>
          <a
            href={`/admin/schedule?month=${monthOffset + 1}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Next &rarr;
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

      <div className="mt-6">
        <ShiftForm
          staff={staff}
          minDate={toDateInputValue(monthStart)}
          maxDate={toDateInputValue(monthEnd)}
          returnTo={currentPath}
        />
      </div>

      <div className="mt-6">
        <ShiftList shifts={shifts} returnTo={currentPath} />
      </div>
    </div>
  );
}
