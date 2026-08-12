"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type UserFormState = { error?: string } | undefined;

const roleSchema = z.enum(["ADMIN", "MANAGER", "MEMBER", "EMPLOYEE"]);
const hireRoleSchema = z.enum(["MANAGER", "MEMBER", "EMPLOYEE"]);

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Username can only have lowercase letters, numbers, and underscores");

const hourlyPayRateSchema = z
  .string()
  .optional()
  .transform((val) => (val && val.trim() ? Number(val) : undefined))
  .refine((val) => val === undefined || (Number.isFinite(val) && val >= 0), {
    message: "Enter a valid hourly pay rate",
  });

const safeCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(4, "Safe-Code must be at least 4 characters")
  .max(20, "Safe-Code must be 20 characters or fewer")
  .regex(/^[A-Z0-9]+$/, "Safe-Code can only have letters and numbers");

const inviteUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  role: hireRoleSchema,
  hourlyPayRate: hourlyPayRateSchema,
  safeCode: safeCodeSchema,
});

export async function createInviteAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdmin();

  const parsed = inviteUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
    hourlyPayRate: formData.get("hourlyPayRate"),
    safeCode: formData.get("safeCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, username, email, role, hourlyPayRate, safeCode } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }, { safeCode }] },
  });
  if (existing) {
    if (existing.email === email) return { error: "An account with that email already exists" };
    if (existing.username === username) return { error: "That username is taken" };
    return { error: "That Safe-Code is already in use — try a different one." };
  }

  await prisma.user.create({
    data: { firstName, lastName, username, email, role, hourlyPayRate, safeCode },
  });

  redirect(`/admin/users?invited=${safeCode}&hireName=${encodeURIComponent(`${firstName} ${lastName}`)}`);
}

const updateUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  role: roleSchema,
  hourlyPayRate: hourlyPayRateSchema,
});

export async function updateUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const admin = await requireAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    return { error: "Missing user id" };
  }

  const parsed = updateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
    hourlyPayRate: formData.get("hourlyPayRate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, username, email, role, hourlyPayRate } = parsed.data;

  if (userId === admin.id && role !== "ADMIN") {
    return { error: "You can't remove your own admin access." };
  }

  const existing = await prisma.user.findFirst({
    where: { AND: [{ OR: [{ email }, { username }] }, { NOT: { id: userId } }] },
  });
  if (existing) {
    return {
      error:
        existing.email === email
          ? "An account with that email already exists"
          : "That username is taken",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, username, email, role, hourlyPayRate },
  });
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
