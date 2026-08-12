import { requireEmployeeArea } from "@/lib/auth";
import { prisma } from "@/lib/db";
import BookingsTable from "@/app/components/BookingsTable";

export default async function EmployeeBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string }>;
}) {
  const [, { updated }] = await Promise.all([requireEmployeeArea(), searchParams]);

  const bookings = await prisma.booking.findMany({
    include: { user: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Bookings ({bookings.length})</h2>
      {updated && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Booking updated.
        </div>
      )}
      <div className="mt-4">
        <BookingsTable bookings={bookings} returnTo="/employee/bookings" />
      </div>
    </div>
  );
}
