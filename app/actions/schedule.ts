"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type ScheduleFormState = { error?: string } | undefined;

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:MM format");

const returnToSchema = z
  .string()
  .optional()
  .transform((val) => (val && val.startsWith("/admin") ? val : "/admin/schedule"));

const shiftSchema = z
  .object({
    userId: z.string().min(1, "Choose a person"),
    date: z.string().min(1, "Choose a date"),
    startTime: timeSchema,
    endTime: timeSchema,
    returnTo: returnToSchema,
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export async function createShiftAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  await requireAdmin();

  const parsed = shiftSchema.safeParse({
    userId: formData.get("userId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    returnTo: formData.get("returnTo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.shift.create({
    data: {
      userId: parsed.data.userId,
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
  });

  redirect(`${parsed.data.returnTo}?saved=1`);
}

const autoScheduleSchema = z.object({
  userId: z.string().min(1, "Choose a person"),
  weekStart: z.string().min(1, "Choose a week"),
  startTime: timeSchema,
  returnTo: returnToSchema,
});

/** Adds whole hours to an "HH:MM" time, clamped to 23:59 (shifts don't cross midnight). */
function addHours(time: string, hours: number) {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + hours * 60, 23 * 60 + 59);
  const endHour = Math.floor(total / 60);
  const endMinute = total % 60;
  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}

/** Fills Mon-Fri of the given week with 8-hour shifts (40 hours) for one person, skipping any day they already have a shift. */
export async function autoScheduleWeekAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  await requireAdmin();

  const parsed = autoScheduleSchema.safeParse({
    userId: formData.get("userId"),
    weekStart: formData.get("weekStart"),
    startTime: formData.get("startTime"),
    returnTo: formData.get("returnTo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { userId, weekStart, startTime, returnTo } = parsed.data;
  const endTime = addHours(startTime, 8);
  if (endTime <= startTime) {
    return { error: "Start time is too late to fit an 8-hour shift in the same day" };
  }

  const monday = new Date(weekStart);
  const weekdays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const weekEnd = new Date(monday);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const existing = await prisma.shift.findMany({
    where: { userId, date: { gte: monday, lt: weekEnd } },
    select: { date: true },
  });
  const existingKeys = new Set(existing.map((s) => s.date.toISOString().slice(0, 10)));

  const toCreate = weekdays.filter((d) => !existingKeys.has(d.toISOString().slice(0, 10)));

  if (toCreate.length > 0) {
    await prisma.shift.createMany({
      data: toCreate.map((date) => ({ userId, date, startTime, endTime })),
    });
  }

  const skipped = weekdays.length - toCreate.length;
  redirect(
    `${returnTo}?autoScheduled=${toCreate.length}${skipped ? `&autoSkipped=${skipped}` : ""}`
  );
}

export async function deleteShiftAction(formData: FormData) {
  await requireAdmin();
  const shiftId = formData.get("shiftId");
  if (typeof shiftId !== "string" || !shiftId) return;

  await prisma.shift.delete({ where: { id: shiftId } }).catch(() => null);

  const returnTo = returnToSchema.parse(formData.get("returnTo") ?? undefined);
  redirect(`${returnTo}?deleted=1`);
}
