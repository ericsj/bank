import "dotenv/config";
import { transferService } from "@/container";
import { prisma } from "@/lib/prisma";

const ORIGIN_ACCOUNT = "123";
const DEST_ACCOUNT = "456";

// Script created to demo concurrency problem (all transfer promises read the inicial from account balance at once
// so at the end the final balance of origin is 9000 and destination is 20000)
async function main() {
  await prisma.transfer.deleteMany({
    where: {
      OR: [
        {
          fromAccountId: ORIGIN_ACCOUNT,
        },
        {
          toAccountId: DEST_ACCOUNT,
        },
      ],
    },
  });
  for (const [id, balance] of [
    ["123", 100_00],
    ["456", 0],
  ] as const) {
    await prisma.account.update({
      where: {
        id,
      },
      data: {
        balance,
      },
    });
  }
  const trasnferAttemps = Array.from({ length: 20 }, () =>
    transferService.transfer({
      fromAccountId: ORIGIN_ACCOUNT,
      toAccountId: DEST_ACCOUNT,
      amount: 10_00,
    }),
  );
  const transfersResults = await Promise.allSettled(trasnferAttemps);
  const fulfilledTransfersCount = transfersResults.filter(
    (p) => p.status === "fulfilled",
  ).length;
  const fromAccountFinalBalance = (
    await prisma.account.findFirstOrThrow({
      where: {
        id: ORIGIN_ACCOUNT,
      },
    })
  ).balance;
  const toAccountFinalBalance = (
    await prisma.account.findFirstOrThrow({
      where: {
        id: DEST_ACCOUNT,
      },
    })
  ).balance;
  const totalTransferedAmount = (
    await prisma.transfer.aggregate({
      where: {
        fromAccountId: ORIGIN_ACCOUNT,
        toAccountId: DEST_ACCOUNT,
      },
      _sum: {
        amount: true,
      },
    })
  )._sum.amount;
  console.log("fulfilled transfers count: ", fulfilledTransfersCount);
  console.log("fromAccount final balance: ", fromAccountFinalBalance);
  console.log("toAccount final balance: ", toAccountFinalBalance);
  console.log("total transfered amount: ", totalTransferedAmount);
}

main().finally(() => {
  prisma.$disconnect();
});
