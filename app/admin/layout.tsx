import Link from "next/link";
import { requireStaff } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <nav className="flex gap-4 text-sm font-medium text-slate-700">
          <Link href="/admin" className="hover:text-blue-700">
            Dashboard
          </Link>
          <Link href="/admin/listings" className="hover:text-blue-700">
            Listings
          </Link>
          <Link href="/admin/bookings" className="hover:text-blue-700">
            Bookings
          </Link>
          {user.role === "ADMIN" && (
            <Link href="/admin/users" className="hover:text-blue-700">
              Users
            </Link>
          )}
          <Link href="/" className="hover:text-blue-700">
            Back to site
          </Link>
        </nav>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
