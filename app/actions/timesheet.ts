"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireEmployeeArea } from "@/lib/auth";

export type TimesheetFormState = { error?: string } | undefined;

const editSchema = z.object({
  entryId: z.string().min(1),
  clockIn: z.string().min(1, "Enter a clock-in time"),
  clockOut: z.string().optional(),
});

export async function editTimeEntryAction(
  _prevState: TimesheetFormState,
  formData: FormData
): Promise<TimesheetFormState> {
  const me = await requireEmployeeArea();

  const parsed = editSchema.safeParse({
    entryId: formData.get("entryId"),
    clockIn: formData.get("clockIn"),
    clockOut: formData.get("clockOut") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const entry = await prisma.timeClockEntry.findUnique({ where: { id: parsed.data.entryId } });
  if (!entry) return { error: "Entry not found" };

  const isManager = me.role === "ADMIN" || me.role === "MANAGER";
  if (!isManager && entry.userId !== me.id) {
    return { error: "Not authorized" };
  }

  const clockIn = new Date(parsed.data.clockIn);
  const clockOut = parsed.data.clockOut ? new Date(parsed.data.clockOut) : null;
  if (Number.isNaN(clockIn.getTime())) return { error: "Invalid clock-in time" };
  if (clockOut && Number.isNaN(clockOut.getTime())) return { error: "Invalid clock-out time" };
  if (clockOut && clockOut <= clockIn) return { error: "Clock-out must be after clock-in" };

  await prisma.timeClockEntry.update({
    where: { id: entry.id },
    data: { clockIn, clockOut, needsApproval: !isManager },
  });

  redirect("/employee/timesheet?saved=1");
}

export async function approveTimeEntryAction(formData: FormData) {
  const me = await requireEmployeeArea();
  if (me.role !== "ADMIN" && me.role !== "MANAGER") return;

  const entryId = formData.get("entryId");
  if (typeof entryId !== "string" || !entryId) return;

  await prisma.timeClockEntry.update({
    where: { id: entryId },
    data: { needsApproval: false },
  });

  redirect("/employee/timesheet?approved=1");
}
