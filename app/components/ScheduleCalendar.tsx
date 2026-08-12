import { toDateInputValue } from "@/lib/week";
import { deleteShiftAction } from "@/app/actions/schedule";

const palette = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-rose-100 text-rose-800 border-rose-200",
];

function colorFor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) % palette.length;
  return palette[hash];
}

type CalendarShift = {
  id: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  user: { firstName: string; lastName: string };
};

export default function ScheduleCalendar({
  days,
  shifts,
  showNames,
  editable = false,
  returnTo,
}: {
  days: Date[];
  shifts: CalendarShift[];
  showNames: boolean;
  editable?: boolean;
  returnTo?: string;
}) {
  const dayNameFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const todayKey = toDateInputValue(new Date());

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              {dayShifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`rounded-lg border px-2 py-1.5 text-xs leading-tight ${colorFor(shift.userId)}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold">
                      {shift.startTime}–{shift.endTime}
                    </span>
                    {editable && returnTo && (
                      <form action={deleteShiftAction}>
                        <input type="hidden" name="shiftId" value={shift.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
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
        })}
      </div>
    </div>
  );
}
