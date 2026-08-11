import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import BookingForm from "./BookingForm";

const purposeLabel: Record<string, string> = {
  VACATION: "Vacation",
  WORK: "Work",
  BOTH: "Vacation & Work",
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, user] = await Promise.all([
    prisma.property.findUnique({ where: { id } }),
    getCurrentUser(),
  ]);

  if (!property) notFound();

  const images = property.images.split(",");
  const amenities = property.amenities.split(",");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
          <p className="mt-1 text-slate-600">
            {property.city}, {property.country} &middot; {property.type === "HOTEL" ? "Hotel" : "House"}{" "}
            &middot; {purposeLabel[property.purpose]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!property.isAvailable && (
            <span className="rounded-full bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600">
              Unavailable
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
            ★ {property.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 overflow-hidden rounded-2xl sm:grid-cols-4 sm:grid-rows-2">
        {images.slice(0, 4).map((src, i) => (
          <div
            key={src}
            className={`relative aspect-[4/3] bg-slate-100 ${
              i === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : ""
            }`}
          >
            <Image
              src={src}
              alt={`${property.title} photo ${i + 1}`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">About this place</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{property.description}</p>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Details</h2>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
            <li>🛏️ {property.bedrooms} bedroom{property.bedrooms === 1 ? "" : "s"}</li>
            <li>👥 Up to {property.maxGuests} guests</li>
            <li>🏷️ {property.type === "HOTEL" ? "Hotel" : "House"}</li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Amenities</h2>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
            {amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> {amenity}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="lg:sticky lg:top-24">
            <BookingForm
              propertyId={property.id}
              pricePerNight={property.pricePerNight}
              maxGuests={property.maxGuests}
              isLoggedIn={Boolean(user)}
              isAvailable={property.isAvailable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
