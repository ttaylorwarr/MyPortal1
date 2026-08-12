"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireEmployeeArea } from "@/lib/auth";

export type ScheduleFormState = { error?: string } | undefined;

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:MM format");

const returnToSchema = z
  .string()
  .optional()
  .transform((val) => (val && val.startsWith("/employee") ? val : "/employee"));

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
  const me = await requireEmployeeArea();
  const isManager = me.role === "ADMIN" || me.role === "MANAGER";
  const requestedUserId = formData.get("userId");
  const userId =
    isManager && typeof requestedUserId === "string" && requestedUserId ? requestedUserId : me.id;

  const parsed = shiftSchema.safeParse({
    userId,
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

export async function deleteShiftAction(formData: FormData) {
  const me = await requireEmployeeArea();
  const shiftId = formData.get("shiftId");
  if (typeof shiftId !== "string" || !shiftId) return;

  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) return;

  const isManager = me.role === "ADMIN" || me.role === "MANAGER";
  if (!isManager && shift.userId !== me.id) return;

  await prisma.shift.delete({ where: { id: shiftId } });

  const returnTo = returnToSchema.parse(formData.get("returnTo") ?? undefined);
  redirect(`${returnTo}?deleted=1`);
}
