import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run db:make-admin -- <email>");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.update({
    where: { email: email.trim().toLowerCase() },
    data: { isAdmin: true },
  });

  console.log(`${user.email} is now an admin.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
