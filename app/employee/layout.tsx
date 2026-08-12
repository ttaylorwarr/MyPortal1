import Link from "next/link";
import { requireEmployeeArea } from "@/lib/auth";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireEmployeeArea();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="hidden shrink-0 md:block md:w-48">
        <h1 className="text-2xl font-bold text-slate-900">Employee</h1>
        <nav className="mt-4 flex flex-col text-sm font-medium text-slate-700">
          <Link
            href="/employee"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Schedule
          </Link>
          <Link
            href="/employee/timeclock"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Time Clock
          </Link>
          <Link
            href="/employee/timesheet"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Timesheet
          </Link>
          <div className="my-2 hidden border-t border-slate-200 md:block" />
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Back to site
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
