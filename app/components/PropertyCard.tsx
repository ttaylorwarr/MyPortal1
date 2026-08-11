import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type PropertyCardProps = {
  id: string;
  title: string;
  type: string;
  purpose: string;
  city: string;
  country: string;
  pricePerNight: number;
  images: string;
  rating: number;
};

const purposeLabel: Record<string, string> = {
  VACATION: "Vacation",
  WORK: "Work",
  BOTH: "Vacation & Work",
};

export default function PropertyCard({
  id,
  title,
  type,
  purpose,
  city,
  country,
  pricePerNight,
  images,
  rating,
}: PropertyCardProps) {
  const coverImage = images.split(",")[0];

  return (
    <Link
      href={`/listings/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {type === "HOTEL" ? "Hotel" : "House"}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-teal-600/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {purposeLabel[purpose] ?? purpose}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">{title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-slate-600">
            ★ {rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {city}, {country}
        </p>
        <p className="mt-2 text-sm">
          <span className="font-bold text-slate-900">{formatPrice(pricePerNight)}</span>{" "}
          <span className="text-slate-500">/ night</span>
        </p>
      </div>
    </Link>
  );
}
