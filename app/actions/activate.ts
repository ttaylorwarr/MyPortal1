"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export type ActivateFormState = { error?: string } | undefined;

const activateSchema = z
  .object({
    safeCode: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, "Enter your Safe-Code"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function activateAccountAction(
  _prevState: ActivateFormState,
  formData: FormData
): Promise<ActivateFormState> {
  const parsed = activateSchema.safeParse({
    safeCode: formData.get("safeCode"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { safeCode, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { safeCode } });
  if (!user || user.passwordHash) {
    return { error: "That Safe-Code is invalid or has already been used." };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, safeCode: null },
  });

  await createSession(user.id);
  redirect(user.role === "MEMBER" ? "/account" : "/admin");
}
