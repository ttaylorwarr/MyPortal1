import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import KeyBadge from "@/app/components/KeyBadge";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string; saved?: string; passwordChanged?: string }>;
}) {
  const [user, { booked, saved, passwordChanged }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);
  if (!user) redirect("/login?next=/account");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My account</h1>
          <p className="mt-1 text-slate-600">
            {user.firstName} {user.lastName} &middot; @{user.username} &middot; {user.email}
          </p>
        </div>
        <Link
          href="/account/edit"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Edit account
        </Link>
      </div>

      {booked && (
        <div className="mt-6 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Booking confirmed! Your digital key is ready below.
        </div>
      )}
      {saved && (
        <div className="mt-6 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Account updated.
        </div>
      )}
      {passwordChanged && (
        <div className="mt-6 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Password changed.
        </div>
      )}

      <h2 className="mt-8 text-lg font-bold text-slate-900">Your bookings</h2>

      {bookings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          <p>You haven&apos;t booked a stay yet.</p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {bookings.map((booking) => {
            const coverImage = booking.property.images.split(",")[0];
            return (
              <div
                key={booking.id}
                className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row ${
                  booking.id === booked
                    ? "border-blue-400 bg-blue-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-auto sm:w-48">
                  <Image
                    src={coverImage}
                    alt={booking.property.title}
                    fill
                    sizes="(min-width: 640px) 192px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <Link
                      href={`/listings/${booking.property.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-700"
                    >
                      {booking.property.title}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {booking.property.city}, {booking.property.country}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {formatDate(booking.checkIn)} &rarr; {formatDate(booking.checkOut)} &middot;{" "}
                      {booking.guests} guest{booking.guests === 1 ? "" : "s"} &middot;{" "}
                      <span className="font-semibold">{formatPrice(booking.totalPrice)}</span>
                    </p>
                  </div>
                  <KeyBadge keyCode={booking.keyCode} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
