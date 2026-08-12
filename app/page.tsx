import { prisma } from "@/lib/db";
import PropertyCard from "@/app/components/PropertyCard";
import Filters from "@/app/components/Filters";
import type { Prisma } from "@/app/generated/prisma/client";

type SearchParams = {
  q?: string;
  purpose?: string;
  type?: string;
  maxPrice?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { q, purpose, type, maxPrice } = params;

  const where: Prisma.PropertyWhereInput = { isAvailable: true };

  if (q) {
    where.OR = [
      { city: { contains: q } },
      { country: { contains: q } },
      { title: { contains: q } },
    ];
  }
  if (purpose === "VACATION" || purpose === "WORK") {
    where.purpose = purpose === "VACATION" ? { in: ["VACATION", "BOTH"] } : { in: ["WORK", "BOTH"] };
  }
  if (type === "HOTEL" || type === "HOUSE") {
    where.type = type;
  }
  const maxPriceNumber = maxPrice ? Number(maxPrice) : undefined;
  if (maxPriceNumber && !Number.isNaN(maxPriceNumber)) {
    where.pricePerNight = { lte: maxPriceNumber };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Rent a hotel or home
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            See the price and pictures, book the stay you want, and find your digital key
            waiting in your account when you&apos;re ready to check in.
          </p>
          <div className="mt-6">
            <Filters q={q} purpose={purpose} type={type} maxPrice={maxPrice} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <p className="mb-4 text-sm text-slate-500">
          {properties.length} {properties.length === 1 ? "stay" : "stays"} found
        </p>
        {properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No stays match your search. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
