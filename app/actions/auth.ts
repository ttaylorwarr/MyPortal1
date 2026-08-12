"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, clearSession, hashPassword, verifyPassword } from "@/lib/auth";

export type AuthFormState = { error?: string } | undefined;

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Username can only have lowercase letters, numbers, and underscores");

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, username, email, password } = parsed.data;

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
  const user = await prisma.user.create({
    data: { name, username, email, passwordHash },
  });

  await createSession(user.id);
  redirect("/account");
}

const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(1, "Enter your username or email"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional(),
});

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { identifier, password, next } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid username/email or password" };
  }

  await createSession(user.id);
  redirect(next && next.startsWith("/") ? next : "/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
