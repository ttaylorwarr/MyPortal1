import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const VALID_ROLES = ["ADMIN", "MANAGER", "MEMBER"] as const;
type Role = (typeof VALID_ROLES)[number];

async function main() {
  const email = process.argv[2];
  const roleArg = (process.argv[3] ?? "ADMIN").toUpperCase();

  if (!email) {
    console.error("Usage: npm run db:set-role -- <email> [ADMIN|MANAGER|MEMBER]");
    process.exitCode = 1;
    return;
  }

  if (!VALID_ROLES.includes(roleArg as Role)) {
    console.error(`Invalid role "${roleArg}". Must be one of: ${VALID_ROLES.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.update({
    where: { email: email.trim().toLowerCase() },
    data: { role: roleArg as Role },
  });

  console.log(`${user.email} is now ${user.role}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
