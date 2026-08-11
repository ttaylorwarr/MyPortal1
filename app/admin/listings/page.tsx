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

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price / night</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{property.title}</td>
                <td className="px-4 py-3 text-slate-600">
                  {property.city}, {property.country}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {property.type === "HOTEL" ? "Hotel" : "House"}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatPrice(property.pricePerNight)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      property.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form action={togglePropertyAvailabilityAction}>
                      <input type="hidden" name="id" value={property.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {property.isAvailable ? "Mark unavailable" : "Mark available"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/listings/${property.id}`}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
