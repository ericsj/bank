import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.transfer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.account.createMany({
    data: [
      { id: "123", owner: "Ana", balance: 1000_00 },
      { id: "456", owner: "John", balance: 2000_00 },
    ],
  });
  console.log("seed completed");
}

main().finally(() => prisma.$disconnect());
