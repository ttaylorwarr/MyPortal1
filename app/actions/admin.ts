"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type PropertyFormState = { error?: string } | undefined;

const propertySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.enum(["HOTEL", "HOUSE"]),
  purpose: z.enum(["VACATION", "WORK", "BOTH"]),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  description: z.string().trim().min(1, "Description is required"),
  amenities: z
    .string()
    .trim()
    .min(1, "List at least one amenity")
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",")
    ),
  images: z
    .string()
    .trim()
    .min(1, "List at least one image path or URL")
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",")
    ),
  maxGuests: z.coerce.number().int().min(1, "At least 1 guest"),
  bedrooms: z.coerce.number().int().min(0, "Bedrooms can't be negative"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
});

function parsePropertyForm(formData: FormData) {
  return propertySchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    purpose: formData.get("purpose"),
    city: formData.get("city"),
    country: formData.get("country"),
    pricePerNight: formData.get("pricePerNight"),
    description: formData.get("description"),
    amenities: formData.get("amenities"),
    images: formData.get("images"),
    maxGuests: formData.get("maxGuests"),
    bedrooms: formData.get("bedrooms"),
    rating: formData.get("rating"),
  });
}

export async function createPropertyAction(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin();

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const property = await prisma.property.create({ data: parsed.data });
  redirect(`/admin/listings/${property.id}?saved=1`);
}

export async function updatePropertyAction(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing listing id" };
  }

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.property.update({ where: { id }, data: parsed.data });
  redirect(`/admin/listings/${id}?saved=1`);
}

export async function deletePropertyAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  await prisma.booking.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });
  redirect("/admin/listings?deleted=1");
}
