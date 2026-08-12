import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { user: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Bookings ({bookings.length})</h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Listing</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Key</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {booking.user.firstName} {booking.user.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{booking.user.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{booking.property.title}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(booking.checkIn)} &rarr; {formatDate(booking.checkOut)}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatPrice(booking.totalPrice)}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{booking.keyCode}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
