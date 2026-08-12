"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export type AccountFormState = { error?: string } | undefined;

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Username can only have lowercase letters, numbers, and underscores");

const profileSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export async function updateProfileAction(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const me = await getCurrentUser();
  if (!me) redirect("/login?next=/account/edit");

  const parsed = profileSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { username, email } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { AND: [{ OR: [{ email }, { username }] }, { NOT: { id: me.id } }] },
  });
  if (existing) {
    return {
      error:
        existing.email === email
          ? "An account with that email already exists"
          : "That username is taken",
    };
  }

  await prisma.user.update({ where: { id: me.id }, data: { username, email } });
  redirect("/account?saved=1");
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const me = await getCurrentUser();
  if (!me) redirect("/login?next=/account/edit");

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const fullUser = await prisma.user.findUnique({ where: { id: me.id } });
  if (
    !fullUser ||
    !fullUser.passwordHash ||
    !(await verifyPassword(parsed.data.currentPassword, fullUser.passwordHash))
  ) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash } });
  redirect("/account?passwordChanged=1");
}
