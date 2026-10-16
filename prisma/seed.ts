import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const users = [
  { id: "123", owner: "Ana", email: "ana@bank.dev", balance: 1000_00 },
  { id: "456", owner: "John", email: "john@bank.dev", balance: 2000_00 },
];
async function main() {
  await prisma.transfer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  const passwordHash = await bcrypt.hash("pass123", 10);
  for (const user of users) {
    await prisma.account.create({
      data: {
        id: user.id,
        owner: user.owner,
        balance: user.balance,
        user: {
          create: {
            email: user.email,
            passwordHash,
          },
        },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
