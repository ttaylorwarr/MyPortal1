import BookingRow from "./BookingRow";

type BookingWithRelations = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  keyCode: string;
  user: { firstName: string; lastName: string; email: string };
  property: { title: string; maxGuests: number };
};

export default function BookingsTable({
  bookings,
  returnTo,
}: {
  bookings: BookingWithRelations[];
  returnTo: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
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
            <BookingRow
              key={booking.id}
              returnTo={returnTo}
              booking={{
                id: booking.id,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                keyCode: booking.keyCode,
                maxGuests: booking.property.maxGuests,
                guestName: `${booking.user.firstName} ${booking.user.lastName}`,
                guestEmail: booking.user.email,
                propertyTitle: booking.property.title,
              }}
            />
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
  );
}
