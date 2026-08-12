import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { togglePropertyAvailabilityAction } from "@/app/actions/admin";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const [properties, { deleted }] = await Promise.all([
    prisma.property.findMany({ orderBy: { createdAt: "desc" } }),
    searchParams,
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Listings ({properties.length})</h2>
        <Link
          href="/admin/listings/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add a listing
        </Link>
      </div>

      {deleted && (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Listing deleted.
        </div>
      )}

      {properties.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
          No listings yet.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const coverImage = property.images.split(",")[0];
            return (
              <div
                key={property.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={coverImage}
                    alt={property.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {property.type === "HOTEL" ? (
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 9V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5h2V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9zM5 5v11h3v-2h2v2h2V9h-2v2H8V5H5zm9 3v8h2V8h-2z" />
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2 2 8v10a1 1 0 0 0 1 1h5v-6h4v6h5a1 1 0 0 0 1-1V8l-8-6z" />
                      </svg>
                    )}
                    {property.type === "HOTEL" ? "Hotel" : "House"}
                  </span>
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                      property.isAvailable
                        ? "bg-green-600/95 text-white"
                        : "bg-slate-600/90 text-white"
                    }`}
                  >
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-semibold text-slate-900">{property.title}</h3>
                  <p className="flex items-center gap-1 text-sm text-slate-500">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-slate-400">
                      <path
                        fillRule="evenodd"
                        d="M10 18s6-5.686 6-10a6 6 0 1 0-12 0c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property.city}, {property.country}
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 text-slate-400">
                      <path d="M11.3 1.3a1 1 0 0 0-1.4 0l-8.6 8.6a1 1 0 0 0 0 1.4l7.4 7.4a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4l-7.4-7.4zM6 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                    </svg>
                    <span className="font-bold text-slate-900">{formatPrice(property.pricePerNight)}</span>
                    <span className="text-slate-500">/ night</span>
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <form action={togglePropertyAvailabilityAction} className="flex-1">
                      <input type="hidden" name="id" value={property.id} />
                      <button
                        type="submit"
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {property.isAvailable ? "Mark unavailable" : "Mark available"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/listings/${property.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
