import Link from "next/link";
import { requireStaff } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="hidden shrink-0 md:block md:w-48">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <nav className="mt-4 flex flex-col text-sm font-medium text-slate-700">
          <Link
            href="/admin"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Listings
          </Link>
          <Link
            href="/admin/bookings"
            className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
          >
            Bookings
          </Link>
          {user.role === "ADMIN" && (
            <Link
              href="/admin/schedule"
              className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
            >
              Schedule
            </Link>
          )}
          {user.role === "ADMIN" && (
            <Link
              href="/admin/users"
              className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-blue-700"
            >
              Users
            </Link>
          )}
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
