"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";

export type UserFormState = { error?: string } | undefined;

const roleSchema = z.enum(["ADMIN", "MANAGER", "MEMBER"]);

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Username can only have lowercase letters, numbers, and underscores");

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleSchema,
});

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, username, email, password, role } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return {
      error:
        existing.email === email
          ? "An account with that email already exists"
          : "That username is taken",
    };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { name, username, email, passwordHash, role } });
  redirect("/admin/users?created=1");
}

const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  role: roleSchema,
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
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, username, email, role } = parsed.data;

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

  await prisma.user.update({ where: { id: userId }, data: { name, username, email, role } });
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
