import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePropertyAction } from "@/app/actions/admin";
import PropertyForm from "@/app/admin/listings/PropertyForm";
import DeleteButton from "@/app/admin/listings/DeleteButton";

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Edit listing</h2>
        <DeleteButton id={property.id} title={property.title} />
      </div>

      {saved && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Listing saved.
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PropertyForm
          action={updatePropertyAction}
          submitLabel="Save changes"
          defaults={{
            id: property.id,
            title: property.title,
            type: property.type,
            purpose: property.purpose,
            city: property.city,
            country: property.country,
            pricePerNight: property.pricePerNight,
            description: property.description,
            amenities: property.amenities,
            images: property.images,
            maxGuests: property.maxGuests,
            bedrooms: property.bedrooms,
            rating: property.rating,
            isAvailable: property.isAvailable,
          }}
        />
      </div>
    </div>
  );
}
