import { toDateInputValue } from "@/lib/week";
import { colorFor } from "@/lib/scheduleColors";
import { deleteShiftAction } from "@/app/actions/schedule";

type CalendarShift = {
  id: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  user: { firstName: string; lastName: string };
};

export default function ScheduleCalendar({
  weeks,
  monthIndex,
  shifts,
  showNames,
  editable = false,
  returnTo,
}: {
  weeks: Date[][];
  monthIndex: number;
  shifts: CalendarShift[];
  showNames: boolean;
  editable?: boolean;
  returnTo?: string;
}) {
  const dayNameFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const listDateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const todayKey = toDateInputValue(new Date());

  const monthShifts = shifts
    .filter((s) => s.date.getMonth() === monthIndex)
    .slice()
    .sort(
      (a, b) =>
        toDateInputValue(a.date).localeCompare(toDateInputValue(b.date)) ||
        a.startTime.localeCompare(b.startTime),
    );

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid min-w-[770px] grid-cols-7">
          {weeks[0].map((day) => (
            <div
              key={toDateInputValue(day)}
              className="border-b border-l border-slate-200 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 first:border-l-0"
            >
              {dayNameFmt.format(day)}
            </div>
          ))}

          {weeks.map((week) =>
            week.map((day) => {
              const key = toDateInputValue(day);
              const isToday = key === todayKey;
              const inMonth = day.getMonth() === monthIndex;
              const dayShifts = shifts.filter(
                (s) => toDateInputValue(s.date) === key,
              );
              return (
                <div
                  key={key}
                  className={`min-h-[110px] space-y-1 border-b border-l border-slate-200 p-1.5 first:border-l-0 ${
                    isToday ? "bg-blue-50/60" : !inMonth ? "bg-slate-50" : ""
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isToday
                        ? "text-blue-700"
                        : inMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {dateFmt.format(day)}
                  </p>
                  {dayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`rounded-md border px-1.5 py-1 text-[11px] leading-tight ${colorFor(shift.userId)} ${
                        inMonth ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold">
                          {shift.startTime}–{shift.endTime}
                        </span>
                        {editable && returnTo && (
                          <form action={deleteShiftAction}>
                            <input
                              type="hidden"
                              name="shiftId"
                              value={shift.id}
                            />
                            <input
                              type="hidden"
                              name="returnTo"
                              value={returnTo}
                            />
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
                      {showNames && (
                        <p className="mt-0.5 truncate">
                          {shift.user.firstName} {shift.user.lastName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
          Shifts this month
        </h3>
        {monthShifts.length === 0 ? (
          <p className="px-4 py-4 text-sm text-slate-400">
            No shifts scheduled.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {monthShifts.map((shift) => (
              <li
                key={shift.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${colorFor(shift.userId).split(" ")[0]}`}
                  />
                  <span className="font-medium text-slate-900">
                    {listDateFmt.format(shift.date)}
                  </span>
                  <span className="text-slate-600">
                    {shift.startTime}–{shift.endTime}
                  </span>
                  {showNames && (
                    <span className="text-slate-500">
                      {shift.user.firstName} {shift.user.lastName}
                    </span>
                  )}
                </div>
                {editable && returnTo && (
                  <form action={deleteShiftAction}>
                    <input type="hidden" name="shiftId" value={shift.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
