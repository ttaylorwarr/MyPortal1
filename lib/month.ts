import { getWeekStart } from "./week";

export function getMonthStart(date: Date, monthOffset = 0) {
  const d = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Weeks (Mon-Sun) needed to fully display the month, as an array of 7-day arrays. */
export function getMonthGridWeeks(monthStart: Date) {
  const lastDayOfMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const weeks: Date[][] = [];
  let weekStart = getWeekStart(monthStart, 0);

  do {
    weeks.push(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
      })
    );
    weekStart = new Date(weekStart);
    weekStart.setDate(weekStart.getDate() + 7);
  } while (weekStart <= lastDayOfMonth);

  return weeks;
}

export function formatMonthLabel(monthStart: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(monthStart);
}
