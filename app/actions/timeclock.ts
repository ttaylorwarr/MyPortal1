"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireEmployeeArea } from "@/lib/auth";

export async function clockInAction() {
  const me = await requireEmployeeArea();

  const open = await prisma.timeClockEntry.findFirst({
    where: { userId: me.id, clockOut: null },
  });
  if (!open) {
    await prisma.timeClockEntry.create({
      data: { userId: me.id, clockIn: new Date() },
    });
  }
  redirect("/employee/timeclock");
}

export async function clockOutAction() {
  const me = await requireEmployeeArea();

  const open = await prisma.timeClockEntry.findFirst({
    where: { userId: me.id, clockOut: null },
    orderBy: { clockIn: "desc" },
  });
  if (open) {
    await prisma.timeClockEntry.update({
      where: { id: open.id },
      data: { clockOut: new Date() },
    });
  }
  redirect("/employee/timeclock");
}
