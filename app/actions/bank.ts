"use server";

import { randomInt } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

function generateCardNumber() {
  let digits = "";
  for (let i = 0; i < 10; i++) digits += randomInt(0, 10).toString();
  return digits;
}

function generatePin() {
  let digits = "";
  for (let i = 0; i < 4; i++) digits += randomInt(0, 10).toString();
  return digits;
}

export async function applyCardAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/bank");

  const existing = await prisma.creditCard.findUnique({ where: { userId: user.id } });
  if (!existing) {
    await prisma.creditCard.create({ data: { userId: user.id } });
  } else if (existing.status === "REJECTED") {
    await prisma.creditCard.update({
      where: { userId: user.id },
      data: { status: "PENDING" },
    });
  }

  redirect("/bank?applied=1");
}

export async function approveCardAction(formData: FormData) {
  await requireAdmin();
  const cardId = formData.get("cardId");
  if (typeof cardId !== "string" || !cardId) return;

  await prisma.creditCard.update({
    where: { id: cardId },
    data: {
      status: "APPROVED",
      cardNumber: generateCardNumber(),
      pin: generatePin(),
      creditLimit: 500,
      approvedAt: new Date(),
    },
  });

  redirect("/admin/bank?approved=1");
}

export async function rejectCardAction(formData: FormData) {
  await requireAdmin();
  const cardId = formData.get("cardId");
  if (typeof cardId !== "string" || !cardId) return;

  await prisma.creditCard.update({
    where: { id: cardId },
    data: { status: "REJECTED" },
  });

  redirect("/admin/bank?rejected=1");
}

export async function toggleFreezeAction(formData: FormData) {
  await requireAdmin();
  const cardId = formData.get("cardId");
  if (typeof cardId !== "string" || !cardId) return;

  const card = await prisma.creditCard.findUnique({ where: { id: cardId } });
  if (!card) return;

  await prisma.creditCard.update({
    where: { id: cardId },
    data: { isFrozen: !card.isFrozen },
  });

  redirect("/admin/bank?updated=1");
}

export type CardLimitFormState = { error?: string } | undefined;

const limitSchema = z.object({
  cardId: z.string().min(1),
  creditLimit: z.coerce.number().min(0, "Limit can't be negative").max(1000000, "That's too high"),
});

export async function updateCardLimitAction(
  _prevState: CardLimitFormState,
  formData: FormData
): Promise<CardLimitFormState> {
  await requireAdmin();

  const parsed = limitSchema.safeParse({
    cardId: formData.get("cardId"),
    creditLimit: formData.get("creditLimit"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid limit" };
  }

  await prisma.creditCard.update({
    where: { id: parsed.data.cardId },
    data: { creditLimit: parsed.data.creditLimit },
  });

  redirect("/admin/bank?updated=1");
}
