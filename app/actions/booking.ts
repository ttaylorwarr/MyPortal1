"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export type BookingFormState = { error?: string } | undefined;

function generateKeyCode() {
  const chunk = () => randomBytes(2).toString("hex").toUpperCase();
  return `KEY-${chunk()}-${chunk()}`;
}

const bookingSchema = z
  .object({
    propertyId: z.string().min(1),
    checkIn: z.string().min(1, "Choose a check-in date"),
    checkOut: z.string().min(1, "Choose a check-out date"),
    guests: z.coerce.number().int().min(1, "At least 1 guest"),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export async function createBookingAction(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please log in to book this stay." };
  }

  const parsed = bookingSchema.safeParse({
    propertyId: formData.get("propertyId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guests: formData.get("guests"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid booking details" };
  }

  const { propertyId, checkIn, checkOut, guests } = parsed.data;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    return { error: "This property no longer exists." };
  }

  if (guests > property.maxGuests) {
    return { error: `This stay sleeps up to ${property.maxGuests} guests.` };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (nights < 1) {
    return { error: "Stay must be at least 1 night." };
  }

  const totalPrice = nights * property.pricePerNight;

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      keyCode: generateKeyCode(),
    },
  });

  redirect(`/account?booked=${booking.id}`);
}
