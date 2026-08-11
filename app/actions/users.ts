"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type UserFormState = { error?: string } | undefined;

const roleSchema = z.enum(["ADMIN", "MANAGER", "MEMBER"]);

export async function updateUserRoleAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const admin = await requireAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    return { error: "Missing user id" };
  }

  const parsedRole = roleSchema.safeParse(formData.get("role"));
  if (!parsedRole.success) {
    return { error: "Invalid role" };
  }

  if (userId === admin.id && parsedRole.data !== "ADMIN") {
    return { error: "You can't remove your own admin access." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role: parsedRole.data } });
  redirect("/admin/users?saved=1");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    return;
  }

  if (userId === admin.id) {
    redirect("/admin/users?error=self-delete");
  }

  await prisma.booking.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  redirect("/admin/users?deleted=1");
}
