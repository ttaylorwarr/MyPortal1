import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [listingCount, bookingCount, userCount, revenue] = await Promise.all([
    prisma.property.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.booking.aggregate({ _sum: { totalPrice: true } }),
  ]);

  const stats = [
    { label: "Listings", value: listingCount, href: "/admin/listings" },
    { label: "Bookings", value: bookingCount, href: "/admin/bookings" },
    { label: "Users", value: userCount },
    { label: "Total booked revenue", value: formatPrice(revenue._sum.totalPrice ?? 0) },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block hover:opacity-80">
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/listings/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add a listing
        </Link>
        <Link
          href="/admin/listings"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Manage listings
        </Link>
      </div>
    </div>
  );
}
