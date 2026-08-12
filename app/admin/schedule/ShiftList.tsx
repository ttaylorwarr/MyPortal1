import { toDateInputValue } from "@/lib/week";
import { colorFor } from "@/lib/scheduleColors";
import { deleteShiftAction } from "@/app/actions/schedule";

type Shift = {
  id: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  user: { firstName: string; lastName: string };
};

export default function ShiftList({ shifts, returnTo }: { shifts: Shift[]; returnTo: string }) {
  const listDateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const sorted = shifts.slice().sort((a, b) => {
    const nameA = `${a.user.firstName} ${a.user.lastName}`;
    const nameB = `${b.user.firstName} ${b.user.lastName}`;
    return (
      nameA.localeCompare(nameB) ||
      toDateInputValue(a.date).localeCompare(toDateInputValue(b.date)) ||
      a.startTime.localeCompare(b.startTime)
    );
  });

  const groups: { name: string; userId: string; shifts: Shift[] }[] = [];
  for (const shift of sorted) {
    const name = `${shift.user.firstName} ${shift.user.lastName}`;
    const last = groups[groups.length - 1];
    if (last && last.name === name) {
      last.shifts.push(shift);
    } else {
      groups.push({ name, userId: shift.userId, shifts: [shift] });
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {groups.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-400">No shifts scheduled.</p>
      ) : (
        <div className="divide-y divide-slate-200">
          {groups.map((group) => (
            <div key={group.userId}>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2">
                <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${colorFor(group.userId).split(" ")[0]}`} />
                <span className="text-sm font-semibold text-slate-900">{group.name}</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {group.shifts.map((shift) => (
                  <li key={shift.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">{listDateFmt.format(shift.date)}</span>
                      <span className="text-slate-600">
                        {shift.startTime}–{shift.endTime}
                      </span>
                    </div>
                    <form action={deleteShiftAction}>
                      <input type="hidden" name="shiftId" value={shift.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Remove
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
