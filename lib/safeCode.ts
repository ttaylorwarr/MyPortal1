import { randomInt } from "crypto";
import { prisma } from "@/lib/db";

// Excludes ambiguous characters (0/O, 1/I/L) so codes are easy to read and type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 10;

function randomCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

export async function generateSafeCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const existing = await prisma.user.findUnique({ where: { safeCode: code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique Safe-Code");
}
